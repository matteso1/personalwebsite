import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listAll, isFsConfigured } from "../lib/fs";

/**
 * /fs/graph — Obsidian-style file graph.
 * Authors are big nodes; files orbit them. Clicking a node deep-links into the shell.
 *
 * Tiny hand-rolled force simulation:
 *   - charge:  pairwise inverse-square repulsion
 *   - spring:  Hooke attraction on each edge
 *   - center:  weak pull toward (0,0) so nothing drifts off-screen
 *   - drag:    velocity damping
 */

function pickColor(seed) {
  // deterministic phosphor-leaning hue per author
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  // bias toward green/cyan/yellow band
  const hue = 80 + (h % 140); // 80..220 → green→cyan→blue
  return `hsl(${hue}, 60%, 62%)`;
}

export default function FsGraphPage() {
  const nav = useNavigate();
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const stateRef = useRef(null);
  const [hover, setHover] = useState(null); // node (for tooltip rendering only)
  const [selected, setSelected] = useState(null);
  const hoverRef = useRef(null);
  const selectedRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [err, setErr] = useState("");
  const [loaded, setLoaded] = useState(false);

  // load index
  useEffect(() => {
    if (!isFsConfigured()) { setErr("filesystem offline"); setLoaded(true); return; }
    (async () => {
      try {
        const all = await listAll({ force: true });
        setFiles(all);
      } catch (e) {
        setErr(e.message || String(e));
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // build graph
  const graph = useMemo(() => {
    if (!files.length) return { nodes: [], edges: [] };
    const nodes = [];
    const edges = [];
    const id = (s) => s;

    // root
    nodes.push({ id: "/", label: "/", kind: "root", r: 18 });

    // segment-level dirs
    const dirs = new Set();
    for (const f of files) {
      const parts = f.path.split("/").filter(Boolean);
      let acc = "";
      for (let i = 0; i < parts.length - 1; i++) {
        acc += "/" + parts[i];
        dirs.add(acc);
      }
    }
    for (const d of dirs) {
      const parent = d.slice(0, d.lastIndexOf("/")) || "/";
      const handle = d.startsWith("/home/") && d.split("/").length === 3 ? d.split("/")[2] : null;
      nodes.push({
        id: d,
        label: d.split("/").pop(),
        kind: handle ? "author" : "dir",
        r: handle ? 12 : 8,
        color: handle ? pickColor(handle) : undefined,
      });
      edges.push({ a: parent, b: d });
    }

    // files
    for (const f of files) {
      const parent = f.path.slice(0, f.path.lastIndexOf("/")) || "/";
      nodes.push({
        id: f.path,
        label: f.path.split("/").pop(),
        kind: "file",
        author: f.author,
        created_at: f.created_at,
        r: 5,
        color: pickColor(f.author),
      });
      edges.push({ a: parent, b: f.path });
    }

    return { nodes, edges };
  }, [files]);

  // physics + draw
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");

    // initial scatter
    const positions = new Map();
    for (const n of graph.nodes) {
      const a = Math.random() * Math.PI * 2;
      const r = 40 + Math.random() * 220;
      positions.set(n.id, {
        x: Math.cos(a) * r,
        y: Math.sin(a) * r,
        vx: 0, vy: 0,
        node: n,
      });
    }
    if (positions.has("/")) Object.assign(positions.get("/"), { x: 0, y: 0 });

    const adj = new Map();
    for (const e of graph.edges) {
      if (!adj.has(e.a)) adj.set(e.a, []);
      if (!adj.has(e.b)) adj.set(e.b, []);
      adj.get(e.a).push(e.b);
      adj.get(e.b).push(e.a);
    }

    let running = true;
    let camX = 0, camY = 0, zoom = 1;
    let dragging = null;        // node currently being dragged
    let downHit = null;         // node hit on pointerdown (for click vs drag detection)
    let downAt = { x: 0, y: 0 };
    let didDrag = false;
    let panStart = null;
    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const screenToWorld = (sx, sy) => {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      return { x: (sx - rect.left - cx) / zoom + camX, y: (sy - rect.top - cy) / zoom + camY };
    };

    const hitTest = (sx, sy) => {
      const w = screenToWorld(sx, sy);
      let best = null, bestDist = Infinity;
      for (const p of positions.values()) {
        const dx = p.x - w.x, dy = p.y - w.y;
        const d = Math.hypot(dx, dy);
        if (d < p.node.r + 6 / zoom && d < bestDist) { bestDist = d; best = p; }
      }
      return best;
    };

    // events
    const CLICK_SLOP = 5;
    const onPointerDown = (ev) => {
      ev.preventDefault();
      downAt = { x: ev.clientX, y: ev.clientY };
      didDrag = false;
      const hit = hitTest(ev.clientX, ev.clientY);
      downHit = hit;
      if (!hit) panStart = { camX, camY, sx: ev.clientX, sy: ev.clientY };
      try { canvas.setPointerCapture?.(ev.pointerId); } catch {}
    };
    const onPointerMove = (ev) => {
      if (downHit || panStart) {
        const dx = ev.clientX - downAt.x, dy = ev.clientY - downAt.y;
        if (!didDrag && Math.hypot(dx, dy) > CLICK_SLOP) {
          didDrag = true;
          if (downHit) dragging = downHit;
        }
      }
      if (dragging) {
        const w = screenToWorld(ev.clientX, ev.clientY);
        dragging.x = w.x; dragging.y = w.y; dragging.vx = 0; dragging.vy = 0;
      } else if (panStart) {
        camX = panStart.camX - (ev.clientX - panStart.sx) / zoom;
        camY = panStart.camY - (ev.clientY - panStart.sy) / zoom;
      } else {
        const hit = hitTest(ev.clientX, ev.clientY);
        const node = hit ? hit.node : null;
        if (hoverRef.current?.id !== node?.id) {
          hoverRef.current = node;
          setHover(node);            // for tooltip — does NOT re-run this effect
        }
        canvas.style.cursor = hit ? "pointer" : "grab";
      }
    };
    const onPointerUp = (ev) => {
      try { canvas.releasePointerCapture?.(ev.pointerId); } catch {}
      const wasClick = downHit && !didDrag;
      const clicked = downHit;
      dragging = null;
      panStart = null;
      downHit = null;
      didDrag = false;
      if (wasClick) onNodeClick(clicked.node);
    };
    const onWheel = (ev) => {
      ev.preventDefault();
      const factor = Math.exp(-ev.deltaY * 0.0015);
      const w = screenToWorld(ev.clientX, ev.clientY);
      zoom *= factor;
      zoom = Math.max(0.25, Math.min(zoom, 4));
      const w2 = screenToWorld(ev.clientX, ev.clientY);
      camX += w.x - w2.x; camY += w.y - w2.y;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    // ── physics step ───────────────────────────────────────
    const REPULSION = 1800;
    const SPRING_K = 0.04;
    const SPRING_LEN = 70;
    const CENTER_K = 0.005;
    const DAMP = 0.86;

    const step = () => {
      const arr = [...positions.values()];
      // repulsion (O(n²) — fine for our scale)
      for (let i = 0; i < arr.length; i++) {
        const a = arr[i];
        for (let j = i + 1; j < arr.length; j++) {
          const b = arr[j];
          let dx = a.x - b.x, dy = a.y - b.y;
          let d2 = dx * dx + dy * dy;
          if (d2 < 0.01) { d2 = 0.01; dx = (Math.random() - 0.5); dy = (Math.random() - 0.5); }
          const f = REPULSION / d2;
          const d = Math.sqrt(d2);
          const fx = (dx / d) * f, fy = (dy / d) * f;
          a.vx += fx; a.vy += fy;
          b.vx -= fx; b.vy -= fy;
        }
      }
      // springs
      for (const e of graph.edges) {
        const a = positions.get(e.a), b = positions.get(e.b);
        if (!a || !b) continue;
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 0.001;
        const f = SPRING_K * (d - SPRING_LEN);
        a.vx += (dx / d) * f; a.vy += (dy / d) * f;
        b.vx -= (dx / d) * f; b.vy -= (dy / d) * f;
      }
      // center pull
      for (const p of arr) {
        p.vx += -p.x * CENTER_K;
        p.vy += -p.y * CENTER_K;
      }
      // integrate
      for (const p of arr) {
        if (p === dragging) continue;
        p.vx *= DAMP; p.vy *= DAMP;
        p.x += p.vx; p.y += p.vy;
      }
      // pin root
      const root = positions.get("/"); if (root) { root.x = 0; root.y = 0; root.vx = 0; root.vy = 0; }
    };

    // ── draw ───────────────────────────────────────────────
    const draw = () => {
      const rect = wrap.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      // bg
      const grd = ctx.createRadialGradient(rect.width / 2, rect.height / 2, 0, rect.width / 2, rect.height / 2, Math.max(rect.width, rect.height) / 1.4);
      grd.addColorStop(0, "rgba(95,209,147,0.04)");
      grd.addColorStop(1, "rgba(6,8,7,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, rect.width, rect.height);

      ctx.save();
      ctx.translate(rect.width / 2, rect.height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-camX, -camY);

      // focus subgraph (Obsidian-style): focal node + neighbors stay bright,
      // everything else dims. read via refs so hover changes don't re-run the effect.
      const hot = hoverRef.current?.id || selectedRef.current?.id;
      const focalSet = new Set();
      if (hot) {
        focalSet.add(hot);
        for (const nb of (adj.get(hot) || [])) focalSet.add(nb);
      }

      // edges — per-edge style based on focal proximity
      for (const e of graph.edges) {
        const a = positions.get(e.a), b = positions.get(e.b);
        if (!a || !b) continue;
        const isHotEdge = hot && focalSet.has(e.a) && focalSet.has(e.b);
        if (hot && !isHotEdge) {
          ctx.strokeStyle = "rgba(214,216,200,0.05)";
          ctx.lineWidth = 1 / zoom;
        } else if (isHotEdge) {
          ctx.strokeStyle = "rgba(95,209,147,0.6)";
          ctx.lineWidth = 1.5 / zoom;
        } else {
          ctx.strokeStyle = "rgba(214,216,200,0.13)";
          ctx.lineWidth = 1 / zoom;
        }
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // pulse halo around the focal node
      if (hot) {
        const fp = positions.get(hot);
        if (fp) {
          const t = (Date.now() % 1800) / 1800;
          const pulseR = fp.node.r + 6 + Math.sin(t * Math.PI * 2) * 3;
          ctx.strokeStyle = "rgba(95,209,147,0.32)";
          ctx.lineWidth = 1.2 / zoom;
          ctx.beginPath();
          ctx.arc(fp.x, fp.y, pulseR, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // nodes
      for (const p of positions.values()) {
        const n = p.node;
        const isHot = n.id === hot;
        const inFocus = !hot || focalSet.has(n.id);
        const r = n.r * (isHot ? 1.35 : 1);
        const fill = n.kind === "root" ? "#d4b462"
          : n.kind === "author" ? (n.color || "#5fd193")
          : n.kind === "file" ? (n.color || "#6cc1d9")
          : "#8a9088";

        ctx.globalAlpha = inFocus ? 1 : 0.22;
        ctx.shadowColor = fill;
        ctx.shadowBlur = isHot ? 22 : (inFocus ? 8 : 0);
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // root renders its glyph centered inside the disc — keeps the label
        // from hanging off the bottom looking like a stray tick mark.
        if (n.kind === "root") {
          ctx.fillStyle = "rgba(6,8,7,0.9)";
          ctx.font = `${14 / zoom}px 'JetBrains Mono', ui-monospace, monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("/", p.x, p.y);
        } else if (n.kind === "author" || isHot) {
          ctx.fillStyle = isHot ? "#d6d8c8" : "rgba(214,216,200,0.78)";
          ctx.font = `${(n.kind === "file" ? 11 : 12) / zoom}px 'JetBrains Mono', ui-monospace, monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillText(n.label, p.x, p.y + r + 4);
        }
        ctx.globalAlpha = 1;
      }

      ctx.restore();
    };

    let raf = 0;
    const loop = () => {
      if (!running) return;
      if (!document.hidden) {
        step();
        draw();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // hold a stable handle for cleanup
    stateRef.current = { positions, adj };

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph]);

  const onNodeClick = (node) => {
    selectedRef.current = node;
    setSelected(node);
    if (node.kind === "file") {
      nav("/fs#" + encodeURIComponent(node.id));
    } else if (node.kind === "author" || node.kind === "dir" || node.kind === "root") {
      nav("/fs#" + encodeURIComponent(node.id));
    }
  };

  return (
    <div className="q-page">
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
        <h1 className="q-name" style={{ marginBottom: 0 }}>
          /fs/graph<em>.</em>
        </h1>
        <a href="#" onClick={(e) => { e.preventDefault(); nav("/fs"); }} style={{ fontSize: 12, color: "var(--c-cyan)" }}>← back to shell</a>
      </div>
      <p className="q-tagline" style={{ marginBottom: 14, maxWidth: "60ch" }}>
        Every file in the guestbook, plotted as a graph. Drag nodes, scroll to zoom, click to jump to that path.
      </p>

      {!loaded ? (
        <div className="empty">…</div>
      ) : err ? (
        <div className="empty" style={{ color: "var(--c-red)" }}>{err}</div>
      ) : !files.length ? (
        <div className="empty">no files yet — write one with <code>vim /home/you/hello.txt</code></div>
      ) : (
        <div className="q-graph-wrap" ref={wrapRef}>
          <canvas ref={canvasRef} className="q-graph-canvas" />
          <div className="q-graph-legend">
            <span><span className="dot root" /> root</span>
            <span><span className="dot author" /> author</span>
            <span><span className="dot file" /> file</span>
            <span style={{ marginLeft: "auto", color: "var(--ink-dim)" }}>
              {files.length} files · {new Set(files.map((f) => f.author)).size} authors
            </span>
          </div>
          {hover && (
            <div className="q-graph-tooltip">
              <div style={{ color: "var(--c-cyan)" }}>{hover.id}</div>
              {hover.author && <div className="ls-meta">{hover.author}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
