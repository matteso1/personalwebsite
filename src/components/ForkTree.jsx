import React, { useEffect, useRef } from "react";

/**
 * ForkTree — a slowly rotating 3D fork-graph rendered as neon wireframe.
 * Root node diverges into N branches, each branch into children, each child
 * into leaves. Pulses travel outward along every edge (root → leaves).
 *
 * Container-responsive: fills 100% of wrapper, maintains 16:10 aspect.
 * DPR-aware (capped 2), offscreen-paused, ~26 fps.
 */
export default function ForkTree({
  color = "#C6F727",
  pulseColor = "#FF2EA0",
  speed = 0.0055,
  tiltDeg = 20,
}) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0, H = 0;
    let cx = 0, cy = 0;
    let R = 0;

    // Build the tree topology once — positions in "R units" scaled at draw time
    const BRANCHES = 4;
    const SUB = 3;           // children per branch
    const LEAVES = 2;        // leaves per child

    const rootPos = [0, -0.22, 0];
    const branches = [];
    const children = [];
    const leaves = [];
    const edges = [];        // [fromIndex, toIndex] into nodes[]
    const nodes = [rootPos]; // index 0 = root

    for (let i = 0; i < BRANCHES; i++) {
      const theta = (i / BRANCHES) * Math.PI * 2 + Math.PI / BRANCHES;
      const bx = Math.cos(theta) * 0.52;
      const bz = Math.sin(theta) * 0.52;
      const bPos = [bx, 0.02, bz];
      branches.push(nodes.length);
      edges.push([0, nodes.length]);
      nodes.push(bPos);

      for (let j = 0; j < SUB; j++) {
        const spread = 0.42;
        const phi = theta + (j - (SUB - 1) / 2) * (spread / (SUB - 1 || 1));
        const rr = 0.82;
        const cPos = [
          Math.cos(phi) * rr,
          0.18 + (j === 1 ? 0.03 : 0),
          Math.sin(phi) * rr,
        ];
        const cIdx = nodes.length;
        children.push(cIdx);
        edges.push([branches[i], cIdx]);
        nodes.push(cPos);

        // leaves only on outer children
        if (j !== 1) {
          for (let k = 0; k < LEAVES; k++) {
            const lSpread = 0.22;
            const lPhi = phi + (k === 0 ? -lSpread : lSpread);
            const lr = 1.02;
            const lPos = [
              Math.cos(lPhi) * lr,
              0.32,
              Math.sin(lPhi) * lr,
            ];
            const lIdx = nodes.length;
            leaves.push(lIdx);
            edges.push([cIdx, lIdx]);
            nodes.push(lPos);
          }
        }
      }
    }

    const tilt = (tiltDeg * Math.PI) / 180;
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);

    const project = (p, angle) => {
      const x = p[0] * R;
      const y = p[1] * R;
      const z = p[2] * R;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const xr = x * cosA - z * sinA;
      const zr = x * sinA + z * cosA;
      const yt = y * cosT - zr * sinT;
      const zt = y * sinT + zr * cosT;
      const persp = (R * 3.2) / (R * 3.2 + zt);
      return [xr * persp + cx, -yt * persp + cy, zt];
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      W = Math.max(120, Math.round(rect.width));
      H = Math.max(80, Math.round(rect.height));
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2;
      R = Math.min(W * 0.33, H * 0.48);
      cy = H / 2 + R * 0.30;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { rootMargin: "120px" }
    );
    io.observe(canvas);

    const rgb = hexToRgb(color);
    const pulseRgb = hexToRgb(pulseColor);
    const glowStroke = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.14)`;
    const bodyStroke = color;
    const nodeFill = color;
    const pulseFill = pulseColor;

    let t = Math.PI * 0.23;
    let rafId;
    let last = 0;
    const FRAME_MS = 38;

    const tick = (now) => {
      rafId = requestAnimationFrame(tick);
      if (!visible) return;
      if (now - last < FRAME_MS) return;
      last = now;
      t += speed;

      ctx.clearRect(0, 0, W, H);
      const angle = t;

      // Pre-project all nodes once per frame
      const P = new Array(nodes.length);
      for (let i = 0; i < nodes.length; i++) P[i] = project(nodes[i], angle);

      // Pass 1 — wide translucent glow on every edge
      ctx.strokeStyle = glowStroke;
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      for (let i = 0; i < edges.length; i++) {
        const a = P[edges[i][0]];
        const b = P[edges[i][1]];
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
      }

      // Pass 2 — crisp body line (thickness depends on depth)
      for (let i = 0; i < edges.length; i++) {
        const a = P[edges[i][0]];
        const b = P[edges[i][1]];
        // depth ~= distance from root by hop count; use simple heuristic
        const fromIsRoot = edges[i][0] === 0;
        const toIsLeaf = leaves.indexOf(edges[i][1]) !== -1;
        ctx.strokeStyle = bodyStroke;
        ctx.lineWidth = fromIsRoot ? 1.55 : toIsLeaf ? 0.75 : 1.05;
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
      }

      // Pulses — each edge has its own traveling dot, phased
      const pulseT = (t * 2.4) % 1;
      for (let i = 0; i < edges.length; i++) {
        const phase = (pulseT + i * 0.083) % 1;
        const a = P[edges[i][0]];
        const b = P[edges[i][1]];
        const px = a[0] + (b[0] - a[0]) * phase;
        const py = a[1] + (b[1] - a[1]) * phase;
        // falloff near the endpoints so pulses don't stack on nodes
        const fade = Math.sin(phase * Math.PI);
        // glow
        ctx.fillStyle = `rgba(${pulseRgb.r}, ${pulseRgb.g}, ${pulseRgb.b}, ${0.18 * fade})`;
        ctx.beginPath();
        ctx.arc(px, py, 4.5 * fade, 0, Math.PI * 2);
        ctx.fill();
        // core
        ctx.fillStyle = pulseFill;
        ctx.beginPath();
        ctx.arc(px, py, 1.7 * fade, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nodes — octahedron silhouettes at each vertex
      for (let i = 0; i < P.length; i++) {
        const [px, py] = P[i];
        const isRoot = i === 0;
        const isBranch = branches.indexOf(i) !== -1;
        const size = isRoot ? 7 : isBranch ? 5 : 3;

        // glow
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`;
        ctx.beginPath();
        ctx.arc(px, py, size * 2.1, 0, Math.PI * 2);
        ctx.fill();
        // core diamond
        ctx.fillStyle = nodeFill;
        ctx.beginPath();
        ctx.moveTo(px, py - size);
        ctx.lineTo(px + size, py);
        ctx.lineTo(px, py + size);
        ctx.lineTo(px - size, py);
        ctx.closePath();
        ctx.fill();
        // inner notch on root
        if (isRoot) {
          ctx.fillStyle = "#000";
          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
    };
  }, [color, pulseColor, speed, tiltDeg]);

  return (
    <div
      ref={wrapRef}
      style={{
        width: "100%",
        aspectRatio: "16 / 10",
        position: "relative",
      }}
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
