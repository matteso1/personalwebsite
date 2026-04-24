import React from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, ArrowUpRight, Download } from "lucide-react";
import site from "../content/site.json";
import HudFrame from "../components/HudFrame";
import AsciiArt from "../components/AsciiArt";
import AsciiDivider from "../components/AsciiDivider";

/* Three-color palette only: acid / plasma / coral */
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

/* ASCII index card — sits beside the big page title */
const INDEX_ASCII = String.raw`
 ┌──────────────────────────┐
 │  /work                   │
 │  ──────                  │
 │   ▸ systems              │
 │   ▸ inference            │
 │   ▸ infrastructure       │
 │   ▸ tooling              │
 │                          │
 │   shipped. not demo'd.   │
 └──────────────────────────┘`;

const ProjectsPage = () => {
  return (
    <div className="relative">
      {/* ── Header ───────────────────────────── */}
      <section className="pt-16 pb-14">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-10">
          <AsciiDivider label="work" accent="var(--acid)" />

          <div className="mt-8 grid md:grid-cols-[1.4fr_1fr] gap-10 items-end">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="eyebrow mb-4">
                <span style={{ color: "var(--acid)" }}>02 ·</span> {site.projects.length} entries
              </div>

              <h1
                className="display mb-6"
                style={{
                  fontSize: "clamp(64px, 12vw, 200px)",
                  lineHeight: "0.84",
                  letterSpacing: "-0.055em",
                  color: "var(--text)",
                }}
              >
                things<br />
                <span className="serif-italic" style={{ color: "var(--acid)" }}>i built</span>
                <span style={{ color: "var(--acid)" }}>.</span>
              </h1>

              <p className="max-w-xl text-lg leading-relaxed" style={{ color: "var(--text-mid)" }}>
                end-to-end systems. distributed engines. ML infrastructure.
                shipped with receipts — not demos, not screenshots.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="hidden md:block"
            >
              <div
                className="p-4"
                style={{
                  border: "1px dashed var(--border-mid)",
                  background: "rgba(0,0,0,0.3)",
                }}
              >
                <div
                  className="mb-2 flex items-center justify-between"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: "var(--text-dim)",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  <span><span style={{ color: "var(--plasma)" }}>//</span> index</span>
                  <span style={{ color: "var(--text-ghost)" }}>0{site.projects.length} logged</span>
                </div>
                <AsciiArt art={INDEX_ASCII} color="var(--acid)" size={11} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── All Projects ─────────────────────── */}
      <section className="pb-32">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-10">
          <div className="space-y-4">
            {site.projects.map((project, index) => (
              <motion.article key={project.title} {...fadeOnView(index * 0.05)}>
                <HudFrame
                  accent={mapAccent(project.accent)}
                  className="p-7 md:p-10"
                >
                  <div className="grid md:grid-cols-[auto_1fr_auto] gap-8 items-start">
                    {/* Index number */}
                    <div className="min-w-[60px]">
                      <div
                        className="text-[10px] uppercase tracking-[0.2em] mb-1"
                        style={{ color: "var(--text-ghost)", fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        no.
                      </div>
                      <div
                        className="display"
                        style={{
                          fontSize: "clamp(44px, 5.4vw, 72px)",
                          color: accentVar(project.accent),
                          letterSpacing: "-0.05em",
                          lineHeight: 1,
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <div className="flex items-baseline flex-wrap gap-3 mb-3">
                        <h2
                          className="display"
                          style={{
                            fontSize: "clamp(32px, 4.4vw, 60px)",
                            letterSpacing: "-0.045em",
                            color: "var(--text)",
                            lineHeight: 0.9,
                          }}
                        >
                          {project.title}
                        </h2>
                        {project.status === "Active" && (
                          <span className="chip acid">
                            <span
                              className="inline-block"
                              style={{
                                width: 5, height: 5,
                                background: "var(--acid)",
                                boxShadow: "0 0 8px var(--acid)",
                                animation: "pulse-dot 1.4s infinite",
                              }}
                            />
                            active
                          </span>
                        )}
                      </div>
                      <p
                        className="serif-italic text-xl mb-4"
                        style={{ color: accentVar(project.accent) }}
                      >
                        {project.subtitle}
                      </p>
                      <p
                        className="leading-relaxed mb-5 max-w-3xl"
                        style={{ color: "var(--text-mid)", fontSize: 15 }}
                      >
                        {project.description}
                      </p>

                      {project.receipt && (
                        <div
                          className="text-sm p-3 mb-5 max-w-3xl"
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            borderLeft: `2px solid ${accentVar(project.accent)}`,
                            background: `${accentVar(project.accent)}10`,
                            color: "var(--text)",
                          }}
                        >
                          <span style={{ color: accentVar(project.accent) }}>→ </span>
                          {project.receipt}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5">
                        {project.tech.map((t) => (
                          <span key={t} className="pill">{t}</span>
                        ))}
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex md:flex-col items-end gap-4 min-w-[140px]">
                      <div className="md:text-right">
                        <div
                          className="text-[10px] uppercase tracking-[0.14em]"
                          style={{ color: "var(--text-ghost)", fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          year
                        </div>
                        <div
                          className="text-sm"
                          style={{ color: "var(--acid)", fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {project.year}
                        </div>
                      </div>
                      {project.role && (
                        <div className="md:text-right">
                          <div
                            className="text-[10px] uppercase tracking-[0.14em]"
                            style={{ color: "var(--text-ghost)", fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            role
                          </div>
                          <div
                            className="text-sm"
                            style={{ color: "var(--text-mid)", fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            {project.role}
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2 md:justify-end mt-1">
                        {project.links?.site && (
                          <a
                            href={project.links.site}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Site"
                            style={{ color: accentVar(project.accent) }}
                            className="hover:opacity-80"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        )}
                        {project.links?.repo && (
                          <a
                            href={project.links.repo}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Repo"
                            style={{ color: "var(--text-mid)" }}
                            className="hover:opacity-80"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {project.links?.demo && (
                          <a
                            href={project.links.demo}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Demo"
                            style={{ color: "var(--plasma)" }}
                            className="hover:opacity-80"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {project.links?.download && (
                          <a
                            href={project.links.download}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Download"
                            style={{ color: "var(--text-mid)" }}
                            className="hover:opacity-80"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </HudFrame>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
