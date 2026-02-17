export const GRID_SIZE = 8;

// Terminal palette colors for pieces
export const PIECE_COLORS = {
  I: '#00ff9f',   // terminal green
  L: '#00d4ff',   // terminal cyan
  J: '#ffb800',   // terminal amber
  T: '#ff4757',   // terminal red
  S: '#a855f7',   // purple
  Z: '#f472b6',   // pink
  O: '#38bdf8',   // sky
  line3: '#fbbf24', // yellow
  corner: '#fb923c', // orange
  bigL: '#c084fc',  // violet
  rect: '#34d399',  // emerald
};

// Piece definitions: each is an array of [row, col] offsets from origin
export const PIECE_DEFS = [
  // 2-cell lines
  { id: 'line2h', cells: [[0, 0], [0, 1]], color: PIECE_COLORS.I },
  { id: 'line2v', cells: [[0, 0], [1, 0]], color: PIECE_COLORS.I },

  // 3-cell lines
  { id: 'line3h', cells: [[0, 0], [0, 1], [0, 2]], color: PIECE_COLORS.line3 },
  { id: 'line3v', cells: [[0, 0], [1, 0], [2, 0]], color: PIECE_COLORS.line3 },

  // 4-cell lines
  { id: 'line4h', cells: [[0, 0], [0, 1], [0, 2], [0, 3]], color: PIECE_COLORS.I },
  { id: 'line4v', cells: [[0, 0], [1, 0], [2, 0], [3, 0]], color: PIECE_COLORS.I },

  // 5-cell lines
  { id: 'line5h', cells: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], color: PIECE_COLORS.I },
  { id: 'line5v', cells: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], color: PIECE_COLORS.I },

  // 2x2 square
  { id: 'square', cells: [[0, 0], [0, 1], [1, 0], [1, 1]], color: PIECE_COLORS.O },

  // 2x3 and 3x2 rectangles
  { id: 'rect2x3', cells: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2]], color: PIECE_COLORS.rect },
  { id: 'rect3x2', cells: [[0,0],[0,1],[1,0],[1,1],[2,0],[2,1]], color: PIECE_COLORS.rect },

  // 3x3 square
  { id: 'square3', cells: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]], color: PIECE_COLORS.O },

  // Small L / Corner shapes (3 cells, 2x2 bounding box, 4 rotations)
  { id: 'corner1', cells: [[0, 0], [0, 1], [1, 0]], color: PIECE_COLORS.corner },
  { id: 'corner2', cells: [[0, 0], [0, 1], [1, 1]], color: PIECE_COLORS.corner },
  { id: 'corner3', cells: [[0, 0], [1, 0], [1, 1]], color: PIECE_COLORS.corner },
  { id: 'corner4', cells: [[0, 1], [1, 0], [1, 1]], color: PIECE_COLORS.corner },

  // Medium L shapes (4 cells, 2x3 bounding box, 4 rotations)
  { id: 'L1', cells: [[0, 0], [1, 0], [2, 0], [2, 1]], color: PIECE_COLORS.L },
  { id: 'L2', cells: [[0, 0], [0, 1], [0, 2], [1, 0]], color: PIECE_COLORS.L },
  { id: 'L3', cells: [[0, 0], [0, 1], [1, 1], [2, 1]], color: PIECE_COLORS.L },
  { id: 'L4', cells: [[0, 2], [1, 0], [1, 1], [1, 2]], color: PIECE_COLORS.L },

  // Medium J shapes (4 cells, 2x3 bounding box, 4 rotations)
  { id: 'J1', cells: [[0, 1], [1, 1], [2, 0], [2, 1]], color: PIECE_COLORS.J },
  { id: 'J2', cells: [[0, 0], [1, 0], [1, 1], [1, 2]], color: PIECE_COLORS.J },
  { id: 'J3', cells: [[0, 0], [0, 1], [1, 0], [2, 0]], color: PIECE_COLORS.J },
  { id: 'J4', cells: [[0, 0], [0, 1], [0, 2], [1, 2]], color: PIECE_COLORS.J },

  // Large L shapes (5 cells, 3x3 bounding box, 4 rotations)
  { id: 'bigL1', cells: [[0, 0], [0, 1], [0, 2], [1, 0], [2, 0]], color: PIECE_COLORS.bigL },
  { id: 'bigL2', cells: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]], color: PIECE_COLORS.bigL },
  { id: 'bigL3', cells: [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]], color: PIECE_COLORS.bigL },
  { id: 'bigL4', cells: [[0, 2], [1, 2], [2, 0], [2, 1], [2, 2]], color: PIECE_COLORS.bigL },

  // T shapes (4 cells, 4 rotations)
  { id: 'T1', cells: [[0, 0], [0, 1], [0, 2], [1, 1]], color: PIECE_COLORS.T },
  { id: 'T2', cells: [[0, 0], [1, 0], [1, 1], [2, 0]], color: PIECE_COLORS.T },
  { id: 'T3', cells: [[0, 1], [1, 0], [1, 1], [1, 2]], color: PIECE_COLORS.T },
  { id: 'T4', cells: [[0, 1], [1, 0], [1, 1], [2, 1]], color: PIECE_COLORS.T },

  // S shapes (4 cells, 2 rotations)
  { id: 'S1', cells: [[0, 1], [0, 2], [1, 0], [1, 1]], color: PIECE_COLORS.S },
  { id: 'S2', cells: [[0, 0], [1, 0], [1, 1], [2, 1]], color: PIECE_COLORS.S },

  // Z shapes (4 cells, 2 rotations)
  { id: 'Z1', cells: [[0, 0], [0, 1], [1, 1], [1, 2]], color: PIECE_COLORS.Z },
  { id: 'Z2', cells: [[0, 1], [1, 0], [1, 1], [2, 0]], color: PIECE_COLORS.Z },
];
