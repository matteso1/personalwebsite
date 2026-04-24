import React, { useEffect, useRef } from "react";

/**
 * ForkGraph — animated git-log-style commit graph of a thaw fork.
 * Parent trunk grows commit-by-commit, hits a fork node that pulses in
 * the accent color, then 4 child branches fan out and grow their own
 * divergent commits. Loops every cycleMs.
 */
export default function ForkGraph({
  color = "#C6F727",
  accentColor = "#FF2EA0",
  cycleMs = 6800,
}) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rgb = hexToRgb(color);
    const accRgb = hexToRgb(accentColor);

    let W = 0, H2 = 0;
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      W = Math.max(240, Math.round(rect.width));
      H2 = Math.max(320, Math.round(rect.height));
      canvas.width = W * dpr;
      canvas.height = H2 * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H2 + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    let visible = true;
    const io = new IntersectionObserver(
      ([e]) => { visible = e.isIntersecting; },
      { rootMargin: "160px" }
    );
    io.observe(canvas);

    const PARENT = [
      { label: "parent.session" },
      { label: "+128 tok" },
      { label: "+256 tok" },
      { label: "+384 tok" },
    ];
    const FORK_LABEL = "fork @ 0.88s";
    const CHILDREN = [
      { id: "c₁", n: 3 },
      { id: "c₂", n: 3 },
      { id: "c₃", n: 3 },
      { id: "c₄", n: 3 },
    ];

    // Timing in normalized cycle [0..1]
    const T = {
      parentStart: 0.00,
      parentStep: 0.055,
      forkAt: 0.30,
      fanoutStart: 0.40,
      fanoutEnd: 0.50,
      childStart: 0.53,
      childStep: 0.070,
      footerAt: 0.72,
      fadeStart: 0.92,
      fadeEnd: 1.00,
    };

    const pulseFn = (age, dur) =>
      age < 0 ? 0 : Math.max(0, 1 - age / dur);

    const start = performance.now();
    let rafId = 0;

    const MONO = '500 11px "JetBrains Mono", "SF Mono", ui-monospace, monospace';
    const MONO_B = '600 11px "JetBrains Mono", "SF Mono", ui-monospace, monospace';
    const MONO_S = '500 9px "JetBrains Mono", "SF Mono", ui-monospace, monospace';

    const draw = (now) => {
      rafId = requestAnimationFrame(draw);
      if (!visible) return;
      const t = ((now - start) % cycleMs) / cycleMs;

      ctx.clearRect(0, 0, W, H2);

      // ── Layout ──
      const padL = 22, padR = 18, padT = 26, padB = 34;
      const usableH = H2 - padT - padB;
      const usableW = W - padL - padR;

      const nParent = PARENT.length;
      const nChildRows = CHILDREN[0].n;
      const totalRows = nParent + 1 /* fork */ + 1 /* fanout */ + nChildRows + 1 /* child labels */;
      const rowH = Math.max(20, Math.min(52, usableH / (totalRows + 0.5)));

      const trunkX = padL + 6;
      const parentY0 = padT + rowH * 0.6;
      const parentYs = PARENT.map((_, i) => parentY0 + i * rowH * 1.25);
      const forkY = parentYs[nParent - 1] + rowH * 1.25;
      const fanoutY = forkY + rowH;

      const childLaneW = Math.min(usableW * 0.85, 340);
      const colGap = childLaneW / (CHILDREN.length - 1);
      const childCols = CHILDREN.map((_, i) => trunkX + i * colGap);
      const childY0 = fanoutY + rowH * 0.75;
      const cYs = (n) => Array.from({ length: n }, (_, j) => childY0 + j * rowH * 1.1);

      // ── Global fade in/out ──
      const fadeIn = Math.min(1, t * 30);
      const fadeOut = t > T.fadeStart
        ? Math.max(0, 1 - (t - T.fadeStart) / (T.fadeEnd - T.fadeStart))
        : 1;
      const A = fadeIn * fadeOut;

      ctx.lineCap = "round";
      ctx.textBaseline = "middle";

      // ── Drawing primitives ──
      const line = (x1, y1, x2, y2, alpha, accent = false) => {
        const c = accent ? accRgb : rgb;
        ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${0.14 * alpha})`;
        ctx.lineWidth = 4.5;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${0.92 * alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      };

      const node = (x, y, alpha, pulse = 0, accent = false) => {
        const c = accent ? accRgb : rgb;
        if (pulse > 0) {
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${pulse * 0.40 * alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, 5 + pulse * 9, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${0.22 * alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 4.0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 2.3, 0, Math.PI * 2);
        ctx.fill();
      };

      const text = (x, y, str, alpha, opts = {}) => {
        let c = rgb, mul = 0.62;
        if (opts.accent) c = accRgb;
        if (opts.dim) { c = { r: 170, g: 170, b: 170 }; mul = 0.4; }
        ctx.font = opts.bold ? MONO_B : (opts.small ? MONO_S : MONO);
        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha * mul})`;
        ctx.fillText(str, x, y);
      };

      // ── Parent trunk + commits ──
      for (let i = 0; i < nParent; i++) {
        const appear = T.parentStart + i * T.parentStep;
        if (i > 0) {
          const prevAppear = T.parentStart + (i - 1) * T.parentStep;
          if (t >= prevAppear) {
            const g = Math.min(1, (t - prevAppear) / (appear - prevAppear));
            const endY = parentYs[i - 1] + g * (parentYs[i] - parentYs[i - 1]);
            line(trunkX, parentYs[i - 1], trunkX, endY, A);
          }
        }
        if (t >= appear) {
          const pulse = pulseFn(t - appear, 0.20);
          node(trunkX, parentYs[i], A, pulse);
          const lblA = A * Math.min(1, (t - appear) / 0.08);
          text(trunkX + 14, parentYs[i], PARENT[i].label, lblA);
        }
      }

      // ── Trunk from last parent to fork ──
      const lastParentAppear = T.parentStart + (nParent - 1) * T.parentStep;
      if (t >= lastParentAppear) {
        const g = Math.min(1, (t - lastParentAppear) / (T.forkAt - lastParentAppear));
        const endY = parentYs[nParent - 1] + g * (forkY - parentYs[nParent - 1]);
        line(trunkX, parentYs[nParent - 1], trunkX, endY, A);
      }

      // ── Fork node (accent) with dual pulse ──
      if (t >= T.forkAt) {
        const age = t - T.forkAt;
        const p1 = pulseFn(age, 0.18);
        const p2 = pulseFn(age - 0.16, 0.18);
        const pulse = Math.max(p1, p2 * 0.85) * 1.3;
        node(trunkX, forkY, A, pulse, true);
        const lblA = A * Math.min(1, age / 0.08);
        text(trunkX + 14, forkY, FORK_LABEL, lblA, { accent: true, bold: true });
      }

      // ── Fanout: drop + horizontal + tees ──
      if (t >= T.fanoutStart) {
        const phase = Math.min(1, (t - T.fanoutStart) / (T.fanoutEnd - T.fanoutStart));
        const dropPhase = Math.min(1, phase / 0.28);
        line(
          trunkX, forkY + 4,
          trunkX, forkY + 4 + dropPhase * (fanoutY - forkY - 4),
          A
        );
        if (phase > 0.25) {
          const hp = (phase - 0.25) / 0.75;
          const maxX = childCols[CHILDREN.length - 1];
          const curX = trunkX + hp * (maxX - trunkX);
          line(trunkX, fanoutY, curX, fanoutY, A);
          for (let i = 0; i < CHILDREN.length; i++) {
            if (childCols[i] <= curX + 1) {
              const dP = Math.min(1, (curX - childCols[i] + 8) / 10);
              line(childCols[i], fanoutY, childCols[i], fanoutY + 8 * dP, A);
            }
          }
        }
      }

      // ── Children trunks + commits ──
      for (let ci = 0; ci < CHILDREN.length; ci++) {
        const cx = childCols[ci];
        const baseT = T.childStart + ci * 0.012;
        const ys = cYs(CHILDREN[ci].n);

        for (let j = 0; j < CHILDREN[ci].n; j++) {
          const appear = baseT + j * T.childStep;
          const cy = ys[j];
          const prevY = j === 0 ? fanoutY + 8 : ys[j - 1];
          const prevAppear = j === 0 ? T.fanoutEnd : baseT + (j - 1) * T.childStep;
          if (t >= prevAppear) {
            const g = Math.min(1, (t - prevAppear) / (appear - prevAppear));
            line(cx, prevY, cx, prevY + g * (cy - prevY), A);
          }
          if (t >= appear) {
            const pulse = pulseFn(t - appear, 0.16);
            node(cx, cy, A, pulse);
          }
        }

        const lastAppear = baseT + (CHILDREN[ci].n - 1) * T.childStep;
        if (t >= lastAppear) {
          const lblA = A * Math.min(1, (t - lastAppear) / 0.06);
          const lastY = ys[CHILDREN[ci].n - 1];
          text(cx - 6, lastY + rowH * 0.9, CHILDREN[ci].id, lblA);
        }
      }

      // ── Footer status ──
      if (t > T.footerAt) {
        const fA = Math.min(1, (t - T.footerAt) / 0.08) * A;
        text(padL, H2 - padB * 0.4, "$ thaw.fork(n=4)", fA, { dim: true });
        text(padL + 122, H2 - padB * 0.4, "→ bit-identical", fA, { accent: true });
      }

      // ── Header breadcrumb ──
      text(padL, padT * 0.55, "» session.fork.graph", A * 0.9, { dim: true, small: true });
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
    };
  }, [color, accentColor, cycleMs]);

  return (
    <div
      ref={wrapRef}
      style={{ width: "100%", aspectRatio: "4 / 3", position: "relative" }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}

function hexToRgb(hex) {
  const m = hex.replace("#", "");
  const bigint = parseInt(
    m.length === 3 ? m.split("").map((c) => c + c).join("") : m,
    16
  );
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}
