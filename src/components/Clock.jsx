import React, { useEffect, useState } from "react";

/* ISO-ish clock for headers — updates every second, mono-fixed width. */
export default function Clock() {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = String(t.getHours()).padStart(2, "0");
  const mm = String(t.getMinutes()).padStart(2, "0");
  const ss = String(t.getSeconds()).padStart(2, "0");
  return (
    <span className="mono" style={{ fontSize: 10.5, letterSpacing: "0.14em", color: "var(--paper-dim)" }}>
      {hh}:{mm}
      <span style={{ color: "var(--paper-ghost)" }}>:{ss}</span>
    </span>
  );
}
