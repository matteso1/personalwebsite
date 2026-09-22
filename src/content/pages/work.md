---
title: Work
description: What I have built, with numbers. vLLM upstream and the fellowship, thaw, Matteson Systems, the DoIT research role, and selected projects.
---

## vLLM (upstream + fellowship)

[10 upstream vLLM PRs have merged](https://github.com/vllm-project/vllm/pulls?q=is%3Apr+is%3Amerged+author%3Amatteso1). I work with Simon Mo as an Inferact-sponsored open-source fellow, measuring startup costs and moving reusable preparation out of the path to a working server.

**Reusable initialized-engine snapshots, merged September 21 ([#51360](https://github.com/vllm-project/vllm/pull/51360)).** Designed and implemented `vllm snapshot create`, `inspect` and `restore`, including environment compatibility checks, restored-output validation and process cleanup. This is an opt-in experimental path for a compatible same-host Linux x86-64, single-GPU TP1 deployment. Final lifecycle validation on H200 covered create, restore, container restart and a second restore, with output matching the captured oracle.

An earlier controlled benchmark reduced command-launch-to-first-correct-response from **54.7 s to 20.4 s**, a **62.7% reduction**, against an ordinary process with warm model and generated caches. Scope: Qwen3-32B BF16, one H100 PCIe 80 GB, TP1, medians of three trials per arm; snapshot payload pages were evicted before restore. This is a pre-merge performance result, separate from the final H200 lifecycle acceptance. [Measurement and experimental limits](https://github.com/vllm-project/vllm/pull/51360#measured).

**Container-image compression, merged September 21 ([#55608](https://github.com/vllm-project/vllm/pull/55608)).** Added zstd publishing for CI images and a Docker Hub variant while retaining gzip for downstream compatibility.

Earlier merged work includes [pluggable sleep-mode backends (#44074)](https://github.com/vllm-project/vllm/pull/44074), [communicator-agnostic capability flags (#47243)](https://github.com/vllm-project/vllm/pull/47243), [compile-cache correctness (#47356)](https://github.com/vllm-project/vllm/pull/47356) and [memory-profile reuse across boots (#47388)](https://github.com/vllm-project/vllm/pull/47388). The cache-key bug surfaced during measurement: a startup flag caused `21-27s` of H100 recompilation to avoid about `2s` of profiling.

**Ongoing:** [build-time Python bytecode (#55422)](https://github.com/vllm-project/vllm/pull/55422), [shared CLI/runtime argument declarations (#56884)](https://github.com/vllm-project/vllm/pull/56884), and experiments on preparation-cache reuse across fresh replicas.

## thaw

`thaw` is git for live LLM agent sessions: checkpoints, branches, diffs, and restores live inference state (weights, KV cache, prefix-hash table, scheduler). A running vLLM or SGLang session forks in `0.88s` median instead of a `~340s` cold boot on an H100. The core is a double-buffered O_DIRECT DMA pipeline overlapping disk reads with PCIe transfer, plus an 8-shard parallel CRC32C verifier proven equal to a serial pass. Open source, 16 releases on PyPI as `thaw-vllm`, Apache-2.0. Full engineering writeup, receipts, and the honest negative result on its own page.

[Read the thaw writeup](/work/thaw) / [thaw.sh](https://thaw.sh) / [repo](https://github.com/thaw-ai/thaw)

## Matteson Systems LLC

An autonomous outreach system for local businesses. Scans a region from OpenStreetMap (`10,500+` businesses scored in one run, `158` high-priority leads surfaced), screenshots each site in a real headless browser, runs Lighthouse Core Web Vitals, and does a Claude-vision pass to name the single most damaging fixable problem. Writes the owner a personalized email and a plain-English scorecard. Append-only event-sourced Postgres CRM with a threaded Gmail drip on Vercel cron. About `three cents` per business. Built solo.

[Read the writeup](/work/matteson-systems) / [mattesonsystems.com](https://mattesonsystems.com)

## Research Cyberinfrastructure, UW-Madison DoIT

AI Workflows Research Assistant, January to April 2026. LLM evaluation and cost-tracking framework on AWS Bedrock: 9 models, 3 ensemble strategies, `282` questions. Ensemble majority voting scored `0.840`, beat every individual model. Pareto analysis: Llama-4 Maverick at `98%` of top accuracy at a fraction of cost and latency. Presented at UW-Madison ML+X Forum.

## Selected projects

**Sentinel.** Distributed message queue in Go, Kafka-inspired, built from scratch: custom LSM-tree storage engine, skip-list memtables, SSTables with CRC32, write-ahead log, leveled compaction, gRPC wire protocol with topic and partition consumer groups. Raft consensus hand-rolled: leader election, log replication, split-brain prevention, tested against a deterministic in-memory network simulator. [Read the writeup](/work/sentinel) / [repo](https://github.com/matteso1/sentinel)

**Madison Metro ML.** Live ML that corrects the transit API's ETAs. 47-feature XGBoost model plus Mondrian conformal prediction, calibrated `90%` coverage interval stratified by route, day-type, and horizon. Retrains nightly through GitHub Actions behind a hard deploy gate (at least 2s MAE gain required). React, DeckGL, and MapLibre frontend renders 200+ live vehicles at 60fps. [Read the writeup](/work/madison-metro-ml) / [madisonbuseta.com](https://madisonbuseta.com)

**Lattice.** Reactive framework in Rust with a PyO3 binding and a Cranelift JIT, measured at `10.6x` Streamlit on the same workload. [repo](https://github.com/matteso1/lattice)

**brain2text.** BCI decoder for a Kaggle task: 5-layer GRU with a CTC decoder, `40%` WER. [repo](https://github.com/matteso1/brain2text)

**gitstare.** Git-history TUI written in Rust. [repo](https://github.com/matteso1/gitstare)

**LockBox.** Password manager on AES-256-GCM. [repo](https://github.com/matteso1/lockbox)

## Coursework

Distributed-systems visualizations of Cassandra, Kafka, HDFS, and HBase (CS544); 1.2M-tweet sentiment pipeline on the UW HTCondor grid (STAT405); causal-inference propensity-score matching in R (STAT479).
