---
title: Matteson Systems
description: Autonomous outreach system for local businesses. Scrapes OpenStreetMap, runs Lighthouse and Claude-vision in a headless browser, writes a personalized scorecard per business.
year: 2026
role: Founder and Engineer
stack: [Next.js, Postgres, Drizzle, Playwright, Claude, Lighthouse, Vercel]
receipt: 10,500+ businesses scored, 158 leads in one run, about 3 cents each
order: 2
links:
  site: https://mattesonsystems.com
---

Matteson Systems LLC is the entity behind both this product and [thaw](/work/thaw). The product here is an autonomous outreach pipeline I built solo to audit local-business websites at scale.

## what it is

The pipeline starts from OpenStreetMap and pulls every business in a region. For each one, it opens the real website in a headless browser, screenshots it on desktop and a real mobile profile, and runs Lighthouse Core Web Vitals. A Claude-vision pass reads the page and names the single most damaging fixable problem. That finding becomes the subject line and lead of a personalized email; a scorecard page built per business gives the owner a plain-English breakdown with a letter grade and an easy fix for each problem.

10,500+ businesses scored in a single run. 158 high-priority leads surfaced. About three cents per business end to end.

## how it runs

State lives in an append-only, event-sourced Postgres CRM with Drizzle migrations. Every send, open, and reply is a recorded event. A threaded Gmail drip runs on a Vercel cron with reputation-aware send caps and in-thread RFC822 replies. Opens and replies are tracked. A per-call cost ledger in integer microcents tracks the real unit economics.

## what broke

The day I finished the scorecard, the system was about to cold-email a funeral home in Toronto that had been scraped in by accident: out of region, wrong category. I built a filter for those cases. Most of running this is judgment around the model calls, not the model calls themselves.

## numbers

- `10,500+` businesses scored in a single run
- `158` high-priority leads surfaced
- about `three cents` per business, end to end
