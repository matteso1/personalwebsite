import React from 'react';

export default function InkBorder({ children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-3xl border border-white/10 [mask-image:radial-gradient(circle at 20% 10%,black 30%,transparent 70%)]" />
      <div className="absolute inset-0 rounded-3xl border border-white/10 opacity-30 rotate-1" />
      <div className="absolute inset-0 rounded-3xl border border-white/10 opacity-10 -rotate-1" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}


