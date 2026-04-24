import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Github,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import blogPosts from "../data/blogPosts";
import WindowFrame from "../components/WindowFrame";
import MoshStrip from "../components/MoshStrip";
import {
  SpeculativeComparison,
  ArchitectureOverview,
  HeadArchitectureBefore,
  HeadArchitectureAfter,
  CandidateTree,
  TreeAttentionMask,
  PruningStrategies,
  KernelComparison,
  SpeculativeLoop,
  TrainingPipeline,
} from "../components/diagrams/GorgonDiagrams";

const diagramComponents = {
  "speculative-comparison": SpeculativeComparison,
  "architecture-overview": ArchitectureOverview,
  "head-architecture-before": HeadArchitectureBefore,
  "head-architecture-after": HeadArchitectureAfter,
  "candidate-tree": CandidateTree,
  "tree-attention-mask": TreeAttentionMask,
  "pruning-strategies": PruningStrategies,
  "kernel-comparison": KernelComparison,
  "speculative-loop": SpeculativeLoop,
  "training-pipeline": TrainingPipeline,
};

const Diagram = ({ name }) => {
  const D = diagramComponents[name];
  if (!D) {
    return (
      <div
        style={{
          margin: "28px 0",
          padding: 16,
          border: "1px dashed var(--amber)",
          background: "var(--amber-soft)",
          color: "var(--amber)",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
        }}
      >
        // unknown diagram: {name}
      </div>
    );
  }
  return <D />;
};

/* ── Prism code theme keyed to v5 palette ── */
const codeTheme = {
  'code[class*="language-"]': {
    color: "var(--paper)",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.88em",
    lineHeight: "1.65",
    background: "transparent",
    fontFeatureSettings: '"liga" 0, "calt" 0',
  },
  'pre[class*="language-"]': {
    color: "var(--paper)",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.88em",
    lineHeight: "1.65",
    background: "var(--void-2)",
    padding: "1.2em 1.4em",
    margin: 0,
    overflow: "auto",
    borderRadius: 0,
  },
  comment:      { color: "var(--paper-ghost)", fontStyle: "italic" },
  prolog:       { color: "var(--paper-ghost)" },
  doctype:      { color: "var(--paper-ghost)" },
  cdata:        { color: "var(--paper-ghost)" },
  punctuation:  { color: "var(--paper-mid)" },
  property:     { color: "var(--amber)" },
  tag:          { color: "var(--rust)" },
  boolean:      { color: "var(--amber)" },
  number:       { color: "var(--amber)" },
  constant:     { color: "var(--amber)" },
  symbol:       { color: "var(--rust)" },
  selector:     { color: "var(--rust)" },
  "attr-name":  { color: "var(--amber)" },
  string:       { color: "var(--rust)" },
  char:         { color: "var(--rust)" },
  builtin:      { color: "var(--amber)" },
  operator:     { color: "var(--paper-mid)" },
  entity:       { color: "var(--amber)" },
  url:          { color: "var(--amber)" },
  variable:     { color: "var(--paper)" },
  inserted:     { color: "var(--rust)" },
  atrule:       { color: "var(--amber)" },
  "attr-value": { color: "var(--rust)" },
  keyword:      { color: "var(--rust)", fontWeight: 600 },
  regex:        { color: "var(--amber)" },
  important:    { color: "var(--amber)", fontWeight: 700 },
  deleted:      { color: "var(--rust-dim)" },
  function:     { color: "var(--amber)" },
  "class-name": { color: "var(--amber)", fontWeight: 600 },
  decorator:    { color: "var(--rust)" },
};

/* ── Markdown → v5 typography ── */
const markdownComponents = {
  h1: ({ children }) => (
    <h1
      className="hed"
      style={{
        fontSize: "clamp(30px, 4vw, 48px)",
        letterSpacing: "-0.01em",
        lineHeight: 0.96,
        color: "var(--paper)",
        margin: "56px 0 20px",
      }}
    >
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2
      className="hed"
      style={{
        fontSize: "clamp(26px, 3.2vw, 38px)",
        letterSpacing: "-0.005em",
        lineHeight: 1,
        color: "var(--paper)",
        margin: "48px 0 18px",
        paddingBottom: 12,
        borderBottom: "1px solid var(--hairline-2)",
      }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      className="hed"
      style={{
        fontSize: "clamp(22px, 2.4vw, 28px)",
        letterSpacing: 0,
        lineHeight: 1.05,
        color: "var(--paper)",
        margin: "36px 0 14px",
      }}
    >
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4
      className="serif"
      style={{
        fontSize: 22,
        color: "var(--rust)",
        margin: "32px 0 12px",
      }}
    >
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p style={{ fontSize: 16, lineHeight: 1.85, color: "var(--paper-mid)", marginBottom: 20 }}>
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong style={{ color: "var(--paper)", fontWeight: 600 }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em className="serif" style={{ color: "var(--amber)" }}>
      {children}
    </em>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noreferrer" : undefined}
      style={{
        color: "var(--rust)",
        textDecoration: "underline",
        textDecorationColor: "rgba(198,247,39,0.4)",
        textUnderlineOffset: 3,
      }}
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote
      className="serif"
      style={{
        padding: "6px 0 6px 22px",
        borderLeft: "2px solid var(--rust)",
        color: "var(--paper-mid)",
        fontSize: 18,
        margin: "24px 0",
        background: "var(--rust-soft)",
        paddingRight: 16,
      }}
    >
      {children}
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: 8 }}>
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol style={{ marginBottom: 20, paddingLeft: 22, color: "var(--paper-mid)", display: "flex", flexDirection: "column", gap: 8 }}>
      {children}
    </ol>
  ),
  li: ({ children, ordered }) => {
    if (ordered) {
      return (
        <li style={{ fontSize: 15.5, lineHeight: 1.7, color: "var(--paper-mid)" }}>
          {children}
        </li>
      );
    }
    return (
      <li
        style={{
          fontSize: 15.5,
          lineHeight: 1.7,
          color: "var(--paper-mid)",
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        <span style={{ color: "var(--rust)", flexShrink: 0, lineHeight: 1.7 }}>▸</span>
        <span style={{ flex: 1 }}>{children}</span>
      </li>
    );
  },
  hr: () => (
    <hr
      style={{
        border: "none",
        borderTop: "1px dashed var(--hairline-2)",
        margin: "48px 0",
      }}
    />
  ),
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    const inline = !className;

    if (inline) {
      return (
        <code
          className="mono"
          style={{
            background: "var(--void-2)",
            color: "var(--amber)",
            fontSize: "0.88em",
            padding: "2px 6px",
            border: "1px solid var(--hairline-2)",
          }}
        >
          {children}
        </code>
      );
    }

    if (match && match[1] === "diagram") {
      const name = String(children).trim();
      return <Diagram name={name} />;
    }

    return (
      <div
        style={{
          margin: "24px 0",
          overflow: "hidden",
          border: "1px solid var(--hairline-2)",
          background: "var(--void-2)",
        }}
      >
        <div
          className="mono"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 14px",
            borderBottom: "1px solid var(--hairline-2)",
            color: "var(--paper-dim)",
            fontSize: 10.5,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            background: "var(--void-3)",
          }}
        >
          <span style={{ display: "inline-flex", gap: 6 }}>
            <span style={{ width: 9, height: 9, border: "1px solid var(--paper-ghost)", borderRadius: "50%" }} />
            <span style={{ width: 9, height: 9, border: "1px solid var(--paper-ghost)", borderRadius: "50%" }} />
            <span style={{ width: 9, height: 9, border: "1px solid var(--paper-ghost)", borderRadius: "50%" }} />
          </span>
          <span style={{ color: "var(--rust)" }}>▸</span>
          <span>{match ? match[1] : "text"}</span>
        </div>
        <SyntaxHighlighter
          style={codeTheme}
          language={match ? match[1] : "text"}
          PreTag="div"
          customStyle={{ margin: 0, background: "var(--void-2)", padding: "1.1rem 1.3rem" }}
          codeTagProps={{
            style: {
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.88em",
              fontFeatureSettings: '"liga" 0, "calt" 0',
            },
          }}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    );
  },
  pre: ({ children }) => <>{children}</>,
  table: ({ children }) => (
    <div style={{ margin: "24px 0", overflowX: "auto", border: "1px solid var(--hairline-2)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead style={{ background: "var(--void-2)", borderBottom: "1px solid var(--hairline-2)" }}>
      {children}
    </thead>
  ),
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr style={{ borderBottom: "1px solid var(--hairline-2)" }}>{children}</tr>
  ),
  th: ({ children }) => (
    <th
      className="mono"
      style={{
        padding: "10px 14px",
        textAlign: "left",
        fontSize: 10.5,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "var(--rust)",
      }}
    >
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td style={{ padding: "10px 14px", color: "var(--paper-mid)" }}>{children}</td>
  ),
  img: ({ src, alt }) => (
    <figure style={{ margin: "28px 0" }}>
      <img
        src={src}
        alt={alt || ""}
        style={{
          width: "100%",
          display: "block",
          border: "1px solid var(--hairline-2)",
          background: "var(--void-2)",
        }}
      />
      {alt && (
        <figcaption
          className="mono"
          style={{
            marginTop: 8,
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "var(--paper-dim)",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          ▸ {alt}
        </figcaption>
      )}
    </figure>
  ),
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function WritingPostPage() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/writing" replace />;

  const sorted = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const idx = sorted.findIndex((p) => p.slug === slug);
  const prev = sorted[idx + 1];
  const next = sorted[idx - 1];

  return (
    <div>
      {/* ═════════ HEADER ═════════ */}
      <article style={{ padding: "42px 22px 40px", position: "relative" }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <Link
            to="/writing"
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
              marginBottom: 28,
            }}
          >
            <ArrowLeft size={13} /> back / writing
          </Link>

          <div
            className="holo-panel"
            style={{
              padding: "32px 36px",
              marginBottom: 40,
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 10.5,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: "var(--rust)",
                marginBottom: 16,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ width: 22, height: 1, background: "var(--rust)" }} />
              / article · read
            </div>

            <h1
              className="hed"
              style={{
                fontSize: "clamp(38px, 5.6vw, 76px)",
                letterSpacing: "-0.012em",
                lineHeight: 0.94,
                color: "var(--paper)",
                marginBottom: 20,
              }}
            >
              {post.title}
            </h1>

            <p
              className="serif"
              style={{
                fontSize: "clamp(20px, 2.2vw, 28px)",
                lineHeight: 1.28,
                color: "var(--rust)",
                marginBottom: 26,
                maxWidth: 820,
              }}
            >
              {post.subtitle}
            </p>

            <div
              className="mono"
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 20,
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--paper-dim)",
                marginBottom: 22,
                paddingBottom: 22,
                borderBottom: "1px solid var(--hairline-2)",
              }}
            >
              <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                <Calendar size={12} /> {formatDate(post.date)}
              </span>
              <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                <Clock size={12} /> {post.readTime}
              </span>
              {post.github && (
                <a
                  href={post.github}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    color: "var(--rust)",
                    textDecoration: "none",
                  }}
                >
                  <Github size={12} /> source <ExternalLink size={10} />
                </a>
              )}
              {post.demo && (
                <a
                  href={post.demo}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    color: "var(--amber)",
                    textDecoration: "none",
                  }}
                >
                  <ExternalLink size={12} /> live demo
                </a>
              )}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {post.tags.map((t) => (
                <span key={t} className="pill">{t}</span>
              ))}
            </div>
          </div>

          {/* ═════════ BODY ═════════ */}
          <div
            className="holo-panel static article-body-panel"
            style={{ padding: "36px 40px" }}
          >
            <div className="article-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </article>

      <MoshStrip length={200} label="end of article" bursts={5} />

      {/* ═════════ PREV / NEXT ═════════ */}
      <section style={{ padding: "56px 22px 36px" }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <WindowFrame title="CONTINUE / reader.next" tint="amber">
            <div className="pn-grid">
              {prev ? (
                <Link to={`/writing/${prev.slug}`} className="pn-card pn-prev">
                  <div className="mono" style={{ fontSize: 10.5, letterSpacing: "0.22em", color: "var(--paper-dim)", textTransform: "uppercase", marginBottom: 10 }}>
                    ← older
                  </div>
                  <div className="hed" style={{ fontSize: 22, letterSpacing: 0, lineHeight: 1.1, color: "var(--paper)" }}>
                    {prev.title}
                  </div>
                  <div className="mono" style={{ marginTop: 8, fontSize: 11, letterSpacing: "0.12em", color: "var(--paper-dim)" }}>
                    {formatDate(prev.date)}
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {next ? (
                <Link to={`/writing/${next.slug}`} className="pn-card pn-next">
                  <div className="mono" style={{ fontSize: 10.5, letterSpacing: "0.22em", color: "var(--rust)", textTransform: "uppercase", marginBottom: 10, textAlign: "right" }}>
                    newer →
                  </div>
                  <div className="hed" style={{ fontSize: 22, letterSpacing: 0, lineHeight: 1.1, color: "var(--paper)", textAlign: "right" }}>
                    {next.title}
                  </div>
                  <div className="mono" style={{ marginTop: 8, fontSize: 11, letterSpacing: "0.12em", color: "var(--paper-dim)", textAlign: "right" }}>
                    {formatDate(next.date)}
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </WindowFrame>

          <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginTop: 28 }}>
            {post.github && (
              <a href={post.github} target="_blank" rel="noreferrer" className="btn primary">
                <Github size={12} /> view on github
              </a>
            )}
            {post.demo && (
              <a href={post.demo} target="_blank" rel="noreferrer" className="btn amber">
                <ExternalLink size={12} /> live demo
              </a>
            )}
            <Link to="/writing" className="btn">
              <ArrowLeft size={12} /> all posts
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .article-body { font-size: 16px; line-height: 1.85; color: var(--paper-mid); }
        .article-body > *:first-child { margin-top: 0 !important; }

        .pn-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .pn-card {
          padding: 26px 26px;
          text-decoration: none;
          color: inherit;
          transition: background 0.2s var(--ease);
          display: block;
        }
        .pn-prev { border-right: 1px solid var(--hairline-2); }
        .pn-card:hover { background: rgba(236, 229, 215, 0.025); }
        .pn-card:hover .hed { color: var(--rust) !important; }

        @media (max-width: 720px) {
          .pn-grid { grid-template-columns: 1fr; }
          .pn-prev { border-right: none; border-bottom: 1px solid var(--hairline-2); }
          .pn-next .hed, .pn-next .mono { text-align: left !important; }
        }
      `}</style>
    </div>
  );
}
