import React, { useEffect, useRef } from "react";

/**
 * CardLift — quiet cursor-following 3D lift. No click, no spin, no foil.
 * Hovering raises the card slightly and tilts it toward the cursor.
 * On leave, returns to rest.
 */
export default function CardLift({ children, maxTilt = 6, className = "", style }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(pointer: coarse)").matches) return;

    let raf = 0;
    let tx = 0, ty = 0, lift = 0, gx = 50, gy = 50;

    const apply = () => {
      el.style.setProperty("--lift-x", `${tx.toFixed(2)}deg`);
      el.style.setProperty("--lift-y", `${ty.toFixed(2)}deg`);
      el.style.setProperty("--lift-z", `${lift.toFixed(2)}`);
      el.style.setProperty("--lift-gx", `${gx.toFixed(1)}%`);
      el.style.setProperty("--lift-gy", `${gy.toFixed(1)}%`);
    };

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      ty = (x - 0.5) * 2 * maxTilt;
      tx = (0.5 - y) * 2 * maxTilt;
      gx = x * 100;
      gy = y * 100;
      lift = 1;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      tx = 0; ty = 0; lift = 0;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [maxTilt]);

  return (
    <div ref={ref} className={`card-lift ${className}`.trim()} style={style}>
      <div className="card-lift-inner">
        {children}
        <div className="card-lift-sheen" aria-hidden />
      </div>
    </div>
  );
}
