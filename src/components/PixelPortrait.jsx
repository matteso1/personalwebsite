import React from "react";

/* Pixel-grid portrait rendered as SVG <rect>s on a fixed coordinate system.
   Identical on every monitor regardless of font fallback. Each character of
   the source string maps to one cell:
       '#' filled
       '.' empty
       'o' eye highlight (uses --eye color) */
const ROWS = [
  "...........#####............",
  ".........#########..........",
  "........###########.........",
  ".......#############........",
  "......###############.......",
  "......###############.......",
  "......##.##.....##.##.......",
  "......##.#oo...#oo.##.......",
  "......##..o.....o..##.......",
  "......##....###....##.......",
  "......##....###....##.......",
  "......###..#####..###.......",
  ".......#############........",
  "........###########.........",
  ".........#########..........",
  "...........#####............",
  "............###.............",
  "...........#####............",
  "..........#######...........",
  ".........#########..........",
  "........###########.........",
  "........###########.........",
  ".........#########..........",
];

export default function PixelPortrait({
  fill = "var(--paper-mid)",
  eye = "var(--accent)",
  cell = 8,
  className = "",
  style,
  label = "SUBJECT / N.M",
}) {
  const cols = ROWS[0].length;
  const rows = ROWS.length;
  const padX = 2;
  const padY = 2;
  const w = (cols + padX * 2) * cell;
  const h = (rows + padY * 2) * cell + 14;

  const rects = [];
  for (let r = 0; r < rows; r++) {
    const line = ROWS[r];
    for (let c = 0; c < cols; c++) {
      const ch = line[c];
      if (ch === "." || ch === " ") continue;
      rects.push(
        <rect
          key={`${r}-${c}`}
          x={(c + padX) * cell}
          y={(r + padY) * cell + 14}
          width={cell}
          height={cell}
          fill={ch === "o" ? eye : fill}
          shapeRendering="crispEdges"
        />
      );
    }
  }

  return (
    <svg
      className={className}
      style={{ display: "block", width: "100%", height: "auto", ...style }}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={label}
    >
      <text
        x={padX * cell}
        y={10}
        fill="var(--paper-dim)"
        fontFamily="JetBrains Mono, Menlo, monospace"
        fontSize={9}
        letterSpacing={1.4}
      >
        {`+----- ${label} ${"-".repeat(Math.max(0, cols - label.length - 8))}+`}
      </text>
      {rects}
      <text
        x={padX * cell}
        y={h - 4}
        fill="var(--paper-dim)"
        fontFamily="JetBrains Mono, Menlo, monospace"
        fontSize={9}
      >
        {`+${"-".repeat(cols + 2)}+`}
      </text>
    </svg>
  );
}
