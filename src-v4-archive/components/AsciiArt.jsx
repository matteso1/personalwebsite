import React, { useEffect, useRef, useState } from "react";

/**
 * Renders a pre-formatted ASCII art block with an optional typewriter reveal.
 *
 * Props:
 *   art       — multi-line string
 *   color     — text color (var(--acid) default)
 *   size      — font-size px (11 default)
 *   typewriter — bool; if true, character-by-character reveal on mount
 *   speed     — chars per frame during typewriter (4 default)
 *   className / style — passthrough
 */
export default function AsciiArt({
  art = "",
  color = "var(--acid)",
  size = 11,
  typewriter = false,
  speed = 4,
  className = "",
  style,
}) {
  const [revealed, setRevealed] = useState(typewriter ? "" : art);
  const frame = useRef(0);

  useEffect(() => {
    if (!typewriter) { setRevealed(art); return; }
    let i = 0;
    let raf;
    const tick = () => {
      frame.current += 1;
      if (frame.current % 1 === 0) {
        i = Math.min(art.length, i + speed);
        setRevealed(art.slice(0, i));
      }
      if (i < art.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [art, typewriter, speed]);

  return (
    <pre
      className={`ascii-art ${className}`}
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: size,
        lineHeight: 1.15,
        color,
        whiteSpace: "pre",
        margin: 0,
        userSelect: "none",
        ...style,
      }}
      aria-hidden="true"
    >
      {revealed}
    </pre>
  );
}
