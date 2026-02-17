import { createEmptyGrid, canPlace, placePiece, findCompletedLines, clearLines, canAnyPieceFit } from './board.js';
import { getRandomPieces, getSmartPieces } from './pieces.js';
import { calculatePlacementScore, calculateClearScore } from './scoring.js';

export const PHASES = {
  PLAYING: 'PLAYING',
  CLEARING: 'CLEARING',
  GAME_OVER: 'GAME_OVER',
};

export function createInitialState() {
  return {
    grid: createEmptyGrid(),
    pieces: getRandomPieces(3),
    score: 0,
    streak: 0,
    phase: PHASES.PLAYING,
    clearingCells: null, // Set of "r,c" strings to animate
    justPlacedCells: null, // Set of "r,c" strings for placement pulse
    lastScoreDelta: 0, // points earned from last action (for +N popup)
    linesCleared: 0,
  };
}

export const ACTIONS = {
  PLACE_PIECE: 'PLACE_PIECE',
  FINISH_CLEAR: 'FINISH_CLEAR',
  CLEAR_JUST_PLACED: 'CLEAR_JUST_PLACED',
  RESET: 'RESET',
};

export function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.PLACE_PIECE: {
      const { pieceIndex, row, col } = action;
      const piece = state.pieces[pieceIndex];
      if (!piece) return state;
      if (!canPlace(state.grid, piece, row, col)) return state;

      let grid = placePiece(state.grid, piece, row, col);
      const placementScore = calculatePlacementScore(piece.cells.length);
      let score = state.score + placementScore;

      // Track which cells were just placed for pulse animation
      const justPlacedCells = new Set();
      for (const [dr, dc] of piece.cells) {
        justPlacedCells.add(`${row + dr},${col + dc}`);
      }

      // Remove placed piece from tray
      const pieces = [...state.pieces];
      pieces[pieceIndex] = null;

      // Check for completed lines
      const { rows, cols } = findCompletedLines(grid);
      const totalLines = rows.length + cols.length;

      if (totalLines > 0) {
        // Build set of cells to animate
        const clearingCells = new Set();
        for (const r of rows) {
          for (let c = 0; c < 8; c++) clearingCells.add(`${r},${c}`);
        }
        for (const c of cols) {
          for (let r = 0; r < 8; r++) clearingCells.add(`${r},${c}`);
        }

        const { lineScore, newStreak } = calculateClearScore(totalLines, state.streak);

        return {
          ...state,
          grid,
          pieces,
          score: score + lineScore,
          streak: newStreak,
          phase: PHASES.CLEARING,
          clearingCells,
          justPlacedCells,
          lastScoreDelta: placementScore + lineScore,
          linesCleared: state.linesCleared + totalLines,
          _pendingClear: { rows, cols },
        };
      }

      // No lines cleared -- reset streak
      let nextPieces = pieces;
      // If all 3 pieces used, deal new set
      if (pieces.every(p => p === null)) {
        nextPieces = getSmartPieces(3, grid);
      }

      // Check game over
      if (!canAnyPieceFit(grid, nextPieces.filter(Boolean))) {
        return {
          ...state,
          grid,
          pieces: nextPieces,
          score,
          streak: 0,
          phase: PHASES.GAME_OVER,
          clearingCells: null,
          justPlacedCells,
          lastScoreDelta: placementScore,
        };
      }

      return {
        ...state,
        grid,
        pieces: nextPieces,
        score,
        streak: 0,
        phase: PHASES.PLAYING,
        clearingCells: null,
        justPlacedCells,
        lastScoreDelta: placementScore,
      };
    }

    case ACTIONS.FINISH_CLEAR: {
      const { rows, cols } = state._pendingClear || { rows: [], cols: [] };
      let grid = clearLines(state.grid, rows, cols);

      let pieces = state.pieces;
      if (pieces.every(p => p === null)) {
        pieces = getSmartPieces(3, grid);
      }

      if (!canAnyPieceFit(grid, pieces.filter(Boolean))) {
        return {
          ...state,
          grid,
          pieces,
          phase: PHASES.GAME_OVER,
          clearingCells: null,
          _pendingClear: null,
        };
      }

      return {
        ...state,
        grid,
        pieces,
        phase: PHASES.PLAYING,
        clearingCells: null,
        _pendingClear: null,
      };
    }

    case ACTIONS.CLEAR_JUST_PLACED:
      return { ...state, justPlacedCells: null, lastScoreDelta: 0 };

    case ACTIONS.RESET:
      return createInitialState();

    default:
      return state;
  }
}
