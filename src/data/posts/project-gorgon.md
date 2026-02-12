# Building a Speculative Decoding Engine from Scratch

*A deep dive into Project Gorgon: custom Triton kernels, tree-structured attention, adaptive pruning, and the debugging story of a missing normalization layer.*

---

## The Problem with Autoregressive Inference

Large language model inference is fundamentally **memory-bandwidth bound**. Each token generation requires a full forward pass through the model, but the actual computation is dominated by moving weights from VRAM to compute units. The GPU's arithmetic units sit idle waiting for data. Generating 128 tokens means 128 sequential forward passes -- even though the GPU could handle significantly more work per pass.

The arithmetic intensity (FLOPs per byte of memory traffic) of autoregressive decoding is roughly 1-2, well below the ~300 ratio needed to fully utilize an A100's compute. We are paying for 80GB of VRAM and 312 TFLOPS of compute, but only using the bandwidth.

**Speculative decoding** attacks this directly: use a cheap model to *draft* multiple tokens, then *verify* them all in a single backbone pass. If the drafts are good, you get multiple tokens for the price of one forward pass. If they are bad, you lose only the cost of drafting (which is negligible) and still get one token -- the same as normal decoding. The worst case is autoregressive speed; the best case is a proportional speedup to the number of accepted tokens.

```diagram
speculative-comparison
```

## Architecture Overview

The full system connects several components: a frozen Llama-3 backbone, lightweight Medusa draft heads, a tree-structured candidate generator, and custom GPU kernels for efficient verification.

```diagram
architecture-overview
```

## Medusa Draft Heads

The standard approach to speculative decoding uses a separate smaller model as the drafter. Medusa takes a different path: attach lightweight "heads" directly to the backbone's hidden states. Each head is trained to predict a different future position.

### The Head Architecture

A natural first attempt is simple: take the hidden state, pass it through a residual block, then project to vocabulary logits.

```diagram
head-architecture-before
```

Head *k* receives the backbone's hidden state at position *t* and predicts the token at position *t + k*. The `lm_head` (the final projection to vocabulary logits) is initialized from the backbone's own lm_head weights, giving heads a strong starting point.

This seems reasonable, but there is a subtle architectural bug that took real debugging to find.

### The Missing Normalization Layer

Llama-3 (and most modern LLMs) use a **pre-norm** architecture. The forward pass looks like:

```python
hidden = transformer_layers(input)    # pre-norm hidden state
normed = RMSNorm(hidden)              # model.norm
logits = lm_head(normed)              # projection to vocab
```

The `outputs.hidden_states[-1]` that we extract from HuggingFace returns the **pre-norm** hidden state. But our lm_head was initialized from the backbone's lm_head, which expects **post-norm** input. The single ResidualBlock has to simultaneously learn to approximate RMSNorm AND predict shifted tokens.

The symptom was devastating: after 10,000 training steps, the benchmark showed a **0.2% acceptance rate** and **0.08x speedup** -- 12x slower than just running the backbone normally. The heads were performing barely better than random.

The fix is architectural:

```diagram
head-architecture-after
```

We copy the backbone's RMSNorm layer, freeze its parameters, and prepend it to each head. Now at initialization (before any training), each head computes approximately `lm_head(RMSNorm(hidden))` -- which is exactly the backbone's own next-token prediction. The ResidualBlock starts as an approximate identity (skip connection), and training only needs to learn the small delta for shifted-position prediction.

This is the difference between training heads that start from a strong baseline versus training heads that start from random noise. The loss should drop dramatically in the first few hundred steps.

### Three Problems, Not One

The 0.2% acceptance rate actually had three root causes:

1. **The benchmark never loaded trained checkpoints.** The benchmark script called `load_backbone_4bit()` which creates fresh MedusaHead instances with random weights. There was no `--heads-checkpoint` flag. We were benchmarking random heads.

2. **Missing RMSNorm** (described above). Even with proper checkpoint loading, the trained heads had to learn both normalization and position-shifting simultaneously.

3. **Training config issues.** The cosine LR scheduler decayed to exactly 0.0 (no `eta_min`). A resumed training run from step 6,500 was in the tail of cosine decay with near-zero learning rate. Most effective training happened only in the first run.

Each fix individually would have been insufficient. All three had to be addressed together.

## Tree-Structured Candidate Generation

Given 4 heads with top-k=4, the naive approach produces a Cartesian product tree:

```diagram
candidate-tree
```

Total candidates: 4 + 16 + 64 + 256 = 340 across 4 levels. Each root-to-leaf path is a possible continuation sequence. We verify all of them in a single forward pass.

### Tree Attention

Standard causal attention uses a triangular mask. Tree attention generalizes this: each candidate token attends only to its **ancestors** in the tree (and itself). This maintains causal consistency -- each candidate only sees the tokens it would have seen if generated sequentially along its path.

```diagram
tree-attention-mask
```

The mask is built with vectorized ancestor propagation. Starting from the direct parent array, we iteratively propagate ancestor relationships upward until convergence. For a tree of depth D, this takes at most D iterations.

### Adaptive Pruning

Not all 340 candidates are worth verifying. Many branches represent sequences the model would never actually generate. We implemented three pruning strategies:

```diagram
pruning-strategies
```

**Confidence threshold.** After computing softmax probabilities for each head's predictions, prune any candidate with probability below a threshold. If head 2 gives token X only 3% probability, we skip it.

**Path-probability product.** Track the cumulative probability along each root-to-leaf path. A candidate might have 40% probability from its head, but if its parent had 10% probability, the path probability is only 4%. Prune deep paths with low cumulative confidence.

**Entropy-weighted thresholds.** Not all heads are equally confident. A head with high entropy (spread-out probability distribution) is genuinely uncertain -- pruning it aggressively would remove valid candidates. We scale the threshold by `(1 - normalized_entropy)`: confident heads get pruned more, uncertain heads get to explore.

The combination lets the tree adapt to the input. Easy, predictable sequences produce small trees (fast verification). Difficult, high-entropy sequences produce larger trees (more candidates, higher chance of finding a match).

## Custom GPU Kernels

### The Standard Triton Kernel

The baseline implementation materializes the full (N, N) boolean attention mask, then passes it to a Triton kernel that does standard masked multi-head attention:

```python
@triton.jit
def _tree_attention_kernel(Q, K, V, Mask, Out, ...):
    row = tl.program_id(0)
    # Load Q row
    q = tl.load(Q + row * stride_q + tl.arange(0, BLOCK_D))
    # Compute scores against all K
    for j in range(0, N, BLOCK_N):
        k = tl.load(K + j * stride_k + ...)
        score = tl.sum(q * k, axis=0)
        mask = tl.load(Mask + row * N + j + ...)
        score = tl.where(mask, score, float('-inf'))
        # ... softmax, accumulate V
```

This works, but the (N, N) mask is wasteful. For N=340 candidates, that is 115,600 booleans -- larger than the actual Q, K, V tensors for typical hidden dimensions.

### The Fused Mask-Free Kernel

The key insight: the tree structure is fully described by a compact `parents` array of N int32 values. `parents[i]` gives the index of node i's parent (-1 for root). We can compute the ancestor relationship on-the-fly instead of materializing the mask.

```diagram
kernel-comparison
```

```python
@triton.jit
def _fused_tree_verify_kernel(Q, K, V, Parents, Out, ..., MAX_DEPTH: tl.constexpr):
    row = tl.program_id(0)

    # Phase 1: Walk parents array, build ancestor bitmask in registers
    ancestor_mask = 1 << row   # self
    cur = row
    for _ in tl.static_range(0, MAX_DEPTH):
        p = tl.load(Parents + cur)
        ancestor_mask |= tl.where(p >= 0, 1 << p, 0)
        cur = tl.where(p >= 0, p, cur)

    # Phase 2: Q*K attention with bitmask instead of mask tensor
    q = tl.load(Q + row * stride_q + tl.arange(0, BLOCK_D))
    for j in range(0, N, BLOCK_N):
        k = tl.load(K + ...)
        score = tl.sum(q * k, axis=0)
        is_ancestor = (ancestor_mask >> j) & 1
        score = tl.where(is_ancestor, score, float('-inf'))
        # ... softmax, accumulate V
```

`MAX_DEPTH` is a `tl.constexpr`, so the ancestor walk unrolls completely at compile time. For typical Medusa trees (depth 3-5, N < 100), the walk is 3-5 scalar loads per row, compared to reading N boolean values from global memory.

The memory savings are proportional to N: we replace an O(N^2) mask tensor with an O(N) parents array. For N=340, this is a 340x reduction in mask memory.

We also wrote a plain CUDA kernel (88 LOC) for comparison, using shared-memory softmax with per-block parallelism. Having three implementations (reference PyTorch, Triton, CUDA) means each one validates the others -- any disagreement beyond floating-point tolerance indicates a bug.

## Verification and KV Cache Management

### The Speculative Decoding Loop

```diagram
speculative-loop
```

### Greedy Acceptance

After the tree-attention forward pass, we check each root-to-leaf path:

1. For each path, compare the verifier's argmax at position *i* with the draft token at position *i+1*
2. Accept the **longest matching prefix** across all paths
3. Collect the verifier's own prediction at the last accepted position as a **bonus token**

Even if all drafts are wrong, we get 1 token (the bonus) -- identical to autoregressive decoding. The verification is vectorized: a single argmax over all logits, a single CPU transfer, and the winning path is found in one pass without redundant loops or GPU synchronization points.

### KV Cache Trim-on-Reject

Speculative decoding complicates KV cache management. The verification pass produces cache entries for all N candidate positions, but only the accepted path should be kept. We trim the cache to the accepted prefix length after each iteration. This is cheaper than the alternative approaches (checkpoint/rollback, or full recomputation) because trim is a single slice operation per layer.

The implementation wraps HuggingFace's `DynamicCache` and handles both the legacy tuple-of-tuples format and the modern `DynamicCache` object format. After trimming, we update the internal `_seen_tokens` counter to keep the cache consistent for subsequent forward passes.

## Per-Iteration Instrumentation

Every speculative iteration records an `IterationStats`:

```python
@dataclass
class IterationStats:
    tree_size: int          # Number of candidates in the tree
    accepted_length: int    # Number of accepted tokens (excluding bonus)
    head_acceptance: list   # Per-head acceptance (True/False per head)
    time_draft_ms: float    # Time spent building candidate tree
    time_verify_ms: float   # Time spent in backbone forward pass
    time_kv_trim_ms: float  # Time spent trimming KV cache
```

From these, we compute aggregate metrics:

- **Mean accepted length (tau)**: The average number of tokens accepted per iteration. This is the key metric -- higher tau means more tokens per forward pass.
- **Per-head acceptance rates**: How often each head's prediction matches the verifier. Head 0 (next token) should have the highest rate; deeper heads will be lower.
- **Tree utilization**: What fraction of the tree's candidates were actually accepted. Low utilization means the tree is too large -- adaptive pruning should help.

These metrics feed directly into the ablation runner, which sweeps across configurations (num_heads, top_k, depth, confidence_threshold) to find the Pareto frontier of tree size vs. acceptance rate.

## Training Pipeline

### Knowledge Distillation

The heads are trained via knowledge distillation from the frozen backbone:

```diagram
training-pipeline
```

1. Run backbone on WikiText training data with `torch.no_grad()` to get hidden states
2. Head *k* receives hidden state at position *t*, must predict the ground truth token at position *t + k*
3. Loss = cross-entropy between head logits and shifted ground truth targets
4. Only head parameters (~8M total for 4 heads) receive gradients; backbone (8B) and RMSNorm are frozen

Training uses all sequence positions (`hidden[:, :-k, :] -> targets[:, k:]`), not just the last token. This gives roughly 500x more training signal per batch compared to last-token-only distillation.

### Training Configuration

The training runs for 30,000 steps with:

- **3e-4 peak learning rate** with 500-step linear warmup
- **Cosine annealing** to eta_min=1e-5 (never decays to zero)
- **Gradient clipping** at max_norm=1.0
- **Effective batch size 16** (4 samples x 4 gradient accumulation steps)
- **bf16 mixed precision** for A100/H100 compatibility

A previous training run (10k steps) failed to produce useful heads due to the missing RMSNorm and the LR schedule decaying to exactly zero. The current configuration addresses both issues.

## What I Would Do Differently

**Start with the norm.** The missing RMSNorm was the single biggest issue and it took careful debugging to identify. In hindsight, the architectural mismatch is obvious: if the backbone's lm_head expects normalized input, the heads should provide normalized input. The lesson is to trace the exact data flow through the model before designing auxiliary components.

**Validate early with a trivial test.** Before training for 10,000 steps, I should have verified that the heads could at least approximate head-0 (next-token) accuracy with minimal training. A 100-step sanity check would have revealed the RMSNorm issue immediately.

**Instrument from the start.** The `IterationStats` infrastructure was added after the first failed benchmark. Having per-iteration metrics from day one would have made the diagnosis faster -- we would have seen that every head had near-zero acceptance, not just low overall acceptance.

---

*Project Gorgon is open source. The full implementation, including all kernels, training scripts, and benchmark infrastructure, is available on [GitHub](https://github.com/matteso1/ProjectGorgon).*
