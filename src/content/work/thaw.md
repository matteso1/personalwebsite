---
title: thaw
description: Git for live LLM agent sessions. Checkpoint, branch, diff, and restore live vLLM/SGLang inference state. A session forks in 0.88s median vs ~340s cold boot on H100.
year: 2026
role: Independent project
status: Historical project
stack: [Rust, CUDA, Python, PyO3, vLLM, SGLang]
receipt: 0.88s median fork vs ~340s cold boot on H100
order: 99
featured: false
links:
  site: https://thaw.sh
  repo: https://github.com/thaw-ai/thaw
  pypi: https://pypi.org/project/thaw-vllm/
  rfc: https://github.com/vllm-project/vllm/issues/34303
  pr: https://github.com/vllm-project/vllm/pull/44074
manpage: true
---

<div class="man-header">THAW(1)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;User Commands&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;THAW(1)</div>

## NAME

thaw - git for live LLM agent sessions

## SYNOPSIS

```
thaw checkpoint | branch | diff | checkout | log [session]
```

## DESCRIPTION

Booting a vLLM worker cold takes roughly 340 seconds on an H100: load weights, warm the allocator, run prefill to rebuild the KV cache. If your workload is one long-lived server, you pay that once. If it is thousands of short divergent rollouts, that cold start is the whole problem.

thaw treats a running agent session the way git treats a working tree. It turns live inference state (weights, KV cache, scheduler, prefix-hash table) into a file you can `checkpoint`, `branch`, `diff`, `checkout`, and `log`. A new worker forks from a checkpoint in 0.88s median instead of booting from scratch. Inspection verbs (`inspect`, `diff`, `log`) need no GPU, so the everyday loop runs on a laptop. Open source on PyPI as `thaw-vllm` (16 releases, currently 0.6.0, Apache-2.0), built in Rust, CUDA, and Python.

### DMA pipeline

Restoring tens of gigabytes from disk to GPU is bounded by how well you overlap three stages: reading from disk, copying over PCIe, and verifying what arrived. A double-buffered `O_DIRECT` pipeline reads the next chunk while the current chunk is in flight over PCIe, with the page cache bypassed. On H100 with Llama-3-8B, a cache-evicted cold-cache benchmark restored 16.06 GB in 1.2s at 13.0 GB/s over NVMe (n=3). The complete cold start fell from 25.0s to 2.7s, or 9.2x, under that same boundary; these are not universal restore or 70B figures.

### Verifier

A fork is worthless if the restore is silently corrupt. A serial CRC32C pass is correct but slow enough to eat the throughput gain. 8 shards run in parallel; the sharded result matches the serial pass exactly, so verification rides along with the transfer rather than gating it. Output was bit-identical on all 3 cold-cache benchmark runs.

### KV cache

vLLM stores the cache as thousands of small per-block allocations. Snapshotting them one block at a time meant roughly 16,000 tiny DMAs, each with its own setup cost. Coalescing the scattered blocks into a single contiguous gather, moving it once, then unpacking on the far side removes that per-block DMA overhead.

### Prefix-cache reconstruction

Restoring the KV bytes is not enough if vLLM does not know what is in them. Rebuilding the prefix-cache hash table on restore means a forked worker gets cache hits on any shared prefix and skips prefill. That is the point of forking a warm session rather than booting a fresh one.

### CudaBackend

The `CudaBackend` trait puts a mock backend and the real CUDA backend behind one contract. Pipeline ordering, shard math, snapshot bookkeeping: all of it runs and gets tested without a GPU. The GPU-free Rust and Python test suites run on macOS and Linux with no CUDA installed.

### Rewind

`thaw rewind` captures N sampled continuations from a shared trunk with per-token logprobs, finds the exact divergence token, and names the branch the model was most confident in, all on a laptop. Validated end-to-end on an A100 with Qwen2.5-7B best-of-8. That question (what does re-feeding a transcript actually cost versus resuming exact KV state?) became a sole-author arXiv paper: ["Re-feeding Is Not Replaying: Measuring Replay Noise in Counterfactual Token-Credit Estimation"](https://arxiv.org/abs/2606.15621) (June 2026).

## BENCHMARKS

| metric | what it measures | technique | proof |
|---|---|---|---|
| `0.88s` median fork | wall time vs `~340s` cold boot (H100) | snapshot and restore of live inference state | [repo](https://github.com/thaw-ai/thaw) |
| `13.0 GB/s` cold-cache NVMe restore | 1.2s for 16.06GB, H100 Llama-3-8B, n=3 | double-buffered `O_DIRECT` DMA pipeline | [repo](https://github.com/thaw-ai/thaw) |
| `9.2x` complete cold start | 25.0s -> 2.7s, H100 Llama-3-8B, cache-evicted, n=3 | overlapped read, PCIe transfer, and verification | [repo](https://github.com/thaw-ai/thaw) |
| `0.29s` / `55 GB/s` | 8B hot-swap, 86% of PCIe Gen5 line rate | persisted pinned mmap, one-time `cudaHostRegister` | [repo](https://github.com/thaw-ai/thaw) |
| bit-identical on 3 runs | restored output in the cold-cache benchmark | end-to-end restore verification | [repo](https://github.com/thaw-ai/thaw) |
| TP snapshots bit-exact | 2xH100 and 2xA40 | tensor-parallel snapshot correctness | [repo](https://github.com/thaw-ai/thaw) |
| 8-shard == serial | `CRC32C` verifier correctness | parallel shards proven equal to a serial pass | [repo](https://github.com/thaw-ai/thaw) |
| DMA coalescing | KV-snapshot per-block overhead | `~16K` per-block DMAs coalesced into one gather | [repo](https://github.com/thaw-ai/thaw) |
| GPU-free Rust/Python suites | Test coverage runs without a GPU | `CudaBackend` trait, mock and real behind one contract | [repo](https://github.com/thaw-ai/thaw) |

## BUGS

For an honest negative result from a sibling project, see [project-gorgon](/writing/project-gorgon): speculative decoding that ended at 0.66x of baseline.

## STATUS

thaw is open source under Apache-2.0, on PyPI as [`thaw-vllm`](https://pypi.org/project/thaw-vllm/), 16 releases in, currently 0.6.0. I am an active participant in vLLM [RFC #34303](https://github.com/vllm-project/vllm/issues/34303) (CUDA Checkpoint/Restore for Near-Zero Cold Starts); RFC author elizabetht asked five thread participants, including me, for input on direction. Out of that thread came [PR #44074](https://github.com/vllm-project/vllm/pull/44074), a pluggable sleep-mode backend abstraction with receipted 70B sleep/wake integration on 2xH100, merged into vLLM core in July 2026 with review engagement from NVIDIA Dynamo and Alibaba Cloud engineers; the follow-up [#47243](https://github.com/vllm-project/vllm/pull/47243) (communicator-agnostic capability flags) merged the same day. That work became a vLLM open-source fellowship, sponsored by Inferact: engine cold-start (July 2026), then model hot-swap (August). The research side became a sole-author arXiv paper: ["Re-feeding Is Not Replaying"](https://arxiv.org/abs/2606.15621) (June 2026). I applied to YC for S26; the application was rejected but placed in the top 10%, YC encouraged a reapply, so it is on the table.

## SEE ALSO

[thaw.sh](https://thaw.sh) &middot; [repo](https://github.com/thaw-ai/thaw) &middot; [pypi](https://pypi.org/project/thaw-vllm/) &middot; [RFC #34303](https://github.com/vllm-project/vllm/issues/34303) &middot; [PR #44074](https://github.com/vllm-project/vllm/pull/44074) &middot; [the paper on arXiv](https://arxiv.org/abs/2606.15621)

<div class="man-footer">thaw 0.6.0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;July 2026&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;THAW(1)</div>
