---
title: About
description: Nils Matteson is a UW-Madison data-science graduate and incoming CS master's student at Northeastern Silicon Valley. Systems and ML infrastructure engineer, Boise to Madison to the Bay.
---

Swedish-American, dual citizen, raised in Boise. Madison now. San Jose in the fall.

## education

B.S. Data Science, CS minor, University of Wisconsin-Madison, May 2026. M.S. Computer Science at Northeastern University's Silicon Valley campus in San Jose, September 2026 to May 2028. I picked the campus over the ranking: the work I want to do happens within twenty miles of it.

## what I work on

My main project is [thaw](/work/thaw), git for live LLM agent sessions, built in Rust, CUDA, and Python. It checkpoints, branches, diffs, and restores live inference state (weights, KV cache, prefix-hash table, scheduler). A running vLLM session forks in 0.88s median on an H100 against a cold boot of roughly 340s. Getting there required a double-buffered O_DIRECT DMA pipeline that overlaps disk reads with PCIe transfer, an 8-shard parallel CRC32C verifier proven to match a serial pass, and coalescing about 16,000 tiny per-block DMAs into one contiguous gather to remove a 60x snapshot bottleneck. 16 releases on PyPI as `thaw-vllm`, 388 tests in CI (155 Rust, 233 Python) that run with no CUDA toolchain.

I opened [PR #44074](https://github.com/vllm-project/vllm/pull/44074) (pluggable sleep-mode backend abstraction) in vLLM after participating in [RFC #34303](https://github.com/vllm-project/vllm/issues/34303).

## research

The question I keep returning to is state. A transformer mid-generation is a multi-gigabyte live data structure, and almost everything downstream of it (agent frameworks, RL pipelines, evaluation harnesses) treats it as disposable: throw it away, re-feed text, hope the numbers come back the same. thaw is the engineering half of an argument that it should be a first-class artifact. The measurement half is a sole-author arXiv paper, ["Re-feeding Is Not Replaying"](https://arxiv.org/abs/2606.15621) (June 2026): on stock vLLM, the re-feed shortcut changes per-token credit estimates at decision tokens 14 to 28 points above a replica noise floor, the perturbation is consistent with mean-zero so averages mostly survive, threshold-based token selection does not, and vLLM's batch-invariant kernels eliminate the whole effect bit-exactly. Total compute was under $10 of rented A100 time, which I consider part of the result.

The plan from here: keep doing measurement work on inference systems, get the preprint through a workshop, and eventually a PhD in ML systems. I want the kind of career where the deliverable is a number with a confidence interval and a repo attached.

## founder

[Matteson Systems LLC](/work/matteson-systems) is the entity behind thaw, and also behind a separate product: an autonomous outreach system that audits local-business websites, runs Lighthouse Core Web Vitals in a real headless browser, does a Claude-vision pass, and writes the owner a personalized scorecard. 10,500+ businesses scored, 158 high-priority leads in one run, about 3 cents each. I applied to YC for the S26 batch; the application was rejected but placed in the top 10%, YC encouraged a reapply, and I am reapplying.

## other

I make music in Ableton, play guitar, run, and ski when the snow is worth it. The site looks like Windows 98 on purpose; desktop computing peaked then and I see no reason to pretend otherwise.
