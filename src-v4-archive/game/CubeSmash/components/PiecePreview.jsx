import React from 'react';
import { getPieceBounds } from '../logic/pieces.js';

export default function PiecePreview({ piece, pieceIndex, onPointerDown, isDragging, enterDelay = 0 }) {
  if (!piece) {
    return <div className="bb-piece-preview bb-piece-preview--empty" />;
  }

  const { rows, cols } = getPieceBounds(piece);
  const cellSet = new Set(piece.cells.map(([r, c]) => `${r},${c}`));

  return (
    <div
      className={`bb-piece-preview bb-piece-preview--enter ${isDragging ? 'opacity-30' : ''}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, 16px)`,
        gridTemplateRows: `repeat(${rows}, 16px)`,
        animationDelay: `${enterDelay}ms`,
      }}
      onPointerDown={(e) => onPointerDown(e, pieceIndex)}
    >
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const filled = cellSet.has(`${r},${c}`);
          return (
            <div
              key={`${r}-${c}`}
              className="bb-piece-cell"
              style={{
                backgroundColor: filled ? piece.color : 'transparent',
                boxShadow: filled ? `0 0 4px ${piece.color}` : 'none',
              }}
            />
          );
        })
      )}
    </div>
  );
}
