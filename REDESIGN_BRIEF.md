# nilsmatteson.com — redesign brief

*2026-04-24. Written after side-by-side review of current site vs. thaw.sh.*

---

## The honest problem

**Your current site says you're a student looking for your first job. You're not that anymore.**

The content is stale:
- "Data Science & CS student at UW-Madison" — you're 2 weeks from graduating, co-founder of thaw, YC S26 applicant, NEU SV Fall 2026, published RFC author. The site hasn't caught up.
- "I build systems that scale" — generic LinkedIn-header phrase. You have the actual receipt (0.88s fork round on H100) and it's not mentioned.
- "Looking for my first full-time role" — wrong framing. You're running a company. If anyone's doing the hiring it's you.
- "Featured Track" / "Producer • Artist • Visionary" is still living in the repo (`Home.jsx`, which is routed nowhere but sits in the source) — dead code makes the whole thing feel abandoned.
- Project list doesn't include thaw. Your most valuable artifact isn't on your own portfolio.

The aesthetic is stale:
- Terminal green Matrix-droplet background is the #1 most-used "hacker portfolio" trope on GitHub. Every CS undergrad with a side project ships this exact look. It reads generic even though the individual pieces are well-executed.
- `// 01 INDEX` section labels + `~ / nils-matteson / index _` breadcrumb is the same cute-terminal device on 10,000 Dev.to profiles.
- Monochrome green — one accent color, flat — can't hold attention the way thaw.sh's dual acid/magenta does.
- Typography is a single JetBrains Mono–flavored family. No contrast pair. No display weight moment. Nothing that stops you scrolling.
- Game of Life background is a nerd-flex that everyone already knows is a nerd-flex.

**You liked thaw.sh because it reads like a movie poster. Your personal site reads like a CS 280 term project.**

---

## What makes thaw.sh work (and how to steal it)

Reverse-engineered from `site/index.html`:

### Typography system — the real unlock

Three-font stack, each doing a distinct job:
- **Archivo Black** — display. Massive, condensed, uppercase, letter-spacing tight to `-.055em`. Used at clamp(56px, 11.5vw, 190px) for the hero. This is the "movie poster" feeling.
- **Instrument Serif italic** — the secret ingredient. A warm, calligraphic serif set in italic, lowercase, appearing inside the Archivo Black hero as a contrast accent. `<em>` inside `<h1>` — that ONE inflection makes the whole thing feel designed instead of templated.
- **JetBrains Mono** — navigation, chips, small labels. Doesn't dominate, just grounds.

Most "hacker" portfolios use mono for everything. That's the mistake. Mono + massive display + italic serif is the jump.

### Color system

Not a single accent — a *dual* accent with tertiary:
- **Acid green** `#C6FF1A` (yours is close already)
- **Magenta** `#FF2E7E` (the missing partner)
- Blue / cyan / violet as tertiary glows (radial gradients in the background)

The magenta is what creates the "cinematic" feeling. Green alone = terminal. Green + magenta = poster.

### Background atmosphere

Not a Game of Life simulation. Three ambient layers, all `pointer-events:none; z-index:0`:
1. **Radial gradient glow** — ellipses of `rgba(acid, 0.07)` and `rgba(magenta, 0.06)` off-canvas
2. **Subtle grid** — 56px grid lines at 2.5% opacity, masked to fade at edges
3. **Light noise/grain** (optional, from a noise.png you already have in `/public`)

Subtle enough you don't notice unless you look. Strong enough to make the black feel *intentional* rather than empty.

### Card treatment (your "holographic" ask)

The thaw cards use two techniques layered:
1. **Neon rim border** — `::before` pseudo-element with a conic or linear gradient in the border, using `-webkit-mask-composite: xor` to punch out the interior. Creates a thin iridescent edge that doesn't bleed into content.
2. **Ambient drop shadow** — `0 60px 120px -40px rgba(blue, 0.25)` — soft colored shadow giving lift without visible offset.

For *true holographic* cards (which you want), add:
3. **Pointer-tracked radial gradient** — mousemove listener updates `--mouse-x` and `--mouse-y` CSS vars; card background has `radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(acid, 0.15), transparent 40%)` — creates the "light catches it as you hover" feel
4. **Chromatic-aberration sheen** — second pseudo-element with a conic-gradient rotating through hues, `mix-blend-mode: color-dodge`, low opacity, masked to appear only on hover. Pokemon-card iridescence.

I'll include a full component for this below.

---

## The new identity: who the site is actually about now

**Current framing:** "ambitious UW-Madison senior looking for their first tech role"

**Reframe:** "the guy who built thaw — a fork primitive for LLM inference — shipping it out of a 3-person startup while finishing undergrad, heading to SV this fall"

That's a completely different resume line. Your site should open with it.

### Updated one-line bio

```
I build the thaw primitive — fork a running LLM and hydrate N divergent 
children in <1s. Open source, on PyPI, validated on H100.
Heading to Silicon Valley Fall 2026 via the Northeastern MS in CS.
Also: Swedish-American dual citizen, Ableton obsessive, 
UW-Madison CS & DS '26.
```

### Updated stats band (the "movie poster numbers")

Same treatment thaw.sh uses for `0.88s per fork round`:

```
0.88s    per fork round on H100 8B (vs 340s cold-boot, 400× amortized)
14+GB/s  parallel CRC32C fold throughput  
9,424    lines of Rust shipped in thaw-core
3        people on the team (Nils, Matt, Karan)
T15      MS in CS program, Fall 2026, Silicon Valley
```

These are *your* receipts. Lead with them.

---

## Proposed new information architecture

Current: Index → Projects → Blog → Arcade

Proposed: **Index → Work → Writing → Play**

- **Index (/)** — hero + 3 stat cards + featured project strip. Lean, not a wall.
- **Work (/work)** — replaces /projects. thaw is the hero card (dedicated section with link to thaw.sh). Madison Metro / LockBox / Sentinel / Synapse / Aura stay, but as "prior work" below thaw. Ordering matters.
- **Writing (/writing)** — replaces /blog. Your bus writeup + sat-viz writeup. Add 1-2 thaw-process posts (the fork-primitive story, the S3 ceiling lesson).
- **Play (/play)** — keeps the arcade/GoL stuff you already built, plus Ableton tracks (Spotify embed from old Home.jsx moves here, not the landing page). This is where the *personality* lives — separate from the professional layer.

### What to remove

- `src/pages/Home.jsx` (the old music-producer one) — delete entirely
- `src/pages/About.jsx`, `src/pages/Contact.jsx`, `src/pages/NotFound.jsx`, `src/pages/ProjectsPage.jsx` → audit for dead routes, delete what's not in `App.jsx`
- Game of Life background — replace with the ambient-glow + grid from thaw.sh (keep GoL optionally on /play as a toy)
- The matrix-droplet green rain — same, retire it
- `Producer • Artist • Visionary` copy in `Home.jsx` — delete

---

## Concrete redesign: hero page

See `HomePage.redesign.jsx` (I'm adding it next to the existing one). Summary of the moves:

1. **Hero headline** — Archivo Black at clamp(72px, 12vw, 200px), uppercase. Two lines:
   ```
   FORK A      ← outlined/stroked version of the text
   LIVE LLM.   ← solid, acid color on the verb, instrument-serif italic on "live"
   ```
   Pulled directly from thaw.sh's aesthetic but about YOUR work.

2. **Instead of a typewriter**, a static 2-sentence sub. Typewriters feel slow on return visits. Cut it.

3. **CTA row**: `[read the receipt →]` `[github]` `[resume ↓]` — the primary CTA links to thaw.sh, not "see my work." Your best work is thaw; point at it.

4. **Stats band** under the hero (3 big numbers) before any grid section. Movie-poster pacing.

5. **Featured project = thaw** as a full-width holographic card with the fork diagram embedded (SVG, not a video — lighter). Then 3 smaller holographic cards for Madison Metro / Sentinel / Synapse.

6. **"Who I am"** as a single paragraph, NOT a bulleted "Location / Outside work / Current focus / Approach" terminal block. That reads like a signup form. Write it as prose:
   > *"Swedish-American, raised in Boise, studying at UW-Madison. I build things I don't know how to build, break them, and figure out why. Right now that means the fork primitive for LLM inference. Before that: a distributed message queue, a real-time collab engine, ML for bus ETAs. After UW I'm moving to the Bay to start the Northeastern MS in CS at their Silicon Valley campus — research, labs, and whatever's next."*

7. **Retire the `// 01 INDEX`, `// 02 ABOUT`, `// 03 WHAT I DO` section labels**. They're training wheels. Use whitespace and typography to separate sections — like thaw.sh does.

8. **Footer with status chip** — `● shipping thaw from madison. sv in 4 months.` — matches the live-status vibe thaw.sh has.

---

## Holographic card component (the thing you specifically asked for)

File `src/components/HolographicCard.jsx` — drop-in replacement for `terminal-card`.

```jsx
import React, { useRef } from 'react';

export default function HolographicCard({ children, className = '', accent = 'acid' }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`holo-card ${className}`}
      data-accent={accent}
    >
      <div className="holo-shine" />
      <div className="holo-rim" />
      <div className="holo-content">{children}</div>
    </div>
  );
}
```

CSS (add to `src/styles/index.css`):

```css
.holo-card {
  position: relative;
  background: linear-gradient(180deg, rgba(16,19,31,0.9), rgba(11,13,22,0.9));
  border-radius: 14px;
  padding: 1.75rem;
  isolation: isolate;
  overflow: hidden;
  transition: transform .3s var(--ease);
  --mx: 50%;
  --my: 50%;
}
.holo-card:hover { transform: translateY(-2px); }

/* Iridescent rim */
.holo-rim {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: conic-gradient(
    from 180deg at 50% 50%,
    rgba(198,255,26,0.3),
    rgba(0,229,255,0.3),
    rgba(255,46,126,0.3),
    rgba(198,255,26,0.3)
  );
  -webkit-mask: linear-gradient(#000,#000) content-box, linear-gradient(#000,#000);
  mask: linear-gradient(#000,#000) content-box, linear-gradient(#000,#000);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0.6;
  transition: opacity .3s var(--ease);
}
.holo-card:hover .holo-rim { opacity: 1; }

/* Mouse-tracked shine (the "light catches it" effect) */
.holo-shine {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    600px circle at var(--mx) var(--my),
    rgba(198,255,26,0.12),
    transparent 40%
  );
  pointer-events: none;
  opacity: 0;
  transition: opacity .3s var(--ease);
  z-index: 1;
}
.holo-card:hover .holo-shine { opacity: 1; }

.holo-card[data-accent="magenta"] .holo-shine {
  background: radial-gradient(
    600px circle at var(--mx) var(--my),
    rgba(255,46,126,0.14),
    transparent 40%
  );
}

.holo-content { position: relative; z-index: 2; }

/* Soft ambient shadow */
.holo-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  box-shadow:
    0 30px 60px -20px rgba(62,107,255,0.2),
    0 60px 120px -40px rgba(255,46,126,0.12);
  pointer-events: none;
  z-index: -1;
}
```

That's Pokémon-card-iridescence without being tacky. Hover = light catches it. Subtle at rest, alive on interaction.

---

## Upgraded palette (update `tailwind.config.js`)

```js
colors: {
  bg: '#07080D',
  'bg-2': '#0B0D16',
  surface: '#10131F',
  'surface-2': '#181C2C',
  acid: '#C6FF1A',
  'acid-dim': '#9ACC0E',
  magenta: '#FF2E7E',
  'magenta-dim': '#CC1F62',
  cyan: '#00E5FF',
  violet: '#A855F7',
  'text-primary': '#EAEDF5',
  'text-mid': '#B4BAC9',
  'text-dim': '#6E7588',
  warn: '#FFB547',
}
```

Fonts (add to `index.html` `<head>` — same Google Fonts line thaw.sh uses):

```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Archivo+Black&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Then in Tailwind:
```js
fontFamily: {
  display: ['"Archivo Black"', 'sans-serif'],
  sans: ['Archivo', 'system-ui', 'sans-serif'],
  serif: ['"Instrument Serif"', 'serif'],
  mono: ['"JetBrains Mono"', 'monospace'],
}
```

---

## Background atmosphere (replaces Game of Life)

Drop into `Layout.jsx` instead of `<GameOfLife />`:

```jsx
<div className="ambient-bg" aria-hidden>
  <div className="ambient-glow" />
  <div className="ambient-grid" />
  <div className="ambient-noise" />
</div>
```

CSS:
```css
.ambient-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.ambient-glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 900px 600px at 85% -10%, rgba(198,255,26,.07), transparent 60%),
    radial-gradient(ellipse 800px 500px at 10% 110%, rgba(255,46,126,.06), transparent 60%),
    radial-gradient(ellipse 600px 400px at 50% 50%, rgba(62,107,255,.03), transparent 70%);
}
.ambient-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse at 50% 30%, black, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse at 50% 30%, black, transparent 80%);
}
.ambient-noise {
  position: absolute;
  inset: 0;
  background-image: url('/noise.png');
  opacity: 0.03;
  mix-blend-mode: overlay;
}
```

Quieter, more cinematic, doesn't fight the content. If you want to keep GoL, move it to `/play` as an interactive toy.

---

## Micro-interactions that add soul (pick 2-3, not all)

1. **Magnetic buttons** — button gently shifts toward cursor on hover (Framer Motion, `whileHover={{ scale: 1.02, x: cursorX }}`)
2. **Scramble text effect** on the hero headline — character cycle on first load, settling into the final text (library: `npm i use-scramble`)
3. **Parallax depth** — hero headline sits 20px closer to camera than sub-text; subtle mouse-parallax on Y axis only
4. **Ambient audio toggle** — tiny speaker icon bottom-right; toggles a soft drone/pad you produced in Ableton. Nobody does this. Absolute flex.
5. **Cursor trail** — small glowing acid dot following cursor, fades on stop. Sparingly — overused in 2023 but the trick still works if the rest of the design is restrained.
6. **Section reveal** — sections fade/slide in on scroll via Framer Motion `useInView` (you already have the imports)

Don't do all of these. Pick the ones that match the tone. My pick for your vibe: **2 (scramble hero) + 4 (ambient audio) + 6 (section reveal you already have)**.

---

## Content rewrites (drop-in)

### `src/content/site.json` hero

```json
{
  "hero": {
    "title": "Fork a live LLM.",
    "subtitle": "in under a second",
    "description": "I build thaw — the fork primitive for live LLM inference. Snapshot a running vLLM session, hydrate N divergent children that skip prefill. Open source, shipping on PyPI, validated at 0.88s/round on H100. I'm finishing my CS & DS undergrad at UW-Madison and moving to Silicon Valley for the Northeastern MS in CS this fall."
  }
}
```

### About paragraph (the single-prose version, replaces the 4-paragraph breakup)

> Swedish-American, raised in Boise, studying CS & Data Science at UW-Madison. I build things I don't know how to build, break them, and figure out why. Right now that means thaw — a fork primitive for LLM inference that turns 340-second cold boots into sub-second branches. Before thaw: a distributed message queue from scratch in Go, a real-time collab engine in Rust, ML for bus ETAs in my hometown grid. After UW I'm moving to the Bay for the Northeastern MS in CS at their Silicon Valley campus. Outside of shipping: Ableton, guitar, long runs. The thread is the same in all of it — iteration, attention to detail, caring about how things actually work.

### Featured Work: thaw card (copy)

> **thaw** — the fork primitive for live LLM inference.
> Co-founder + lead engineer. 9,424 lines of Rust across 5 crates, Python bindings, vLLM + SGLang integration, agent-fork demo. Validated at 0.88s per fork round on H100 8B. Open source, on PyPI, upstream RFC'd to vLLM.
> `thaw.sh` · `github.com/thaw-ai/thaw` · `pip install thaw-vllm`

---

## Execution plan (if you want to ship this in a weekend)

### Saturday — foundation
- [ ] Delete dead code: old `Home.jsx`, unused `About.jsx` / `Contact.jsx` / `NotFound.jsx` / `ProjectsPage.jsx` (or audit + trim)
- [ ] Add Google Fonts (Archivo family + Instrument Serif) to `index.html`
- [ ] Update `tailwind.config.js` colors + fonts
- [ ] Replace Game of Life with ambient layers in `Layout.jsx`
- [ ] Write `HolographicCard.jsx` + CSS (from above)

### Sunday — content + hero
- [ ] Rewrite `site.json` with new hero / bio / projects order (thaw first)
- [ ] Rebuild `HomePage.jsx`: hero + stats band + featured thaw card + 3-up project grid + short bio + CTA
- [ ] Scramble-text effect on hero (`use-scramble` npm package, ~5 min)
- [ ] Ship to production (Vercel/GitHub Pages — check current deploy target)

### Later (polish pass)
- [ ] Ambient audio toggle (record a 30-second pad in Ableton, compress to mp3 <500kb)
- [ ] Write 1-2 thaw process posts for `/writing`
- [ ] Screenshot + commit before/after

---

## The vibe check

Before hitting deploy, ask: **does this look like a movie poster or like a term project?**

- Movie poster: massive type, bold color contrast, ambient glow, one undeniable hero, restraint in micro-interactions, italic serif doing an unexpected job.
- Term project: terminal green everywhere, `// 01 SECTION`, bulleted facts, typewriter effect, Game of Life background, and a stack cloud that reads like a LinkedIn skills list.

Your current site is term-project-leaning. Thirty minutes of font work + color work + one hero rewrite pulls it all the way across.

---

## Two directions, pick one

If you want to stay closer to what you have:
- **Direction A: "terminal-elevated"** — keep the terminal-code language but dress it in the thaw.sh typography and palette. Same breadcrumbs and section labels, but they render in Archivo Black + Instrument Serif instead of JetBrains Mono. Less tear-up.

If you want the real rebrand:
- **Direction B: "movie poster"** — the whole thing. Strip terminal language. Big type, holographic cards, ambient glow, dual-accent palette. Matches thaw.sh as a sibling site, not a competitor.

My recommendation: **Direction B.** The terminal-aesthetic was the right move for student-Nils. Founder-Nils + MS-student-in-SV-Nils deserves the upgrade. When you eventually post the SV announcement on LinkedIn, people will click through to your site. Make them see something that says "this guy is serious."
