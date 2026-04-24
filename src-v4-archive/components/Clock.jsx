import React, { useEffect, useState } from "react";

// Live-updating mono clock. Shows: MM.DD.YYYY // HH:MM:SS
export default function Clock({ className = "", style }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const p = (n) => String(n).padStart(2, "0");
  const date = `${p(now.getMonth() + 1)}.${p(now.getDate())}.${now.getFullYear()}`;
  const time = `${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}`;
  return (
    <span className={`mono ${className}`} style={style}>
      <span style={{ color: "var(--text-dim)" }}>{date}</span>
      <span style={{ color: "var(--text-ghost)", margin: "0 6px" }}>//</span>
      <span style={{ color: "var(--jaune)" }}>{time}</span>
    </span>
  );
}
