import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Github, ExternalLink, Calendar, Clock } from "lucide-react";
import blogPosts from "../data/blogPosts";
import Dossier from "../components/Dossier";
import MoshStrip from "../components/MoshStrip";
import ScrambleText from "../components/ScrambleText";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function WritingPage() {
  const posts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const [lead, ...rest] = posts;

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
            <div className="big-idx">03</div>
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
                <span style={{ width: 22, height: 1, background: "var(--amber)" }} />
                / writing · field notes
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
                <ScrambleText text="DISPATCH" duration={1300} />
                <span style={{ color: "var(--amber)" }}>.</span>
              </h1>
            </div>
          </div>

          <div
            className="holo-panel"
            data-accent="amber"
            style={{
              maxWidth: 760,
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
              build logs from{" "}
              <span style={{ color: "var(--amber)" }}>bugs i didn't see coming</span> — mostly about
              ML infrastructure, GPU kernels, distributed systems. longer-form than the commits.
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 30, flexWrap: "wrap" }}>
            <span className="chip amber">
              <span className="dot" /> {posts.length} posts
            </span>
            <span className="chip ghost">long form</span>
            <span className="chip ghost">ml · systems · kernels</span>
          </div>
        </div>
      </section>

      <MoshStrip length={220} label="writing / index" bursts={5} />

      {/* ═══════════════ LEAD POST ═════════════════════════ */}
      {lead && (
        <section style={{ padding: "52px 22px 30px" }}>
          <div style={{ maxWidth: 1440, margin: "0 auto" }}>
            <div
              className="mono"
              style={{
                fontSize: 10.5,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "var(--rust)",
                marginBottom: 16,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ width: 22, height: 1, background: "var(--rust)" }} />
              ▸ latest · {formatDate(lead.date)}
            </div>

            <Dossier accent="rust" stamp={`N.01 · LATEST`} style={{ padding: "0" }}>
              <div className="lead-grid">
                <div style={{ padding: "34px 32px" }}>
                  <div
                    className="mono"
                    style={{
                      fontSize: 10.5,
                      letterSpacing: "0.18em",
                      color: "var(--paper-dim)",
                      textTransform: "uppercase",
                      marginBottom: 16,
                      display: "flex",
                      gap: 18,
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                      <Calendar size={11} /> {formatDate(lead.date)}
                    </span>
                    <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                      <Clock size={11} /> {lead.readTime}
                    </span>
                  </div>

                  <Link
                    to={`/writing/${lead.slug}`}
                    className="hed"
                    style={{
                      display: "block",
                      fontSize: "clamp(44px, 5.4vw, 76px)",
                      letterSpacing: "-0.01em",
                      lineHeight: 0.92,
                      color: "var(--paper)",
                      textDecoration: "none",
                      marginBottom: 16,
                    }}
                  >
                    {lead.title}
                  </Link>
                  <p
                    className="serif"
                    style={{
                      fontSize: "clamp(20px, 2.2vw, 28px)",
                      lineHeight: 1.28,
                      color: "var(--rust)",
                      marginBottom: 20,
                      maxWidth: 780,
                    }}
                  >
                    {lead.subtitle}
                  </p>
                  <p
                    style={{
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: "var(--paper-mid)",
                      marginBottom: 22,
                      maxWidth: 740,
                    }}
                  >
                    {lead.summary}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 24 }}>
                    {lead.tags.slice(0, 6).map((t) => (
                      <span key={t} className="pill">{t}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Link to={`/writing/${lead.slug}`} className="btn primary">
                      read article <ArrowUpRight size={12} />
                    </Link>
                    {lead.github && (
                      <a href={lead.github} target="_blank" rel="noreferrer" className="btn">
                        <Github size={12} /> source
                      </a>
                    )}
                    {lead.demo && (
                      <a href={lead.demo} target="_blank" rel="noreferrer" className="btn amber">
                        <ExternalLink size={12} /> demo
                      </a>
                    )}
                  </div>
                </div>

                {/* right — index card look */}
                <div
                  style={{
                    borderLeft: "1px solid var(--hairline-2)",
                    background: "var(--void-2)",
                    padding: "34px 28px",
                    position: "relative",
                  }}
                >
                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.22em",
                      color: "var(--paper-dim)",
                      textTransform: "uppercase",
                      marginBottom: 14,
                    }}
                  >
                    // article / meta
                  </div>
                  <div className="field">
                    <span className="field-key">slug</span>
                    <span className="field-val mono" style={{ fontSize: 12 }}>{lead.slug}</span>
                  </div>
                  <div className="field">
                    <span className="field-key">date</span>
                    <span className="field-val">{formatDate(lead.date)}</span>
                  </div>
                  <div className="field">
                    <span className="field-key">length</span>
                    <span className="field-val amber">{lead.readTime}</span>
                  </div>
                  <div className="field">
                    <span className="field-key">tags</span>
                    <span className="field-val mono" style={{ fontSize: 11.5 }}>
                      {lead.tags.length} topics
                    </span>
                  </div>
                  <div className="field" style={{ borderBottom: "none" }}>
                    <span className="field-key">status</span>
                    <span className="field-val rust">▶ published</span>
                  </div>
                </div>
              </div>
            </Dossier>
          </div>
          <style>{`
            .lead-grid {
              display: grid;
              grid-template-columns: 1.8fr 1fr;
            }
            @media (max-width: 900px) {
              .lead-grid { grid-template-columns: 1fr; }
              .lead-grid > div:nth-child(2) { border-left: none !important; border-top: 1px solid var(--hairline-2); }
            }
          `}</style>
        </section>
      )}

      {/* ═══════════════ ARCHIVE ═════════════════════════ */}
      <section style={{ padding: "32px 22px 90px" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <div
            className="mono"
            style={{
              fontSize: 10.5,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "var(--paper-dim)",
              marginBottom: 22,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ width: 22, height: 1, background: "var(--amber)" }} />
            / archive · {rest.length}
          </div>

          <div className="archive-list">
            {rest.map((p, i) => (
              <Link
                key={p.slug}
                to={`/writing/${p.slug}`}
                className="archive-row"
              >
                <div className="archive-idx mono">
                  N.{String(i + 2).padStart(2, "0")}
                </div>

                <div className="archive-main">
                  <div
                    className="mono"
                    style={{
                      fontSize: 10.5,
                      letterSpacing: "0.18em",
                      color: "var(--paper-dim)",
                      textTransform: "uppercase",
                      marginBottom: 8,
                      display: "flex",
                      gap: 14,
                      flexWrap: "wrap",
                    }}
                  >
                    <span>{formatDate(p.date)}</span>
                    <span style={{ color: "var(--paper-ghost)" }}>/</span>
                    <span>{p.readTime}</span>
                  </div>
                  <h3
                    className="hed"
                    style={{
                      fontSize: "clamp(30px, 3.6vw, 50px)",
                      letterSpacing: 0,
                      lineHeight: 0.95,
                      color: "var(--paper)",
                      marginBottom: 8,
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    className="serif"
                    style={{
                      fontSize: "clamp(16px, 1.6vw, 20px)",
                      lineHeight: 1.32,
                      color: i % 2 === 0 ? "var(--amber)" : "var(--rust)",
                      marginBottom: 10,
                    }}
                  >
                    {p.subtitle}
                  </p>
                  <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "var(--paper-mid)", marginBottom: 12, maxWidth: 760 }}>
                    {p.summary}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {p.tags.slice(0, 5).map((t) => (
                      <span key={t} className="pill">{t}</span>
                    ))}
                  </div>
                </div>

                <div className="archive-cta">
                  <span className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--paper-dim)", textTransform: "uppercase" }}>
                    read
                  </span>
                  <ArrowUpRight size={28} strokeWidth={1.4} style={{ color: "var(--paper-mid)" }} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <style>{`
          .archive-list {
            display: flex;
            flex-direction: column;
            background: #000;
            border-top: 1px solid var(--hairline-2);
            border-bottom: 1px solid var(--hairline-2);
          }
          .archive-row {
            display: grid;
            grid-template-columns: 80px 1fr auto;
            gap: 22px;
            align-items: flex-start;
            padding: 30px 24px;
            border-bottom: 1px solid var(--hairline-2);
            text-decoration: none;
            color: inherit;
            transition: background 0.2s var(--ease), padding-left 0.2s var(--ease);
            position: relative;
          }
          .archive-row:last-child { border-bottom: none; }
          .archive-row::before {
            content: "";
            position: absolute;
            left: 0; top: 0; bottom: 0;
            width: 0;
            background: var(--rust);
            transition: width 0.25s var(--ease);
          }
          .archive-row:hover {
            background: rgba(236,229,215,0.018);
            padding-left: 24px;
          }
          .archive-row:hover::before { width: 3px; }
          .archive-row:hover .archive-cta svg { color: var(--rust) !important; transform: translate(3px, -3px); }
          .archive-row:hover .hed { color: var(--rust) !important; }

          .archive-idx {
            font-size: 11px;
            letter-spacing: 0.22em;
            color: var(--paper-ghost);
            padding-top: 4px;
          }
          .archive-cta {
            display: inline-flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 4px;
            padding-top: 4px;
          }
          .archive-cta svg { transition: transform 0.25s var(--ease), color 0.25s var(--ease); }
          @media (max-width: 720px) {
            .archive-row { grid-template-columns: 1fr auto; gap: 14px; padding: 22px 4px; }
            .archive-idx { display: none; }
          }
        `}</style>
      </section>
    </div>
  );
}
