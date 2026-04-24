import React, { useEffect, useRef } from "react";

/**
 * ForkCore — neon wireframe viz of the thaw fork primitive.
 *
 * Central icosahedron  = "the live session" (snapshot point)
 * Outer shell (dodec)  = "snapshot boundary"
 * 4 orbital tetrahedra = "divergent forks"
 * Pulsed connectors    = "hydration"
 *
 * All geometry is hand-projected (y-rotation + x-tilt + perspective).
 * Depth-sorted so nearer shapes occlude farther ones correctly.
 */
export default function ForkCore({
  color = "#C6F727",
  pulseColor = "#FF2EA0",
  accentColor = "#A040FF",
  speed = 0.0042,
  tiltDeg = 16,
}) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // — geometry —
    const phi = (1 + Math.sqrt(5)) / 2;
    const ICOSA_RAW = [
      [0, 1, phi], [0, 1, -phi], [0, -1, phi], [0, -1, -phi],
      [1, phi, 0], [1, -phi, 0], [-1, phi, 0], [-1, -phi, 0],
      [phi, 0, 1], [phi, 0, -1], [-phi, 0, 1], [-phi, 0, -1],
    ];
    const ICOSA_VERTS = normalize(ICOSA_RAW);
    const ICOSA_EDGES = edgesAtLength(ICOSA_VERTS, 1.18);

    const DODEC_RAW = [
      [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
      [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
      [0, 1 / phi, phi], [0, 1 / phi, -phi], [0, -1 / phi, phi], [0, -1 / phi, -phi],
      [1 / phi, phi, 0], [1 / phi, -phi, 0], [-1 / phi, phi, 0], [-1 / phi, -phi, 0],
      [phi, 0, 1 / phi], [phi, 0, -1 / phi], [-phi, 0, 1 / phi], [-phi, 0, -1 / phi],
    ];
    const DODEC_VERTS = normalize(DODEC_RAW);
    const DODEC_EDGES = edgesAtLength(DODEC_VERTS, 0.82);

    const TETRA_RAW = [
      [1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1],
    ];
    const TETRA_VERTS = normalize(TETRA_RAW);
    const TETRA_EDGES = [
      [0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3],
    ];

    // 4 orbital forks — each a tetrahedron + satellite octahedron cluster
    const FORKS = 4;
    const forks = [];
    for (let i = 0; i < FORKS; i++) {
      forks.push({
        baseAngle: (i / FORKS) * Math.PI * 2,
        radius: 2.05,
        yOffset: ((i % 2) === 0 ? 0.22 : -0.24) * (1 + (i * 0.08)),
        scale: 0.34,
        spinAxis: (i * 0.41) % 1,
        spinSpeed: 0.8 + i * 0.17,
      });
    }

    // background particle dust
    const PARTICLES = 42;
    const particles = [];
    for (let i = 0; i < PARTICLES; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 7,
        y: (Math.random() - 0.5) * 4,
        z: (Math.random() - 0.5) * 7,
        size: Math.random() * 1.1 + 0.25,
        twinkle: Math.random() * Math.PI * 2,
      });
    }

    // — projection —
    let W = 0, H = 0, cx = 0, cy = 0, R = 0;
    const tilt = (tiltDeg * Math.PI) / 180;
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);

    const project = (p, yaw) => {
      const x = p[0] * R, y = p[1] * R, z = p[2] * R;
      const cA = Math.cos(yaw), sA = Math.sin(yaw);
      const xr = x * cA - z * sA;
      const zr = x * sA + z * cA;
      const yt = y * cosT - zr * sinT;
      const zt = y * sinT + zr * cosT;
      const persp = (R * 4.2) / (R * 4.2 + zt);
      return [xr * persp + cx, -yt * persp + cy, zt];
    };

    // rotate point around y then x then local spin axis
    const rotVerts = (verts, yawLocal, pitchLocal, axisMix) => {
      const cy1 = Math.cos(yawLocal), sy1 = Math.sin(yawLocal);
      const cp1 = Math.cos(pitchLocal), sp1 = Math.sin(pitchLocal);
      return verts.map((v) => {
        // yaw
        let x = v[0] * cy1 - v[2] * sy1;
        let y = v[1];
        let z = v[0] * sy1 + v[2] * cy1;
        // pitch
        const yn = y * cp1 - z * sp1;
        const zn = y * sp1 + z * cp1;
        // axis mix — small roll so neighbouring forks aren't identical
        const roll = axisMix * 0.6;
        const cr = Math.cos(roll), sr = Math.sin(roll);
        const xn = x * cr - yn * sr;
        const ynn = x * sr + yn * cr;
        return [xn, ynn, zn];
      });
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
      cy = H / 2;
      // tight radius: core + fork-radius 2.05 + fork-scale 0.34 ≈ 2.4 of R
      R = Math.min(W * 0.135, H * 0.2);
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
    const pulseRgb = hexToRgb(pulseColor);
    const accentRgb = hexToRgb(accentColor);

    let t = 0;
    let rafId = 0, last = 0;
    const FRAME_MS = 32;

    const drawWire = (verts, edges, yawWorld, opts) => {
      const {
        yawLocal = 0, pitchLocal = 0, axisMix = 0,
        offset = [0, 0, 0], scale = 1,
        rgbTone = rgb, alpha = 1, bodyWidth = 1.2, glowWidth = 5, vertSize = 1.6,
        drawVerts = true,
      } = opts;
      const scaled = rotVerts(verts, yawLocal, pitchLocal, axisMix).map((v) =>
        [v[0] * scale + offset[0], v[1] * scale + offset[1], v[2] * scale + offset[2]]
      );
      const P = scaled.map((v) => project(v, yawWorld));

      ctx.lineCap = "round";

      // glow
      ctx.strokeStyle = `rgba(${rgbTone.r}, ${rgbTone.g}, ${rgbTone.b}, ${0.11 * alpha})`;
      ctx.lineWidth = glowWidth;
      for (let i = 0; i < edges.length; i++) {
        const a = P[edges[i][0]], b = P[edges[i][1]];
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
      }
      // crisp body
      ctx.strokeStyle = `rgba(${rgbTone.r}, ${rgbTone.g}, ${rgbTone.b}, ${0.82 * alpha})`;
      ctx.lineWidth = bodyWidth;
      for (let i = 0; i < edges.length; i++) {
        const a = P[edges[i][0]], b = P[edges[i][1]];
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
      }
      if (drawVerts) {
        ctx.fillStyle = `rgba(${rgbTone.r}, ${rgbTone.g}, ${rgbTone.b}, ${alpha})`;
        for (const p of P) {
          ctx.beginPath();
          ctx.arc(p[0], p[1], vertSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      return P;
    };

    const tick = (now) => {
      rafId = requestAnimationFrame(tick);
      if (!visible) return;
      if (now - last < FRAME_MS) return;
      last = now;
      t += speed;

      ctx.clearRect(0, 0, W, H);
      const yawWorld = t * 0.32;

      // — background dust —
      for (const p of particles) {
        const pp = project([p.x, p.y, p.z], yawWorld);
        const tw = 0.45 + 0.4 * Math.sin(t * 2.1 + p.twinkle);
        const depthA = Math.max(0.08, Math.min(1, (R * 4.2) / (R * 4.2 + pp[2])));
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.18 * tw * depthA})`;
        ctx.beginPath();
        ctx.arc(pp[0], pp[1], p.size * depthA, 0, Math.PI * 2);
        ctx.fill();
      }

      // — compute fork positions (world offsets + z for sort) —
      const forkMeta = forks.map((f, i) => {
        const a = f.baseAngle + t * 0.55;
        const ox = Math.cos(a) * f.radius;
        const oy = f.yOffset + Math.sin(a * 1.3 + i) * 0.18;
        const oz = Math.sin(a) * f.radius;
        const projected = project([ox, oy, oz], yawWorld);
        return { i, f, offset: [ox, oy, oz], projected, z: projected[2] };
      });

      const centerProj = project([0, 0, 0], yawWorld);

      // — paint connectors first (under everything) —
      // sorted back-to-front so foreground pulses draw on top
      const sortedByZ = [...forkMeta].sort((a, b) => b.z - a.z);
      for (const fm of sortedByZ) {
        const fp = fm.projected;
        // wide translucent glow line
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.09)`;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(centerProj[0], centerProj[1]);
        ctx.lineTo(fp[0], fp[1]);
        ctx.stroke();
        // crisp
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.42)`;
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(centerProj[0], centerProj[1]);
        ctx.lineTo(fp[0], fp[1]);
        ctx.stroke();

        // pulse travelling outward (center → fork)
        const pulsePhase = ((t * 1.7) + fm.i * 0.25) % 1;
        const px = centerProj[0] + (fp[0] - centerProj[0]) * pulsePhase;
        const py = centerProj[1] + (fp[1] - centerProj[1]) * pulsePhase;
        const fade = Math.sin(pulsePhase * Math.PI);
        ctx.fillStyle = `rgba(${pulseRgb.r}, ${pulseRgb.g}, ${pulseRgb.b}, ${0.24 * fade})`;
        ctx.beginPath();
        ctx.arc(px, py, 6 * fade, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${pulseRgb.r}, ${pulseRgb.g}, ${pulseRgb.b}, ${fade})`;
        ctx.beginPath();
        ctx.arc(px, py, 2 * fade, 0, Math.PI * 2);
        ctx.fill();
      }

      // — draw back-half forks —
      const behind = forkMeta.filter((fm) => fm.z >= 0).sort((a, b) => b.z - a.z);
      for (const fm of behind) {
        drawFork(fm, yawWorld);
      }

      // — OUTER DODECAHEDRON shell — snapshot boundary —
      drawWire(DODEC_VERTS, DODEC_EDGES, yawWorld, {
        yawLocal: -t * 0.8,
        pitchLocal: t * 0.4,
        scale: 1.42,
        rgbTone: accentRgb,
        alpha: 0.75,
        bodyWidth: 0.9,
        glowWidth: 4,
        vertSize: 1.3,
      });

      // — INNER ICOSAHEDRON — core —
      drawWire(ICOSA_VERTS, ICOSA_EDGES, yawWorld, {
        yawLocal: t * 1.6,
        pitchLocal: Math.sin(t * 0.8) * 0.45,
        scale: 0.72,
        rgbTone: rgb,
        alpha: 1,
        bodyWidth: 1.35,
        glowWidth: 6,
        vertSize: 1.8,
      });

      // — core diamond (bright punctum) —
      ctx.fillStyle = `rgba(${pulseRgb.r}, ${pulseRgb.g}, ${pulseRgb.b}, 0.28)`;
      ctx.beginPath();
      ctx.arc(centerProj[0], centerProj[1], 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(${pulseRgb.r}, ${pulseRgb.g}, ${pulseRgb.b}, 0.85)`;
      ctx.beginPath();
      ctx.arc(centerProj[0], centerProj[1], 3.2, 0, Math.PI * 2);
      ctx.fill();

      // — draw front-half forks (occlude core) —
      const front = forkMeta.filter((fm) => fm.z < 0).sort((a, b) => b.z - a.z);
      for (const fm of front) {
        drawFork(fm, yawWorld);
      }
    };

    const drawFork = (fm, yawWorld) => {
      const { i, f, offset, z } = fm;
      // depth-based alpha for subtle back-fade
      const depth = Math.max(0.55, Math.min(1, (R * 4.2) / (R * 4.2 + z)));
      const spin = t * f.spinSpeed + i;
      const pitch = Math.sin(t * 1.1 + i * 1.7) * 0.6;

      drawWire(TETRA_VERTS, TETRA_EDGES, yawWorld, {
        yawLocal: spin,
        pitchLocal: pitch,
        axisMix: f.spinAxis,
        offset,
        scale: f.scale,
        rgbTone: rgb,
        alpha: 0.88 * depth,
        bodyWidth: 1.1,
        glowWidth: 4.5,
        vertSize: 1.7,
      });

      // a tiny satellite octahedron trailing the tetra, at half scale
      const trailA = f.baseAngle + t * 0.55 - 0.35;
      const trailOff = [
        Math.cos(trailA) * (f.radius - 0.45),
        f.yOffset + Math.sin(trailA * 1.3 + i) * 0.18 + 0.08,
        Math.sin(trailA) * (f.radius - 0.45),
      ];
      drawWire(OCTA_VERTS, OCTA_EDGES, yawWorld, {
        yawLocal: spin * 1.4 + 0.6,
        pitchLocal: -pitch * 0.8,
        offset: trailOff,
        scale: f.scale * 0.48,
        rgbTone: accentRgb,
        alpha: 0.7 * depth,
        bodyWidth: 0.8,
        glowWidth: 3,
        vertSize: 1.2,
      });
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
    };
  }, [color, pulseColor, accentColor, speed, tiltDeg]);

  return (
    <div
      ref={wrapRef}
      style={{ width: "100%", aspectRatio: "16 / 10", position: "relative" }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}

// — shared octahedron geometry —
const OCTA_VERTS = [
  [1, 0, 0], [-1, 0, 0],
  [0, 1, 0], [0, -1, 0],
  [0, 0, 1], [0, 0, -1],
];
const OCTA_EDGES = [
  [0, 2], [0, 3], [0, 4], [0, 5],
  [1, 2], [1, 3], [1, 4], [1, 5],
  [2, 4], [2, 5], [3, 4], [3, 5],
];

// — helpers —
function hexToRgb(hex) {
  const m = hex.replace("#", "");
  const bigint = parseInt(
    m.length === 3 ? m.split("").map((c) => c + c).join("") : m,
    16
  );
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}
function normalize(verts) {
  return verts.map((v) => {
    const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return [v[0] / len, v[1] / len, v[2] / len];
  });
}
function edgesAtLength(verts, maxDist) {
  const out = [];
  for (let i = 0; i < verts.length; i++) {
    for (let j = i + 1; j < verts.length; j++) {
      const dx = verts[i][0] - verts[j][0];
      const dy = verts[i][1] - verts[j][1];
      const dz = verts[i][2] - verts[j][2];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d < maxDist) out.push([i, j]);
    }
  }
  return out;
}
