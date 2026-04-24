import React, { useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════
   AsciiField — the live ambient background.

   A flowing 2-D noise field rendered as ASCII dither characters.
   Cursor-reactive (mouse position biases the field), with slow
   time-varying sin waves driving the density. Each cell picks a
   character from the ramp based on its density value.

   Performance: ~20 fps, ~5 kB per frame. A single <pre>, one
   setAttribute per frame. No canvas, no SVG, no re-renders.
   ═══════════════════════════════════════════════════════════════════ */

const DENSITY_RAMP = " ·.•∘○◍●◉◼■█";
const GLITCH_SET   = "▒▓░█│┃╵┊";

export default function AsciiField({
  fontSize = 15,
  lineHeight = 1.0,
  cols: colsProp,
  rows: rowsProp,
  opacity = 0.32,
  color = "var(--paper)",
  accent = "var(--paper)",
} = {}) {
  const preRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;

    const computeGrid = () => {
      const charW = fontSize * 0.6;
      const charH = fontSize * lineHeight;
      const cols = colsProp ?? Math.ceil(window.innerWidth / charW) + 2;
      const rows = rowsProp ?? Math.ceil(window.innerHeight / charH) + 2;
      return { cols, rows };
    };

    let { cols, rows } = computeGrid();
    let t = 0;
    let rafId;
    let last = 0;
    const FRAME_MS = 85; // ~12 fps — easy on the CPU, still reads as live
    let paused = document.hidden;

    const onResize = () => { ({ cols, rows } = computeGrid()); };
    window.addEventListener("resize", onResize);

    const onVis = () => { paused = document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    let mouseFrame = 0;
    const onMouse = (e) => {
      if (++mouseFrame % 2) return; // throttle to every 2nd event
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const tick = (now) => {
      rafId = requestAnimationFrame(tick);
      if (paused) return;
      if (now - last < FRAME_MS) return;
      last = now;
      t += 0.025;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const rampLen = DENSITY_RAMP.length;
      const rampMax = rampLen - 1;

      let buf = "";
      const glitchRowA = Math.floor(rows * (0.5 + 0.48 * Math.sin(t * 0.3)));
      const glitchRowB = Math.floor(rows * (0.5 + 0.48 * Math.cos(t * 0.17 + 1.2)));

      for (let y = 0; y < rows; y++) {
        const rowIsGlitch = y === glitchRowA || y === glitchRowB;
        const yN = y / rows;

        for (let x = 0; x < cols; x++) {
          const xN = x / cols;

          // Primary flow — layered sine interference
          const n =
            Math.sin(x * 0.11 + t * 1.1) * 0.5 +
            Math.cos(y * 0.17 - t * 0.7) * 0.35 +
            Math.sin((x + y) * 0.07 + t * 1.7) * 0.25 +
            Math.cos((x - y) * 0.043 + t * 0.5) * 0.2;

          // Cursor bulge — radial falloff around the mouse
          const dx = xN - mx;
          const dy = (yN - my) * 1.6; // compensate for tall cells
          const d2 = dx * dx + dy * dy;
          const bulge = Math.exp(-d2 * 14) * 0.9;

          // Vignette — softer at edges
          const ex = 1 - Math.abs(xN - 0.5) * 1.6;
          const ey = 1 - Math.abs(yN - 0.5) * 1.6;
          const edge = Math.max(0, ex) * Math.max(0, ey);

          let v = (n + 1) * 0.5 + bulge;
          v *= 0.4 + 0.6 * edge;

          if (rowIsGlitch && Math.random() < 0.18) {
            buf += GLITCH_SET[Math.floor(Math.random() * GLITCH_SET.length)];
          } else {
            const idx = Math.max(0, Math.min(rampMax, Math.floor(v * rampLen)));
            buf += DENSITY_RAMP[idx];
          }
        }
        buf += "\n";
      }

      pre.textContent = buf;
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [fontSize, lineHeight, colsProp, rowsProp]);

  return (
    <>
      <pre
        ref={preRef}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          margin: 0,
          padding: 0,
          fontFamily: "'JetBrains Mono', 'Menlo', monospace",
          fontSize,
          lineHeight,
          letterSpacing: 0,
          color,
          opacity,
          pointerEvents: "none",
          userSelect: "none",
          whiteSpace: "pre",
          overflow: "hidden",
          zIndex: 1,
          fontFeatureSettings: '"liga" 0, "calt" 0',
        }}
      />
      {/* second pass — soft grayscale vignette, no color tint */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse 70% 60% at 50% 30%, rgba(255,255,255,0.04), transparent 70%)`,
          zIndex: 0,
        }}
      />
    </>
  );
}
