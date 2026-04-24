import React, { useEffect, useState, useRef } from "react";

// Renders text with periodic letter-scramble bursts and RGB split via .glitch CSS.
// Props:
//   text:       string to render
//   interval:   ms between scramble bursts (default 3800)
//   burst:      ms burst duration (default 260)
//   glyphs:     scramble alphabet (default A-Z0-9 + a few symbols)
//   className:  extra className for outer span (keep display styles here)
export default function GlitchText({
  text,
  interval = 3800,
  burst = 260,
  glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#*%@<>[]\\/",
  className = "",
  style,
  as: Tag = "span",
}) {
  const [display, setDisplay] = useState(text);
  const tickRef = useRef();

  useEffect(() => {
    setDisplay(text);
  }, [text]);

  useEffect(() => {
    let scrambleTimer;
    let scrambleEnd;

    const scramble = () => {
      const start = Date.now();
      const targetText = text;

      const frame = () => {
        const t = Date.now() - start;
        if (t >= burst) {
          setDisplay(targetText);
          scrambleTimer = null;
          return;
        }
        const progress = t / burst;
        const out = targetText
          .split("")
          .map((ch, i) => {
            if (ch === " " || ch === "\n") return ch;
            // resolve letters from left → right
            if (i / targetText.length < progress) return ch;
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join("");
        setDisplay(out);
        scrambleTimer = requestAnimationFrame(frame);
      };
      frame();
    };

    tickRef.current = setInterval(scramble, interval);
    return () => {
      clearInterval(tickRef.current);
      if (scrambleTimer) cancelAnimationFrame(scrambleTimer);
      clearTimeout(scrambleEnd);
    };
  }, [text, interval, burst, glyphs]);

  return (
    <Tag
      className={`glitch ${className}`}
      data-text={text}
      style={style}
    >
      {display}
    </Tag>
  );
}
