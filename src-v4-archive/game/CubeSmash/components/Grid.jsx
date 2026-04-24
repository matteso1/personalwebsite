import React from 'react';

export default function Grid({ grid, ghostCell, dragging, clearingCells, justPlacedCells, gridRef }) {
  // Build ghost cell set for fast lookup
  const ghostSet = new Set();
  let ghostValid = false;
  if (ghostCell && dragging) {
    ghostValid = ghostCell.valid;
    for (const [dr, dc] of dragging.piece.cells) {
      ghostSet.add(`${ghostCell.row + dr},${ghostCell.col + dc}`);
    }
  }

  const clearSet = clearingCells || new Set();
  const placedSet = justPlacedCells || new Set();

  return (
    <div className="bb-grid" ref={gridRef}>
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const key = `${r},${c}`;
          const isGhost = ghostSet.has(key);
          const isClearing = clearSet.has(key);
          const isJustPlaced = placedSet.has(key);
          const color = cell;
          const isAlt = (r + c) % 2 === 1;

          let className = 'bb-cell';
          let style = {};

          // Checkerboard on empty cells
          if (!color && isAlt) {
            className += ' bb-cell--alt';
          }

          if (isClearing && color) {
            className += ' bb-cell--filled bb-cell--clearing';
            // Stagger: diagonal sweep based on row + col
            const delay = (r + c) * 30;
            style = {
              backgroundColor: color,
              '--cell-color': color,
              animationDelay: `${delay}ms`,
            };
          } else if (color) {
            className += ' bb-cell--filled';
            style = { backgroundColor: color, '--cell-color': color };
            if (isJustPlaced) {
              className += ' bb-cell--just-placed';
            }
          }

          if (isGhost && !color) {
            className += ghostValid ? ' bb-cell--ghost-valid' : ' bb-cell--ghost-invalid';
            style = {
              backgroundColor: ghostValid ? dragging.piece.color : '#ff4757',
            };
          }

          return <div key={key} className={className} style={style} />;
        })
      )}
    </div>
  );
}
