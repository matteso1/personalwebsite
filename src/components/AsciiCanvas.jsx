import React, { useEffect, useRef, useState } from "react";

/**
 * AsciiCanvas — render a block of ASCII art.
 * Optional typewriter reveal on enter.
 *
 * props:
 *   art       — multiline string
 *   color     — CSS color (default: var(--paper))
 *   size      — font-size px (default 11)
 *   typewrite — bool (animate per character)
 *   speed     — chars per frame (default 8)
 *   flicker   — bool (CSS flicker)
 */
export default function AsciiCanvas({
  art,
  color = "var(--paper)",
  size = 11,
  typewrite = false,
  speed = 8,
  flicker = false,
  className = "",
  style,
}) {
  const [shown, setShown] = useState(typewrite ? "" : art);
  const raf = useRef(0);

  useEffect(() => {
    if (!typewrite) { setShown(art); return; }
    let i = 0;
    const tick = () => {
      i = Math.min(i + speed, art.length);
      setShown(art.slice(0, i));
      if (i < art.length) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [art, typewrite, speed]);

  return (
    <pre
      className={`ascii ascii-tight ${className}`}
      style={{
        color,
        fontSize: size,
        animation: flicker ? "sigil-flicker 5s ease-in-out infinite" : undefined,
        ...style,
      }}
    >
      {shown}
    </pre>
  );
}
