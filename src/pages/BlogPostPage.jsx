import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import mermaid from "mermaid";
import { ArrowLeft, Calendar, Clock, Github, ExternalLink } from "lucide-react";
import blogPosts from "../data/blogPosts";
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

// Map of diagram names to components
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

// Component to render diagrams by name
const Diagram = ({ name }) => {
    const DiagramComponent = diagramComponents[name];
    if (!DiagramComponent) {
        return (
            <div className="my-8 p-4 border border-terminal-amber/50 bg-terminal-surface/50 rounded-sm">
                <p className="text-terminal-amber text-sm">Unknown diagram: {name}</p>
            </div>
        );
    }
    return <DiagramComponent />;
};

const Mermaid = ({ chart }) => {
    const [svg, setSvg] = React.useState('');
    const [error, setError] = React.useState(null);
    const id = React.useId().replace(/:/g, '');
    const containerRef = React.useRef(null);

    React.useEffect(() => {
        const renderChart = async () => {
            try {
                setError(null);
                const uniqueId = `mermaid-${id}`;
                // Pass container ref for better sizing calculation
                const { svg } = await mermaid.render(uniqueId, chart, containerRef.current);
                setSvg(svg);
            } catch (err) {
                console.error("Mermaid failed to render", err);
                setError(err.message);
            }
        };

        if (chart && containerRef.current) {
            renderChart();
        }
    }, [chart, id, containerRef]);

    if (error) {
        return (
            <div className="my-8 p-4 border border-terminal-red/50 bg-terminal-surface/50 rounded-sm overflow-hidden">
                <p className="text-terminal-red text-xs mb-2 font-bold uppercase tracking-wider">Mermaid Render Error</p>
                <pre className="text-terminal-red/80 text-xs overflow-x-auto whitespace-pre-wrap font-mono mb-4">
                    {error}
                </pre>
                <div className="text-terminal-muted text-xs border-t border-terminal-red/20 pt-2">
                    <p className="mb-1">Raw Content:</p>
                    <pre className="font-mono whitespace-pre">{chart}</pre>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="my-8 flex justify-center bg-terminal-surface/50 p-4 border border-terminal rounded-sm overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
};

// Custom dark theme that matches the terminal aesthetic
const terminalTheme = {
    'code[class*="language-"]': {
        color: "#e4e4e7",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.85em",
        lineHeight: "1.6",
    },
    'pre[class*="language-"]': {
        color: "#e4e4e7",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.85em",
        lineHeight: "1.6",
        background: "#0a0a0b",
        padding: "1.5em",
        margin: "0",
        overflow: "auto",
        borderRadius: "0",
    },
    comment: { color: "#4a4a52" },
    prolog: { color: "#4a4a52" },
    doctype: { color: "#4a4a52" },
    cdata: { color: "#4a4a52" },
    punctuation: { color: "#a1a1aa" },
    property: { color: "#00d4ff" },
    tag: { color: "#ff4757" },
    boolean: { color: "#ffb800" },
    number: { color: "#ffb800" },
    constant: { color: "#00d4ff" },
    symbol: { color: "#00ff9f" },
    selector: { color: "#00ff9f" },
    "attr-name": { color: "#00d4ff" },
    string: { color: "#00ff9f" },
    char: { color: "#00ff9f" },
    builtin: { color: "#00d4ff" },
    operator: { color: "#a1a1aa" },
    entity: { color: "#ffb800" },
    url: { color: "#00d4ff" },
    variable: { color: "#e4e4e7" },
    inserted: { color: "#00ff9f" },
    atrule: { color: "#00d4ff" },
    "attr-value": { color: "#00ff9f" },
    keyword: { color: "#ff4757" },
    regex: { color: "#ffb800" },
    important: { color: "#ffb800", fontWeight: "bold" },
    deleted: { color: "#ff4757" },
    function: { color: "#00d4ff" },
    "class-name": { color: "#ffb800" },
    decorator: { color: "#00d4ff" },
};

// Custom markdown components that match the terminal aesthetic
const markdownComponents = {
    h1: ({ children }) => (
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mt-16 mb-6 first:mt-0">
            {children}
        </h1>
    ),
    h2: ({ children }) => (
        <h2 className="font-display text-2xl md:text-3xl font-bold text-white mt-14 mb-5 pb-3 border-b border-terminal">
            {children}
        </h2>
    ),
    h3: ({ children }) => (
        <h3 className="font-display text-xl md:text-2xl font-semibold text-white mt-10 mb-4">
            {children}
        </h3>
    ),
    h4: ({ children }) => (
        <h4 className="font-display text-lg font-semibold text-terminal-green mt-8 mb-3">
            {children}
        </h4>
    ),
    p: ({ children }) => (
        <p className="text-[#a1a1aa] leading-[1.85] mb-5">{children}</p>
    ),
    strong: ({ children }) => (
        <strong className="text-white font-semibold">{children}</strong>
    ),
    em: ({ children }) => (
        <em className="text-terminal-cyan italic">{children}</em>
    ),
    a: ({ href, children }) => (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-terminal-green hover:text-terminal-cyan underline underline-offset-2 decoration-terminal-green/30 hover:decoration-terminal-cyan/50 transition-colors"
        >
            {children}
        </a>
    ),
    blockquote: ({ children }) => (
        <blockquote className="border-l-2 border-terminal-green/50 pl-6 my-6 text-terminal-muted italic">
            {children}
        </blockquote>
    ),
    ul: ({ children }) => (
        <ul className="space-y-2 mb-5 ml-2">{children}</ul>
    ),
    ol: ({ children }) => (
        <ol className="space-y-2 mb-5 ml-2 list-decimal list-inside marker:text-terminal-green">
            {children}
        </ol>
    ),
    li: ({ children, ordered }) => (
        <li className="text-[#a1a1aa] leading-relaxed flex items-start gap-2">
            {!ordered && (
                <span className="text-terminal-green mt-1.5 text-xs select-none shrink-0">
                    ▸
                </span>
            )}
            <span className="flex-1">{children}</span>
        </li>
    ),
    hr: () => (
        <hr className="border-terminal my-12" />
    ),
    code: ({ className, children, ...props }) => {
        const match = /language-(\w+)/.exec(className || "");
        const inline = !className;

        if (inline) {
            return (
                <code className="px-1.5 py-0.5 bg-terminal text-terminal-cyan text-[0.85em] border border-terminal-border font-mono">
                    {children}
                </code>
            );
        }

        // Handle custom diagram markers
        if (match && match[1] === "diagram") {
            const diagramName = String(children).trim();
            return <Diagram name={diagramName} />;
        }

        if (match && match[1] === "mermaid") {
            return <Mermaid chart={String(children).replace(/\n$/, "")} />;
        }

        return (
            <div className="my-6 terminal-card overflow-hidden">
                {match && (
                    <div className="flex items-center gap-2 px-4 py-2 border-b border-terminal text-xs text-terminal-muted">
                        <span className="w-2.5 h-2.5 rounded-full bg-terminal-red/60" />
                        <span className="w-2.5 h-2.5 rounded-full bg-terminal-amber/60" />
                        <span className="w-2.5 h-2.5 rounded-full bg-terminal-green/60" />
                        <span className="ml-2">{match[1]}</span>
                    </div>
                )}
                <SyntaxHighlighter
                    style={terminalTheme}
                    language={match ? match[1] : "text"}
                    PreTag="div"
                    customStyle={{
                        margin: 0,
                        background: "#0a0a0b",
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
            <table className="w-full text-sm border border-terminal">{children}</table>
        </div>
    ),
    thead: ({ children }) => (
        <thead className="bg-terminal-surface border-b border-terminal">
            {children}
        </thead>
    ),
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
        <tr className="border-b border-terminal last:border-0 hover:bg-terminal-green/5 transition-colors">
            {children}
        </tr>
    ),
    th: ({ children }) => (
        <th className="px-4 py-3 text-left text-terminal-green text-xs tracking-wider uppercase font-semibold">
            {children}
        </th>
    ),
    td: ({ children }) => (
        <td className="px-4 py-3 text-[#a1a1aa]">{children}</td>
    ),
};

const BlogPostPage = () => {
    const { slug } = useParams();
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        return <Navigate to="/blog" replace />;
    }

    return (
        <div className="min-h-screen px-6 md:px-12 lg:px-20 py-20">
            <div className="max-w-4xl">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-sm text-terminal-muted hover:text-terminal-green transition-colors mb-12"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to blog</span>
                    </Link>
                </motion.div>

                {/* Article Header */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <div className="section-label mb-6">ARTICLE</div>

                    <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                        {post.title}
                    </h1>

                    <p className="text-terminal-green text-lg mb-6">{post.subtitle}</p>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-terminal-muted mb-8">
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
                                className="flex items-center gap-1.5 hover:text-terminal-green transition-colors"
                            >
                                <Github className="w-4 h-4" />
                                View source
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1 text-xs border border-terminal text-terminal-muted"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </motion.header>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-terminal-green/50 via-terminal-cyan/30 to-transparent mb-12" />

                {/* Article Content */}
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="prose-terminal"
                >
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                    >
                        {post.content}
                    </ReactMarkdown>
                </motion.article>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-20 pt-12 border-t border-terminal"
                >
                    <div className="terminal-card p-8 text-center">
                        <h3 className="font-display text-xl font-bold text-white mb-3">
                            Interested in the code?
                        </h3>
                        <p className="text-terminal-muted mb-6 text-sm">
                            The full implementation is open source — kernels, training scripts,
                            benchmarks, and all.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {post.github && (
                                <a
                                    href={post.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-3 px-6 py-3 bg-terminal-green text-terminal-bg font-semibold hover:bg-terminal-green/90 transition-colors"
                                >
                                    <Github className="w-5 h-5" />
                                    View on GitHub
                                </a>
                            )}
                            <Link
                                to="/blog"
                                className="inline-flex items-center gap-3 px-6 py-3 border border-terminal text-terminal-muted hover:text-terminal-green hover:border-terminal-green transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to all posts
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BlogPostPage;
