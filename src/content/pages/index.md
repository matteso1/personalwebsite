---
title: Nils Matteson
description: Systems and ML infrastructure engineer. Builds GPU inference tooling. thaw forks a live vLLM session in 0.88s vs ~340s cold boot.
---

I build the systems layer of AI: GPU and CUDA inference, distributed systems, and applied ML. B.S. Data Science, CS minor, UW-Madison (May 2026). M.S. CS at Northeastern Silicon Valley (San Jose, Sep 2026).

## thaw

[thaw](https://thaw.sh) is git for live LLM agent sessions. It checkpoints, branches, diffs, and restores live vLLM/SGLang inference state (weights, KV cache, prefix-hash table, scheduler). A session forks in 0.88s median on an H100 instead of a ~340s cold boot, about 400x amortized. 16 releases on PyPI as [thaw-vllm](https://pypi.org/project/thaw-vllm/), currently 0.6.0, Apache-2.0. I opened [PR #44074](https://github.com/vllm-project/vllm/pull/44074) in vLLM (pluggable sleep-mode backend), following participation in [RFC #34303](https://github.com/vllm-project/vllm/issues/34303). Sole-author preprint: "Re-feeding Is Not Replaying" (June 2026). Full writeup: [/work/thaw](/work/thaw).

---

- [Work](/work): thaw, Matteson Systems, the DoIT Bedrock eval, Sentinel, Madison Metro ML
- [Writing](/writing): speculative decoding postmortem, bus ETA system, RAG benchmarks
- [About](/about): school, location, availability
- [Agents](/agents): facts for LLMs

Open to SWE/MLE internship Summer 2027, full-time 2028. GPU inference, distributed systems, ML infrastructure. Contact: [nils@thaw.sh](mailto:nils@thaw.sh)
