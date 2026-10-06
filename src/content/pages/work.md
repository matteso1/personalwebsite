---
title: Work
description: Selected inference engineering work in vLLM and FlashInfer, plus a few earlier projects.
---

<a id="vllm-upstream--fellowship"></a>

## Inference engineering

I work with Simon Mo as an Inferact-sponsored vLLM open-source fellow. Most of my work starts with a question about startup: what does a fresh server have to do, what can it reuse, and how do we check that it still serves correctly?

That has meant following imports, compilation, model loading, memory allocation, and kernel tuning through the same startup. I'm interested in the boundaries between them, especially when removing one cost exposes another. These are a few pieces of that work.

### Reusable engine snapshots

[Merged in vLLM: #51360](https://github.com/vllm-project/vllm/pull/51360). I designed and implemented experimental commands to create, inspect, and restore an initialized engine, with compatibility checks, output validation, and process cleanup. The supported scope is a compatible same-host, Linux x86-64, single-GPU TP1 setup. The PR records the tests and limitations.

### Python startup

[Merged in vLLM: #55422](https://github.com/vllm-project/vllm/pull/55422). This moves Python bytecode compilation into the build so a fresh container can use prepared caches. The work included checking which packages were actually imported and separating compilation costs from other import work.

### Preparation through ordinary serving

[Shared lifecycle draft: #59832](https://github.com/vllm-project/vllm/pull/59832) and [ordinary serve adapter draft: #59851](https://github.com/vllm-project/vllm/pull/59851). These follow-ups connect snapshot preparation and recovery to the normal serving path. The aim is to prepare a configuration once and activate compatible replicas while preserving serving behavior. Provider integration and broader qualification are still open.

### MoE kernel tuning

[Open FlashInfer PR: #6032](https://github.com/flashinfer-ai/flashinfer/pull/6032). I'm working on opt-in factorized search for ordinary MoE autotuning, alongside cache reuse and checks on the selected kernels. Exhaustive search stays the default. The [vLLM integration, #59995](https://github.com/vllm-project/vllm/pull/59995), is a draft.

## Earlier projects

- [Sentinel](/work/sentinel): a distributed message queue in Go, with an LSM-tree storage engine and Raft replication.
- [Madison Metro ML](/work/madison-metro-ml): transit arrival predictions with XGBoost and conformal prediction intervals.
- [LLM evaluation at UW-Madison DoIT](/writing/wattbot-rag): comparing models and ensemble strategies on AWS Bedrock, including cost and latency.
