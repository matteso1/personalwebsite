---
title: Nils Matteson
description: Nils Matteson, an engineer interested in inference systems, startup performance, and understanding where the time goes.
intro: I'm into inference engineering. I like making models faster to start and understanding where the time goes.
---

## Lately

I've been working on [vLLM](https://github.com/vllm-project/vllm) through an Inferact-sponsored open-source fellowship with Simon Mo. Most of my time goes into what happens before a model serves its first request: loading weights, compiling code, tuning kernels, and deciding which of that work we can reuse.

I'm interested in GPU memory, caching, and the less obvious reasons a system is slow. I like following a problem through the stack, making a change, and checking whether it helped for the reason I thought it would.

## A few things I've worked on

- [Reusable engine snapshots](https://github.com/vllm-project/vllm/pull/51360). Saving initialized state so a compatible vLLM engine can use it again.
- [Python startup](https://github.com/vllm-project/vllm/pull/55422). Moving bytecode compilation into the container build.
- [MoE kernel tuning](https://github.com/flashinfer-ai/flashinfer/pull/6032). Exploring a smaller search space in FlashInfer, and checking the choices it makes.

[More about the work](/work) and the details behind it.

## A paper

[Re-feeding Is Not Replaying: Measuring Replay Noise in Counterfactual Token-Credit Estimation](https://arxiv.org/abs/2606.15621), a sole-author preprint from June 2026. I looked at whether resuming a model's saved decoder state produces the same measurements as feeding the text back in. The experiments compare both against repeated runs, separating replay differences from run-to-run noise. The writeup includes the setup, results, and cases where the distinction disappears.

[PDF](/refeed-drift.pdf) and [experiment logs and analysis code](https://github.com/thaw-ai/thaw/tree/main/paper/refeed-drift).

## Off the clock

I'm in San Jose, studying CS at Northeastern after finishing at UW-Madison. I make music in Ableton, play guitar, run, and ski when I can. [A little more about me](/about).
