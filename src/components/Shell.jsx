import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Github, Linkedin, Mail, Menu, X, FileText, ArrowUpRight } from "lucide-react";
import site from "../content/site.json";
import Ambient from "./Ambient";
import Clock from "./Clock";
import MoshStrip from "./MoshStrip";

const NAV = [
  { code: "01", label: "index",   path: "/" },
  { code: "02", label: "work",    path: "/work" },
  { code: "03", label: "writing", path: "/writing" },
];

export default function Shell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Ambient />

      {/* ══ Top utility bar ══════════════════════════════════ */}
      <div
        className="mono"
        style={{
          position: "relative",
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
          padding: "8px 22px",
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--paper-dim)",
          borderBottom: "1px solid var(--hairline)",
          background: "rgba(7,7,10,0.9)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <span style={{ color: "var(--rust)" }}>NM-0426</span>
          <span style={{ opacity: 0.5 }}>/</span>
          <span>madison · wi</span>
          <span style={{ opacity: 0.5 }}>/</span>
          <span style={{ display: "inline-flex", gap: 7, alignItems: "center" }}>
            <span className="status-dot" /> live
          </span>
        </div>
        <div style={{ display: "none" }} className="util-mid">
          <span>subject : n.matteson</span>
        </div>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <Clock />
          <span style={{ opacity: 0.5 }}>/</span>
          <span>v5.0</span>
        </div>
      </div>

      {/* ══ Header ══════════════════════════════════════════ */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "rgba(7,7,10,0.78)",
          backdropFilter: "blur(12px) saturate(140%)",
          borderBottom: "1px solid var(--hairline-2)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 18,
            padding: "14px 22px",
            maxWidth: 1440,
            margin: "0 auto",
          }}
        >
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              textDecoration: "none",
              color: "var(--paper)",
            }}
          >
            <span
              style={{
                width: 22, height: 22,
                border: "1.5px solid var(--rust)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <span style={{ width: 10, height: 10, background: "var(--rust)" }} />
            </span>
            <span
              className="hed"
              style={{
                fontSize: 18,
                letterSpacing: "0.04em",
                lineHeight: 1,
              }}
            >
              NILS<span style={{ color: "var(--rust)" }}>.</span>MATTESON
            </span>
          </Link>

          <nav
            className="mono"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            {NAV.map((item) => {
              const active = item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="nav-link"
                  style={{
                    padding: "8px 14px",
                    textDecoration: "none",
                    color: active ? "var(--rust)" : "var(--paper-mid)",
                    display: "inline-flex",
                    gap: 10,
                    alignItems: "center",
                    borderBottom: active ? "1px solid var(--rust)" : "1px solid transparent",
                  }}
                >
                  <span style={{ color: "var(--paper-ghost)" }}>{item.code}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <a
              href={site.links.resume}
              target="_blank"
              rel="noreferrer"
              className="btn primary"
              style={{ marginLeft: 14, padding: "9px 15px" }}
            >
              <FileText style={{ width: 12, height: 12 }} />
              resume
            </a>
          </nav>

          <button
            aria-label="menu"
            onClick={() => setMobileOpen((v) => !v)}
            style={{
              display: "none",
              background: "transparent",
              border: "1px solid var(--hairline-3)",
              color: "var(--paper)",
              padding: 8,
            }}
            className="mobile-menu-btn"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* ══ Mobile sheet ══════════════════════════════════════ */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "var(--void)",
            padding: "84px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {NAV.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="hed"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 16,
                padding: "22px 0",
                borderBottom: "1px solid var(--hairline-2)",
                fontSize: 42,
                color: location.pathname === item.path ? "var(--rust)" : "var(--paper)",
                textDecoration: "none",
              }}
            >
              <span className="mono" style={{ fontSize: 11, letterSpacing: "0.2em", color: "var(--paper-dim)" }}>
                {item.code}
              </span>
              {item.label}
            </Link>
          ))}
          <a
            href={site.links.resume}
            target="_blank"
            rel="noreferrer"
            className="hed"
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              padding: "22px 0",
              borderBottom: "1px solid var(--hairline-2)",
              fontSize: 42,
              color: "var(--rust)",
              textDecoration: "none",
            }}
          >
            <span className="mono" style={{ fontSize: 11, letterSpacing: "0.2em", color: "var(--paper-dim)" }}>
              ↗
            </span>
            resume
          </a>
          <div style={{ marginTop: 30, display: "flex", gap: 16 }}>
            <a href={site.links.github} target="_blank" rel="noreferrer" style={{ color: "var(--paper-mid)" }}>
              <Github size={22} />
            </a>
            <a href={site.links.linkedin} target="_blank" rel="noreferrer" style={{ color: "var(--paper-mid)" }}>
              <Linkedin size={22} />
            </a>
            <a href={site.links.email} style={{ color: "var(--paper-mid)" }}>
              <Mail size={22} />
            </a>
          </div>
        </div>
      )}

      {/* ══ Content ══════════════════════════════════════════ */}
      <main style={{ position: "relative", zIndex: 10 }}>{children}</main>

      {/* ══ Footer ══════════════════════════════════════════ */}
      <footer
        style={{
          position: "relative",
          zIndex: 10,
          marginTop: 80,
          borderTop: "1px solid var(--hairline-2)",
          background: "var(--void)",
        }}
      >
        <MoshStrip length={160} speed={48} bursts={3} />

        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            padding: "56px 22px 32px",
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 26,
          }}
        >
          <div style={{ gridColumn: "span 6" }}>
            <div
              className="hed"
              style={{ fontSize: "clamp(56px, 10vw, 140px)", letterSpacing: "-0.01em", lineHeight: 0.85 }}
            >
              NILS<span style={{ color: "var(--rust)" }}>.</span>
            </div>
            <p
              className="serif"
              style={{ fontSize: 22, lineHeight: 1.35, marginTop: 16, color: "var(--paper-mid)", maxWidth: 480 }}
            >
              building at the edge of compute — open to conversations about GPU inference, distributed systems, and the things that break along the way.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" }}>
              <a href={site.links.email} className="btn primary">
                <Mail style={{ width: 12, height: 12 }} /> say hello
              </a>
              <a href={site.links.resume} target="_blank" rel="noreferrer" className="btn">
                <FileText style={{ width: 12, height: 12 }} /> resume
              </a>
            </div>
          </div>

          <div style={{ gridColumn: "span 3" }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>nav</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {NAV.map((n) => (
                <li key={n.path}>
                  <Link
                    to={n.path}
                    className="mono"
                    style={{ color: "var(--paper-mid)", textDecoration: "none", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}
                  >
                    <span style={{ color: "var(--paper-ghost)", marginRight: 10 }}>{n.code}</span>
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={site.links.thaw}
                  target="_blank"
                  rel="noreferrer"
                  className="mono"
                  style={{ color: "var(--rust)", textDecoration: "none", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  thaw.sh <ArrowUpRight size={12} />
                </a>
              </li>
            </ul>
          </div>

          <div style={{ gridColumn: "span 3" }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>elsewhere</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              <li>
                <a href={site.links.github} target="_blank" rel="noreferrer" className="mono" style={{ color: "var(--paper-mid)", textDecoration: "none", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", display: "inline-flex", gap: 8, alignItems: "center" }}>
                  <Github size={13} /> github
                </a>
              </li>
              <li>
                <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="mono" style={{ color: "var(--paper-mid)", textDecoration: "none", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", display: "inline-flex", gap: 8, alignItems: "center" }}>
                  <Linkedin size={13} /> linkedin
                </a>
              </li>
              <li>
                <a href={site.links.email} className="mono" style={{ color: "var(--paper-mid)", textDecoration: "none", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", display: "inline-flex", gap: 8, alignItems: "center" }}>
                  <Mail size={13} /> mail
                </a>
              </li>
            </ul>
            <p
              className="mono"
              style={{ marginTop: 24, color: "var(--paper-ghost)", fontSize: 9.5, letterSpacing: "0.22em", textTransform: "uppercase" }}
            >
              © {new Date().getFullYear()} — encoded in madison
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile responsive shim */}
      <style>{`
        @media (max-width: 820px) {
          header nav { display: none !important; }
          .mobile-menu-btn { display: inline-flex !important; }
          footer > div > div:nth-child(1) { grid-column: span 12 !important; }
          footer > div > div:nth-child(2),
          footer > div > div:nth-child(3) { grid-column: span 6 !important; }
        }
      `}</style>
    </div>
  );
}
