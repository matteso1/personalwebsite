import React from "react";
import { Link } from "react-router-dom";
import {
  Github, ArrowUpRight, Mail, Download, MapPin, ArrowRight,
} from "lucide-react";
import site from "../content/site.json";
import Dossier from "../components/Dossier";
import WindowFrame from "../components/WindowFrame";
import AsciiCanvas from "../components/AsciiCanvas";
import ForkGraph from "../components/ForkGraph";
import CardTilt from "../components/CardTilt";
import ProjectBand from "../components/ProjectBand";
import MoshStrip from "../components/MoshStrip";
import ScrambleText from "../components/ScrambleText";
import {
  DOSSIER_PORTRAIT, SYS_PANEL, CONTACT_BANNER,
} from "../lib/ascii";

export default function HomePage() {
  const [featured, ...rest] = site.projects;

  return (
    <div>
      {/* ═══════════════ HERO ══════════════════════════════════ */}
      <section style={{ position: "relative", padding: "54px 22px 40px" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          {/* top chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
            <span className="chip rust">
              <span className="dot" /> available · summer '27 intern
            </span>
            <span className="chip blue">
              <MapPin size={12} /> san francisco · bay area
            </span>
            <span className="chip ghost">swedish-american</span>
            <span className="chip amber">open to · sde / mle</span>
          </div>

          <div className="hero-grid">
            {/* LEFT — huge name + serif */}
            <div>
              <div
                className="mono"
                style={{
                  fontSize: 10.5,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--paper-dim)",
                  marginBottom: 10,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ color: "var(--rust)" }}>01</span>
                <span style={{ width: 20, height: 1, background: "var(--paper-dim)" }} />
                subject · cs / ds / swe
              </div>

              <h1
                className="hed"
                style={{
                  fontSize: "clamp(88px, 17vw, 260px)",
                  letterSpacing: "-0.015em",
                  lineHeight: 0.8,
                  color: "var(--paper)",
                }}
              >
                <ScrambleText text="NILS" duration={1100} />
                <span style={{ color: "var(--rust)" }}>.</span>
                <br />
                <span
                  style={{
                    WebkitTextStroke: "2px var(--paper)",
                    color: "transparent",
                    display: "inline-block",
                  }}
                >
                  <ScrambleText text="MATTESON" duration={1400} />
                </span>
              </h1>

              <div
                className="holo-panel"
                style={{
                  maxWidth: 680,
                  marginTop: 36,
                  padding: "22px 26px 24px",
                }}
              >
                {/* corner ticks — keeps the ascii-dossier vocabulary */}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: -1,
                    left: -1,
                    width: 12,
                    height: 12,
                    borderTop: "1px solid var(--accent)",
                    borderLeft: "1px solid var(--accent)",
                    zIndex: 2,
                  }}
                />
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    bottom: -1,
                    right: -1,
                    width: 12,
                    height: 12,
                    borderBottom: "1px solid var(--accent-2)",
                    borderRight: "1px solid var(--accent-2)",
                    zIndex: 2,
                  }}
                />
                <div
                  className="mono"
                  style={{
                    fontSize: 9.5,
                    letterSpacing: "0.28em",
                    color: "var(--paper-dim)",
                    textTransform: "uppercase",
                    marginBottom: 10,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      background: "var(--accent)",
                      boxShadow: "0 0 8px var(--accent)",
                    }}
                  />
                  transmission / 0001
                </div>
                <p
                  className="serif"
                  style={{
                    fontSize: "clamp(24px, 3vw, 38px)",
                    lineHeight: 1.18,
                    color: "var(--paper)",
                    margin: 0,
                  }}
                >
                  i build{" "}
                  <span
                    style={{
                      color: "var(--accent)",
                      textShadow: "0 0 14px rgba(198,247,39,0.55)",
                    }}
                  >
                    systems
                  </span>{" "}
                  that shouldn't work, then i break them to figure out{" "}
                  <span
                    style={{
                      color: "var(--accent-2)",
                      textShadow: "0 0 14px rgba(255,46,160,0.55)",
                    }}
                  >
                    why.
                  </span>
                </p>

                <div
                  style={{
                    height: 1,
                    background:
                      "linear-gradient(90deg, var(--accent), transparent 70%)",
                    margin: "18px 0 16px",
                    opacity: 0.55,
                  }}
                />

                <p
                  style={{
                    fontSize: 14.5,
                    lineHeight: 1.7,
                    color: "var(--paper-mid)",
                    margin: 0,
                    maxWidth: 600,
                  }}
                >
                  {site.hero.subtitle}
                </p>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 28 }}>
                <a href={site.links.resume} target="_blank" rel="noreferrer" className="btn primary">
                  <ArrowRight size={12} /> resume
                </a>
                <Link to="/work" className="btn">
                  <span style={{ color: "var(--paper-dim)" }}>02</span> view work
                </Link>
                <a href={site.links.github} target="_blank" rel="noreferrer" className="btn amber">
                  <Github size={12} /> github
                </a>
              </div>
            </div>

            {/* RIGHT — dossier tower */}
            <div className="hero-right">
              <CardTilt maxTilt={10} glareStrength={0.28}>
                <Dossier stamp="CLASSIFIED · 0426" style={{ padding: 0 }}>
                  <div
                    style={{
                      padding: "18px 20px 6px",
                      borderBottom: "1px dashed var(--hairline-2)",
                    }}
                  >
                    <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--paper-dim)", textTransform: "uppercase" }}>
                      // subject profile
                    </div>
                    <div className="hed" style={{ fontSize: 34, lineHeight: 0.95, marginTop: 6, letterSpacing: 0 }}>
                      N<span style={{ color: "var(--rust)" }}>/</span>M
                    </div>
                  </div>

                  <AsciiCanvas
                    art={DOSSIER_PORTRAIT}
                    color="var(--paper-mid)"
                    size={10.5}
                    style={{ padding: "14px 16px 8px" }}
                    typewrite
                    speed={12}
                  />

                  <div style={{ padding: "14px 20px 20px", borderTop: "1px dashed var(--hairline-2)" }}>
                    <div className="field" style={{ padding: "6px 0" }}>
                      <span className="field-key">origin</span>
                      <span className="field-val rust">boise, id → madison, wi</span>
                    </div>
                    <div className="field" style={{ padding: "6px 0" }}>
                      <span className="field-key">current</span>
                      <span className="field-val rust">uw-madison · cs + ds '26</span>
                    </div>
                    <div className="field" style={{ padding: "6px 0" }}>
                      <span className="field-key">next</span>
                      <span className="field-val rust">neu mscs · sv '26–'28</span>
                    </div>
                    <div className="field" style={{ padding: "6px 0", borderBottom: "none" }}>
                      <span className="field-key">shipping</span>
                      <span className="field-val">
                        <a href={site.links.thaw} target="_blank" rel="noreferrer" style={{ color: "var(--rust)", textDecoration: "none" }}>
                          thaw.sh ↗
                        </a>
                      </span>
                    </div>
                  </div>
                </Dossier>
              </CardTilt>
            </div>
          </div>
        </div>

        <style>{`
          .hero-grid {
            display: grid;
            grid-template-columns: 1.55fr 1fr;
            gap: 48px;
            align-items: start;
          }
          @media (max-width: 980px) {
            .hero-grid { grid-template-columns: 1fr; }
            .hero-right { order: -1; max-width: 420px; }
          }
        `}</style>
      </section>

      {/* ═══════════════ TICKER ═════════════════════════════ */}
      <section style={{ marginTop: 6 }}>
        <div className="ticker">
          <div className="ticker-track">
            {[...site.marquee, ...site.marquee].map((m, i) => (
              <span key={i} className="ticker-item">
                <span>{m}</span>
                <span className="ticker-sep">◆</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ NOW — four dossiers ═════════════════ */}
      <section style={{ padding: "74px 22px 44px" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <SectionHead
            index="02"
            label="now"
            title={<>current <span className="serif" style={{ color: "var(--rust)" }}>operations</span>.</>}
            meta={`updated ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }).toLowerCase()}`}
          />

          <div className="now-grid">
            {site.now.items.map((item, i) => {
              const accent = ["rust", "blue", "amber", "rust"][i % 4];
              const accentVar = accent === "rust" ? "var(--rust)" : accent === "amber" ? "var(--amber)" : "var(--accent-3)";
              return (
              <Dossier
                key={item.label}
                accent={accent}
                stamp={`N.${String(i + 1).padStart(2, "0")} / 04`}
                style={{ padding: "24px 26px" }}
              >
                <div
                  className="mono"
                  style={{
                    display: "inline-flex",
                    gap: 8,
                    padding: "3px 9px",
                    border: `1px dashed ${accentVar}`,
                    color: accentVar,
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    marginBottom: 18,
                  }}
                >
                  {item.label}
                </div>
                <h3 className="hed" style={{ fontSize: "clamp(34px, 4vw, 52px)", letterSpacing: 0, color: "var(--paper)", lineHeight: 0.92 }}>
                  {item.title}
                </h3>
                <p style={{ marginTop: 14, color: "var(--paper-mid)", fontSize: 14, lineHeight: 1.65 }}>
                  {item.text}
                </p>
              </Dossier>
              );
            })}
          </div>
        </div>

        <style>{`
          .now-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 22px;
          }
          @media (max-width: 820px) {
            .now-grid { grid-template-columns: 1fr; }
          }
        `}</style>
      </section>

      <MoshStrip length={200} label="status · nominal" bursts={5} />

      {/* ═══════════════ WORK — featured + grid ═══════════════ */}
      <section style={{ padding: "74px 22px 36px" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <SectionHead
            index="03"
            label="work"
            title={<>selected <span className="serif" style={{ color: "var(--amber)" }}>artifacts</span>.</>}
            right={
              <Link to="/work" className="btn" style={{ padding: "9px 14px" }}>
                all projects <ArrowUpRight size={12} />
              </Link>
            }
          />

          {/* Featured — the thaw window */}
          <WindowFrame
            title={`WORK / ${featured.title}.exe`}
            subtitle={`${featured.year} · ${featured.role}`}
            tint="rust"
            style={{ marginBottom: 36 }}
          >
            <div className="feat-grid">
              <div style={{ padding: "32px 30px" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                  <span className="chip rust"><span className="dot" /> active</span>
                  <span className="chip ghost">{featured.year}</span>
                </div>

                <h3
                  className="hed"
                  style={{
                    fontSize: "clamp(68px, 10vw, 148px)",
                    letterSpacing: "-0.015em",
                    lineHeight: 0.82,
                    color: "var(--rust)",
                  }}
                >
                  {featured.title}
                </h3>

                <p
                  className="serif"
                  style={{
                    fontSize: "clamp(22px, 2.3vw, 28px)",
                    lineHeight: 1.25,
                    color: "var(--paper)",
                    marginTop: 14,
                    marginBottom: 16,
                  }}
                >
                  {featured.subtitle}
                </p>

                <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--paper-mid)", maxWidth: 580, marginBottom: 22 }}>
                  {featured.description}
                </p>

                <div
                  className="mono"
                  style={{
                    padding: "12px 14px",
                    borderLeft: "2px solid var(--rust)",
                    background: "var(--rust-soft)",
                    fontSize: 12,
                    letterSpacing: "0.02em",
                    color: "var(--paper)",
                    marginBottom: 22,
                    maxWidth: 580,
                  }}
                >
                  <span style={{ color: "var(--rust)" }}>→&nbsp;</span>
                  {featured.receipt}
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
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

              {/* Right: fork ASCII on tinted panel */}
              <div
                style={{
                  borderLeft: "1px solid var(--hairline-2)",
                  background:
                    "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(198,247,39,0.22), transparent 72%), #000",
                  padding: "32px 26px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--paper-dim)", textTransform: "uppercase", marginBottom: 14 }}>
                  <span style={{ color: "var(--rust)" }}>//</span> the primitive
                </div>
                <ForkGraph color="#C6F727" accentColor="#FF2EA0" />
                <div
                  className="mono"
                  style={{ marginTop: 22, fontSize: 11, lineHeight: 1.8, color: "var(--paper-mid)", letterSpacing: "0.02em" }}
                >
                  <div><span style={{ color: "var(--amber)" }}>$</span> snapshot weights + kv + scheduler</div>
                  <div><span style={{ color: "var(--amber)" }}>$</span> hydrate N children from fork point</div>
                  <div><span style={{ color: "var(--amber)" }}>$</span> skip prefill · diverge · repeat</div>
                  <div style={{ marginTop: 10, color: "var(--rust)" }}>▸ bit-identical · 400× amortized</div>
                </div>
              </div>
            </div>
          </WindowFrame>

          <div className="mono" style={{ fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--paper-dim)", marginBottom: 14, display: "inline-flex", gap: 10, alignItems: "center" }}>
            <span style={{ width: 18, height: 1, background: "var(--accent-3)" }} />
            ▸ side quests · archive stream
          </div>
        </div>
        <ProjectBand projects={rest} startIndex={2} />

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

      {/* ═══════════════ ABOUT + STATS ═════════════════════ */}
      <section style={{ padding: "48px 22px 44px" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <SectionHead
            index="04"
            label="about"
            title={<>the short <span className="serif" style={{ color: "var(--rust)" }}>version</span>.</>}
          />

          <div className="about-grid">
            <div className="holo-panel" style={{ padding: "30px 32px" }}>
              <p
                className="serif"
                style={{
                  fontSize: "clamp(24px, 2.6vw, 34px)",
                  lineHeight: 1.22,
                  color: "var(--paper)",
                  marginBottom: 28,
                  marginTop: 0,
                }}
              >
                {site.about.lead}
              </p>
              {site.about.paragraphs.map((p, i, arr) => (
                <p
                  key={i}
                  style={{
                    fontSize: 15,
                    lineHeight: 1.75,
                    color: "var(--paper-mid)",
                    marginBottom: i === arr.length - 1 ? 0 : 18,
                  }}
                >
                  {p}
                </p>
              ))}
            </div>

            <div>
              <WindowFrame title="SYS / vitals.cfg" tint="amber">
                <AsciiCanvas art={SYS_PANEL} color="var(--amber)" size={11} style={{ padding: "14px 16px" }} />
              </WindowFrame>

              <div
                className="holo-panel"
                data-accent="amber"
                style={{ marginTop: 18, padding: "6px 22px" }}
              >
                {site.stats.map((s, i) => (
                  <div key={s.label} className="field">
                    <span className="field-key">{s.label}</span>
                    <span
                      className={`field-val ${i % 2 === 0 ? "rust" : "amber"}`}
                      style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 32, letterSpacing: 0, lineHeight: 1, textAlign: "right" }}
                    >
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <style>{`
          .about-grid {
            display: grid;
            grid-template-columns: 1.4fr 1fr;
            gap: 56px;
            align-items: start;
          }
          @media (max-width: 900px) {
            .about-grid { grid-template-columns: 1fr; gap: 32px; }
          }
        `}</style>
      </section>

      {/* ═══════════════ STACK ═════════════════════════════ */}
      <section style={{ padding: "48px 22px 44px" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <SectionHead
            index="05"
            label="stack"
            title={<>tools on the <span className="serif" style={{ color: "var(--amber)" }}>workbench</span>.</>}
          />
          <div className="stack-grid">
            {site.stack.map((group, i) => {
              const accent = ["amber", "blue", "rust", "blue"][i % 4];
              const accentVar = accent === "rust" ? "var(--rust)" : accent === "amber" ? "var(--amber)" : "var(--accent-3)";
              return (
              <Dossier key={group.group} accent={accent} style={{ padding: "20px 22px" }}>
                <div
                  className="mono"
                  style={{
                    fontSize: 10.5,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: accentVar,
                    marginBottom: 14,
                  }}
                >
                  // {group.group}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {group.items.map((item) => (
                    <span key={item} className="pill">{item}</span>
                  ))}
                </div>
              </Dossier>
              );
            })}
          </div>
        </div>
        <style>{`
          .stack-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 18px;
          }
          @media (max-width: 900px) { .stack-grid { grid-template-columns: repeat(2, 1fr); } }
          @media (max-width: 560px) { .stack-grid { grid-template-columns: 1fr; } }
        `}</style>
      </section>

      {/* ═══════════════ EDUCATION ═════════════════════════ */}
      <section style={{ padding: "48px 22px 44px" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <SectionHead
            index="06"
            label="education"
            title={<>school — current <span className="serif" style={{ color: "var(--rust)" }}>&amp; next</span>.</>}
          />
          <div className="edu-grid">
            {site.education.map((ed, i) => (
              <WindowFrame key={ed.institution} title={`EDU / ${i === 0 ? "current" : "next"}.log`} tint={i === 0 ? "rust" : "amber"}>
                <div style={{ padding: "22px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                    <div
                      className="mono"
                      style={{
                        fontSize: 10.5,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: i === 0 ? "var(--rust)" : "var(--amber)",
                      }}
                    >
                      {i === 0 ? "▶ current" : "▷ incoming"}
                    </div>
                    <div className="mono" style={{ fontSize: 10.5, color: "var(--paper-dim)", letterSpacing: "0.14em" }}>
                      {ed.date}
                    </div>
                  </div>
                  <h3
                    className="hed"
                    style={{
                      fontSize: "clamp(28px, 3vw, 40px)",
                      letterSpacing: 0,
                      lineHeight: 1,
                      color: "var(--paper)",
                    }}
                  >
                    {ed.institution}
                  </h3>
                  <p className="serif" style={{ fontSize: 20, lineHeight: 1.3, color: i === 0 ? "var(--rust)" : "var(--amber)", marginTop: 6, marginBottom: 10 }}>
                    {ed.degree}
                  </p>
                  <p className="mono" style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--paper-dim)", marginBottom: 14, display: "inline-flex", gap: 6, alignItems: "center" }}>
                    <MapPin size={11} /> {ed.location}
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                    {ed.highlights.map((h, j) => (
                      <li key={j} style={{ fontSize: 13, lineHeight: 1.55, color: "var(--paper-mid)", display: "flex", gap: 10 }}>
                        <span style={{ color: i === 0 ? "var(--rust)" : "var(--amber)" }}>▸</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </WindowFrame>
            ))}
          </div>
        </div>
        <style>{`
          .edu-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 22px;
          }
          @media (max-width: 900px) { .edu-grid { grid-template-columns: 1fr; } }
        `}</style>
      </section>

      <MoshStrip length={220} label="end of transmission" bursts={6} />

      {/* ═══════════════ CONTACT — terminal ═══════════════════ */}
      <section style={{ padding: "74px 22px 92px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionHead
            index="07"
            label="contact"
            title={<>let's <span className="serif" style={{ color: "var(--rust)" }}>talk</span>.</>}
          />

          <WindowFrame title="TERMINAL / nm@matteson ~ contact" tint="rust">
            <div className="term" style={{ borderTop: 0, borderLeft: 0, borderRight: 0, borderBottom: 0, padding: "28px 32px" }}>
              <AsciiCanvas art={CONTACT_BANNER} color="var(--rust)" size={11} style={{ marginBottom: 18 }} />

              <div><span className="term-prompt">$</span> whoami</div>
              <div className="term-out">nils · swe / mle · wi → ca · swedish-american</div>
              <div style={{ height: 10 }} />

              <div><span className="term-prompt">$</span> cat intent.txt</div>
              <div className="term-out" style={{ maxWidth: 760 }}>
                {site.contact.body}
              </div>
              <div style={{ height: 10 }} />

              <div><span className="term-prompt">$</span> ls channels/</div>
              <div style={{ marginLeft: 14, marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                <a href={site.links.email} className="mono" style={{ color: "var(--amber)", textDecoration: "none" }}>
                  <span className="term-key">▸</span>&nbsp; mail <span style={{ color: "var(--paper-dim)" }}>→</span> nilsmatteson@icloud.com
                </a>
                <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="mono" style={{ color: "var(--amber)", textDecoration: "none" }}>
                  <span className="term-key">▸</span>&nbsp; linkedin <span style={{ color: "var(--paper-dim)" }}>→</span> nils-matteson
                </a>
                <a href={site.links.github} target="_blank" rel="noreferrer" className="mono" style={{ color: "var(--amber)", textDecoration: "none" }}>
                  <span className="term-key">▸</span>&nbsp; github <span style={{ color: "var(--paper-dim)" }}>→</span> matteso1
                </a>
                <a href={site.links.resume} target="_blank" rel="noreferrer" className="mono" style={{ color: "var(--amber)", textDecoration: "none" }}>
                  <span className="term-key">▸</span>&nbsp; resume <span style={{ color: "var(--paper-dim)" }}>→</span> resume.pdf
                </a>
              </div>
              <div style={{ height: 14 }} />

              <div>
                <span className="term-prompt">$</span>{" "}
                <span className="term-out caret">_</span>
              </div>

              <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 10 }}>
                <a href={site.links.email} className="btn primary">
                  <Mail size={12} /> say hello
                </a>
                <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="btn amber">
                  linkedin <ArrowUpRight size={12} />
                </a>
                <a href={site.links.github} target="_blank" rel="noreferrer" className="btn">
                  <Github size={12} /> github
                </a>
              </div>
            </div>
          </WindowFrame>
        </div>
      </section>
    </div>
  );
}

/* Section heading — small reusable block */
function SectionHead({ index, label, title, meta, right }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 30 }}>
      <div style={{ display: "flex", gap: 28, alignItems: "flex-end" }}>
        <div className="big-idx">{index}</div>
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
            / {label}
          </div>
          <h2
            className="hed"
            style={{
              fontSize: "clamp(40px, 6.4vw, 92px)",
              letterSpacing: "-0.01em",
              lineHeight: 0.88,
              color: "var(--paper)",
            }}
          >
            {title}
          </h2>
          {meta && (
            <div className="mono" style={{ marginTop: 8, fontSize: 11, letterSpacing: "0.12em", color: "var(--paper-dim)" }}>
              {meta}
            </div>
          )}
        </div>
      </div>
      {right}
    </div>
  );
}
