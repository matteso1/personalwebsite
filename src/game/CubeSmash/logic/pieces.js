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

// === Shape families ===
const FAMILIES = {
  rectangles: ['square', 'rect2x3', 'rect3x2', 'square3'],
  lines: ['line2h', 'line2v', 'line3h', 'line3v', 'line4h', 'line4v', 'line5h', 'line5v'],
  linesH: ['line2h', 'line3h', 'line4h', 'line5h'],
  linesV: ['line2v', 'line3v', 'line4v', 'line5v'],
  corners: ['corner1', 'corner2', 'corner3', 'corner4'],
  mediumL: ['L1', 'L2', 'L3', 'L4', 'J1', 'J2', 'J3', 'J4'],
  bigL: ['bigL1', 'bigL2', 'bigL3', 'bigL4'],
  tShapes: ['T1', 'T2', 'T3', 'T4'],
  sShapes: ['S1', 'S2'],
  zShapes: ['Z1', 'Z2'],
  tetrominos: ['T1', 'T2', 'T3', 'T4', 'S1', 'S2', 'Z1', 'Z2', 'L1', 'L2', 'L3', 'L4', 'J1', 'J2', 'J3', 'J4'],
};

// === Synergy Sets: pre-defined combos of 3 that feel intentional ===
const SYNERGY_SETS = [
  // Big square + two rectangles (fills a 3-row band)
  ['square3', 'rect2x3', 'rect2x3'],
  ['square3', 'rect3x2', 'rect3x2'],
  // Horizontal builders
  ['line5h', 'line3h', 'rect2x3'],
  ['line5h', 'line3h', 'square'],
  ['line4h', 'line4h', 'square'],
  ['line4h', 'line3h', 'line3h'],
  // Vertical builders
  ['line5v', 'line3v', 'rect3x2'],
  ['line5v', 'line3v', 'square'],
  ['line4v', 'line4v', 'square'],
  ['line4v', 'line3v', 'line3v'],
  // L-family combos
  ['bigL1', 'corner3', 'line3h'],
  ['bigL2', 'corner4', 'line3h'],
  ['bigL3', 'corner1', 'line3v'],
  ['bigL4', 'corner2', 'line3v'],
  // Matching L/J pairs + line
  ['L1', 'J1', 'line3v'],
  ['L2', 'J4', 'line3h'],
  ['L3', 'J3', 'line2v'],
  ['L4', 'J2', 'line2h'],
  // Three complementary corners
  ['corner1', 'corner3', 'corner2'],
  ['corner2', 'corner4', 'corner1'],
  ['corner1', 'corner4', 'corner3'],
  // Rectangle combos
  ['rect2x3', 'rect2x3', 'rect3x2'],
  ['rect3x2', 'rect3x2', 'rect2x3'],
  ['square', 'square', 'rect2x3'],
  ['square', 'square', 'rect3x2'],
  // Tetromino sets
  ['T1', 'S1', 'line2h'],
  ['T3', 'Z1', 'line2h'],
  ['S1', 'Z1', 'square'],
  ['T2', 'L1', 'line2v'],
  ['T4', 'J1', 'line2v'],
  // Mixed medium shapes
  ['square3', 'line3h', 'line3v'],
  ['rect2x3', 'line4h', 'corner1'],
  ['rect3x2', 'line4v', 'corner3'],
];

// === Shape Family themes for strategy 3 ===
const FAMILY_THEMES = [
  { name: 'rectangles', pool: FAMILIES.rectangles },
  { name: 'lines', pool: FAMILIES.lines },
  { name: 'lFamily', pool: [...FAMILIES.corners, ...FAMILIES.mediumL, ...FAMILIES.bigL] },
  { name: 'tetrominos', pool: FAMILIES.tetrominos },
  { name: 'corners+squares', pool: [...FAMILIES.corners, 'square', 'square3'] },
  { name: 'bigPieces', pool: [...FAMILIES.bigL, 'square3', 'rect2x3', 'rect3x2', 'line5h', 'line5v'] },
];

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

// === Strategy 1: Synergy Sets ===
function strategySynergy() {
  const set = pickRandom(SYNERGY_SETS);
  return set.map(id => ({ ...byId(id) }));
}

// === Strategy 2: Board-Aware Gap Fill ===
function strategyBoardAware(grid) {
  const nearComplete = getNearCompleteLines(grid, 5);
  const allLines = [
    ...nearComplete.rows.map(r => ({ ...r, type: 'row' })),
    ...nearComplete.cols.map(c => ({ ...c, type: 'col' })),
  ];

  if (allLines.length === 0) {
    // Fallback to synergy
    return strategySynergy();
  }

  // Sort by most filled first (closest to completion)
  allLines.sort((a, b) => b.filled - a.filled);
  const target = allLines[0];

  const pieces = [];

  // Pick a piece that matches the gap
  const gapLen = target.gapCount;
  const isRow = target.type === 'row';
  const lineLookup = isRow ? LINE_H_BY_LEN : LINE_V_BY_LEN;

  // Try exact gap length, then smaller
  let gapFiller = null;
  for (let len = gapLen; len >= 1; len--) {
    const candidates = lineLookup[len];
    if (candidates && candidates.length > 0) {
      gapFiller = pickRandom(candidates);
      break;
    }
  }

  // If gap is small (1-2), a single cell or 2-cell piece; if no line found, try square for 2-gap
  if (!gapFiller && gapLen <= 2) {
    gapFiller = byId(isRow ? 'line2h' : 'line2v');
  }

  if (gapFiller) {
    pieces.push({ ...gapFiller });
  } else {
    // Couldn't find a gap filler, just pick a medium piece
    pieces.push({ ...pickRandom(PIECE_DEFS.filter(p => p.cells.length >= 3 && p.cells.length <= 5)) });
  }

  // Fill remaining slots from same orientation family + some rectangular pieces
  const orientedPool = isRow
    ? [...FAMILIES.linesH, 'rect2x3', 'square']
    : [...FAMILIES.linesV, 'rect3x2', 'square'];

  while (pieces.length < 3) {
    pieces.push({ ...byId(pickRandom(orientedPool)) });
  }

  return pieces;
}

// === Strategy 3: Shape Family ===
function strategyShapeFamily() {
  const theme = pickRandom(FAMILY_THEMES);
  const pieces = [];
  for (let i = 0; i < 3; i++) {
    pieces.push({ ...byId(pickRandom(theme.pool)) });
  }
  return pieces;
}

// === Strategy 4: Pure Random ===
function strategyRandom() {
  const pieces = [];
  for (let i = 0; i < 3; i++) {
    pieces.push({ ...pickRandom(PIECE_DEFS) });
  }
  return pieces;
}

// === Post-selection: ensure fitability ===
function ensureFitability(pieces, grid) {
  // Check each piece; swap unplaceable ones for the largest piece that fits
  for (let i = 0; i < pieces.length; i++) {
    if (!canPieceFitAnywhere(grid, pieces[i])) {
      // Find the largest piece that fits
      let replaced = false;
      for (const candidate of PIECES_BY_SIZE_DESC) {
        if (canPieceFitAnywhere(grid, candidate)) {
          pieces[i] = { ...candidate };
          replaced = true;
          break;
        }
      }
      if (!replaced) {
        // Board is truly full, nothing fits -- leave as-is
        break;
      }
    }
  }
  return pieces;
}

// === Post-selection: no triple duplicates ===
function deduplicateTriples(pieces) {
  if (pieces.length < 3) return pieces;

  const ids = pieces.map(p => p.id);
  if (ids[0] === ids[1] && ids[1] === ids[2]) {
    // All three are the same -- replace the third with a random different piece
    let replacement;
    let attempts = 0;
    do {
      replacement = pickRandom(PIECE_DEFS);
      attempts++;
    } while (replacement.id === ids[0] && attempts < 20);
    pieces[2] = { ...replacement };
  }
  return pieces;
}

// === Main export ===
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

  // High density override: always use board-aware strategy
  if (density > 0.65) {
    pieces = strategyBoardAware(grid);
  } else {
    // Roll strategy
    const strategyRoll = Math.random();
    if (strategyRoll < 0.30) {
      pieces = strategySynergy();
    } else if (strategyRoll < 0.60) {
      pieces = strategyBoardAware(grid);
    } else if (strategyRoll < 0.85) {
      pieces = strategyShapeFamily();
    } else {
      pieces = strategyRandom();
    }
  }

  // Trim or pad to requested count (should always be 3, but be safe)
  while (pieces.length < count) {
    pieces.push({ ...pickRandom(PIECE_DEFS) });
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
