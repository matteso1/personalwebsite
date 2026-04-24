import React, { useRef } from "react";

/**
 * HolographicCard
 * - Iridescent rim (conic-gradient inside a masked padding-only ::before pattern)
 * - Mouse-tracked radial shine (Pokemon-card effect)
 * - Ambient drop shadow
 *
 * accent: "acid" (default) | "magenta" | "cyan" | "violet"
 */
export default function HolographicCard({
  children,
  className = "",
  accent = "acid",
  as: Tag = "div",
  href,
  target,
  rel,
  onClick,
}) {
  const ref = useRef(null);

  const onMove = (e) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mx", `${x}%`);
    card.style.setProperty("--my", `${y}%`);
  };

  const onLeave = () => {
    const card = ref.current;
    if (!card) return;
    card.style.setProperty("--mx", `50%`);
    card.style.setProperty("--my", `50%`);
  };

  const Component = href ? "a" : Tag;
  const extraProps = href ? { href, target, rel } : {};

  return (
    <Component
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      data-accent={accent}
      className={`holo-card block ${className}`}
      {...extraProps}
    >
      <div className="holo-shine" />
      <div className="holo-rim" />
      <div className="holo-content">{children}</div>
    </Component>
  );
}
