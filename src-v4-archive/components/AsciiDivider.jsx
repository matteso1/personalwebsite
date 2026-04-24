import React from "react";

/**
 * Thin horizontal ASCII divider — clean, DedSec-style.
 * Looks like:  ──── [ label ] ────────────────────────
 */
export default function AsciiDivider({
  label = "",
  color = "var(--text-dim)",
  accent = "var(--acid)",
  className = "",
  style,
}) {
  return (
    <div
      className={`ascii-divider ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color,
        userSelect: "none",
        ...style,
      }}
    >
      <span style={{ color: accent }}>┣</span>
      {label && (
        <span>
          <span style={{ color: accent, opacity: 0.85 }}>/&nbsp;</span>
          {label}
        </span>
      )}
      <span
        aria-hidden="true"
        style={{
          flex: 1,
          height: 1,
          background: `linear-gradient(to right, ${color}, transparent)`,
          opacity: 0.4,
        }}
      />
      <span style={{ color, opacity: 0.5 }}>┫</span>
    </div>
  );
}
