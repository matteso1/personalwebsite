import { PIECE_DEFS } from './constants.js';
import { getBoardDensity, getNearCompleteLines, canPieceFitAnywhere } from './board.js';

// Categorize pieces by cell count
const SMALL_PIECES = PIECE_DEFS.filter(p => p.cells.length <= 2);
const MEDIUM_PIECES = PIECE_DEFS.filter(p => p.cells.length >= 3 && p.cells.length <= 4);
const LARGE_PIECES = PIECE_DEFS.filter(p => p.cells.length >= 5);

// Line pieces that can fill horizontal/vertical gaps
const LINE_PIECES_BY_LENGTH = {};
for (const p of PIECE_DEFS) {
  if (p.id.startsWith('line')) {
    const len = p.cells.length;
    if (!LINE_PIECES_BY_LENGTH[len]) LINE_PIECES_BY_LENGTH[len] = [];
    LINE_PIECES_BY_LENGTH[len].push(p);
  }
}

function pickFromCategory(category) {
  return category[Math.floor(Math.random() * category.length)];
}

function pickWeighted(smallWeight, mediumWeight, largeWeight) {
  const roll = Math.random();
  if (roll < smallWeight) return pickFromCategory(SMALL_PIECES);
  if (roll < smallWeight + mediumWeight) return pickFromCategory(MEDIUM_PIECES);
  return pickFromCategory(LARGE_PIECES);
}

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
  const nearComplete = getNearCompleteLines(grid, 6);

  // Determine weights based on density
  let smallW, medW, largeW;
  if (density < 0.3) {
    smallW = 0.33; medW = 0.34; largeW = 0.33;
  } else if (density <= 0.6) {
    smallW = 0.25; medW = 0.50; largeW = 0.25;
  } else {
    smallW = 0.45; medW = 0.40; largeW = 0.15;
  }

  const pieces = [];
  for (let i = 0; i < count; i++) {
    const picked = pickWeighted(smallW, medW, largeW);
    pieces.push({ ...picked, uid: `${Date.now()}-${i}-${Math.random()}` });
  }

  // Near-complete line bonus: 1 in 3 chance to replace one piece with a gap-filler
  const allNearLines = [...nearComplete.rows, ...nearComplete.cols];
  if (allNearLines.length > 0 && Math.random() < 0.33) {
    const line = allNearLines[Math.floor(Math.random() * allNearLines.length)];
    const gapLen = line.gapCount;
    const candidates = LINE_PIECES_BY_LENGTH[gapLen];
    if (candidates && candidates.length > 0) {
      const replaceIdx = Math.floor(Math.random() * count);
      const picked = candidates[Math.floor(Math.random() * candidates.length)];
      pieces[replaceIdx] = { ...picked, uid: `${Date.now()}-bonus-${Math.random()}` };
    }
  }

  // Fitability check: ensure at least 1 piece can fit
  const anyFits = pieces.some(p => canPieceFitAnywhere(grid, p));
  if (!anyFits) {
    // Re-roll the largest piece with progressively smaller ones
    let largestIdx = 0;
    let largestSize = 0;
    for (let i = 0; i < pieces.length; i++) {
      if (pieces[i].cells.length > largestSize) {
        largestSize = pieces[i].cells.length;
        largestIdx = i;
      }
    }
    // Try small pieces first, then medium
    for (const category of [SMALL_PIECES, MEDIUM_PIECES]) {
      for (let attempt = 0; attempt < 10; attempt++) {
        const candidate = pickFromCategory(category);
        if (canPieceFitAnywhere(grid, candidate)) {
          pieces[largestIdx] = { ...candidate, uid: `${Date.now()}-reroll-${Math.random()}` };
          return pieces;
        }
      }
    }
    // If still nothing fits, the board is truly full -- return as-is
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
