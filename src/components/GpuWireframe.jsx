import React, { useEffect, useRef } from "react";

/**
 * GpuWireframe — hand-modeled RTX-4090-FE-style GPU, neon wireframe,
 * slowly yawing with a gentle pitch wobble so it's never purely edge-on.
 * Fan spins independently of the card.
 *
 * Geometry is authored directly in "card units": length X (-2.5..+2.5),
 * thickness Y (-0.35..+0.35), depth Z (-1.05..+1.05).
 * Projected CPU-side (yaw then pitch, then perspective).
 */
export default function GpuWireframe({
  color = "#C6F727",
  accentColor = "#FF2EA0",
  speed = 0.0034,
  fanSpeed = 0.14,
  basePitchDeg = 6,
}) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // ── geometry authoring helpers ────────────────────────────
    const verts = [];
    const edges = [];
    const addV = (x, y, z) => (verts.push([x, y, z]), verts.length - 1);
    const addE = (a, b) => edges.push([a, b]);
    const addRect = (a, b, c, d) => {
      addE(a, b); addE(b, c); addE(c, d); addE(d, a);
    };
    const addLoop = (idx) => {
      for (let i = 0; i < idx.length; i++) addE(idx[i], idx[(i + 1) % idx.length]);
    };

    // ── MAIN SHROUD — rectangular prism ───────────────────────
    const L = 2.5, H = 0.35, D = 1.05;
    const B = {
      nnn: addV(-L, -H, -D), pnn: addV( L, -H, -D),
      ppn: addV( L,  H, -D), npn: addV(-L,  H, -D),
      nnp: addV(-L, -H,  D), pnp: addV( L, -H,  D),
      ppp: addV( L,  H,  D), npp: addV(-L,  H,  D),
    };
    addRect(B.npn, B.ppn, B.ppp, B.npp);  // top
    addRect(B.nnn, B.pnn, B.pnp, B.nnp);  // bottom
    addE(B.nnn, B.npn); addE(B.pnn, B.ppn);
    addE(B.pnp, B.ppp); addE(B.nnp, B.npp);

    // ── TOP FACE · logo tile on left (RTX 4090 plate) ─────────
    const topY = H + 0.045;
    const lgL = -L * 0.82, lgR = -L * 0.18, lgF = -D * 0.62, lgB =  D * 0.62;
    const L1 = addV(lgL, topY, lgF), L2 = addV(lgR, topY, lgF);
    const L3 = addV(lgR, topY, lgB), L4 = addV(lgL, topY, lgB);
    addRect(L1, L2, L3, L4);
    // drop to main top surface
    const Lb1 = addV(lgL, H, lgF), Lb2 = addV(lgR, H, lgF);
    const Lb3 = addV(lgR, H, lgB), Lb4 = addV(lgL, H, lgB);
    addRect(Lb1, Lb2, Lb3, Lb4);
    addE(L1, Lb1); addE(L2, Lb2); addE(L3, Lb3); addE(L4, Lb4);
    // inner RTX text rectangle (raised slightly further)
    const rtxCX = (lgL + lgR) / 2;
    const rtxW = (lgR - lgL) * 0.58;
    const rtxD = (lgB - lgF) * 0.22;
    const r1 = addV(rtxCX - rtxW / 2, topY + 0.015, -rtxD);
    const r2 = addV(rtxCX + rtxW / 2, topY + 0.015, -rtxD);
    const r3 = addV(rtxCX + rtxW / 2, topY + 0.015,  rtxD);
    const r4 = addV(rtxCX - rtxW / 2, topY + 0.015,  rtxD);
    addRect(r1, r2, r3, r4);
    // two tick marks on the tile (sub-detail: corner dashes)
    const tickLen = 0.15;
    const t1a = addV(lgL + 0.06, topY + 0.005, lgF + 0.06);
    const t1b = addV(lgL + 0.06 + tickLen, topY + 0.005, lgF + 0.06);
    const t2a = addV(lgR - 0.06, topY + 0.005, lgB - 0.06);
    const t2b = addV(lgR - 0.06 - tickLen, topY + 0.005, lgB - 0.06);
    addE(t1a, t1b); addE(t2a, t2b);

    // ── TOP FACE · X-ridge crossing the middle ───────────────
    const xY = H + 0.03;
    const xSpread = L * 0.38, xDepth = D * 0.82;
    const xA1 = addV(-xSpread, xY, -xDepth), xA2 = addV( xSpread, xY,  xDepth);
    const xB1 = addV(-xSpread, xY,  xDepth), xB2 = addV( xSpread, xY, -xDepth);
    addE(xA1, xA2); addE(xB1, xB2);
    // ridge ends drop to surface
    const xA1b = addV(-xSpread, H, -xDepth), xA2b = addV( xSpread, H,  xDepth);
    const xB1b = addV(-xSpread, H,  xDepth), xB2b = addV( xSpread, H, -xDepth);
    addE(xA1, xA1b); addE(xA2, xA2b);
    addE(xB1, xB1b); addE(xB2, xB2b);
    // small center square where the ridges cross
    const cxSq = 0.13;
    const c1 = addV(-cxSq, xY + 0.005, -cxSq);
    const c2 = addV( cxSq, xY + 0.005, -cxSq);
    const c3 = addV( cxSq, xY + 0.005,  cxSq);
    const c4 = addV(-cxSq, xY + 0.005,  cxSq);
    addRect(c1, c2, c3, c4);

    // ── TOP FACE · fan aperture on right ─────────────────────
    const fanCX = L * 0.55, fanCZ = 0;
    const fanR = Math.min(D * 0.85, L * 0.42);
    const fanRimY = H + 0.025;
    const FAN_SEG = 44;
    const aperture = [];
    for (let i = 0; i < FAN_SEG; i++) {
      const a = (i / FAN_SEG) * Math.PI * 2;
      aperture.push(addV(fanCX + Math.cos(a) * fanR, fanRimY, fanCZ + Math.sin(a) * fanR));
    }
    addLoop(aperture);
    // inner lower lip — the aperture has depth
    const apLower = [];
    const lowerY = H - 0.12;
    for (let i = 0; i < FAN_SEG; i++) {
      const a = (i / FAN_SEG) * Math.PI * 2;
      apLower.push(addV(
        fanCX + Math.cos(a) * fanR * 0.96,
        lowerY,
        fanCZ + Math.sin(a) * fanR * 0.96,
      ));
    }
    addLoop(apLower);
    for (let i = 0; i < FAN_SEG; i += 4) addE(aperture[i], apLower[i]);

    // ── HEATSINK FINS on the two long faces (+Z, -Z) ─────────
    const FIN_N = 9;
    for (let f = 0; f < FIN_N; f++) {
      const yy = -H + (f + 0.5) * (2 * H) / FIN_N;
      const a1 = addV(-L * 0.95, yy,  D), a2 = addV(L * 0.95, yy,  D); addE(a1, a2);
      const b1 = addV(-L * 0.95, yy, -D), b2 = addV(L * 0.95, yy, -D); addE(b1, b2);
    }

    // ── BOTTOM FACE · backplate ridge lines + second fan hint ──
    const bpY = -H - 0.02;
    const BP_N = 6;
    for (let f = 0; f < BP_N; f++) {
      const zz = -D + (f + 0.5) * (2 * D) / BP_N;
      const a1 = addV(-L * 0.9, bpY, zz);
      const a2 = addV( L * 0.9, bpY, zz);
      addE(a1, a2);
    }
    // a subtle rectangular vent on the backplate, on LEFT half
    const ventX1 = -L * 0.7, ventX2 = -L * 0.25;
    const ventZ1 = -D * 0.55, ventZ2 = D * 0.55;
    const v1 = addV(ventX1, bpY - 0.005, ventZ1);
    const v2 = addV(ventX2, bpY - 0.005, ventZ1);
    const v3 = addV(ventX2, bpY - 0.005, ventZ2);
    const v4 = addV(ventX1, bpY - 0.005, ventZ2);
    addRect(v1, v2, v3, v4);

    // ── POWER CONNECTOR tab on top, near aperture ─────────────
    const pcX = 0.2, pcZ = -D * 0.58;
    const pcW = 0.32, pcD = 0.24, pcTop = H + 0.24;
    const pcLx = pcX - pcW / 2, pcRx = pcX + pcW / 2;
    const pcFz = pcZ - pcD / 2, pcBz = pcZ + pcD / 2;
    const p1 = addV(pcLx, H, pcFz), p2 = addV(pcRx, H, pcFz);
    const p3 = addV(pcRx, H, pcBz), p4 = addV(pcLx, H, pcBz);
    const p5 = addV(pcLx, pcTop, pcFz), p6 = addV(pcRx, pcTop, pcFz);
    const p7 = addV(pcRx, pcTop, pcBz), p8 = addV(pcLx, pcTop, pcBz);
    addRect(p5, p6, p7, p8);
    addE(p1, p5); addE(p2, p6); addE(p3, p7); addE(p4, p8);
    // 12 pin subdivisions on top (two rows of 6)
    for (let i = 1; i < 6; i++) {
      const px = pcLx + (pcW * i) / 6;
      addE(
        addV(px, pcTop + 0.001, pcFz),
        addV(px, pcTop + 0.001, pcBz),
      );
    }
    addE(
      addV(pcLx, pcTop + 0.001, (pcFz + pcBz) / 2),
      addV(pcRx, pcTop + 0.001, (pcFz + pcBz) / 2),
    );

    // ── IO BRACKET on -X end ──────────────────────────────────
    const brX = -L - 0.18;
    const brH = H * 0.9, brD = D * 0.94;
    const br1 = addV(brX, -brH, -brD), br2 = addV(-L, -brH, -brD);
    const br3 = addV(-L,  brH, -brD), br4 = addV(brX,  brH, -brD);
    const br5 = addV(brX, -brH,  brD), br6 = addV(-L, -brH,  brD);
    const br7 = addV(-L,  brH,  brD), br8 = addV(brX,  brH,  brD);
    addRect(br1, br2, br3, br4); addRect(br5, br6, br7, br8);
    addE(br1, br5); addE(br2, br6); addE(br3, br7); addE(br4, br8);
    // display port openings — 3 slots + 1 HDMI, on -Z side of bracket
    const dpFaceY0 = -brH * 0.55, dpH = 0.11;
    for (let i = 0; i < 3; i++) {
      const z = -brD * 0.6 + i * (brD * 0.45);
      const d1 = addV(brX - 0.002, dpFaceY0, z);
      const d2 = addV(brX - 0.002, dpFaceY0 + dpH, z);
      const d3 = addV(brX - 0.002, dpFaceY0 + dpH, z + 0.32);
      const d4 = addV(brX - 0.002, dpFaceY0, z + 0.32);
      addRect(d1, d2, d3, d4);
    }
    const hmY = dpFaceY0 + dpH + 0.15, hmH = 0.1;
    const hm1 = addV(brX - 0.002, hmY, -brD * 0.6);
    const hm2 = addV(brX - 0.002, hmY + hmH, -brD * 0.6);
    const hm3 = addV(brX - 0.002, hmY + hmH, -brD * 0.6 + 0.48);
    const hm4 = addV(brX - 0.002, hmY, -brD * 0.6 + 0.48);
    addRect(hm1, hm2, hm3, hm4);

    // ── FAN (separate — spins) ────────────────────────────────
    const BLADES = 9;
    const BLADE_SAMPLES = 7;
    const fanInnerR = fanR * 0.20;
    const fanOuterR = fanR * 0.94;
    const fanY = fanRimY - 0.01;
    const fanBladeProfile = []; // per-sample { r, off }
    for (let s = 0; s < BLADE_SAMPLES; s++) {
      const tt = s / (BLADE_SAMPLES - 1);
      fanBladeProfile.push({
        r: fanInnerR + (fanOuterR - fanInnerR) * tt,
        off: Math.pow(tt, 1.35) * 0.7,
      });
    }
    const HUB_SEG = 24;

    // ── projection ────────────────────────────────────────────
    let W = 0, H2 = 0, cx = 0, cy = 0, S = 0;

    const project = (p, yaw, pitch) => {
      // axis swap: length (original X) → vertical (Y); thickness (original Y) → horizontal (X).
      // Card stands on end; yaw then spins around its long axis.
      const x = -p[1] * S, y = p[0] * S, z = p[2] * S;
      const cY = Math.cos(yaw), sY = Math.sin(yaw);
      const x1 = x * cY - z * sY;
      const z1 = x * sY + z * cY;
      const cP = Math.cos(pitch), sP = Math.sin(pitch);
      const y1 = y * cP - z1 * sP;
      const z2 = y * sP + z1 * cP;
      const persp = (S * 4.6) / (S * 4.6 + z2);
      return [x1 * persp + cx, -y1 * persp + cy, z2];
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      W = Math.max(160, Math.round(rect.width));
      H2 = Math.max(100, Math.round(rect.height));
      canvas.width = W * dpr;
      canvas.height = H2 * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H2 + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2;
      cy = H2 / 2;
      S = Math.min(W * 0.28, H2 * 0.32);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { rootMargin: "160px" }
    );
    io.observe(canvas);

    const rgb = hexToRgb(color);
    const accentRgb = hexToRgb(accentColor);
    const basePitch = (basePitchDeg * Math.PI) / 180;

    let t = 0, fanT = 0;
    let rafId = 0, last = 0;
    const FRAME_MS = 30;

    const tick = (now) => {
      rafId = requestAnimationFrame(tick);
      if (!visible) return;
      if (now - last < FRAME_MS) return;
      last = now;
      t += speed;
      fanT += fanSpeed;

      ctx.clearRect(0, 0, W, H2);

      const yaw = t;
      const pitch = basePitch + Math.sin(t * 0.6) * 0.07;

      // pre-project all verts + track per-edge midpoint z for depth-fade
      const P = new Array(verts.length);
      for (let i = 0; i < verts.length; i++) P[i] = project(verts[i], yaw, pitch);

      ctx.lineCap = "round";

      // Glow pass
      for (let i = 0; i < edges.length; i++) {
        const a = P[edges[i][0]], b = P[edges[i][1]];
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.09)`;
        ctx.lineWidth = 5.2;
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
      }
      // Crisp body — depth-modulated alpha so back edges feel further
      for (let i = 0; i < edges.length; i++) {
        const a = P[edges[i][0]], b = P[edges[i][1]];
        const mz = (a[2] + b[2]) * 0.5;
        // z ~ -range..+range; normalize to 0.55..1
        const depth = Math.max(0.38, Math.min(1, (S * 4.6) / (S * 4.6 + mz)));
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.85 * depth})`;
        ctx.lineWidth = 1.05;
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
      }

      // ── fan blades ────────────────────────────────────────
      // glow
      ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`;
      ctx.lineWidth = 4.2;
      const bladePts = new Array(BLADES);
      for (let b = 0; b < BLADES; b++) {
        const baseA = (b / BLADES) * Math.PI * 2 + fanT;
        const line = new Array(BLADE_SAMPLES);
        for (let s = 0; s < BLADE_SAMPLES; s++) {
          const { r, off } = fanBladeProfile[s];
          const a = baseA + off;
          line[s] = project(
            [fanCX + Math.cos(a) * r, fanY, fanCZ + Math.sin(a) * r],
            yaw, pitch,
          );
        }
        bladePts[b] = line;
        ctx.beginPath();
        ctx.moveTo(line[0][0], line[0][1]);
        for (let s = 1; s < BLADE_SAMPLES; s++) ctx.lineTo(line[s][0], line[s][1]);
        ctx.stroke();
      }
      // crisp
      for (let b = 0; b < BLADES; b++) {
        const line = bladePts[b];
        const mz = line[Math.floor(BLADE_SAMPLES / 2)][2];
        const depth = Math.max(0.3, Math.min(1, (S * 4.6) / (S * 4.6 + mz)));
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.92 * depth})`;
        ctx.lineWidth = 0.95;
        ctx.beginPath();
        ctx.moveTo(line[0][0], line[0][1]);
        for (let s = 1; s < BLADE_SAMPLES; s++) ctx.lineTo(line[s][0], line[s][1]);
        ctx.stroke();
      }

      // fan hub ring
      const hub = new Array(HUB_SEG);
      for (let i = 0; i < HUB_SEG; i++) {
        const a = (i / HUB_SEG) * Math.PI * 2 + fanT * 0.6;
        hub[i] = project(
          [fanCX + Math.cos(a) * fanInnerR, fanY + 0.008, fanCZ + Math.sin(a) * fanInnerR],
          yaw, pitch,
        );
      }
      ctx.strokeStyle = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.85)`;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(hub[0][0], hub[0][1]);
      for (let i = 1; i < HUB_SEG; i++) ctx.lineTo(hub[i][0], hub[i][1]);
      ctx.closePath();
      ctx.stroke();

      // hub dot
      const hubC = project([fanCX, fanY + 0.02, fanCZ], yaw, pitch);
      ctx.fillStyle = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.28)`;
      ctx.beginPath();
      ctx.arc(hubC[0], hubC[1], 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 1)`;
      ctx.beginPath();
      ctx.arc(hubC[0], hubC[1], 2.4, 0, Math.PI * 2);
      ctx.fill();
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
    };
  }, [color, accentColor, speed, fanSpeed, basePitchDeg]);

  return (
    <div
      ref={wrapRef}
      style={{ width: "100%", aspectRatio: "4 / 5", position: "relative" }}
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
