import React, { useEffect, useRef } from 'react';

export default function Spotlight() {
  const ref = useRef(null);

  useEffect(() => {
    // Disable on touch/coarse pointers (mobile) to avoid heavy overlays
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      return; // no spotlight on mobile
    }
    const el = ref.current;
    const onMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      if (el) {
        el.style.setProperty('--x', `${x}px`);
        el.style.setProperty('--y', `${y}px`);
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background:
          'radial-gradient(600px 400px at var(--x) var(--y), rgba(139,92,246,0.12), transparent 60%)',
      }}
    />
  );
}


