import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Github,
  ExternalLink,
  ArrowUpRight,
  Mail,
  FileText,
  Download,
  MapPin,
} from "lucide-react";
import site from "../content/site.json";
import Marquee from "../components/Marquee";
import HudFrame from "../components/HudFrame";
import GlitchText from "../components/GlitchText";
import AsciiArt from "../components/AsciiArt";
import AsciiDivider from "../components/AsciiDivider";

/* Three-color palette. Keep everything in this set. */
const ACCENTS = { acid: "acid", plasma: "plasma", coral: "coral" };
const mapAccent = (a) =>
  ({
    acid: "acid",
    cyan: "plasma", aqua: "plasma", violet: "plasma", plasma: "plasma",
    magenta: "coral", hotmag: "coral", coral: "coral", red: "coral",
    jaune: "acid",
  }[a] || "acid");
const accentVar = (a) => `var(--${mapAccent(a)})`;

const fadeOnView = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ASCII hero monogram — Nils / Matteson trajectory */
const HERO_ASCII = String.raw`
 ┌────────────────────────┐
 │ ┌─────┐      ┌─────┐   │
 │ │  N  │──────│  M  │   │  ::  matteson-n
 │ └──┬──┘      └──┬──┘   │  ::  swe / mle
 │    │            │      │  ::  uw-madison '26
 │    └─────┬──────┘      │  ::  neu mscs '28
 │          │             │
 │     [ madison ]        │       ◢▇▇▇
 │          │             │       ◢▇▇
 │          ▼             │       ◢▇
 │     [ bay area ]       │
 └────────────────────────┘`;

/* ASCII block used in featured thaw panel */
const FORK_ASCII = String.raw`
      parent session
           │
   ┌───────┼───────┐
   ▼       ▼       ▼
 child   child   child
  0.88s per fork round`;

const HomePage = () => {
  const [featured, ...rest] = site.projects;

  return (
    <div className="relative">
      {/* ═══════════════ HERO ═══════════════════════════ */}
      <section className="pt-14 md:pt-20 pb-16">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap items-center gap-2 mb-6"
          >
            <span className="chip acid">
              <span
                className="inline-block"
                style={{
                  width: 5, height: 5,
                  background: "var(--acid)",
                  boxShadow: "0 0 6px var(--acid)",
                  animation: "pulse-dot 1.6s infinite",
                }}
              />
              <span>available — summer '27 intern</span>
            </span>
            <span className="chip ghost">
              <MapPin className="w-3 h-3" />
              <span>madison, wi → bay area</span>
            </span>
            <span className="chip ghost">
              <span>swedish-american</span>
            </span>
          </motion.div>

          <div className="grid md:grid-cols-[1.35fr_1fr] gap-10 items-start">
            {/* LEFT — massive name + tagline */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="eyebrow mb-4">
                <span style={{ color: "var(--acid)" }}>01 ·</span> cs & data science
              </div>

              <h1
                className="display"
                style={{
                  fontSize: "clamp(76px, 15vw, 220px)",
                  letterSpacing: "-0.055em",
                  lineHeight: 0.82,
                  marginBottom: 0,
                  color: "var(--text)",
                }}
              >
                <GlitchText text="NILS" as="span" interval={6000} burst={260} />
                <span style={{ color: "var(--acid)" }}>.</span>
                <br />
                <GlitchText
                  text="MATTESON"
                  as="span"
                  interval={7200}
                  burst={300}
                  style={{ color: "var(--text)" }}
                />
              </h1>

              <p
                className="serif-italic mt-8 max-w-xl"
                style={{
                  fontSize: "clamp(22px, 2.6vw, 32px)",
                  lineHeight: 1.15,
                  color: "var(--text-mid)",
                }}
              >
                i build <span style={{ color: "var(--acid)" }}>systems</span> that shouldn't
                work, then i break them to figure out{" "}
                <span style={{ color: "var(--plasma)" }}>why.</span>
              </p>

              <p className="mt-6 max-w-xl leading-relaxed" style={{ color: "var(--text-mid)", fontSize: 15 }}>
                {site.hero.subtitle}
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                <a href={site.links.resume} target="_blank" rel="noreferrer" className="btn primary">
                  <FileText className="w-3.5 h-3.5" /> resume
                </a>
                <Link to="/projects" className="btn">
                  view work <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <a href={site.links.github} target="_blank" rel="noreferrer" className="btn">
                  <Github className="w-3.5 h-3.5" /> github
                </a>
              </div>
            </motion.div>

            {/* RIGHT — ASCII dossier card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="hidden md:block"
            >
              <HudFrame accent="plasma" className="p-5">
                <div
                  className="flex items-center justify-between mb-3"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.18em", textTransform: "uppercase" }}
                >
                  <span><span style={{ color: "var(--plasma)" }}>//</span> dossier</span>
                  <span style={{ color: "var(--coral)" }}>● live</span>
                </div>
                <AsciiArt
                  art={HERO_ASCII}
                  color="var(--acid)"
                  size={10.5}
                  typewriter
                  speed={6}
                />
                <div
                  className="mt-4 pt-3 flex items-baseline justify-between text-[11px]"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    borderTop: "1px dashed var(--border-mid)",
                    color: "var(--text-dim)",
                    letterSpacing: "0.08em",
                  }}
                >
                  <span>shipping <span style={{ color: "var(--acid)" }}>thaw</span></span>
                  <span>rust · cuda · python</span>
                </div>
              </HudFrame>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ MARQUEE — single, subtle ═════ */}
      <section className="py-0">
        <Marquee items={site.marquee} accent="acid" speed={42} />
      </section>

      {/* ═══════════════ CURRENTLY ═════════════════════ */}
      <section className="pt-24 pb-16">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-10">
          <AsciiDivider label="now" accent="var(--acid)" />

          <motion.div {...fadeOnView(0)} className="mt-6 mb-12 flex items-end justify-between flex-wrap gap-6">
            <h2
              className="display"
              style={{
                fontSize: "clamp(40px, 6vw, 72px)",
                letterSpacing: "-0.045em",
                lineHeight: 0.9,
              }}
            >
              currently.
            </h2>
            <p className="max-w-sm text-sm" style={{ color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>
              updated {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }).toLowerCase()}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {site.now.items.map((item, i) => (
              <motion.div key={item.label} {...fadeOnView(0.06 * i)}>
                <HudFrame accent={mapAccent(item.accent)} className="p-7 h-full">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div
                      className="text-[10px] uppercase tracking-[0.2em]"
                      style={{ color: accentVar(item.accent), fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {item.label}
                    </div>
                    <div
                      className="text-[10px]"
                      style={{ color: "var(--text-ghost)", fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      0{i + 1} / 04
                    </div>
                  </div>
                  <h3
                    className="display mb-3"
                    style={{
                      fontSize: "clamp(30px, 4vw, 46px)",
                      letterSpacing: "-0.04em",
                      color: "var(--text)",
                      lineHeight: 0.95,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ color: "var(--text-mid)", lineHeight: 1.6, fontSize: 14 }}>
                    {item.text}
                  </p>
                </HudFrame>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SELECTED WORK ════════════════════ */}
      <section className="pt-8 pb-20">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-10">
          <AsciiDivider label="work" accent="var(--plasma)" />

          <motion.div {...fadeOnView(0)} className="mt-6 mb-12 flex items-end justify-between flex-wrap gap-6">
            <h2
              className="display"
              style={{
                fontSize: "clamp(40px, 6vw, 72px)",
                letterSpacing: "-0.045em",
                lineHeight: 0.9,
              }}
            >
              selected work<span style={{ color: "var(--acid)" }}>.</span>
            </h2>
            <Link to="/projects" className="btn">
              all projects <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          {/* Featured project */}
          <motion.div {...fadeOnView(0)}>
            <HudFrame accent="acid" className="p-8 md:p-12 relative">
              <div className="grid md:grid-cols-[1.3fr_1fr] gap-10 items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    <span className="chip acid">
                      <span className="inline-block" style={{ width: 5, height: 5, background: "var(--acid)", boxShadow: "0 0 6px var(--acid)" }} />
                      active · {featured.year}
                    </span>
                    <span className="chip ghost">{featured.role}</span>
                  </div>

                  <h3
                    className="display"
                    style={{
                      fontSize: "clamp(68px, 10vw, 150px)",
                      letterSpacing: "-0.055em",
                      lineHeight: 0.85,
                      color: "var(--acid)",
                      marginBottom: 14,
                    }}
                  >
                    {featured.title}
                  </h3>

                  <p
                    className="serif-italic mb-4"
                    style={{ color: "var(--text)", fontSize: "clamp(20px, 2.2vw, 28px)", lineHeight: 1.15 }}
                  >
                    {featured.subtitle}
                  </p>
                  <p className="leading-relaxed mb-6 max-w-2xl" style={{ color: "var(--text-mid)", fontSize: 15 }}>
                    {featured.description}
                  </p>

                  <div
                    className="text-sm p-3 mb-6 max-w-2xl"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      background: "rgba(158, 255, 61, 0.04)",
                      borderLeft: "2px solid var(--acid)",
                      color: "var(--text)",
                    }}
                  >
                    <span style={{ color: "var(--acid)" }}>→ </span>{featured.receipt}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {featured.tech.map((t) => (
                      <span key={t} className="pill">{t}</span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {featured.links?.site && (
                      <a href={featured.links.site} target="_blank" rel="noreferrer" className="btn primary">
                        {featured.links.site.replace("https://", "")} <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {featured.links?.repo && (
                      <a href={featured.links.repo} target="_blank" rel="noreferrer" className="btn">
                        <Github className="w-3.5 h-3.5" /> source
                      </a>
                    )}
                    {featured.links?.pypi && (
                      <a href={featured.links.pypi} target="_blank" rel="noreferrer" className="btn plasma">
                        <Download className="w-3.5 h-3.5" /> pypi
                      </a>
                    )}
                  </div>
                </div>

                {/* ASCII fork diagram */}
                <div className="hidden md:block">
                  <div
                    className="p-4"
                    style={{
                      border: "1px dashed var(--border-mid)",
                      background: "rgba(0,0,0,0.3)",
                    }}
                  >
                    <div
                      className="mb-3"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10,
                        color: "var(--text-dim)",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                      }}
                    >
                      <span style={{ color: "var(--acid)" }}>//</span> the primitive
                    </div>
                    <AsciiArt art={FORK_ASCII} color="var(--acid)" size={11.5} />
                  </div>
                </div>
              </div>
            </HudFrame>
          </motion.div>

          {/* Rest of projects */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {rest.map((p, i) => (
              <motion.div key={p.title} {...fadeOnView(0.06 * i)}>
                <HudFrame accent={mapAccent(p.accent)} className="p-6 h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="text-[10px] uppercase tracking-[0.2em]"
                      style={{ color: accentVar(p.accent), fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      0{i + 2}
                    </div>
                    <div
                      className="text-[10px]"
                      style={{ color: "var(--text-ghost)", fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {p.year}
                    </div>
                  </div>
                  <h4
                    className="display mb-2"
                    style={{
                      fontSize: "clamp(24px, 2.4vw, 32px)",
                      letterSpacing: "-0.04em",
                      color: "var(--text)",
                      lineHeight: 0.95,
                    }}
                  >
                    {p.title}
                  </h4>
                  <p
                    className="serif-italic mb-3 text-base"
                    style={{ color: accentVar(p.accent) }}
                  >
                    {p.subtitle}
                  </p>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-mid)" }}>
                    {p.description}
                  </p>
                  {p.receipt && (
                    <p className="text-[11px] mb-4" style={{ color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>
                      <span style={{ color: accentVar(p.accent) }}>→</span> {p.receipt}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {p.tech.slice(0, 4).map((t) => (
                      <span key={t} className="pill">{t}</span>
                    ))}
                  </div>
                  <div className="flex gap-3 text-[11px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {p.links?.repo && (
                      <a href={p.links.repo} target="_blank" rel="noreferrer"
                         className="no-underline flex items-center gap-1.5 hover:opacity-80"
                         style={{ color: "var(--text-mid)" }}>
                        <Github className="w-3 h-3" /> source
                      </a>
                    )}
                    {p.links?.demo && (
                      <a href={p.links.demo} target="_blank" rel="noreferrer"
                         className="no-underline flex items-center gap-1.5 hover:opacity-80"
                         style={{ color: "var(--text-mid)" }}>
                        <ExternalLink className="w-3 h-3" /> live
                      </a>
                    )}
                    {p.links?.download && (
                      <a href={p.links.download} target="_blank" rel="noreferrer"
                         className="no-underline flex items-center gap-1.5 hover:opacity-80"
                         style={{ color: "var(--text-mid)" }}>
                        <Download className="w-3 h-3" /> download
                      </a>
                    )}
                  </div>
                </HudFrame>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ ABOUT ═════════════════════ */}
      <section className="pt-12 pb-20">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-10">
          <AsciiDivider label="about" accent="var(--coral)" />

          <motion.div {...fadeOnView(0)} className="mt-6 mb-12">
            <h2
              className="display"
              style={{
                fontSize: "clamp(40px, 6vw, 72px)",
                letterSpacing: "-0.045em",
                lineHeight: 0.9,
              }}
            >
              the short version<span style={{ color: "var(--coral)" }}>.</span>
            </h2>
          </motion.div>

          <motion.div {...fadeOnView(0.05)} className="grid md:grid-cols-[1.2fr_1fr] gap-12 items-start">
            <div>
              <p
                className="serif-italic mb-8"
                style={{
                  fontSize: "clamp(22px, 2.5vw, 32px)",
                  lineHeight: 1.25,
                  color: "var(--text)",
                }}
              >
                {site.about.lead}
              </p>
              <div className="space-y-4">
                {site.about.paragraphs.map((p, i) => (
                  <p key={i} className="leading-relaxed" style={{ color: "var(--text-mid)", fontSize: 15 }}>
                    {p}
                  </p>
                ))}
              </div>
            </div>

            <div>
              {site.stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="flex items-baseline justify-between gap-4 py-4"
                  style={{ borderBottom: "1px solid var(--border-mid)" }}
                >
                  <div
                    className="text-[10px] uppercase tracking-[0.14em]"
                    style={{ color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {s.label}
                  </div>
                  <div
                    className="display"
                    style={{
                      fontSize: "clamp(26px, 3vw, 42px)",
                      color: accentVar(s.accent),
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {s.value}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ STACK ═════════════════════ */}
      <section className="pt-12 pb-20">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-10">
          <AsciiDivider label="stack" accent="var(--acid)" />

          <motion.div {...fadeOnView(0)} className="mt-6 mb-12">
            <h2
              className="display"
              style={{
                fontSize: "clamp(40px, 6vw, 72px)",
                letterSpacing: "-0.045em",
                lineHeight: 0.9,
              }}
            >
              tools on the workbench<span style={{ color: "var(--acid)" }}>.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {site.stack.map((group, i) => {
              const order = ["acid", "plasma", "coral", "acid"];
              const accent = order[i % order.length];
              return (
                <motion.div key={group.group} {...fadeOnView(0.06 * i)}>
                  <HudFrame accent={accent} className="p-5 h-full">
                    <div
                      className="text-[10px] uppercase tracking-[0.2em] mb-4"
                      style={{ color: `var(--${accent})`, fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {group.group}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <span key={item} className="pill">{item}</span>
                      ))}
                    </div>
                  </HudFrame>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ EDUCATION ═════════════════════ */}
      <section className="pt-12 pb-20">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-10">
          <AsciiDivider label="education" accent="var(--plasma)" />

          <motion.div {...fadeOnView(0)} className="mt-6 mb-12">
            <h2
              className="display"
              style={{
                fontSize: "clamp(40px, 6vw, 72px)",
                letterSpacing: "-0.045em",
                lineHeight: 0.9,
              }}
            >
              school — current & next<span style={{ color: "var(--plasma)" }}>.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {site.education.map((ed, i) => (
              <motion.div key={ed.institution} {...fadeOnView(0.08 * i)}>
                <HudFrame accent={mapAccent(ed.accent)} className="p-7 h-full">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div
                      className="text-[10px] uppercase tracking-[0.18em]"
                      style={{ color: accentVar(ed.accent), fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {i === 0 ? "current" : "next"}
                    </div>
                    <div
                      className="text-[10px]"
                      style={{ color: "var(--text-ghost)", fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {ed.date}
                    </div>
                  </div>
                  <h3
                    className="display mb-2"
                    style={{
                      fontSize: "clamp(24px, 2.6vw, 34px)",
                      letterSpacing: "-0.035em",
                      color: "var(--text)",
                      lineHeight: 1,
                    }}
                  >
                    {ed.institution}
                  </h3>
                  <p className="serif-italic text-lg mb-3" style={{ color: accentVar(ed.accent) }}>
                    {ed.degree}
                  </p>
                  <p
                    className="text-xs mb-5 flex items-center gap-1.5"
                    style={{ color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    <MapPin className="w-3 h-3" />
                    {ed.location}
                  </p>
                  <ul className="space-y-2 text-sm" style={{ color: "var(--text-mid)" }}>
                    {ed.highlights.map((h, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span style={{ color: accentVar(ed.accent) }}>▸</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </HudFrame>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CONTACT ═════════════════════ */}
      <section className="pt-8 pb-32">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-10">
          <AsciiDivider label="contact" accent="var(--acid)" />

          <motion.div {...fadeOnView(0)} className="mt-10">
            <HudFrame accent="acid" className="p-10 md:p-14">
              <div className="grid md:grid-cols-[1.4fr_1fr] gap-10 items-end">
                <div>
                  <h2
                    className="display mb-5"
                    style={{
                      fontSize: "clamp(52px, 9vw, 132px)",
                      letterSpacing: "-0.055em",
                      lineHeight: 0.85,
                    }}
                  >
                    let's talk<span style={{ color: "var(--acid)" }}>.</span>
                  </h2>
                  <p className="leading-relaxed max-w-xl" style={{ color: "var(--text-mid)" }}>
                    {site.contact.body}
                  </p>
                  <p
                    className="mt-5 text-[11px] uppercase tracking-[0.18em]"
                    style={{ color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    <span style={{ color: "var(--acid)" }}>&gt;</span> usually reply within a day
                    <span className="cursor-blink" />
                  </p>
                </div>
                <div className="flex flex-col gap-2 md:items-end">
                  <a href={site.links.email} className="btn primary">
                    <Mail className="w-3.5 h-3.5" /> nilsmatteson@icloud.com
                  </a>
                  <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="btn plasma">
                    linkedin <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <a href={site.links.github} target="_blank" rel="noreferrer" className="btn">
                    <Github className="w-3.5 h-3.5" /> github.com/matteso1
                  </a>
                  <a href={site.links.resume} target="_blank" rel="noreferrer" className="btn">
                    <FileText className="w-3.5 h-3.5" /> resume.pdf
                  </a>
                </div>
              </div>
            </HudFrame>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
