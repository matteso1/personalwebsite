---
title: Nils Matteson
description: Nils Matteson, an engineer interested in inference systems, startup performance, and understanding where the time goes.
intro: I work on inference systems. I like making models faster to start and understanding where the time goes.
---

## Lately

I've been working on [vLLM](https://github.com/vllm-project/vllm) through an Inferact-sponsored open-source fellowship with Simon Mo. Most of my time goes into what happens before a model serves its first request: loading weights, compiling code, tuning kernels, and deciding which of that work we can reuse.

I'm interested in GPU memory, caching, and the less obvious reasons a system is slow. I like following a problem through the stack, making a change, and checking whether it helped for the reason I thought it would.

## A few things I've worked on

- [Reusable engine snapshots](https://github.com/vllm-project/vllm/pull/51360). Saving initialized state so a compatible vLLM engine can use it again.
- [Python startup](https://github.com/vllm-project/vllm/pull/55422). Moving bytecode compilation into the container build.
- [MoE kernel tuning](https://github.com/flashinfer-ai/flashinfer/pull/6032). Exploring a smaller search space in FlashInfer, and checking the choices it makes.

[More about the work](/work) and the details behind it.

## Off the clock

I'm in San Jose, studying CS at Northeastern after finishing at UW-Madison. I make music in Ableton, play guitar, run, and ski when I can. [A little more about me](/about).
