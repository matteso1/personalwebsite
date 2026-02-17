import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useGameState } from './hooks/useGameState.js';
import { useDragAndDrop } from './hooks/useDragAndDrop.js';
import { useHighScores } from './hooks/useHighScores.js';
import { useAuth } from './hooks/useAuth.js';
import { PHASES } from './logic/gameEngine.js';
import { getPieceBounds } from './logic/pieces.js';
import Grid from './components/Grid.jsx';
import PieceTray from './components/PieceTray.jsx';
import ScoreDisplay from './components/ScoreDisplay.jsx';
import GameOverModal from './components/GameOverModal.jsx';
import HighScoreBoard from './components/HighScoreBoard.jsx';
import AuthPanel from './components/AuthPanel.jsx';
import './styles/blockBlast.css';

export default function BlockBlast() {
  const { state, placePiece, reset } = useGameState();
  const { user, isLoggedIn, displayName, authLoading, login, register, logout } = useAuth();
  const { scores, loading, personalBest, submitScore, refetch } = useHighScores(user?.id, displayName);
  const {
    dragging,
    dragPosRef,
    ghostCell,
    gridRef,
    floatRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  } = useDragAndDrop(state.grid, state.pieces, placePiece, state.phase);

  // Floating "+N" popups
  const [scorePopups, setScorePopups] = useState([]);
  const popupIdRef = useRef(0);

  useEffect(() => {
    if (state.lastScoreDelta > 0) {
      const id = ++popupIdRef.current;
      setScorePopups(prev => [...prev, { id, value: state.lastScoreDelta }]);
      const timer = setTimeout(() => {
        setScorePopups(prev => prev.filter(p => p.id !== id));
      }, 850);
      return () => clearTimeout(timer);
    }
  }, [state.lastScoreDelta, state.score]);

  const handleReset = () => {
    reset();
    refetch();
  };

  return (
    <div
      className="relative select-none"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Auth */}
      <AuthPanel
        isLoggedIn={isLoggedIn}
        displayName={displayName}
        authLoading={authLoading}
        onLogin={login}
        onRegister={register}
        onLogout={logout}
      />

      {/* Score */}
      <div className="mb-4">
        <ScoreDisplay score={state.score} streak={state.streak} linesCleared={state.linesCleared} />
      </div>

      {/* Grid */}
      <div className="flex justify-center relative">
        <Grid
          grid={state.grid}
          ghostCell={ghostCell}
          dragging={dragging}
          clearingCells={state.clearingCells}
          justPlacedCells={state.justPlacedCells}
          gridRef={gridRef}
        />
        {/* Score popups over grid */}
        {scorePopups.map(p => (
          <div key={p.id} className="bb-score-popup" style={{ left: '50%', top: '40%' }}>
            +{p.value}
          </div>
        ))}
      </div>

      {/* Piece Tray */}
      <PieceTray
        pieces={state.pieces}
        onPointerDown={onPointerDown}
        draggingIndex={dragging ? dragging.pieceIndex : -1}
      />

      {/* Leaderboard */}
      <div className="mt-6">
        <div className="section-label mb-3">HIGH_SCORES</div>
        <HighScoreBoard scores={scores} loading={loading} />
      </div>

      {/* Floating drag piece */}
      {dragging && (
        <FloatingPiece
          piece={dragging.piece}
          dragPosRef={dragPosRef}
          floatRef={floatRef}
          gridRef={gridRef}
        />
      )}

      {/* Game Over */}
      {state.phase === PHASES.GAME_OVER && (
        <GameOverModal
          score={state.score}
          onReset={handleReset}
          isLoggedIn={isLoggedIn}
          personalBest={personalBest}
          onSubmitScore={submitScore}
        />
      )}
    </div>
  );
}

function FloatingPiece({ piece, dragPosRef, floatRef, gridRef }) {
  const { rows, cols } = getPieceBounds(piece);
  const cellSet = new Set(piece.cells.map(([r, c]) => `${r},${c}`));

  // Match cell size to actual grid cell size
  let cellSize = 40;
  if (gridRef.current) {
    cellSize = gridRef.current.getBoundingClientRect().width / 8 * 0.75;
  }

  // Set initial position via layout effect (before paint)
  useLayoutEffect(() => {
    const el = floatRef.current;
    if (!el) return;
    const pos = dragPosRef.current;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    el.style.left = `${pos.x - w / 2}px`;
    el.style.top = `${pos.y - h / 2}px`;
  });

  return (
    <div
      ref={floatRef}
      className="bb-drag-float bb-drag-float--lifted"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        '--cell-size': `${cellSize}px`,
      }}
    >
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const filled = cellSet.has(`${r},${c}`);
          return (
            <div
              key={`${r}-${c}`}
              className="bb-drag-cell"
              style={{
                backgroundColor: filled ? piece.color : 'transparent',
                boxShadow: filled ? `0 0 6px ${piece.color}` : 'none',
              }}
            />
          );
        })
      )}
    </div>
  );
}
