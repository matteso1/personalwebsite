import { GRID_SIZE } from './constants.js';

export function createEmptyGrid() {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null)
  );
}

export function canPlace(grid, piece, row, col) {
  for (const [dr, dc] of piece.cells) {
    const r = row + dr;
    const c = col + dc;
    if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;
    if (grid[r][c] !== null) return false;
  }
  return true;
}

export function placePiece(grid, piece, row, col) {
  const next = grid.map(r => [...r]);
  for (const [dr, dc] of piece.cells) {
    next[row + dr][col + dc] = piece.color;
  }
  return next;
}

export function findCompletedLines(grid) {
  const rows = [];
  const cols = [];

  for (let r = 0; r < GRID_SIZE; r++) {
    if (grid[r].every(cell => cell !== null)) {
      rows.push(r);
    }
  }

  for (let c = 0; c < GRID_SIZE; c++) {
    let full = true;
    for (let r = 0; r < GRID_SIZE; r++) {
      if (grid[r][c] === null) { full = false; break; }
    }
    if (full) cols.push(c);
  }

  return { rows, cols };
}

export function getCellsToRemove(rows, cols) {
  const cells = new Set();
  for (const r of rows) {
    for (let c = 0; c < GRID_SIZE; c++) {
      cells.add(`${r},${c}`);
    }
  }
  for (const c of cols) {
    for (let r = 0; r < GRID_SIZE; r++) {
      cells.add(`${r},${c}`);
    }
  }
  return cells;
}

export function clearLines(grid, rows, cols) {
  const next = grid.map(r => [...r]);
  const cells = getCellsToRemove(rows, cols);
  for (const key of cells) {
    const [r, c] = key.split(',').map(Number);
    next[r][c] = null;
  }
  return next;
}

export function canPieceFitAnywhere(grid, piece) {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (canPlace(grid, piece, r, c)) return true;
    }
  }
  return false;
}

export function canAnyPieceFit(grid, pieces) {
  return pieces.some(p => p && canPieceFitAnywhere(grid, p));
}

export function getBoardDensity(grid) {
  let filled = 0;
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] !== null) filled++;
    }
  }
  return filled / (GRID_SIZE * GRID_SIZE);
}

export function getNearCompleteLines(grid, threshold = 6) {
  const result = { rows: [], cols: [] };

  for (let r = 0; r < GRID_SIZE; r++) {
    let filled = 0;
    const gaps = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] !== null) filled++;
      else gaps.push(c);
    }
    if (filled >= threshold && filled < GRID_SIZE) {
      result.rows.push({ index: r, filled, gapCount: GRID_SIZE - filled, gaps });
    }
  }

  for (let c = 0; c < GRID_SIZE; c++) {
    let filled = 0;
    const gaps = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      if (grid[r][c] !== null) filled++;
      else gaps.push(r);
    }
    if (filled >= threshold && filled < GRID_SIZE) {
      result.cols.push({ index: c, filled, gapCount: GRID_SIZE - filled, gaps });
    }
  }

  return result;
}
