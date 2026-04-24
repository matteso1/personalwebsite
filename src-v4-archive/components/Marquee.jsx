import React from "react";

// Marquee with Marathon-style hard edges. Default: black background, neon text.
// accent: "acid" | "aqua" | "hotmag" | "jaune" | "plasma"
export default function Marquee({
  items = [],
  accent = "acid",
  speed = 32,
  invert = false,
  className = "",
}) {
  const doubled = [...items, ...items];
  const accentVar = `var(--${accent})`;
  const bg = invert ? accentVar : "var(--bg-2)";
  const fg = invert ? "var(--bg)" : accentVar;

  return (
    <div
      className={`marquee ${className}`}
      style={{
        background: bg,
        color: fg,
        borderTop: `1px solid ${accentVar}`,
        borderBottom: `1px solid ${accentVar}`,
        boxShadow: invert
          ? `0 0 32px ${accentVar}40, inset 0 0 24px rgba(0,0,0,0.3)`
          : `inset 0 0 40px ${accentVar}22`,
      }}
    >
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        {doubled.map((item, i) => (
          <span className="marquee-item" key={i}>
            <span>{item}</span>
            <span className="marquee-sep" aria-hidden="true">
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
