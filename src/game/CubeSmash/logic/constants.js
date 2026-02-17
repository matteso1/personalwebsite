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
  dot: '#34d399',  // emerald
  line3: '#fbbf24', // yellow
  corner: '#fb923c', // orange
  bigL: '#c084fc',  // violet
  tee: '#22d3ee',   // cyan bright
};

// Piece definitions: each is an array of [row, col] offsets from origin
export const PIECE_DEFS = [
  // Single dot
  { id: 'dot', cells: [[0, 0]], color: PIECE_COLORS.dot },

  // 2-cell line
  { id: 'line2h', cells: [[0, 0], [0, 1]], color: PIECE_COLORS.I },
  { id: 'line2v', cells: [[0, 0], [1, 0]], color: PIECE_COLORS.I },

  // 3-cell line
  { id: 'line3h', cells: [[0, 0], [0, 1], [0, 2]], color: PIECE_COLORS.line3 },
  { id: 'line3v', cells: [[0, 0], [1, 0], [2, 0]], color: PIECE_COLORS.line3 },

  // 4-cell line
  { id: 'line4h', cells: [[0, 0], [0, 1], [0, 2], [0, 3]], color: PIECE_COLORS.I },
  { id: 'line4v', cells: [[0, 0], [1, 0], [2, 0], [3, 0]], color: PIECE_COLORS.I },

  // 5-cell line
  { id: 'line5h', cells: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], color: PIECE_COLORS.I },
  { id: 'line5v', cells: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], color: PIECE_COLORS.I },

  // 2x2 square
  { id: 'square', cells: [[0, 0], [0, 1], [1, 0], [1, 1]], color: PIECE_COLORS.O },

  // 3x3 square
  { id: 'square3', cells: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]], color: PIECE_COLORS.O },

  // L shapes (4 rotations)
  { id: 'L1', cells: [[0, 0], [1, 0], [2, 0], [2, 1]], color: PIECE_COLORS.L },
  { id: 'L2', cells: [[0, 0], [0, 1], [0, 2], [1, 0]], color: PIECE_COLORS.L },
  { id: 'L3', cells: [[0, 0], [0, 1], [1, 1], [2, 1]], color: PIECE_COLORS.L },
  { id: 'L4', cells: [[0, 2], [1, 0], [1, 1], [1, 2]], color: PIECE_COLORS.L },

  // J shapes (4 rotations)
  { id: 'J1', cells: [[0, 1], [1, 1], [2, 0], [2, 1]], color: PIECE_COLORS.J },
  { id: 'J2', cells: [[0, 0], [1, 0], [1, 1], [1, 2]], color: PIECE_COLORS.J },
  { id: 'J3', cells: [[0, 0], [0, 1], [1, 0], [2, 0]], color: PIECE_COLORS.J },
  { id: 'J4', cells: [[0, 0], [0, 1], [0, 2], [1, 2]], color: PIECE_COLORS.J },

  // T shapes (4 rotations)
  { id: 'T1', cells: [[0, 0], [0, 1], [0, 2], [1, 1]], color: PIECE_COLORS.T },
  { id: 'T2', cells: [[0, 0], [1, 0], [1, 1], [2, 0]], color: PIECE_COLORS.T },
  { id: 'T3', cells: [[0, 1], [1, 0], [1, 1], [1, 2]], color: PIECE_COLORS.T },
  { id: 'T4', cells: [[0, 1], [1, 0], [1, 1], [2, 1]], color: PIECE_COLORS.T },

  // S shapes
  { id: 'S1', cells: [[0, 1], [0, 2], [1, 0], [1, 1]], color: PIECE_COLORS.S },
  { id: 'S2', cells: [[0, 0], [1, 0], [1, 1], [2, 1]], color: PIECE_COLORS.S },

  // Z shapes
  { id: 'Z1', cells: [[0, 0], [0, 1], [1, 1], [1, 2]], color: PIECE_COLORS.Z },
  { id: 'Z2', cells: [[0, 1], [1, 0], [1, 1], [2, 0]], color: PIECE_COLORS.Z },

  // Corner (3 cells)
  { id: 'corner1', cells: [[0, 0], [0, 1], [1, 0]], color: PIECE_COLORS.corner },
  { id: 'corner2', cells: [[0, 0], [0, 1], [1, 1]], color: PIECE_COLORS.corner },
  { id: 'corner3', cells: [[0, 0], [1, 0], [1, 1]], color: PIECE_COLORS.corner },
  { id: 'corner4', cells: [[0, 1], [1, 0], [1, 1]], color: PIECE_COLORS.corner },
];
