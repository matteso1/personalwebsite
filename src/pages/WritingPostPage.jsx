import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { getPost } from "../lib/posts";
import { useAuth } from "../lib/useAuth";
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
  if (!D) return null;
  return (
    <div style={{ margin: "24px 0", padding: 16, border: "1px solid var(--rule)", background: "var(--bg-2)" }}>
      <D />
    </div>
  );
};

const codeTheme = {
  'code[class*="language-"]': {
    color: "var(--ink)",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.88em",
    lineHeight: 1.65,
    background: "transparent",
  },
  'pre[class*="language-"]': {
    color: "var(--ink)",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.88em",
    lineHeight: 1.65,
    background: "var(--bg-2)",
    padding: "1em 1.2em",
    margin: 0,
    overflow: "auto",
    border: "1px solid var(--rule)",
  },
  comment: { color: "var(--ink-ghost)", fontStyle: "italic" },
  punctuation: { color: "var(--ink-mid)" },
  property: { color: "var(--accent-q)" },
  tag: { color: "var(--accent-q)" },
  boolean: { color: "var(--accent-q)" },
  number: { color: "var(--accent-q)" },
  string: { color: "#3a6b3a" },
  keyword: { color: "var(--accent-q)", fontWeight: 600 },
  function: { color: "var(--ink)", fontWeight: 600 },
  "class-name": { color: "var(--ink)", fontWeight: 600 },
  operator: { color: "var(--ink-mid)" },
  variable: { color: "var(--ink)" },
};

function fmt(iso) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

const md = {
  h1: ({ children }) => <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 32, fontWeight: 400, letterSpacing: "-0.01em", margin: "44px 0 14px", color: "var(--ink)" }}>{children}</h2>,
  h2: ({ children }) => <h3 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 26, fontWeight: 400, letterSpacing: "-0.005em", margin: "36px 0 12px", color: "var(--ink)", borderBottom: "1px solid var(--rule)", paddingBottom: 8 }}>{children}</h3>,
  h3: ({ children }) => <h4 style={{ fontFamily: "'Charter', Georgia, serif", fontSize: 19, fontWeight: 700, margin: "28px 0 10px", color: "var(--ink)" }}>{children}</h4>,
  p: ({ children }) => <p style={{ fontFamily: "'Charter', Georgia, serif", fontSize: 16.5, lineHeight: 1.68, margin: "0 0 16px", color: "var(--ink)" }}>{children}</p>,
  a: ({ children, href }) => <a href={href} target="_blank" rel="noreferrer" style={{ color: "var(--ink)", textDecoration: "underline", textDecorationColor: "var(--rule-2)", textUnderlineOffset: 3 }}>{children}</a>,
  ul: ({ children }) => <ul style={{ paddingLeft: 22, margin: "0 0 16px", fontFamily: "'Charter', Georgia, serif", fontSize: 16.5, lineHeight: 1.65, color: "var(--ink)" }}>{children}</ul>,
  ol: ({ children }) => <ol style={{ paddingLeft: 22, margin: "0 0 16px", fontFamily: "'Charter', Georgia, serif", fontSize: 16.5, lineHeight: 1.65, color: "var(--ink)" }}>{children}</ol>,
  li: ({ children }) => <li style={{ marginBottom: 6 }}>{children}</li>,
  blockquote: ({ children }) => <blockquote style={{ borderLeft: "3px solid var(--accent-q)", paddingLeft: 16, margin: "20px 0", color: "var(--ink-mid)", fontStyle: "italic" }}>{children}</blockquote>,
  hr: () => <hr style={{ border: "none", borderTop: "1px solid var(--rule)", margin: "32px 0" }} />,
  code: ({ inline, className, children }) => {
    const text = String(children).replace(/\n$/, "");
    const match = /language-(\w+)/.exec(className || "");
    const isBlock = inline === false || !!match || text.includes("\n");
    if (!isBlock) {
      return <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9em", background: "var(--bg-2)", padding: "1px 5px", border: "1px solid var(--rule)" }}>{text}</code>;
    }
    if (text.startsWith("@diagram:")) {
      const name = text.replace("@diagram:", "").trim();
      return <Diagram name={name} />;
    }
    return (
      <SyntaxHighlighter style={codeTheme} language={match?.[1] || "text"} PreTag="div">
        {text}
      </SyntaxHighlighter>
    );
  },
  pre: ({ children }) => <>{children}</>,
  table: ({ children }) => <div style={{ overflowX: "auto", margin: "16px 0" }}><table style={{ borderCollapse: "collapse", width: "100%", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>{children}</table></div>,
  th: ({ children }) => <th style={{ borderBottom: "1px solid var(--rule-2)", padding: "8px 10px", textAlign: "left", color: "var(--ink-dim)", fontWeight: 600 }}>{children}</th>,
  td: ({ children }) => <td style={{ borderBottom: "1px solid var(--rule)", padding: "6px 10px", color: "var(--ink)" }}>{children}</td>,
};

export default function WritingPostPage() {
  const { slug } = useParams();
  const { isAdmin } = useAuth();
  const [post, setPost] = React.useState(undefined);

  React.useEffect(() => {
    getPost(slug).then(setPost);
  }, [slug]);

  if (post === undefined) return <div className="q-page"><p className="q-tagline">…</p></div>;
  if (post === null) return <Navigate to="/writing" replace />;

  return (
    <div className="q-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Link to="/writing" className="q-mono" style={{ fontSize: 12, color: "var(--ink-dim)", textDecoration: "none" }}>
          ← writing
        </Link>
        {isAdmin && (
          <Link to={`/writing/${slug}/edit`} className="q-mono" style={{ fontSize: 12, color: "var(--c-green)", textDecoration: "none" }}>
            edit →
          </Link>
        )}
      </div>

      <div className="q-post-meta" style={{ marginBottom: 8 }}>
        {fmt(post.date)} · {post.readTime}
      </div>
      <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.1, margin: "0 0 14px", color: "var(--ink)" }}>
        {post.title}
      </h1>
      {post.subtitle && (
        <p style={{ fontFamily: "'Charter', Georgia, serif", fontStyle: "italic", fontSize: 19, lineHeight: 1.4, color: "var(--ink-mid)", margin: "0 0 28px", maxWidth: "60ch" }}>
          {post.subtitle}
        </p>
      )}

      {(post.github || post.demo) && (
        <div style={{ display: "flex", gap: 12, marginBottom: 32, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
          {post.github && <a href={post.github} target="_blank" rel="noreferrer" className="q-btn">github →</a>}
          {post.demo && <a href={post.demo} target="_blank" rel="noreferrer" className="q-btn">demo →</a>}
        </div>
      )}

      <article style={{ maxWidth: "68ch" }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={md}>
          {post.content || ""}
        </ReactMarkdown>
      </article>
    </div>
  );
}
