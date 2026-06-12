---
title: About
description: Nils Matteson is a UW-Madison data-science graduate and incoming CS master's student at Northeastern Silicon Valley. Systems and ML infrastructure engineer, Boise to Madison to the Bay.
---

Swedish-American, dual citizen, raised in Boise. Now in Madison. Moving to San Jose in fall 2026.

## education

B.S. Data Science, CS minor, University of Wisconsin-Madison, May 2026. M.S. Computer Science at Northeastern University's Silicon Valley campus in San Jose, September 2026 to May 2028. The Northeastern move lines up with where the inference-infrastructure work actually happens.

## what I work on

My main project is [thaw](/work/thaw), git for live LLM agent sessions, built in Rust, CUDA, and Python. It checkpoints, branches, diffs, and restores live inference state (weights, KV cache, prefix-hash table, scheduler). A running vLLM session forks in 0.88s median on an H100 against a cold boot of roughly 340s. Getting there required a double-buffered O_DIRECT DMA pipeline that overlaps disk reads with PCIe transfer, an 8-shard parallel CRC32C verifier proven to match a serial pass, and coalescing about 16,000 tiny per-block DMAs into one contiguous gather to remove a 60x snapshot bottleneck. 16 releases on PyPI as `thaw-vllm`, 388 tests in CI (155 Rust, 233 Python) that run with no CUDA toolchain.

I opened [PR #44074](https://github.com/vllm-project/vllm/pull/44074) (pluggable sleep-mode backend abstraction) in vLLM after participating in [RFC #34303](https://github.com/vllm-project/vllm/issues/34303). Sole-author preprint: "Re-feeding Is Not Replaying" (June 2026).

Other work, listed on the [work page](/work): a Kafka-style distributed log with hand-rolled LSM-trees and Raft, a transit-ETA model with calibrated conformal coverage, an autonomous outreach system for local businesses.

## founder

[Matteson Systems LLC](/work/matteson-systems) is the entity behind thaw, and also behind a separate product: an autonomous outreach system that audits local-business websites, runs Lighthouse Core Web Vitals in a real headless browser, does a Claude-vision pass, and writes the owner a personalized scorecard. 10,500+ businesses scored, 158 high-priority leads in one run, about 3 cents each. I applied to YC for the S26 batch; the application was rejected but placed in the top 10%, YC encouraged a reapply, and I am reapplying.

## availability

Open to SWE or MLE internship in Summer 2027, full-time in 2028. GPU inference, distributed systems, ML infrastructure. Contact: [nils@thaw.sh](mailto:nils@thaw.sh). Code: [github.com/matteso1](https://github.com/matteso1).

## other

I make music in Ableton, play guitar, run, ski when the snow is worth it.
