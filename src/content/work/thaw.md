---
title: thaw
description: Snapshot and restore live LLM inference state so a vLLM session forks in 0.88s median instead of a ~340s cold boot. Built in Rust, CUDA, and Python.
year: 2026
role: Founder and Lead Engineer
stack: [Rust, CUDA, Python, PyO3, vLLM, SGLang]
receipt: 0.88s median fork vs ~340s cold boot on H100
order: 1
featured: true
links:
  site: https://thaw.sh
  repo: https://github.com/thaw-ai/thaw
  pypi: https://pypi.org/project/thaw-vllm/
  rfc: https://github.com/vllm-project/vllm/issues/34303
---

Booting a large model into a vLLM worker is slow in a way that is easy to ignore until it is the whole problem. Loading weights, warming the allocator, and re-running prefill to rebuild the KV cache takes roughly 340 seconds for a fresh session on an H100. If your workload is one long-lived server, you pay that once. If your workload is thousands of short divergent rollouts, that cold start is the cost.

thaw treats a running model the way an operating system treats a running process. It snapshots the live inference state of a vLLM session, the weights, the KV cache, the scheduler, and the prefix-hash table, then restores that state so a new worker forks from it in 0.88s median rather than booting from nothing. The mental model is `fork()` for an LLM: capture a warm parent, hydrate many children that skip prefill and immediately diverge. It is open source, on PyPI as `thaw-vllm`, and built in Rust, CUDA, and Python.

## The hard parts

The headline number is the restore path, and the restore path is mostly a memory-movement problem dressed up as an inference one.

**The DMA pipeline.** Restoring tens of gigabytes of weights from disk to GPU is bounded by how well you overlap three stages that want to run at different rates: reading from disk, copying across PCIe, and verifying what arrived. I built a double-buffered `O_DIRECT` pipeline so a disk read for the next chunk happens while the current chunk is in flight over PCIe, with the page cache out of the way. That overlap is what gets the weight restore to 14.3 GB/s and a 70B load to 3.4x faster than a cold load.

**The verifier.** A fork is worthless if the restored model is silently corrupt, so every restore is checksummed. A serial CRC32C pass over the whole image is correct but slow enough to eat the throughput win. I split it across 8 shards that run in parallel and proved the sharded result matches the serial pass exactly, so verification rides along with the transfer instead of gating it. The output is bit-identical across 8 models tested, which is the property that actually lets you trust a fork.

**The 60x KV-cache fix.** The first KV-cache snapshot path was honest and very slow. vLLM stores the cache as thousands of small per-block allocations, and snapshotting them one block at a time meant roughly 16,000 tiny DMAs, each with its own setup cost. The fix was to stop treating them as 16,000 transfers and start treating them as one: coalesce the scattered blocks into a single contiguous gather, move it once, then unpack on the far side. That collapsed a 60x bottleneck and is the difference between a snapshot you take constantly and one you avoid taking.

**Prefix-cache reconstruction.** Restoring the KV bytes is not enough if vLLM does not know what is in them. The win that makes children cheap is rebuilding the prefix-cache hash table on restore, so a cold-started request that shares a prefix with the parent gets a cache hit and skips prefill entirely, which is the entire point of forking a warm session rather than booting a fresh one.

**Testing GPU code without a GPU.** All of this is CUDA, and I write most of it on a Mac with no CUDA toolchain. The `CudaBackend` trait puts a mock backend and the real CUDA backend behind one contract, so the logic, the pipeline ordering, the shard math, the snapshot bookkeeping, runs and gets tested without a GPU in the loop. 172 Rust tests run on macOS with no CUDA installed. The real backend has to satisfy the same contract the mock does, so the tests are about the thing, not a stand-in for it.

## Receipts

Every row points at committed code or a committed benchmark log. The honest negative result stays in the table.

| metric | what it measures | technique | proof |
|---|---|---|---|
| `0.88s` median fork | wall time to fork a warm session vs `~340s` cold boot (H100) | snapshot + restore of live inference state | [repo](https://github.com/thaw-ai/thaw) |
| `14.3 GB/s` | weight restore throughput, disk to GPU | double-buffered `O_DIRECT` DMA pipeline | [repo](https://github.com/thaw-ai/thaw) |
| `3.4x` | faster 70B load vs cold load | overlapped read + PCIe transfer | [repo](https://github.com/thaw-ai/thaw) |
| bit-identical | restored output across 8 models | end-to-end restore verification | [repo](https://github.com/thaw-ai/thaw) |
| 8-shard == serial | `CRC32C` verifier correctness | parallel shards proven equal to a serial pass | [repo](https://github.com/thaw-ai/thaw) |
| `60x` removed | KV-snapshot bottleneck | `~16K` per-block DMAs coalesced into one gather | [repo](https://github.com/thaw-ai/thaw) |
| 172 tests | Rust suite, GPU logic without a GPU | `CudaBackend` trait, mock and real behind one contract | [repo](https://github.com/thaw-ai/thaw) |
| `0.66x` baseline | Gorgon speculative-decoding result, ended slower than baseline | tree attention + Medusa draft heads, four bugs found | [writeup](/writing/project-gorgon) |

## Engineering discipline

The receipts are committed JSON, not screenshots, because a number you cannot rerun is a claim. The verifier exists so a fast restore cannot also be a wrong restore. The mock backend exists so the logic is tested on every commit rather than only on the days I have a GPU. The Gorgon row stays in the table because a results page that hides the experiment that ended at 0.66x of baseline is selling, not reporting.

## Status

thaw is open source under Apache-2.0 and on PyPI as [`thaw-vllm`](https://pypi.org/project/thaw-vllm/). The cold-start problem it composes with is also being worked in the open: I opened vLLM [RFC #34303](https://github.com/vllm-project/vllm/issues/34303), *CUDA Checkpoint/Restore for Near-Zero Cold Starts*, co-founded with M. Yu and K. Kapur. I am the founder and lead engineer, 2026 to present, full-time on it under Matteson Systems LLC. We applied to YC for the S26 batch, and the application placed in the top 10%, so we are reapplying.

- Site: [thaw.sh](https://thaw.sh)
- Code: [github.com/thaw-ai/thaw](https://github.com/thaw-ai/thaw)
- Package: [pypi.org/project/thaw-vllm](https://pypi.org/project/thaw-vllm/)
- RFC: [vllm-project/vllm#34303](https://github.com/vllm-project/vllm/issues/34303)
