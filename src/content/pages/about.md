---
title: About
description: Nils Matteson is a UW-Madison data-science senior and incoming CS master's student who builds the systems layer of AI inference. Swedish-American, raised in Boise, based in Madison, moving to the Bay Area in fall 2026.
---

I am Swedish-American, a dual citizen and fluent in Swedish, raised in Boise, Idaho. I live in Madison, Wisconsin now, and I am moving to San Jose and the Bay Area in the fall of 2026.

I build the unglamorous part of AI infrastructure: the GPU and CUDA inference layer, the distributed systems underneath it, and the applied ML that has to stay honest about what it does not know. Most of my time goes to the plumbing that people prefer to treat as a black box, which is exactly the part I find worth understanding.

The loop is always the same. Build the thing. Break it. Figure out why it broke. Rebuild it better. I trust the rebuilds more than the first drafts, because by then I have usually been wrong about something specific and learned the shape of it. That is also why I commit benchmark receipts instead of adjectives. A number with a proof link next to it is the only claim I know how to defend.

## What I work on

My main project is [thaw](/work/thaw), a Rust, CUDA, and Python library that snapshots and restores live LLM inference state: weights, KV cache, prefix-hash table, and scheduler. It forks a running vLLM session in 0.88s median on an H100, against a cold boot of roughly 340s. Getting there meant a double-buffered O_DIRECT DMA pipeline that overlaps disk reads with PCIe transfer, an 8-shard parallel CRC32C verifier that matches a serial pass exactly, and coalescing about 16,000 tiny per-block DMAs into one contiguous gather to kill a 60x snapshot bottleneck. It is on PyPI as `thaw-vllm`, and there are 172 Rust tests that run on my Mac with no CUDA toolchain installed.

I built most of it largely solo, under my own LLC, which has taught me more about scoping and honesty than any class did. The full engineering story, with the receipts laid out as a table, lives on the [thaw page](/work/thaw). The rest of what I have shipped, from a Kafka-style distributed log with hand-rolled LSM-trees and Raft to a transit-ETA model with calibrated conformal coverage, is on the [work page](/work).

## Education

I am finishing a B.S. in Data Science with a CS minor at UW-Madison, expected May 2026. In September 2026 I start an M.S. in Computer Science at Northeastern's Silicon Valley campus in San Jose, running through May 2028. The Northeastern move is the reason for the move west, and the timing lines up with where the inference-infrastructure work actually happens.

## Founder and operator

I am the founder of two things. [thaw](/work/thaw) is the LLM-inference work above; I am full-time on it right now. We applied to YC for the S26 batch, the application placed in the top 10%, and we are reapplying. [Matteson Systems LLC](/work/matteson-systems) is the entity behind thaw, and behind a product of its own: an autonomous outreach system that finds local businesses whose websites are quietly losing them customers, audits each site, and shows the owner exactly what is broken and what it is costing them. It scans a region from OpenStreetMap, screenshots each site in a real headless browser, runs Google's own performance tools, and has a Claude-vision pass read the page and name the single most damaging but fixable problem, then writes the owner a personalized email and builds them a plain-English scorecard. It runs itself from a console I built, at about three cents a business. Running a real LLC, even a small one, changes how you write code. Every shortcut has an owner now, and it is me.

## Away from the keyboard

I make music in Ableton, play guitar, go on long runs, and ski when there is snow worth the drive. None of it is a brand. It is just the part of the week that is not a terminal.

## Availability

I am open to a SWE or MLE internship in summer 2027 and full-time work in 2028, especially on GPU inference, distributed systems, and ML infrastructure teams. Until then I am full-time on thaw. The fastest way to reach me is [nilsmatteson@icloud.com](mailto:nilsmatteson@icloud.com); my code is at [github.com/matteso1](https://github.com/matteso1).

<small>Colophon: this site is Markdown rendered to static HTML through Astro, set in Source Serif 4 with IBM Plex Mono for numbers, units, and file paths, on warm paper under off-black ink with a single locked accent. The calm light theme is a deliberate move off the phosphor-green vim-terminal build it replaced.</small>
