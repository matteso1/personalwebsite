---
title: Nils Matteson
description: Engineer working on LLM-inference infrastructure. CS master's student and founder. I build thaw, git for live LLM agent sessions, in Rust and CUDA. A live session forks in under a second.
---

Engineer working on LLM-inference infrastructure. CS master's student and founder.

I work on the systems layer underneath AI: GPU and CUDA inference, distributed systems, and applied ML. Right now I am in Madison, moving to San Jose and the Bay Area in fall 2026. The way I work is a loop: build the thing, break it, figure out why it broke, rebuild it better.

## thaw

thaw is git for live LLM agent sessions: checkpoint, branch, diff, and restore a running vLLM or SGLang session, so it forks in 0.88s median instead of a roughly 340s cold boot on an H100. It is open source, sixteen releases deep on PyPI as thaw-vllm, with an upstream vLLM PR and a sole-author research preprint behind it. More on [thaw.sh](https://thaw.sh), the [deep write-up](/work/thaw), and the [repo](https://github.com/thaw-ai/thaw).

## Elsewhere on the site

- [Work](/work). thaw first and in full, then Matteson Systems, the DoIT Bedrock eval, and selected projects: a Kafka-style distributed log, a transit-ETA model with conformal coverage, and a few others.
- [Writing](/writing). Engineering write-ups, including the speculative-decoding engine I built that ended slower than baseline, and the four bugs along the way.
- [About](/about). Boise to Madison to the Bay, the schools, and the human side.
- [Agents](/agents). The facts and the receipts in plain prose, for anyone pointing an LLM at this site.

Open to an SWE or MLE internship in summer 2027 and full-time in 2028, especially on GPU inference, distributed systems, and ML infrastructure teams. Currently full-time on thaw.
