import React, { useEffect, useRef, useState } from "react";

/* Uppercase-biased scramble set — matches display-font letterform widths
   so the final layout slot stays stable during the reveal. A few block
   chars sprinkle the datamosh feel without the wild width swings of the
   old "█▓▒░<>/=" set. */
const SCRAMBLE_SET =
  "ABCDEFGHJKLMNOPQRSTUVWXYZ" +
  "ABCDEFGHJKLMNOPQRSTUVWXYZ" +
  "0123456789" +
  "▓▒░#";

/**
 * ScrambleText — reveal + scramble text on viewport enter or hover.
 *
 * Renders an invisible placeholder holding the final string so the
 * element occupies its final width from frame 1. A second absolutely
 * positioned layer paints the animated characters on top — no layout
 * jitter, no pushing neighboring columns around.
 *
 * props:
 *   text, as, duration, className, style, on ("view" | "hover" | "both")
 */
export default function ScrambleText({
  text,
  as: Tag = "span",
  duration = 900,
  className = "",
  style,
  on = "view",
}) {
  const [display, setDisplay] = useState(text);
  const ref = useRef(null);
  const rafRef = useRef(0);
  const hasRun = useRef(false);

  const run = () => {
    cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const len = text.length;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      let out = "";
      for (let i = 0; i < len; i++) {
        const charP = Math.max(0, Math.min(1, (p - (i / len) * 0.5) * 2));
        const c = text[i];
        if (charP >= 1 || c === " " || c === "\n") {
          out += c;
        } else if (charP <= 0) {
          out += SCRAMBLE_SET[Math.floor(Math.random() * SCRAMBLE_SET.length)];
        } else {
          out +=
            Math.random() < charP
              ? c
              : SCRAMBLE_SET[Math.floor(Math.random() * SCRAMBLE_SET.length)];
        }
      }
      setDisplay(out);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else setDisplay(text);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (on === "hover") return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !hasRun.current) {
            hasRun.current = true;
            run();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, on]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const mouseProps =
    on === "hover" || on === "both" ? { onMouseEnter: run } : {};

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...style,
        display: "inline-block",
        position: "relative",
        whiteSpace: "pre",
        /* overflow stays visible — outlined glyphs need breathing room above */
      }}
      {...mouseProps}
    >
      {/* Invisible placeholder — reserves the final width / height slot */}
      <span aria-hidden style={{ visibility: "hidden" }}>{text}</span>
      {/* Visible animated layer — paints over the placeholder */}
      <span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          whiteSpace: "pre",
        }}
      >
        {display}
      </span>
    </Tag>
  );
}
