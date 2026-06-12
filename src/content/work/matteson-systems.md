---
title: Matteson Systems
description: An autonomous outreach system that finds local businesses losing customers to quiet website problems, audits each site, and builds every owner a plain-English scorecard with the fix.
year: 2026
role: Founder and Engineer
stack: [Next.js, Postgres, Drizzle, Playwright, Claude, Lighthouse, Vercel]
receipt: 10,500+ businesses scored, 158 leads in one run, about 3 cents each
order: 2
links:
  site: https://mattesonsystems.com
---

A lot of small businesses, restaurants, shops, contractors, are quietly losing customers to their own websites and have no idea. The site loads slowly, breaks on a phone, buries the phone number, or fails the checks Google actually scores it on. The owner never sees that report card. Matteson Systems is the system I built to find those businesses, read each site the way a frustrated customer would, and hand the owner exactly one thing to fix first.

It is my LLC, and it is also the entity behind thaw. I built all of it solo, and it mostly runs itself.

## How it works

The pipeline takes a region and works through it with me out of the loop.

It starts from OpenStreetMap and pulls every business in the area, the Treasure Valley to begin with: restaurants, shops, contractors, the long tail of local commerce. For each one it opens the real website in a headless browser, screenshots it on desktop and on a real mobile profile, and runs Google's own Lighthouse to measure the Core Web Vitals that actually move search rank and bounce rate.

Then the screenshots go to a Claude-vision pass that reads the page the way a person would and finds the single most damaging but fixable problem. Not a checklist of forty nitpicks: the one thing costing the owner the most, for the least effort to fix. That finding becomes the lead of a personalized email, which links to a scorecard page built just for that business.

## The scorecard

The report card is the part I rebuilt most recently. It is a plain-English scorecard with a big letter grade up top and a breakdown anyone can read, no jargon, no raw Lighthouse traces. Every problem is paired with the easy fix, so the page is not an accusation, it is a to-do list. The email leads with the same single finding the audit actually surfaced, so the message and the page agree instead of reading like a template.

## What it runs on

State lives in an append-only, event-sourced Postgres CRM with Drizzle migrations, so every send, open, and reply is a recorded event rather than a mutable row I have to trust. A threaded Gmail drip runs on a Vercel cron with reputation-aware send caps and in-thread replies. Opens and replies are tracked, the checkout and payment flow is built in, and a per-call cost ledger is kept in integer microcents so I always know the real unit economics. It costs about three cents a business, and I run the whole thing from a console I built.

## An honest detail

The day I rebuilt the scorecard, the system was about to cold-email a funeral home in Toronto that had been scraped in by accident, well outside the region and exactly the kind of business you do not point an outreach bot at. So I built a filter for junk like that: out-of-area entries, sensitive categories, anything that should never get an automated email. That is most of what running this actually is. Not the model call, but the judgment around it.

## Why

I love systems engineering, and this is a system end to end: scraping, real-browser auditing, a vision model, an event-sourced backend, deliverability, and payments, all solo and all cheap to run. It is also useful. The internet is full of small-business sites quietly underperforming, and the work is finding them, showing them plainly what is wrong, and making the fix obvious.

- `10,500+` businesses scored in a single run
- `158` high-priority leads surfaced
- about `three cents` per business, end to end
- Live at [mattesonsystems.com](https://mattesonsystems.com)
