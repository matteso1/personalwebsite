import { PIECE_DEFS, GRID_SIZE } from './constants.js';
import { getBoardDensity, getNearCompleteLines, canPieceFitAnywhere } from './board.js';

// === Helpers ===
const PIECE_BY_ID = {};
for (const p of PIECE_DEFS) PIECE_BY_ID[p.id] = p;

function byId(id) { return PIECE_BY_ID[id]; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// === Tray "vibes" ===
// Each vibe is a pool of piece IDs that feel good together.
// The game picks a vibe, then draws 3 from that pool.
// Pools overlap -- that's fine, it keeps things natural.

const VIBES = [
  // Horizontal builders -- lines and wide shapes for filling rows
  {
    weight: 25,
    pool: ['line2h', 'line3h', 'line4h', 'line5h', 'rect2x3', 'square', 'square3', 'dot'],
  },
  // Vertical builders -- lines and tall shapes for filling columns
  {
    weight: 25,
    pool: ['line2v', 'line3v', 'line4v', 'line5v', 'rect3x2', 'square', 'square3', 'dot'],
  },
  // Chunky -- squares and rectangles, the satisfying fat pieces
  {
    weight: 20,
    pool: ['square', 'square3', 'rect2x3', 'rect3x2', 'line2h', 'line2v', 'line3h', 'line3v', 'dot'],
  },
  // Small + medium mix -- easy to place, good for tight boards
  {
    weight: 10,
    pool: ['dot', 'line2h', 'line2v', 'line3h', 'line3v', 'square', 'corner1', 'corner2', 'corner3', 'corner4', 'diag2a', 'diag2b'],
  },
  // L-shapes + a line -- the occasional challenge tray
  {
    weight: 8,
    pool: ['L1', 'L2', 'L3', 'L4', 'J1', 'J2', 'J3', 'J4', 'line3h', 'line3v', 'line2h', 'line2v', 'square', 'dot'],
  },
  // Big pieces -- rewarding when board is open
  {
    weight: 7,
    pool: ['square3', 'line5h', 'line5v', 'rect2x3', 'rect3x2', 'bigL1', 'bigL2', 'bigL3', 'bigL4'],
  },
  // Wild card -- any common piece, keeps it unpredictable
  {
    weight: 5,
    pool: [
      'dot', 'line2h', 'line2v', 'line3h', 'line3v', 'line4h', 'line4v', 'line5h', 'line5v',
      'square', 'square3', 'rect2x3', 'rect3x2',
      'corner1', 'corner2', 'corner3', 'corner4',
      'diag2a', 'diag2b', 'diag3a', 'diag3b',
      'L1', 'L2', 'L3', 'L4', 'J1', 'J2', 'J3', 'J4',
      'T1', 'T3', 'S1', 'Z1',
    ],
  },
];

// Build weighted vibe selection array
const VIBE_PICKER = [];
for (const vibe of VIBES) {
  for (let i = 0; i < vibe.weight; i++) VIBE_PICKER.push(vibe);
}

function pickVibe() { return pick(VIBE_PICKER); }

// === Gap detection ===
function countIsolatedGaps(grid) {
  let count = 0;
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] !== null) continue;
      const hasNeighbor =
        (r > 0 && grid[r - 1][c] === null) ||
        (r < GRID_SIZE - 1 && grid[r + 1][c] === null) ||
        (c > 0 && grid[r][c - 1] === null) ||
        (c < GRID_SIZE - 1 && grid[r][c + 1] === null);
      if (!hasNeighbor) count++;
    }
  }
  return count;
}

const GAP_FILLERS = ['dot', 'dot', 'line2h', 'line2v', 'diag2a', 'diag2b'];

// === Line gap helpers ===
const LINE_H_BY_LEN = {};
const LINE_V_BY_LEN = {};
for (const p of PIECE_DEFS) {
  if (p.id.startsWith('line')) {
    const len = p.cells.length;
    const map = p.id.endsWith('h') ? LINE_H_BY_LEN : LINE_V_BY_LEN;
    if (!map[len]) map[len] = [];
    map[len].push(p);
  }
}

// Pieces sorted biggest first for fitability fallback
const PIECES_BY_SIZE_DESC = [...PIECE_DEFS].sort((a, b) => b.cells.length - a.cells.length);

// === Core generation ===
function generateTray(grid) {
  const vibe = pickVibe();
  return [pick(vibe.pool), pick(vibe.pool), pick(vibe.pool)].map(id => ({ ...byId(id) }));
}

// When board has near-complete lines, swap first piece for a gap-filler
function helpWithNearCompleteLines(pieces, grid) {
  const nearComplete = getNearCompleteLines(grid, 5);
  const allLines = [
    ...nearComplete.rows.map(r => ({ ...r, type: 'row' })),
    ...nearComplete.cols.map(c => ({ ...c, type: 'col' })),
  ];
  if (allLines.length === 0) return;

  allLines.sort((a, b) => b.filled - a.filled);
  const target = allLines[0];
  const lookup = target.type === 'row' ? LINE_H_BY_LEN : LINE_V_BY_LEN;

  for (let len = target.gapCount; len >= 1; len--) {
    const candidates = lookup[len];
    if (candidates && candidates.length > 0) {
      pieces[0] = { ...pick(candidates) };
      return;
    }
  }
}

// Make sure every piece can actually be placed
function ensureFitability(pieces, grid) {
  for (let i = 0; i < pieces.length; i++) {
    if (!canPieceFitAnywhere(grid, pieces[i])) {
      for (const candidate of PIECES_BY_SIZE_DESC) {
        if (canPieceFitAnywhere(grid, candidate)) {
          pieces[i] = { ...candidate };
          break;
        }
      }
    }
  }
}

// No 3 identical pieces
function dedupe(pieces) {
  if (pieces.length >= 3 && pieces[0].id === pieces[1].id && pieces[1].id === pieces[2].id) {
    // Pick from a different vibe
    const vibe = pickVibe();
    let attempts = 0;
    let replacement;
    do {
      replacement = byId(pick(vibe.pool));
      attempts++;
    } while (replacement.id === pieces[0].id && attempts < 15);
    pieces[2] = { ...replacement };
  }
}

// === Exports ===
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

  // Generate base tray from a vibe
  let pieces = generateTray(grid);

  // Board-aware adjustments
  const density = getBoardDensity(grid);

  // Help complete near-finished lines (more likely at higher density)
  if (density > 0.4 || Math.random() < 0.3) {
    helpWithNearCompleteLines(pieces, grid);
  }

  // Patch isolated 1x1 gaps
  const isoGaps = countIsolatedGaps(grid);
  if (isoGaps >= 2) {
    pieces[pieces.length - 1] = { ...byId(pick(GAP_FILLERS)) };
  } else if (isoGaps === 1 && Math.random() < 0.5) {
    pieces[pieces.length - 1] = { ...byId(pick(GAP_FILLERS)) };
  }

  // At high density, bias toward smaller pieces that actually fit
  if (density > 0.7) {
    const smallPool = ['dot', 'line2h', 'line2v', 'line3h', 'line3v', 'square', 'corner1', 'corner2', 'corner3', 'corner4', 'diag2a', 'diag2b'];
    for (let i = 0; i < pieces.length; i++) {
      if (pieces[i].cells.length >= 6) {
        pieces[i] = { ...byId(pick(smallPool)) };
      }
    }
  }

  // Trim/pad
  while (pieces.length < count) pieces.push({ ...byId(pick(pickVibe().pool)) });
  if (pieces.length > count) pieces.length = count;

  // Post-selection cleanup
  dedupe(pieces);
  ensureFitability(pieces, grid);

  // UIDs
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
