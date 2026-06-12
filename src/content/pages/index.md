---
title: Nils Matteson
description: Systems and ML infrastructure engineer. Builds GPU inference tooling. thaw forks a live vLLM session in 0.88s vs ~340s cold boot. Sole-author preprint on replay noise in token-credit estimation.
---

I build systems for LLM inference: GPU and CUDA, distributed systems, applied ML. I like problems where the deliverable is a number someone else can re-run. B.S. Data Science, CS minor, UW-Madison (May 2026). M.S. CS, Northeastern Silicon Valley, San Jose (Sep 2026). The longer plan is research: measurement problems in ML systems, then a PhD.

## thaw

[thaw](https://thaw.sh) is git for live LLM agent sessions. It checkpoints, branches, diffs, and restores live vLLM/SGLang inference state (weights, KV cache, prefix-hash table, scheduler). A session forks in 0.88s median on an H100 instead of a ~340s cold boot, about 400x amortized. 16 releases on PyPI as [thaw-vllm](https://pypi.org/project/thaw-vllm/), currently 0.6.0, Apache-2.0. I opened [PR #44074](https://github.com/vllm-project/vllm/pull/44074) in vLLM (pluggable sleep-mode backend), following participation in [RFC #34303](https://github.com/vllm-project/vllm/issues/34303). Full writeup: [/work/thaw](/work/thaw).

## the paper

["Re-feeding Is Not Replaying: Measuring Replay Noise in Counterfactual Token-Credit Estimation"](/refeed-drift.pdf), sole author, June 2026, 10 pages. Every published method that asks "which token caused the model's answer" rebuilds the model's state by re-feeding the transcript as a fresh prompt, and assumes that is the same state. I measured the assumption on stock vLLM with a three-pass design: exact decode-time KV resume, an identical second exact pass as a replica noise floor, and the re-feed. At low-margin decision tokens, re-feeding changes the credit estimate at rates 14 to 28 points above the floor; the perturbation is consistent with mean-zero, so averages mostly survive, but threshold-based critical-token selection does not. vLLM's batch-invariant kernels eliminate the effect bit-exactly. Total compute under $10. Data, logs, and the analysis script are public in [the repo](https://github.com/thaw-ai/thaw/tree/main/paper/refeed-drift).

---

- [Work](/work): thaw, Matteson Systems, the DoIT Bedrock eval, Sentinel, Madison Metro ML
- [Writing](/writing): speculative decoding postmortem, bus ETA system, RAG benchmarks
- [About](/about): school, research direction, availability
- [Agents](/agents): facts for LLMs

Open to SWE/MLE internship Summer 2027, full-time 2028. GPU inference, distributed systems, ML infrastructure. Contact: [nils@thaw.sh](mailto:nils@thaw.sh)
