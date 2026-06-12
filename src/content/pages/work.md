---
title: Work
description: A ledger of what I have built and what it does, with the receipts inline. thaw first, then Matteson Systems, the DoIT research role, and selected projects across distributed systems and applied ML.
---

A running ledger of the work. I tend to choose the low-level layer on purpose: GPU and CUDA inference, distributed-systems internals, and applied ML where being honest about uncertainty matters. Each entry below names the real technique and carries its own receipt. The links go to repos, benchmarks, and writeups, not screenshots.

## thaw

`thaw` is git for live LLM agent sessions: it checkpoints, branches, diffs, and restores live inference state (weights, KV cache, prefix-hash table, scheduler) so a running vLLM or SGLang session forks in `0.88s` median instead of a `~340s` cold boot on an H100. The core is a double-buffered O_DIRECT DMA pipeline that overlaps disk reads with PCIe transfer, paired with an 8-shard parallel CRC32C verifier proven to match a serial pass exactly. Open source, sixteen releases deep on PyPI as `thaw-vllm`, with an upstream vLLM PR and a sole-author research preprint behind it. The full engineering story, the committed benchmark receipts, and the honest negative result live on its own page.

[Read the thaw writeup](/work/thaw) / [thaw.sh](https://thaw.sh) / [repo](https://github.com/thaw-ai/thaw)

## Matteson Systems LLC

An autonomous outreach system for local businesses whose websites are quietly losing them customers. It scans a region from OpenStreetMap (more than `10,500` businesses scored in one run, `158` high-priority leads surfaced), screenshots each site in a real headless browser, runs Google's own Lighthouse Core Web Vitals, and has a Claude-vision pass read the page and name the single most damaging but fixable problem. Then it writes the owner a personalized email leading with that one thing and builds them a plain-English scorecard: a letter grade and the easy fix for each problem. The whole thing runs from a console I built, at about `three cents` a business, on an append-only event-sourced Postgres CRM with a threaded Gmail drip on a Vercel cron and open and reply tracking. Built solo.

[Read the writeup](/work/matteson-systems) / [mattesonsystems.com](https://mattesonsystems.com)

## Research Cyberinfrastructure, UW-Madison DoIT

An evaluation and cost-tracking framework on AWS Bedrock, benchmarking 9 LLMs and 3 ensemble strategies across `282` questions. Ensemble majority voting scored `0.840` and beat every individual model. A Pareto analysis showed Llama-4 Maverick reaching `98%` of top accuracy at a fraction of the cost and latency. Presented at the UW-Madison ML+X Forum.

## Selected projects

**Sentinel.** A distributed message queue in Go, Kafka-inspired and built from scratch: a custom LSM-tree storage engine, skip-list memtables clocked at `3.9M reads/s`, SSTables with CRC32, a write-ahead log, and leveled compaction, all behind a gRPC wire protocol with topic and partition consumer groups. Raft consensus is hand-rolled too, with leader election, log replication, and split-brain prevention, exercised against a deterministic in-memory network simulator and 45 tests. [Read the writeup](/work/sentinel) / [repo](https://github.com/matteso1/sentinel)

**Madison Metro ML.** Live ML that corrects the transit API's ETAs. A 47-feature XGBoost model plus Mondrian conformal prediction gives a calibrated `90%` coverage interval, stratified by route, day-type, and horizon. It retrains nightly through GitHub Actions behind a hard deploy gate that requires at least a 2s MAE gain, and the React, DeckGL, and MapLibre frontend renders 200+ live vehicles at 60fps. [Read the writeup](/work/madison-metro-ml) / [madisonbuseta.com](https://madisonbuseta.com)

**Lattice.** A reactive framework in Rust with a PyO3 binding and a Cranelift JIT, measured at `10.6x` Streamlit on the same workload. [repo](https://github.com/matteso1/lattice)

**brain2text.** A brain-computer-interface decoder for a Kaggle task: a 5-layer GRU with a CTC decoder, landing at `40%` WER. [repo](https://github.com/matteso1/brain2text)

**gitstare.** A git-history TUI written in Rust. [repo](https://github.com/matteso1/gitstare)

**LockBox.** A password manager built on AES-256-GCM. [repo](https://github.com/matteso1/lockbox)

## Coursework

Some of the same instincts show up in coursework: distributed-systems visualizations of Cassandra, Kafka, HDFS, and HBase (CS544); a 1.2M-tweet sentiment pipeline run on the UW HTCondor grid (STAT405); and causal-inference propensity-score matching in R (STAT479).
