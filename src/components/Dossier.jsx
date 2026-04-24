import React from "react";

/**
 * Dossier — DedSec file-card wrapper with hairline corner brackets.
 * Set accent="amber" for amber corners (default rust).
 */
export default function Dossier({
  accent = "rust",
  stamp,
  children,
  className = "",
  style,
  onClick,
}) {
  return (
    <div
      className={`dossier ${className}`}
      data-accent={accent}
      style={style}
      onClick={onClick}
    >
      {stamp && <div className="dossier-stamp">{stamp}</div>}
      {children}
    </div>
  );
}
