---
title: Nils Matteson
description: Inference systems engineer and Inferact-sponsored vLLM fellow. 10 upstream vLLM PRs merged, including reusable initialized-engine snapshots and zstd container-image delivery. Founder of thaw and sole author of an inference-systems preprint.
---

I build systems for LLM inference: GPU and CUDA, distributed systems, applied ML. I like problems where the deliverable is a number someone else can re-run. B.S. Data Science, CS minor, UW-Madison (May 2026). M.S. CS, Northeastern Silicon Valley, San Jose (Sep 2026). The longer plan is research: measurement problems in ML systems, then a PhD.

## vLLM

I'm a vLLM open-source fellow sponsored by Inferact, working with Simon Mo on cold start and reusable engine state. [10 upstream vLLM PRs have merged](https://github.com/vllm-project/vllm/pulls?q=is%3Apr+is%3Amerged+author%3Amatteso1).

**Merged September 21:** [reusable initialized-engine snapshots](https://github.com/vllm-project/vllm/pull/51360) and [zstd container-image delivery](https://github.com/vllm-project/vllm/pull/55608). The snapshot feature lets a compatible host restore a prepared engine after its process has exited. I took it through design, implementation, failure handling and H200 end-to-end validation. [More on the work and measurements](/work#vllm-upstream--fellowship).

## thaw

[thaw](https://thaw.sh) is git for live LLM agent sessions. It checkpoints, branches, diffs, and restores live vLLM/SGLang inference state (weights, KV cache, prefix-hash table, scheduler). A session forks in 0.88s median on an H100 instead of a ~340s cold boot, about 400x amortized. 16 releases on PyPI as [thaw-vllm](https://pypi.org/project/thaw-vllm/), currently 0.6.0, Apache-2.0. Out of [RFC #34303](https://github.com/vllm-project/vllm/issues/34303) came [PR #44074](https://github.com/vllm-project/vllm/pull/44074) (pluggable sleep-mode backend abstraction), merged into vLLM core in July 2026, with follow-up [#47243](https://github.com/vllm-project/vllm/pull/47243) merged the same day. That work became a vLLM open-source fellowship, sponsored by Inferact: engine cold-start (July), model hot-swap (August). Full writeup: [/work/thaw](/work/thaw).

## the paper

["Re-feeding Is Not Replaying: Measuring Replay Noise in Counterfactual Token-Credit Estimation"](https://arxiv.org/abs/2606.15621), sole author, June 2026, 10 pages. Every published method that asks "which token caused the model's answer" rebuilds the model's state by re-feeding the transcript as a fresh prompt, and assumes that is the same state. I measured the assumption on stock vLLM with a three-pass design: exact decode-time KV resume, an identical second exact pass as a replica noise floor, and the re-feed. At low-margin decision tokens, re-feeding changes the credit estimate at rates 14 to 28 points above the floor; the perturbation is consistent with mean-zero, so averages mostly survive, but threshold-based critical-token selection does not. vLLM's batch-invariant kernels eliminate the effect bit-exactly. Total compute under $10. Data, logs, and the analysis script are public in [the repo](https://github.com/thaw-ai/thaw/tree/main/paper/refeed-drift).

---

- [Work](/work): thaw, Matteson Systems, the DoIT Bedrock eval, Sentinel, Madison Metro ML
- [Writing](/writing): speculative decoding postmortem, bus ETA system, RAG benchmarks
- [About](/about): school, research direction, availability
- [Agents](/agents): facts for LLMs

Open to full-time inference-runtime engineering roles in San Francisco or remote in the US. Contact: [nils@thaw.sh](mailto:nils@thaw.sh)
