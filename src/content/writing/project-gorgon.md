---
title: "Building a Speculative Decoding Engine from Scratch"
description: "Custom Triton kernels, tree-structured attention, four bugs, and an honest negative result: 0.66x baseline."
date: 2026-02-12
tags: ["CUDA", "speculative decoding", "inference"]
---

Final result: 0.66x baseline. Slower than just running the model. Here is the full arc from 0.08x to 0.66x and what each step cost.

## the problem with autoregressive inference

LLM inference is memory-bandwidth bound. Each token generation requires a full forward pass, but the computation is dominated by moving weights from VRAM to compute units. The arithmetic intensity of autoregressive decoding is roughly 1-2 FLOPs per byte of memory traffic, well below the ~300 ratio needed to saturate an A100.

Speculative decoding attacks this: use a cheap draft model to propose multiple tokens, verify them all in a single backbone pass. If the drafts are good, you get multiple tokens for the price of one forward pass. If they are wrong, you get one token, the same as normal decoding. Worst case is autoregressive speed; best case is speedup proportional to accepted token count.

## the system

Project Gorgon implements Medusa-style speculative decoding for Llama-3-8B (4-bit quantized):

- 4 Medusa draft heads: lightweight MLPs on the backbone's hidden states, each predicting a different future position
- Tree-structured candidate generation: Cartesian product trees with adaptive pruning (confidence thresholds, path-probability products, entropy-weighted expansion)
- Three tree attention kernel implementations: Triton (127 LOC), CUDA (88 LOC), fused mask-free (140 LOC)
- Vectorized verification: single argmax over all candidates, single CPU transfer, no GPU syncs in the loop
- KV cache with trim-on-reject: rejected branches trimmed, not recomputed
- Full benchmark harness with reproducible JSONL reports

90 tests. End-to-end training, inference, and benchmarking.

## results

| stage | head 0 acc. | speedup | what changed |
|---|---|---|---|
| first benchmark (random heads) | 0.2% | 0.08x | nothing loaded; benchmarking random weights |
| after RMSNorm fix (step 10k) | 23.2% | 0.25x | added frozen norm, fixed checkpoint loading |
| after hook optimization (step 30k) | 23.2% | 0.66x | replaced output_hidden_states with forward hook |

Final H100 80GB benchmark (30k training steps):

| metric | baseline | speculative |
|---|---|---|
| tokens/second | 35.71 | 23.47 |
| total time (2560 tokens) | 71.7s | 109.1s |

Head acceptance rates: head 0 23.2%, head 1 7.9%, head 2 5.4%, head 3 3.2%. Mean accepted length (tau): 0.40 tokens per iteration.

## bug 1: benchmarking random heads

The first A100 benchmark showed 0.2% acceptance and 0.08x speedup. My instinct was that the heads needed more training. They did, but that was not the main problem.

The benchmark script called `load_backbone_4bit()` which creates fresh `MedusaHead` instances with randomly initialized weights. It had no `--heads-checkpoint` flag. The 10,000-step training run had produced checkpoints, but the benchmark never loaded them. I was benchmarking random weights.

Fix: added `--heads-checkpoint` CLI flag and `load_trained_heads()` with format compatibility handling (torch.compile `_orig_mod.` prefix stripping, dtype casting, device placement).

## bug 2: missing normalization layer

Llama-3 uses pre-norm: `outputs.hidden_states[-1]` returns the pre-norm hidden state. Our `lm_head` was initialized from the backbone's lm_head, which expects post-norm input. Each head had to simultaneously learn to approximate RMSNorm and predict shifted tokens.

Fix: copy the backbone's RMSNorm, freeze its parameters, prepend it to each head. Now at initialization each head computes `lm_head(RMSNorm(hidden))`, the backbone's own next-token prediction. Training only needs to learn the delta for shifted positions.

## bug 3: dead learning rate schedule

The cosine LR scheduler decayed to exactly 0.0 (no `eta_min`). A resumed run from step 6,500 was in the tail of decay with near-zero LR. Also: `load_config` used direct assignment, so CLI defaults (e.g., `warmup_steps=50`) always overwrote YAML config values (`warmup_steps=500`).

Fix: `eta_min=1e-5` so the LR never flatlines. `setdefault()` in config loading so YAML values are only overridden by explicitly passed CLI args.

## bug 4: verification overhead

After fixing bugs 1-3 and retraining 30k steps, head 0 showed 23% acceptance. Speedup was still only 0.25x. The time breakdown: draft + verify + kv_trim was ~8% of total elapsed time. The other 92%: `output_hidden_states=True` on every verification forward pass. This forces the model to allocate and return hidden state tensors from all 33 transformer layers. The baseline used HuggingFace's `model.generate()`, which never allocates hidden states.

Fix: register a forward hook on `model.model.norm` (the final RMSNorm) to capture the post-norm hidden state directly.

```python
class _HiddenCapture:
    def register(self, model):
        target = model.model.norm
        def _hook(module, inp, out):
            self.hidden = out
        self._handle = target.register_forward_hook(_hook)
```

Verify time dropped from ~10.1s to ~4.9s across the benchmark. Speedup improved from 0.25x to 0.66x.

## why it is still below 1x

Mean accepted length (tau) is 0.40. With the bonus token, each iteration yields ~1.4 tokens. But the verification pass processes all tree candidates (up to 30 with top_k=2), making it more expensive than a single autoregressive step. For speculative decoding to break even, tau needs to be high enough that the extra tokens per iteration outweigh the verification cost. 23% head-0 acceptance is not there.

Paths to greater than 1x: better training data (WikiText is encyclopedic; benchmark prompts have different distribution), longer training (loss curve shows high variance and slow convergence), per-head loss weighting toward head 0, fewer heads (starting with 1-2 and getting to 50%+ acceptance before adding more).

## tree-structured candidate generation

Given 4 heads with top-k=4, the Cartesian product gives 4 + 16 + 64 + 256 = 340 candidates. Three pruning strategies:

- Confidence threshold: prune below a softmax probability threshold
- Path-probability product: track cumulative probability along root-to-leaf paths
- Entropy-weighted thresholds: scale threshold by `(1 - normalized_entropy)` per head; uncertain heads get lower thresholds

With top_k=2, tree shrinks to 2 + 4 + 8 + 16 = 30 candidates.

## custom GPU kernels

Three implementations of tree attention, so each validates the others:

**Triton** (127 LOC): parameterized by `BLOCK_N` and `BLOCK_D`, masked softmax, tree mask pre-materialized as an (N, N) boolean tensor.

**CUDA** (88 LOC): shared-memory softmax with per-block parallelism.

**Fused mask-free** (140 LOC): the tree structure is fully described by a `parents` array of N int32 values. The kernel walks parents in registers to compute ancestor relationships on the fly, rather than loading an (N, N) mask from global memory:

```python
@triton.jit
def _fused_tree_verify_kernel(Q, K, V, Parents, Out, ..., MAX_DEPTH: tl.constexpr):
    row = tl.program_id(0)
    ancestor_mask = 1 << row
    cur = row
    for _ in tl.static_range(0, MAX_DEPTH):
        p = tl.load(Parents + cur)
        ancestor_mask |= tl.where(p >= 0, 1 << p, 0)
        cur = tl.where(p >= 0, p, cur)
```

For N=340 candidates, this replaces 115,600 booleans with 340 int32 values.

## verification and KV cache

After tree-attention forward pass, check each root-to-leaf path: compare verifier argmax at position i with draft token at position i+1, accept the longest matching prefix, take the verifier's prediction at the last accepted position as a bonus token. Even if all drafts are wrong, you get 1 token. Verification is vectorized: single argmax, single CPU transfer, no redundant GPU syncs.

KV cache: trim to accepted prefix length after each iteration, cheaper than checkpoint/rollback.

## training

30,000 steps on WikiText-103 with 4 Medusa heads. Loss drops from ~10 to ~5 in the first 1,000 steps, then oscillates 3-7 for the rest. Minimum 2.83 at step ~18,000. Config: 3e-4 peak LR, 500-step warmup, cosine decay to 1e-5, batch size 16, bf16. ~97 minutes on H100 80GB.

Heads trained via distillation from the frozen backbone: run backbone with `torch.no_grad()` to get hidden states; head k receives hidden state at position t, predicts ground truth at t+k; cross-entropy loss on head parameters only (~8M total). Training uses all sequence positions, giving ~500x more signal per batch than last-token-only distillation.

## what I would do differently

Validate before training: verify that freshly initialized heads can approximate head-0 accuracy on a few examples before committing to 10,000 steps. A 100-step sanity check would have caught the RMSNorm issue.

Benchmark with checkpoint loading from day one: the missing `--heads-checkpoint` flag was not subtle. Test the inference path end-to-end before training.

Profile early: the `output_hidden_states` overhead was invisible until I added timing instrumentation. `IterationStats` from the start would have found it on the first benchmark run.

Start with 1-2 heads: head 0 is by far the most impactful (23% vs 3-8% for deeper heads). Get it to 50%+ acceptance before adding more.

---

Project Gorgon is open source at [github.com/matteso1/ProjectGorgon](https://github.com/matteso1/ProjectGorgon). 90 tests, three GPU kernels, four bugs.
