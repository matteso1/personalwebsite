import React from "react";

/**
 * WindowFrame — faux OS window (Nrthview reference).
 * Used for layered/collaged content blocks.
 */
export default function WindowFrame({
  title = "WINDOW",
  subtitle,
  children,
  className = "",
  style,
  tint = "paper",
}) {
  const titleColor =
    tint === "rust"  ? "var(--rust)"  :
    tint === "amber" ? "var(--amber)" :
    tint === "blue"  ? "var(--accent-3)" :
    "var(--paper-mid)";
  return (
    <div className={`win ${className}`} data-tint={tint} style={style}>
      <div className="win-titlebar" style={{ color: titleColor }}>
        <span className="win-dots">
          <span className="win-dot" style={{ color: "var(--paper-ghost)" }} />
          <span className="win-dot" style={{ color: "var(--paper-ghost)" }} />
          <span className="win-dot" style={{ color: "var(--paper-ghost)" }} />
        </span>
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{title}</span>
        {subtitle && <span style={{ color: "var(--paper-dim)", opacity: 0.8 }}>{subtitle}</span>}
      </div>
      <div>{children}</div>
    </div>
  );
}
