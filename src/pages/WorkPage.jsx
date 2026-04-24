import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Github, ExternalLink, ArrowUpRight, Download, ArrowLeft } from "lucide-react";
import site from "../content/site.json";
import Dossier from "../components/Dossier";
import WindowFrame from "../components/WindowFrame";
import MoshStrip from "../components/MoshStrip";
import ForkGraph from "../components/ForkGraph";
import ScrambleText from "../components/ScrambleText";

const STATUS_ORDER = ["All", "Active", "Shipped"];

export default function WorkPage() {
  const [filter, setFilter] = useState("All");

  const projects = useMemo(() => {
    if (filter === "All") return site.projects;
    return site.projects.filter((p) => p.status === filter);
  }, [filter]);

  const featured = site.projects.find((p) => p.featured) || site.projects[0];
  const rest = projects.filter((p) => p !== featured);

  return (
    <div>
      {/* ═══════════════ HEADER ═════════════════════════════ */}
      <section style={{ padding: "54px 22px 30px", position: "relative" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <Link
            to="/"
            className="mono"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "var(--paper-dim)",
              textDecoration: "none",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: 32,
            }}
          >
            <ArrowLeft size={13} /> back / index
          </Link>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 26, flexWrap: "wrap", marginBottom: 18 }}>
            <div className="big-idx" style={{ color: "var(--paper-ghost)" }}>02</div>
            <div>
              <div
                className="mono"
                style={{
                  fontSize: 10.5,
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  color: "var(--paper-dim)",
                  marginBottom: 12,
                  display: "inline-flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <span style={{ width: 22, height: 1, background: "var(--rust)" }} />
                / work · archive
              </div>
              <h1
                className="hed"
                style={{
                  fontSize: "clamp(64px, 12vw, 188px)",
                  letterSpacing: "-0.015em",
                  lineHeight: 0.82,
                  color: "var(--paper)",
                }}
              >
                <ScrambleText text="ARTIFACTS" duration={1300} />
                <span style={{ color: "var(--rust)" }}>.</span>
              </h1>
            </div>
          </div>

          <div
            className="holo-panel"
            style={{
              maxWidth: 720,
              marginTop: 26,
              padding: "20px 24px",
            }}
          >
            <p
              className="serif"
              style={{
                fontSize: "clamp(20px, 2.2vw, 28px)",
                lineHeight: 1.3,
                color: "var(--paper-mid)",
                margin: 0,
              }}
            >
              six systems, built to ship — distributed infrastructure, ML pipelines,
              weirder things. listed{" "}
              <span style={{ color: "var(--rust)" }}>newest first</span>.
            </p>
          </div>

          {/* status filter */}
          <div style={{ display: "flex", gap: 8, marginTop: 30, flexWrap: "wrap" }}>
            {STATUS_ORDER.map((s) => {
              const active = filter === s;
              return (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className="mono"
                  style={{
                    padding: "7px 14px",
                    border: active
                      ? "1px solid var(--rust)"
                      : "1px solid var(--hairline-3)",
                    background: active ? "var(--rust-soft)" : "#000",
                    color: active ? "var(--rust)" : "var(--paper-mid)",
                    fontSize: 10.5,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    borderRadius: 0,
                    cursor: "pointer",
                    boxShadow: active
                      ? "inset 0 0 22px rgba(198,247,39,0.12)"
                      : "inset 0 0 0 1px rgba(255,255,255,0.02)",
                  }}
                >
                  {s}{" "}
                  <span style={{ color: "var(--paper-ghost)", marginLeft: 6 }}>
                    {s === "All"
                      ? site.projects.length
                      : site.projects.filter((p) => p.status === s).length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <MoshStrip length={220} label="projects / archive" bursts={5} />

      {/* ═══════════════ FEATURED ═════════════════════════ */}
      {filter === "All" && featured && (
        <section style={{ padding: "56px 22px 26px" }}>
          <div style={{ maxWidth: 1440, margin: "0 auto" }}>
            <div
              className="mono"
              style={{
                fontSize: 10.5,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "var(--rust)",
                marginBottom: 14,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ width: 22, height: 1, background: "var(--rust)" }} />
              ▸ featured · primary vector
            </div>

            <WindowFrame
              title={`WORK / ${featured.title}.primary`}
              subtitle={`${featured.year} · ${featured.role}`}
              tint="rust"
            >
              <div className="feat-grid">
                <div style={{ padding: "30px 30px" }}>
                  <h2
                    className="hed"
                    style={{
                      fontSize: "clamp(64px, 9vw, 140px)",
                      letterSpacing: "-0.015em",
                      lineHeight: 0.82,
                      color: "var(--rust)",
                    }}
                  >
                    {featured.title}
                  </h2>
                  <p
                    className="serif"
                    style={{
                      fontSize: "clamp(20px, 2.1vw, 26px)",
                      color: "var(--paper)",
                      marginTop: 10,
                      marginBottom: 14,
                      lineHeight: 1.25,
                    }}
                  >
                    {featured.subtitle}
                  </p>
                  <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "var(--paper-mid)", maxWidth: 620, marginBottom: 18 }}>
                    {featured.description}
                  </p>
                  <div
                    className="mono"
                    style={{
                      padding: "12px 14px",
                      borderLeft: "2px solid var(--rust)",
                      background: "var(--rust-soft)",
                      fontSize: 12,
                      color: "var(--paper)",
                      marginBottom: 20,
                      maxWidth: 620,
                    }}
                  >
                    <span style={{ color: "var(--rust)" }}>→&nbsp;</span>
                    {featured.receipt}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 22 }}>
                    {featured.tech.map((t) => (
                      <span key={t} className="pill">{t}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {featured.links?.site && (
                      <a href={featured.links.site} target="_blank" rel="noreferrer" className="btn primary">
                        {featured.links.site.replace("https://", "")} <ArrowUpRight size={12} />
                      </a>
                    )}
                    {featured.links?.repo && (
                      <a href={featured.links.repo} target="_blank" rel="noreferrer" className="btn">
                        <Github size={12} /> source
                      </a>
                    )}
                    {featured.links?.pypi && (
                      <a href={featured.links.pypi} target="_blank" rel="noreferrer" className="btn amber">
                        <Download size={12} /> pypi
                      </a>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    borderLeft: "1px solid var(--hairline-2)",
                    background:
                      "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(198,247,39,0.22), transparent 72%), #000",
                    padding: "30px 26px",
                  }}
                >
                  <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--paper-dim)", textTransform: "uppercase", marginBottom: 12 }}>
                    <span style={{ color: "var(--rust)" }}>//</span> the primitive
                  </div>
                  <ForkGraph color="#C6F727" accentColor="#FF2EA0" />
                </div>
              </div>
            </WindowFrame>
          </div>

          <style>{`
            .feat-grid {
              display: grid;
              grid-template-columns: 1.55fr 1fr;
            }
            @media (max-width: 900px) {
              .feat-grid { grid-template-columns: 1fr; }
              .feat-grid > div:nth-child(2) { border-left: none !important; border-top: 1px solid var(--hairline-2); }
            }
          `}</style>
        </section>
      )}

      {/* ═══════════════ ALL PROJECTS GRID ═════════════════════ */}
      <section style={{ padding: "40px 22px 90px" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <div
            className="mono"
            style={{
              fontSize: 10.5,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "var(--paper)",
              marginBottom: 22,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 14px",
              background: "#000",
              border: "1px solid rgba(255, 46, 160, 0.45)",
              boxShadow: "inset 0 0 22px rgba(255,46,160,0.14)",
            }}
          >
            <span style={{ width: 22, height: 1, background: "var(--amber)" }} />
            / other artifacts · <span style={{ color: "var(--amber)" }}>{rest.length}</span>
          </div>

          <div className="work-grid">
            {(filter === "All" ? rest : projects).map((p, i) => {
              const accent = ["amber", "blue", "rust"][i % 3];
              const col = accent === "rust" ? "var(--rust)" : accent === "amber" ? "var(--amber)" : "var(--accent-3)";
              return (
                <Dossier
                  key={p.title}
                  accent={accent}
                  stamp={`N.${String(i + 2).padStart(2, "0")}`}
                  style={{ padding: "26px 26px 22px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: 10,
                    }}
                  >
                    <div
                      className="mono"
                      style={{
                        fontSize: 10.5,
                        letterSpacing: "0.16em",
                        color: "var(--paper-dim)",
                        textTransform: "uppercase",
                      }}
                    >
                      {p.year} · {p.role}
                    </div>
                    <span
                      className="mono"
                      style={{
                        fontSize: 10,
                        color: p.status === "Active" ? "var(--rust)" : "var(--paper-dim)",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                      }}
                    >
                      {p.status === "Active" ? "● active" : "○ shipped"}
                    </span>
                  </div>

                  <h3
                    className="hed"
                    style={{
                      fontSize: "clamp(36px, 3.6vw, 54px)",
                      letterSpacing: 0,
                      lineHeight: 0.9,
                      color: "var(--paper)",
                    }}
                  >
                    {p.title}
                  </h3>

                  <p
                    className="serif"
                    style={{
                      fontSize: 18,
                      lineHeight: 1.3,
                      color: col,
                      marginTop: 6,
                      marginBottom: 12,
                    }}
                  >
                    {p.subtitle}
                  </p>

                  <p
                    style={{
                      fontSize: 13,
                      lineHeight: 1.65,
                      color: "var(--paper-mid)",
                      marginBottom: 14,
                    }}
                  >
                    {p.description}
                  </p>

                  {p.receipt && (
                    <div
                      className="mono"
                      style={{
                        padding: "8px 10px",
                        borderLeft: `2px solid ${col}`,
                        background: accent === "rust" ? "var(--rust-soft)" : accent === "amber" ? "var(--amber-soft)" : "var(--accent-3-soft)",
                        fontSize: 10.5,
                        color: "var(--paper)",
                        marginBottom: 14,
                      }}
                    >
                      <span style={{ color: col }}>→ </span>
                      {p.receipt}
                    </div>
                  )}

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
                    {p.tech.map((t) => (
                      <span key={t} className="pill">{t}</span>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    {p.links?.repo && (
                      <a
                        href={p.links.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="mono"
                        style={{
                          color: "var(--paper-mid)",
                          textDecoration: "none",
                          fontSize: 11,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        <Github size={11} /> source
                      </a>
                    )}
                    {p.links?.demo && (
                      <a
                        href={p.links.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="mono"
                        style={{
                          color: "var(--paper-mid)",
                          textDecoration: "none",
                          fontSize: 11,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        <ExternalLink size={11} /> live
                      </a>
                    )}
                    {p.links?.site && (
                      <a
                        href={p.links.site}
                        target="_blank"
                        rel="noreferrer"
                        className="mono"
                        style={{
                          color: col,
                          textDecoration: "none",
                          fontSize: 11,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        <ArrowUpRight size={11} /> site
                      </a>
                    )}
                    {p.links?.pypi && (
                      <a
                        href={p.links.pypi}
                        target="_blank"
                        rel="noreferrer"
                        className="mono"
                        style={{
                          color: col,
                          textDecoration: "none",
                          fontSize: 11,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        <Download size={11} /> pypi
                      </a>
                    )}
                    {p.links?.download && (
                      <a
                        href={p.links.download}
                        target="_blank"
                        rel="noreferrer"
                        className="mono"
                        style={{
                          color: col,
                          textDecoration: "none",
                          fontSize: 11,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        <Download size={11} /> build
                      </a>
                    )}
                  </div>
                </Dossier>
              );
            })}
          </div>
        </div>
        <style>{`
          .work-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
          @media (max-width: 1100px) {
            .work-grid { grid-template-columns: repeat(2, 1fr); }
          }
          @media (max-width: 680px) {
            .work-grid { grid-template-columns: 1fr; }
          }
        `}</style>
      </section>
    </div>
  );
}
