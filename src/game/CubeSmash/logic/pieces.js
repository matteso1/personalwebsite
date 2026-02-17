import { PIECE_DEFS } from './constants.js';
import { getBoardDensity, getNearCompleteLines, canPieceFitAnywhere } from './board.js';

// === Piece lookup by ID ===
const PIECE_BY_ID = {};
for (const p of PIECE_DEFS) {
  PIECE_BY_ID[p.id] = p;
}

function byId(id) {
  return PIECE_BY_ID[id];
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// === Weighted piece pool ===
// Real Block Blast heavily favors simple shapes (squares, lines, rectangles).
// L/T/S/Z shapes appear but are much less common.
// We build a weighted pool by repeating common pieces.
const WEIGHTED_POOL = [];

// Common pieces (high weight) -- the bread and butter
const COMMON_PIECES = [
  'line2h', 'line2v',
  'line3h', 'line3v',
  'line4h', 'line4v',
  'line5h', 'line5v',
  'square',
  'rect2x3', 'rect3x2',
  'square3',
];

// Uncommon pieces (medium weight) -- appear regularly but less often
const UNCOMMON_PIECES = [
  'corner1', 'corner2', 'corner3', 'corner4',
  'L1', 'L2', 'L3', 'L4',
  'J1', 'J2', 'J3', 'J4',
  'bigL1', 'bigL2', 'bigL3', 'bigL4',
];

// Rare pieces (low weight) -- spice, not staple
const RARE_PIECES = [
  'T1', 'T2', 'T3', 'T4',
  'S1', 'S2',
  'Z1', 'Z2',
];

for (const id of COMMON_PIECES) WEIGHTED_POOL.push(id, id, id, id, id); // 5x
for (const id of UNCOMMON_PIECES) WEIGHTED_POOL.push(id, id);            // 2x
for (const id of RARE_PIECES) WEIGHTED_POOL.push(id);                    // 1x

function pickWeighted() {
  return byId(pickRandom(WEIGHTED_POOL));
}

// Line pieces indexed by length for gap-filling
const LINE_H_BY_LEN = {};
const LINE_V_BY_LEN = {};
for (const p of PIECE_DEFS) {
  if (p.id.startsWith('line')) {
    const len = p.cells.length;
    if (p.id.endsWith('h')) {
      if (!LINE_H_BY_LEN[len]) LINE_H_BY_LEN[len] = [];
      LINE_H_BY_LEN[len].push(p);
    } else {
      if (!LINE_V_BY_LEN[len]) LINE_V_BY_LEN[len] = [];
      LINE_V_BY_LEN[len].push(p);
    }
  }
}

// All pieces sorted by cell count descending (for fitability fallback)
const PIECES_BY_SIZE_DESC = [...PIECE_DEFS].sort((a, b) => b.cells.length - a.cells.length);

// === Synergy Sets ===
// Simple, practical combos you'd actually see in Block Blast.
// Focused on common pieces that work well together.
const SYNERGY_SETS = [
  // Square + lines (the classic "fill rows" combo)
  ['square3', 'line5h', 'line3h'],
  ['square3', 'line5v', 'line3v'],
  ['square3', 'rect2x3', 'line2h'],
  ['square3', 'rect3x2', 'line2v'],
  // Rectangle pairs
  ['rect2x3', 'rect2x3', 'square'],
  ['rect3x2', 'rect3x2', 'square'],
  ['rect2x3', 'rect3x2', 'line3h'],
  ['rect2x3', 'rect3x2', 'line3v'],
  // Line combos
  ['line5h', 'line3h', 'line2h'],
  ['line5v', 'line3v', 'line2v'],
  ['line4h', 'line4h', 'line3h'],
  ['line4v', 'line4v', 'line3v'],
  ['line4h', 'line4h', 'square'],
  ['line4v', 'line4v', 'square'],
  ['line5h', 'line5h', 'line3h'],
  ['line5v', 'line5v', 'line3v'],
  // Square + small fills
  ['square', 'square', 'line4h'],
  ['square', 'square', 'line4v'],
  ['square', 'line3h', 'line3v'],
  // Mixed practical
  ['square3', 'square', 'line2h'],
  ['rect2x3', 'line4h', 'line2v'],
  ['rect3x2', 'line4v', 'line2h'],
  ['rect2x3', 'line5h', 'square'],
  ['rect3x2', 'line5v', 'square'],
];

// === Strategy 1: Synergy Sets (~25%) ===
function strategySynergy() {
  const set = pickRandom(SYNERGY_SETS);
  return set.map(id => ({ ...byId(id) }));
}

// === Strategy 2: Board-Aware Gap Fill (~30%) ===
function strategyBoardAware(grid) {
  const nearComplete = getNearCompleteLines(grid, 5);
  const allLines = [
    ...nearComplete.rows.map(r => ({ ...r, type: 'row' })),
    ...nearComplete.cols.map(c => ({ ...c, type: 'col' })),
  ];

  if (allLines.length === 0) {
    return strategyWeightedRandom();
  }

  // Sort by most filled first (closest to completion)
  allLines.sort((a, b) => b.filled - a.filled);
  const target = allLines[0];

  const pieces = [];
  const gapLen = target.gapCount;
  const isRow = target.type === 'row';
  const lineLookup = isRow ? LINE_H_BY_LEN : LINE_V_BY_LEN;

  // Try to find a line piece that fits the gap
  let gapFiller = null;
  for (let len = gapLen; len >= 1; len--) {
    const candidates = lineLookup[len];
    if (candidates && candidates.length > 0) {
      gapFiller = pickRandom(candidates);
      break;
    }
  }

  if (gapFiller) {
    pieces.push({ ...gapFiller });
  } else {
    pieces.push({ ...pickWeighted() });
  }

  // Fill remaining with weighted random (like the real game)
  while (pieces.length < 3) {
    pieces.push({ ...pickWeighted() });
  }

  return pieces;
}

// === Strategy 3: Weighted Random (~45%) ===
// The core strategy -- just pick from the weighted pool.
// This naturally produces "reasonable" sets because the pool
// is dominated by squares, lines, and rectangles.
function strategyWeightedRandom() {
  return [pickWeighted(), pickWeighted(), pickWeighted()].map(p => ({ ...p }));
}

// === Post-selection: ensure fitability ===
function ensureFitability(pieces, grid) {
  for (let i = 0; i < pieces.length; i++) {
    if (!canPieceFitAnywhere(grid, pieces[i])) {
      let replaced = false;
      for (const candidate of PIECES_BY_SIZE_DESC) {
        if (canPieceFitAnywhere(grid, candidate)) {
          pieces[i] = { ...candidate };
          replaced = true;
          break;
        }
      }
      if (!replaced) break;
    }
  }
  return pieces;
}

// === Post-selection: no triple duplicates ===
function deduplicateTriples(pieces) {
  if (pieces.length < 3) return pieces;

  const ids = pieces.map(p => p.id);
  if (ids[0] === ids[1] && ids[1] === ids[2]) {
    let replacement;
    let attempts = 0;
    do {
      replacement = pickWeighted();
      attempts++;
    } while (replacement.id === ids[0] && attempts < 20);
    pieces[2] = { ...replacement };
  }
  return pieces;
}

// === Main exports ===
export function getRandomPieces(count = 3) {
  const pieces = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * PIECE_DEFS.length);
    pieces.push({ ...PIECE_DEFS[idx], uid: `${Date.now()}-${i}-${Math.random()}` });
  }
  return pieces;
}

export function getSmartPieces(count, grid) {
  if (!grid) return getRandomPieces(count);

  const density = getBoardDensity(grid);
  let pieces;

  // High density: always try to help with gap-filling
  if (density > 0.65) {
    pieces = strategyBoardAware(grid);
  } else {
    const roll = Math.random();
    if (roll < 0.25) {
      pieces = strategySynergy();
    } else if (roll < 0.55) {
      pieces = strategyBoardAware(grid);
    } else {
      pieces = strategyWeightedRandom();
    }
  }

  // Trim or pad to requested count
  while (pieces.length < count) {
    pieces.push({ ...pickWeighted() });
  }
  if (pieces.length > count) {
    pieces.length = count;
  }

  // Post-selection rules
  pieces = deduplicateTriples(pieces);
  pieces = ensureFitability(pieces, grid);

  // Assign unique IDs
  for (let i = 0; i < pieces.length; i++) {
    pieces[i].uid = `${Date.now()}-${i}-${Math.random()}`;
  }

  return pieces;
}

export function getPieceBounds(piece) {
  let maxR = 0, maxC = 0;
  for (const [r, c] of piece.cells) {
    if (r > maxR) maxR = r;
    if (c > maxC) maxC = c;
  }
  return { rows: maxR + 1, cols: maxC + 1 };
}
