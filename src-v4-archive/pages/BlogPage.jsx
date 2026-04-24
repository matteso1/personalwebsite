import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Calendar, Clock, Github } from "lucide-react";
import blogPosts from "../data/blogPosts";
import HudFrame from "../components/HudFrame";
import AsciiArt from "../components/AsciiArt";
import AsciiDivider from "../components/AsciiDivider";

/* Three-color rotation for post accents */
const accents = ["acid", "plasma", "coral"];

const fadeOnView = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ASCII feed card — sits beside the big page title */
const FEED_ASCII = String.raw`
 ┌──────────────────────────┐
 │  /writing                │
 │  ─────────               │
 │   ▸ post-mortems         │
 │   ▸ systems notes        │
 │   ▸ debug trails         │
 │   ▸ raw drafts           │
 │                          │
 │   written, not posted.   │
 └──────────────────────────┘`;

const BlogPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* ── Header ───────────────────────────── */}
      <section className="pt-16 pb-14">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-10">
          <AsciiDivider label="writing" accent="var(--plasma)" />

          <div className="mt-8 grid md:grid-cols-[1.4fr_1fr] gap-10 items-end">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="eyebrow mb-4">
                <span style={{ color: "var(--plasma)" }}>03 ·</span> {blogPosts.length} entries
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
                deep<br />
                <span className="serif-italic" style={{ color: "var(--plasma)" }}>dives</span>
                <span style={{ color: "var(--plasma)" }}>.</span>
              </h1>

              <p className="max-w-xl text-lg leading-relaxed" style={{ color: "var(--text-mid)" }}>
                systems i've built, problems i've debugged, things i learned the hard way.
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
                  <span><span style={{ color: "var(--coral)" }}>//</span> feed</span>
                  <span style={{ color: "var(--text-ghost)" }}>0{blogPosts.length} logged</span>
                </div>
                <AsciiArt art={FEED_ASCII} color="var(--plasma)" size={11} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Posts ────────────────────────────── */}
      <section className="pb-32">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-10">
          <div className="space-y-4">
            {blogPosts.map((post, index) => {
              const accent = accents[index % accents.length];
              return (
                <motion.article
                  key={post.slug}
                  {...fadeOnView(index * 0.06)}
                >
                  <HudFrame
                    accent={accent}
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    className="cursor-pointer p-7 md:p-9"
                  >
                    <div className="grid md:grid-cols-[auto_1fr_auto] gap-6 items-start">
                      <div className="min-w-[60px]">
                        <div
                          className="text-[10px] uppercase tracking-[0.18em] mb-1"
                          style={{ color: "var(--text-ghost)", fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          no.
                        </div>
                        <div
                          className="display"
                          style={{
                            fontSize: "clamp(38px, 4.6vw, 56px)",
                            color: `var(--${accent})`,
                            letterSpacing: "-0.05em",
                            lineHeight: 1,
                          }}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </div>
                      </div>
                      <div>
                        <h2
                          className="display mb-2"
                          style={{
                            fontSize: "clamp(26px, 3vw, 38px)",
                            letterSpacing: "-0.04em",
                            color: "var(--text)",
                            lineHeight: 1.02,
                          }}
                        >
                          {post.title}
                        </h2>
                        <p
                          className="serif-italic mb-4 text-lg"
                          style={{ color: `var(--${accent})` }}
                        >
                          {post.subtitle}
                        </p>
                        <p
                          className="text-sm leading-relaxed mb-5"
                          style={{ color: "var(--text-mid)" }}
                        >
                          {post.summary}
                        </p>
                        <div
                          className="flex flex-wrap items-center gap-4 mb-4 text-[11px]"
                          style={{ color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(post.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {post.readTime}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.map((tag) => (
                            <span key={tag} className="pill">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex md:flex-col items-end gap-3">
                        {post.github && (
                          <a
                            href={post.github}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            aria-label="Source"
                            style={{ color: "var(--text-mid)" }}
                            className="hover:opacity-80"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        <ArrowUpRight
                          className="w-5 h-5"
                          style={{ color: `var(--${accent})` }}
                        />
                      </div>
                    </div>
                  </HudFrame>
                </motion.article>
              );
            })}
          </div>

          {/* More coming */}
          <motion.div {...fadeOnView(0.2)} className="mt-12">
            <HudFrame accent="acid" className="p-10 text-center">
              <div
                className="text-[10px] uppercase tracking-[0.2em] mb-3"
                style={{ color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}
              >
                <span style={{ color: "var(--acid)" }}>//</span> incoming
              </div>
              <h3
                className="display mb-3"
                style={{
                  fontSize: "clamp(28px, 3.6vw, 42px)",
                  letterSpacing: "-0.04em",
                  color: "var(--text)",
                  lineHeight: 1,
                }}
              >
                more posts <span className="serif-italic" style={{ color: "var(--acid)" }}>soon</span>
                <span className="cursor-block" />
              </h3>
              <p style={{ color: "var(--text-mid)" }}>
                ml systems, gpu programming, and the things that break along the way.
              </p>
            </HudFrame>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
