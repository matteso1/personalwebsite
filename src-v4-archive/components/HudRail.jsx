import React, { useEffect, useState } from "react";

// A live-looking HUD rail that rotates through status lines.
// Props:
//   leftItems: array of strings (rotates on a timer)
//   rightItems: array of strings (rotates on a timer)
//   interval: ms between rotations
export default function HudRail({
  leftItems = [],
  rightItems = [],
  interval = 2400,
  className = "",
}) {
  const [l, setL] = useState(0);
  const [r, setR] = useState(0);

  useEffect(() => {
    if (leftItems.length < 2 && rightItems.length < 2) return;
    const t = setInterval(() => {
      setL((v) => (v + 1) % Math.max(1, leftItems.length));
      setR((v) => (v + 1) % Math.max(1, rightItems.length));
    }, interval);
    return () => clearInterval(t);
  }, [leftItems.length, rightItems.length, interval]);

  return (
    <div className={`hud-rail ${className}`}>
      <span className="flex items-center gap-2">
        <span
          className="inline-block"
          style={{
            width: 5,
            height: 5,
            background: "var(--acid)",
            boxShadow: "0 0 8px var(--acid)",
          }}
        />
        {leftItems[l]}
      </span>
      <span className="flex items-center gap-2" style={{ color: "var(--aqua)" }}>
        <span>{rightItems[r]}</span>
        <span
          className="inline-block"
          style={{
            width: 5,
            height: 5,
            background: "var(--aqua)",
            boxShadow: "0 0 8px var(--aqua)",
          }}
        />
      </span>
    </div>
  );
}
