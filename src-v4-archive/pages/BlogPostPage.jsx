import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { ArrowLeft, Calendar, Clock, Github, ExternalLink } from "lucide-react";
import blogPosts from "../data/blogPosts";
import HudFrame from "../components/HudFrame";
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
  const DiagramComponent = diagramComponents[name];
  if (!DiagramComponent) {
    return (
      <div
        className="my-8 p-4 rounded"
        style={{
          border: "1px solid var(--warn)",
          background: "rgba(255, 184, 0, 0.08)",
        }}
      >
        <p className="mono text-sm" style={{ color: "var(--warn)" }}>
          Unknown diagram: {name}
        </p>
      </div>
    );
  }
  return <DiagramComponent />;
};

const codeTheme = {
  'code[class*="language-"]': {
    color: "var(--text)",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.85em",
    lineHeight: "1.6",
  },
  'pre[class*="language-"]': {
    color: "var(--text)",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.85em",
    lineHeight: "1.6",
    background: "var(--bg-2)",
    padding: "1.5em",
    margin: "0",
    overflow: "auto",
    borderRadius: "0",
  },
  comment: { color: "#404554" },
  prolog: { color: "#404554" },
  doctype: { color: "#404554" },
  cdata: { color: "#404554" },
  punctuation: { color: "#a9b0c2" },
  property: { color: "var(--aqua)" },
  tag: { color: "var(--hotmag)" },
  boolean: { color: "var(--jaune)" },
  number: { color: "var(--jaune)" },
  constant: { color: "var(--aqua)" },
  symbol: { color: "var(--acid)" },
  selector: { color: "var(--acid)" },
  "attr-name": { color: "var(--aqua)" },
  string: { color: "var(--acid)" },
  char: { color: "var(--acid)" },
  builtin: { color: "var(--aqua)" },
  operator: { color: "#a9b0c2" },
  entity: { color: "var(--jaune)" },
  url: { color: "var(--aqua)" },
  variable: { color: "var(--text)" },
  inserted: { color: "var(--acid)" },
  atrule: { color: "var(--aqua)" },
  "attr-value": { color: "var(--acid)" },
  keyword: { color: "var(--hotmag)" },
  regex: { color: "var(--jaune)" },
  important: { color: "var(--jaune)", fontWeight: "bold" },
  deleted: { color: "var(--hotmag)" },
  function: { color: "var(--plasma)" },
  "class-name": { color: "var(--jaune)" },
  decorator: { color: "var(--aqua)" },
};

const markdownComponents = {
  h1: ({ children }) => (
    <h1
      className="display mt-16 mb-6 first:mt-0"
      style={{
        fontSize: "clamp(28px, 4vw, 44px)",
        letterSpacing: "-0.04em",
        color: "var(--text)",
      }}
    >
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2
      className="display mt-14 mb-5 pb-3"
      style={{
        fontSize: "clamp(24px, 3.2vw, 36px)",
        letterSpacing: "-0.035em",
        color: "var(--text)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      className="display mt-10 mb-4"
      style={{
        fontSize: "clamp(20px, 2.4vw, 28px)",
        letterSpacing: "-0.03em",
        color: "var(--text)",
      }}
    >
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4
      className="serif-italic mt-8 mb-3"
      style={{ fontSize: "20px", color: "var(--acid)" }}
    >
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="leading-[1.85] mb-5" style={{ color: "var(--text-mid)" }}>
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong style={{ color: "var(--text)", fontWeight: 600 }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em className="serif-italic" style={{ color: "var(--aqua)" }}>
      {children}
    </em>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        color: "var(--acid)",
        textDecoration: "underline",
        textDecorationColor: "rgba(140, 255, 0, 0.35)",
        textUnderlineOffset: "2px",
      }}
      className="hover:opacity-80 transition-opacity"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote
      className="pl-6 my-6 serif-italic"
      style={{
        borderLeft: "2px solid var(--acid)",
        color: "var(--text-mid)",
      }}
    >
      {children}
    </blockquote>
  ),
  ul: ({ children }) => <ul className="space-y-2 mb-5 ml-2">{children}</ul>,
  ol: ({ children }) => (
    <ol className="space-y-2 mb-5 ml-2 list-decimal list-inside">{children}</ol>
  ),
  li: ({ children, ordered }) => (
    <li
      className="leading-relaxed flex items-start gap-2"
      style={{ color: "var(--text-mid)" }}
    >
      {!ordered && (
        <span
          className="mt-1.5 text-xs select-none shrink-0"
          style={{ color: "var(--acid)" }}
        >
          ▸
        </span>
      )}
      <span className="flex-1">{children}</span>
    </li>
  ),
  hr: () => (
    <hr className="my-12" style={{ border: "none", borderTop: "1px solid var(--border)" }} />
  ),
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    const inline = !className;

    if (inline) {
      return (
        <code
          className="px-1.5 py-0.5 mono"
          style={{
            background: "var(--bg-2)",
            color: "var(--aqua)",
            fontSize: "0.85em",
            border: "1px solid var(--border-mid)",
          }}
        >
          {children}
        </code>
      );
    }

    if (match && match[1] === "diagram") {
      const diagramName = String(children).trim();
      return <Diagram name={diagramName} />;
    }

    return (
      <div
        className="my-6 overflow-hidden rounded-lg"
        style={{
          border: "1px solid var(--border)",
          background: "var(--bg-2)",
        }}
      >
        {match && (
          <div
            className="flex items-center gap-2 px-4 py-2 mono text-xs"
            style={{
              borderBottom: "1px solid var(--border)",
              color: "var(--text-dim)",
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "var(--magenta)" }}
            />
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "var(--warn)" }}
            />
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "var(--acid)" }}
            />
            <span className="ml-2">{match[1]}</span>
          </div>
        )}
        <SyntaxHighlighter
          style={codeTheme}
          language={match ? match[1] : "text"}
          PreTag="div"
          customStyle={{
            margin: 0,
            background: "var(--bg-2)",
            padding: "1.25rem",
          }}
          codeTagProps={{
            style: {
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.85em",
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
    <div className="my-6 overflow-x-auto">
      <table
        className="w-full text-sm"
        style={{ border: "1px solid var(--border)" }}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead
      style={{
        background: "var(--bg-2)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {children}
    </thead>
  ),
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr style={{ borderBottom: "1px solid var(--border)" }}>{children}</tr>
  ),
  th: ({ children }) => (
    <th
      className="px-4 py-3 text-left mono text-xs tracking-wider uppercase"
      style={{ color: "var(--acid)" }}
    >
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3" style={{ color: "var(--text-mid)" }}>
      {children}
    </td>
  ),
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="relative pt-20 pb-32">
      <div className="max-w-[900px] mx-auto px-5 sm:px-8 md:px-10">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm mb-12 hover:opacity-80 transition-opacity"
            style={{ color: "var(--text-mid)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="mono">back to writing</span>
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="eyebrow mb-6">
            <span style={{ color: "var(--jaune)" }}>/</span>article.read
          </div>

          <h1
            className="display mb-5 leading-tight"
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              letterSpacing: "-0.045em",
              lineHeight: "0.95",
              color: "var(--text)",
            }}
          >
            {post.title}
          </h1>

          <p
            className="serif-italic text-xl md:text-2xl mb-6"
            style={{ color: "var(--acid)" }}
          >
            {post.subtitle}
          </p>

          <div
            className="flex flex-wrap items-center gap-6 mono text-xs mb-8"
            style={{ color: "var(--text-dim)" }}
          >
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
            {post.github && (
              <a
                href={post.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                style={{ color: "var(--acid)" }}
              >
                <Github className="w-4 h-4" />
                source
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {post.demo && (
              <a
                href={post.demo}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                style={{ color: "var(--acid)" }}
              >
                <ExternalLink className="w-4 h-4" />
                live demo
              </a>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span key={tag} className="pill">{tag}</span>
            ))}
          </div>
        </motion.header>

        <div
          className="h-px mb-12"
          style={{
            background:
              "linear-gradient(to right, var(--acid), var(--hotmag), var(--aqua), transparent)",
            opacity: 0.6,
          }}
        />

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {post.content}
          </ReactMarkdown>
        </motion.article>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20"
        >
          <HudFrame accent="acid" crosses className="p-10 text-center">
            <div className="eyebrow mb-3">
              <span style={{ color: "var(--jaune)" }}>/</span>read.the.code
            </div>
            <h3
              className="display mb-3"
              style={{
                fontSize: "clamp(28px, 3.6vw, 40px)",
                letterSpacing: "-0.04em",
                color: "var(--text)",
                lineHeight: 1,
              }}
            >
              interested in the <span className="serif-italic neon-acid">internals?</span>
            </h3>
            <p className="mb-6" style={{ color: "var(--text-mid)" }}>
              Full implementation open source — kernels, training, benchmarks.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {post.github && (
                <a
                  href={post.github}
                  target="_blank"
                  rel="noreferrer"
                  className="btn primary"
                >
                  <Github className="w-3.5 h-3.5" />
                  view on github
                </a>
              )}
              {post.demo && (
                <a
                  href={post.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="btn magenta"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  live demo
                </a>
              )}
              <Link to="/blog" className="btn">
                <ArrowLeft className="w-3.5 h-3.5" />
                all posts
              </Link>
            </div>
          </HudFrame>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPostPage;
