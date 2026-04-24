import React, { useEffect, useRef, useState } from "react";
import { generateMosh } from "../lib/ascii";

/**
 * MoshStrip — a horizontal corrupted-glyph band that occasionally bursts
 * into rust-colored clusters. The heartbeat of the whole layout.
 *
 * props:
 *   length — number of glyphs rendered (default 180)
 *   speed  — animation-duration in seconds (default 38)
 *   bursts — number of rust bursts (default 4)
 */
export default function MoshStrip({ length = 180, speed = 38, bursts = 4, className = "", label }) {
  const [seed, setSeed] = useState(0);
  const base = useRef(generateMosh(length, seed));

  useEffect(() => {
    // Re-seed every 4s for a slow corruption
    const id = setInterval(() => {
      setSeed((s) => s + 1);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  base.current = generateMosh(length, seed);
  const chars = base.current;

  // Inject rust bursts
  const positions = new Set();
  for (let i = 0; i < bursts; i++) {
    const p = Math.floor((i + 1) * (length / (bursts + 1)) + ((seed * 13) % 30));
    positions.add(p % length);
  }

  const nodes = [];
  for (let i = 0; i < chars.length; i++) {
    const pos = Math.floor(i / 1.6);
    if (positions.has(pos)) {
      nodes.push(
        <span key={i} className="mosh-burst">{chars[i]}</span>
      );
    } else {
      nodes.push(chars[i]);
    }
  }

  // Duplicate for seamless loop
  return (
    <div className={`mosh ${className}`} aria-hidden="true">
      <div className="mosh-track" style={{ animationDuration: `${speed}s` }}>
        <span>{nodes}</span>
        <span style={{ marginLeft: 40 }}>{nodes}</span>
      </div>
      {label && (
        <div className="mosh-label">
          <span className="mosh-label-slash">/</span>
          <span className="mosh-label-text">{label}</span>
          <span className="mosh-label-slash">/</span>
        </div>
      )}
    </div>
  );
}
