import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Github, Linkedin, Mail, Menu, X, FileText } from "lucide-react";
import site from "../content/site.json";
import AmbientBackground from "./AmbientBackground";

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileMenuOpen]);

  const nav = [
    { name: "index",    path: "/",         code: "01" },
    { name: "work",     path: "/projects", code: "02" },
    { name: "writing",  path: "/blog",     code: "03" },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <AmbientBackground />

      {/* ── Header ─────────────────────────────────── */}
      <motion.header
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="sticky top-0 z-50"
        style={{
          borderBottom: "1px solid var(--border)",
          backdropFilter: "blur(12px) saturate(140%)",
          WebkitBackdropFilter: "blur(12px) saturate(140%)",
          background: "rgba(10, 10, 10, 0.72)",
        }}
      >
        <div className="max-w-[1360px] mx-auto px-5 sm:px-7 md:px-10">
          <div className="flex items-center justify-between py-3.5 gap-4">
            {/* Wordmark */}
            <Link to="/" className="flex items-center gap-2.5 no-underline" style={{ color: "var(--text)" }}>
              <span
                className="relative inline-block"
                style={{ width: 10, height: 10, background: "var(--acid)", boxShadow: "0 0 10px var(--acid)" }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  letterSpacing: "0.04em",
                  fontWeight: 600,
                }}
              >
                nils<span style={{ color: "var(--acid)" }}>.</span>matteson
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1 text-[11px] font-medium tracking-[0.12em] uppercase"
                 style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {nav.map((item) => {
                const active = location.pathname === item.path ||
                  (item.path !== "/" && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative px-3 py-2 no-underline flex items-center gap-2 transition-colors"
                    style={{ color: active ? "var(--acid)" : "var(--text-mid)" }}
                  >
                    <span style={{ color: "var(--text-ghost)" }}>{item.code}</span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <a
                href={site.links.resume}
                target="_blank"
                rel="noreferrer"
                className="ml-3 inline-flex items-center gap-1.5 py-1.5 px-3 no-underline transition-all"
                style={{
                  color: "var(--bg)",
                  background: "var(--acid)",
                  fontWeight: 700,
                }}
              >
                <FileText className="w-3 h-3" />
                resume
              </a>
            </nav>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2"
              style={{ color: "var(--text-mid)" }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile menu ─────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: "rgba(10,10,10,0.98)", backdropFilter: "blur(20px)" }}
          >
            <div className="flex flex-col h-full pt-20 px-6">
              <nav className="flex-1">
                {nav.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-baseline gap-4 py-5 display text-3xl no-underline"
                      style={{
                        borderBottom: "1px solid var(--border-mid)",
                        color: location.pathname === item.path ? "var(--acid)" : "var(--text)",
                      }}
                    >
                      <span className="text-xs" style={{ color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>
                        {item.code}
                      </span>
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <a
                  href={site.links.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-baseline gap-4 py-5 display text-3xl no-underline"
                  style={{ borderBottom: "1px solid var(--border-mid)", color: "var(--acid)" }}
                >
                  <span className="text-xs" style={{ color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>
                    ↗
                  </span>
                  resume
                </a>
              </nav>

              <div className="py-8" style={{ borderTop: "1px solid var(--border-mid)" }}>
                <div className="flex gap-6 mb-6">
                  <a href={site.links.github} target="_blank" rel="noreferrer" style={{ color: "var(--text-mid)" }}>
                    <Github className="w-6 h-6" />
                  </a>
                  <a href={site.links.linkedin} target="_blank" rel="noreferrer" style={{ color: "var(--text-mid)" }}>
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a href={site.links.email} style={{ color: "var(--text-mid)" }}>
                    <Mail className="w-6 h-6" />
                  </a>
                </div>
                <p className="text-sm" style={{ color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>
                  nilsmatteson@icloud.com
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main ─────────────────────────────────── */}
      <main className="relative z-10">{children}</main>

      {/* ── Footer ───────────────────────────────── */}
      <footer
        className="relative z-10 mt-24"
        style={{ borderTop: "1px solid var(--border-mid)", background: "var(--bg)" }}
      >
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-10 py-14">
          {/* ASCII divider */}
          <pre
            aria-hidden="true"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "var(--text-ghost)",
              margin: 0,
              whiteSpace: "pre",
              overflow: "hidden",
              lineHeight: 1,
              marginBottom: 28,
            }}
          >
{`╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴`}
          </pre>

          <div className="grid md:grid-cols-[2fr_1fr_1fr] gap-10 text-sm">
            <div>
              <div
                className="display mb-4"
                style={{ fontSize: 48, lineHeight: 0.9, letterSpacing: "-0.04em" }}
              >
                nils<span style={{ color: "var(--acid)" }}>.</span>
              </div>
              <p className="max-w-md mb-5" style={{ color: "var(--text-mid)", fontSize: 14 }}>
                Building at the edge of compute. Open to conversations about
                GPU inference, distributed systems, and ML infrastructure.
              </p>
              <div className="flex flex-wrap gap-2">
                <a href={site.links.email} className="btn primary">
                  <Mail className="w-3.5 h-3.5" /> contact
                </a>
                <a href={site.links.resume} target="_blank" rel="noreferrer" className="btn">
                  <FileText className="w-3.5 h-3.5" /> resume
                </a>
              </div>
            </div>

            <div>
              <div className="eyebrow mb-4">nav</div>
              <ul className="space-y-2 text-[12px] uppercase tracking-[0.08em]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                <li><Link to="/" style={{ color: "var(--text-mid)" }} className="no-underline hover:opacity-80">index</Link></li>
                <li><Link to="/projects" style={{ color: "var(--text-mid)" }} className="no-underline hover:opacity-80">work</Link></li>
                <li><Link to="/blog" style={{ color: "var(--text-mid)" }} className="no-underline hover:opacity-80">writing</Link></li>
                <li>
                  <a href={site.links.thaw} target="_blank" rel="noreferrer"
                     style={{ color: "var(--acid)" }} className="no-underline hover:opacity-80">
                    thaw.sh ↗
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="eyebrow mb-4">elsewhere</div>
              <div className="flex flex-col gap-2 text-[12px] uppercase tracking-[0.08em]"
                   style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                <a href={site.links.github} target="_blank" rel="noreferrer"
                   style={{ color: "var(--text-mid)" }} className="no-underline hover:opacity-80 flex items-center gap-2">
                  <Github className="w-4 h-4" /> github
                </a>
                <a href={site.links.linkedin} target="_blank" rel="noreferrer"
                   style={{ color: "var(--text-mid)" }} className="no-underline hover:opacity-80 flex items-center gap-2">
                  <Linkedin className="w-4 h-4" /> linkedin
                </a>
                <a href={site.links.email}
                   style={{ color: "var(--text-mid)" }} className="no-underline hover:opacity-80 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> mail
                </a>
              </div>
              <p className="mt-6 text-[10px] uppercase tracking-[0.14em]"
                 style={{ color: "var(--text-ghost)", fontFamily: "'JetBrains Mono', monospace" }}>
                © {new Date().getFullYear()} — built in madison
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
