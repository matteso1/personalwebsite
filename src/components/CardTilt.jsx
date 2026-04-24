import React, { useEffect, useRef } from "react";

/**
 * CardTilt — cursor-following 3D tilt + roaming glare, opt-in wrapper.
 * Use sparingly (hero cards only). Respects prefers-reduced-motion.
 *
 *   <CardTilt>
 *     <Dossier ...>...</Dossier>
 *   </CardTilt>
 */
export default function CardTilt({
  children,
  maxTilt = 9,
  glareStrength = 0.22,
  style,
  className = "",
}) {
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia?.("(pointer: coarse)").matches) return; // skip touch

    let raf = 0;
    let tx = 0, ty = 0, sx = 50, sy = 50;
    let hovering = 0;

    const apply = () => {
      el.style.setProperty("--tilt-x", `${tx.toFixed(2)}deg`);
      el.style.setProperty("--tilt-y", `${ty.toFixed(2)}deg`);
      el.style.setProperty("--shine-x", `${sx.toFixed(1)}%`);
      el.style.setProperty("--shine-y", `${sy.toFixed(1)}%`);
      el.style.setProperty("--shine-opacity", hovering.toFixed(2));
    };

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      ty = (x - 0.5) * 2 * maxTilt;
      tx = (0.5 - y) * 2 * maxTilt;
      sx = x * 100;
      sy = y * 100;
      hovering = 1;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      tx = 0; ty = 0; hovering = 0;
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
    <div
      ref={wrapRef}
      className={`card-tilt ${className}`.trim()}
      style={{
        "--glare-strength": glareStrength,
        ...style,
      }}
    >
      <div className="card-tilt-inner">
        {children}
        <div className="card-tilt-shine" aria-hidden />
        <div className="card-tilt-glare" aria-hidden />
      </div>
    </div>
  );
}
