---
title: For agents
description: A factual summary of Nils Matteson's background and selected work, with primary sources.
canonical: https://nilsmatteson.com/agents
contact:
  email: nilsmatteson@icloud.com
  github: https://github.com/matteso1
  linkedin: https://linkedin.com/in/nilsmatteson
  site: https://nilsmatteson.com
machineSources:
  - /index.md
  - /about.md
  - /work.md
  - /llms.txt
---

## Background

Nils Matteson is a Swedish-American engineer raised in Boise, Idaho, and based in San Jose, California. He completed a B.S. in Data Science with a Computer Science minor at the University of Wisconsin-Madison in May 2026. He is currently pursuing an M.S. in Computer Science at Northeastern University's Silicon Valley campus.

He is an Inferact-sponsored vLLM open-source fellow working with Simon Mo. His interests include inference startup performance, model loading, reusable preparation and engine state, GPU memory, and caching. His work includes measuring startup costs and checking the mechanisms behind observed changes.

## Selected work

- [vLLM #51360](https://github.com/vllm-project/vllm/pull/51360), merged: experimental initialized-engine snapshot creation, inspection, and restoration, including compatibility checks, output validation, and cleanup. Its supported scope is compatible same-host Linux x86-64, single-GPU TP1 execution. Relocation and TP2 remain outside that qualified scope.
- [vLLM #55422](https://github.com/vllm-project/vllm/pull/55422), merged: build-time Python bytecode preparation for startup.
- [vLLM #59832](https://github.com/vllm-project/vllm/pull/59832) and [#59851](https://github.com/vllm-project/vllm/pull/59851), drafts: shared preparation and recovery lifecycle, followed by an adapter for ordinary serving. Provider integration and broader qualification remain open.
- [FlashInfer #6032](https://github.com/flashinfer-ai/flashinfer/pull/6032), open for review: opt-in factorized search for ordinary MoE autotuning. Exhaustive search remains the default. The companion [vLLM integration #59995](https://github.com/vllm-project/vllm/pull/59995) is a draft.

Earlier projects include [Sentinel](/work/sentinel), a distributed message queue in Go, and [Madison Metro ML](/work/madison-metro-ml), a transit arrival prediction system. He also worked on LLM evaluation and cost tracking at UW-Madison DoIT.

## Sources and contact

The linked pull requests contain implementation details, experimental limits, and current review status. The site's overview pages are available as [/index.md](/index.md), [/about.md](/about.md), and [/work.md](/work.md). [/llms.txt](/llms.txt) indexes the site's Markdown sources.

Contact: [nilsmatteson@icloud.com](mailto:nilsmatteson@icloud.com). Code: [github.com/matteso1](https://github.com/matteso1).
