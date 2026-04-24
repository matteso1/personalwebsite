import { useReducer, useCallback, useEffect, useRef } from 'react';
import { gameReducer, createInitialState, ACTIONS, PHASES } from '../logic/gameEngine.js';

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);
  const clearTimerRef = useRef(null);
  const justPlacedTimerRef = useRef(null);

  // Auto-advance from CLEARING phase after animation (600ms anim + 50ms buffer)
  useEffect(() => {
    if (state.phase === PHASES.CLEARING) {
      clearTimerRef.current = setTimeout(() => {
        dispatch({ type: ACTIONS.FINISH_CLEAR });
      }, 650);
      return () => clearTimeout(clearTimerRef.current);
    }
  }, [state.phase]);

  // Clear justPlacedCells after pulse animation finishes
  useEffect(() => {
    if (state.justPlacedCells) {
      justPlacedTimerRef.current = setTimeout(() => {
        dispatch({ type: ACTIONS.CLEAR_JUST_PLACED });
      }, 300);
      return () => clearTimeout(justPlacedTimerRef.current);
    }
  }, [state.justPlacedCells]);

  const placePiece = useCallback((pieceIndex, row, col) => {
    dispatch({ type: ACTIONS.PLACE_PIECE, pieceIndex, row, col });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: ACTIONS.RESET });
  }, []);

  return { state, placePiece, reset };
}
