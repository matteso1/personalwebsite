import React from 'react';
import PiecePreview from './PiecePreview.jsx';

export default function PieceTray({ pieces, onPointerDown, draggingIndex }) {
  return (
    <div className="bb-tray">
      {pieces.map((piece, i) => (
        <PiecePreview
          key={piece ? piece.uid : `empty-${i}`}
          piece={piece}
          pieceIndex={i}
          onPointerDown={onPointerDown}
          isDragging={draggingIndex === i}
          enterDelay={i * 100}
        />
      ))}
    </div>
  );
}
