/* ═══════════════════════════════════════════════════════════════
   ASCII art library — hand-crafted halftone / DedSec block mosaics.
   All pieces use Unicode block characters (▓▒░█▀▄▌▐) and box-drawing.
   ═══════════════════════════════════════════════════════════════ */

/* — Ambient half-tone moon (Raben reference, abstract) — */
export const MOON = String.raw`
          ░░▒▒▓▓▓▒▒░░
       ░▒▓████████████▓▒░
     ░▓█████▀░░░░░░▒▓█████▓░
    ▒████▀░░▒▓▓▓▒░░░░▒▓██████▒
   ░███▀░▒▓███████▓▒░░▒▓██████░
   ▒██▀░▒▓█████████▓░░░▒▓██████▒
  ▒██░░▓████▓▒░▒▒▓██▓░░░▒▓█████▒
  ▒██░░▓███▒░▒▓▓▓▒░▓▓░░░▒▓█████▒
  ░██▒░▓███▓▒░░▒▒░▒▓▒░░░▒▓█████░
   ▒██▓▒░▒▓▓██████▓▒░░▒▓██████▒
    ▓███▓░░░▒▓▓▓▒░░▒▓██████████
     ░▓█████▓▒░░░▒▓████████▓░
       ░▒▓████████████▓▒░
          ░░▒▒▓▓▓▓▒▒░░`;

/* — Ambient corner sigil (DedSec N∴M) — */
export const SIGIL = String.raw`
  ╔═════════════════════╗
  ║  N.MATTESON // 3B4F ║
  ║  ─────────────────  ║
  ║   ▓▓▓▒▒░░  ░▒▒▓▓▓   ║
  ║    ◢▇▇▇▆▅▄▃▂▁       ║
  ║    ◥▇▇▇▆▅▄▃▂▁       ║
  ║   ▓▓▓▒▒░░  ░▒▒▓▓▓   ║
  ║  ─────────────────  ║
  ║   subject : active  ║
  ║   origin  : wisc    ║
  ║   vector  : sv '26  ║
  ╚═════════════════════╝`;

/* — Hero dossier portrait (abstract silhouette) — */
export const DOSSIER_PORTRAIT = String.raw`
 ┌──── SUBJECT / N.M ─────────┐
 │                            │
 │        ░▒▓▓▓▓▓▒░           │
 │      ▒▓█████████▓▒         │
 │     ▓███████████████▓      │
 │    ▓████▀░░░░░░▀████▓      │
 │    ████░          ░████    │
 │    ███░   ▓▓   ▓▓  ░███    │
 │    ███░   ▀▀   ▀▀  ░███    │
 │    ███░    ░ ░ ░   ░███    │
 │    ▓███░    ▀▀▀    ░███▓   │
 │     ▓█████▒▒▒▒▒▓█████▓     │
 │      ▒▓█████████████▓▒     │
 │        ▒▓█████████▓▒       │
 │         ░▓███████▓░        │
 │          ░▒████▒░          │
 │             ▓▓             │
 │           ▓████▓           │
 │         ████████           │
 │        ██████████          │
 │       ████████████         │
 │       ████████████         │
 │        ▓████████▓          │
 │                            │
 └────────────────────────────┘`;

/* — Fork diagram (for thaw feature card) — */
export const FORK_DIAGRAM = String.raw`
 ┌─ SNAPSHOT ──────────┐
 │                     │
 │    ● parent         │
 │    │ kv + weights   │
 │    │ + scheduler    │
 │    ▼                │
 │   ╳ fork point      │
 │  ╱│╲                │
 │ ╱ │ ╲               │
 │▼  ▼  ▼              │
 │◉  ◉  ◉              │
 │a  b  c              │
 │                     │
 │ ◢  0.88s / round    │
 │ ◥  400× amortized   │
 └─────────────────────┘`;

/* — System status block (footer / misc) — */
export const SYS_PANEL = String.raw`
 ┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
 ┃  //  STATUS             ┃
 ┃  ─────────────────────  ┃
 ┃   ▓ available  · 2027   ┃
 ┃   ▓ shipping   · thaw   ┃
 ┃   ▓ location   · wi→ca  ┃
 ┃   ▓ vector     · swe    ┃
 ┃  ─────────────────────  ┃
 ┃   ◢▇▇▇▇▇▇ OK            ┃
 ┗━━━━━━━━━━━━━━━━━━━━━━━━━┛`;

/* — Tiny inline glyph accents — */
export const GLYPHS = {
  arrow:    "►",
  triangle: "▲",
  block:    "▓",
  half:     "▒",
  light:    "░",
  signal:   "◢▇▇",
  cross:    "✕",
  dot:      "●",
  ring:     "◉",
  diamond:  "◆",
};

/* — Mosh strip generator — produces the corruption band.
     Returns a string of N chars from the block-drawing set. — */
const MOSH_CHARS = "▓▒░█▄▀▌▐│┃═╬╋╵╷╸╹╻╿╽──▬▭▮▯▰▱";
export function generateMosh(length = 220, seed = 0) {
  let out = "";
  let x = seed * 9301 + 49297;
  for (let i = 0; i < length; i++) {
    x = (x * 9301 + 49297) % 233280;
    const r = x / 233280;
    if (r > 0.88) out += "  ";
    else if (r > 0.7) out += "░ ";
    else if (r > 0.5) out += "▒";
    else if (r > 0.3) out += "▓";
    else if (r > 0.12) out += "█";
    else out += MOSH_CHARS[Math.floor(r * 200) % MOSH_CHARS.length];
  }
  return out;
}

/* — Project grid ornament (section divider) — */
export const GRID_ORNAMENT = "▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚";

/* — Contact terminal banner — */
export const CONTACT_BANNER = String.raw`
 ╔══════════════════════════════════════════╗
 ║  TERMINAL  //  ACCESS  //  NM-0426       ║
 ║  ─────────────────────────────────────   ║
 ║  > ready. awaiting message.              ║
 ╚══════════════════════════════════════════╝`;
