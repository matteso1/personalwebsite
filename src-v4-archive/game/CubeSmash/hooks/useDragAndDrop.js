import { useState, useCallback, useRef } from 'react';
import { canPlace } from '../logic/board.js';

export function useDragAndDrop(grid, pieces, placePiece, phase) {
  const [dragging, setDragging] = useState(null); // { pieceIndex, piece }
  const [ghostCell, setGhostCell] = useState(null); // { row, col, valid }
  const gridRef = useRef(null);
  const cellSizeRef = useRef(0);
  const floatRef = useRef(null);
  const dragPosRef = useRef({ x: 0, y: 0 });

  // Given cursor position, figure out which grid cell the piece origin (0,0)
  // maps to, assuming the cursor is over the center of the piece's bounding box.
  const getGridCell = useCallback((clientX, clientY, piece) => {
    const gridEl = gridRef.current;
    if (!gridEl) return null;

    const rect = gridEl.getBoundingClientRect();
    const cellW = rect.width / 8;
    const cellH = rect.height / 8;
    cellSizeRef.current = cellW;

    // Piece bounding box
    let maxR = 0, maxC = 0;
    for (const [r, c] of piece.cells) {
      if (r > maxR) maxR = r;
      if (c > maxC) maxC = c;
    }

    // The cursor is at the center of the floating piece visual.
    // The floating piece visual spans (maxC+1) cells wide, (maxR+1) cells tall.
    // So the top-left of the piece (origin 0,0) in grid coords is:
    //   cursor maps to grid position, then subtract half the piece size
    const gridX = (clientX - rect.left) / cellW;
    const gridY = (clientY - rect.top) / cellH;

    const col = Math.round(gridX - (maxC + 1) / 2);
    const row = Math.round(gridY - (maxR + 1) / 2);

    if (row < -maxR || row >= 8 || col < -maxC || col >= 8) return null;

    return { row, col };
  }, []);

  // Update floating piece DOM directly (no re-render)
  const updateFloatPos = useCallback((x, y) => {
    const el = floatRef.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    el.style.left = `${x - w / 2}px`;
    el.style.top = `${y - h / 2}px`;
  }, []);

  const onPointerDown = useCallback((e, pieceIndex) => {
    if (phase !== 'PLAYING') return;
    const piece = pieces[pieceIndex];
    if (!piece) return;

    e.preventDefault();
    e.target.setPointerCapture?.(e.pointerId);

    dragPosRef.current = { x: e.clientX, y: e.clientY };
    setDragging({ pieceIndex, piece });
    setGhostCell(null);
  }, [pieces, phase]);

  const onPointerMove = useCallback((e) => {
    if (!dragging) return;

    dragPosRef.current = { x: e.clientX, y: e.clientY };
    updateFloatPos(e.clientX, e.clientY);

    const cell = getGridCell(e.clientX, e.clientY, dragging.piece);
    if (cell) {
      const valid = canPlace(grid, dragging.piece, cell.row, cell.col);
      setGhostCell(prev => {
        if (prev && prev.row === cell.row && prev.col === cell.col && prev.valid === valid) return prev;
        return { ...cell, valid };
      });
    } else {
      setGhostCell(prev => prev === null ? prev : null);
    }
  }, [dragging, grid, getGridCell, updateFloatPos]);

  const onPointerUp = useCallback(() => {
    if (!dragging) return;

    if (ghostCell && ghostCell.valid) {
      placePiece(dragging.pieceIndex, ghostCell.row, ghostCell.col);
    }

    setDragging(null);
    dragPosRef.current = { x: 0, y: 0 };
    setGhostCell(null);
  }, [dragging, ghostCell, placePiece]);

  return {
    dragging,
    dragPosRef,
    ghostCell,
    gridRef,
    floatRef,
    cellSize: cellSizeRef.current,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
}
