import React from "react";

// HUD panel with corner brackets + optional mid-edge cross markers.
// Accents: aqua (default), acid, hotmag, plasma, jaune
export default function HudFrame({
  children,
  accent = "aqua",
  crosses = false,
  className = "",
  style,
  as: Tag = "div",
  ...rest
}) {
  return (
    <Tag
      className={`hud-frame ${crosses ? "hud-frame-crosses" : ""} ${className}`}
      data-accent={accent}
      style={style}
      {...rest}
    >
      {children}
      <span className="corner-bl" aria-hidden="true" />
      <span className="corner-br" aria-hidden="true" />
      {crosses && (
        <>
          <span className="cross t" aria-hidden="true">+</span>
          <span className="cross r" aria-hidden="true">+</span>
          <span className="cross b" aria-hidden="true">+</span>
          <span className="cross l" aria-hidden="true">+</span>
        </>
      )}
    </Tag>
  );
}
