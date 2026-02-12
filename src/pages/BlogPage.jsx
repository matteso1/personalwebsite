import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Calendar, Clock, Github } from "lucide-react";
import blogPosts from "../data/blogPosts";

const BlogPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen px-6 md:px-12 lg:px-20 py-20">
            <div className="max-w-5xl">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-16"
                >
                    <div className="section-label mb-8">03 BLOG</div>

                    <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                        Writing & Research
                    </h1>

                    <p className="text-terminal-muted text-lg max-w-2xl">
                        Deep dives into systems I've built, problems I've debugged, and
                        things I've learned along the way.
                    </p>
                </motion.div>

                {/* Blog Posts List */}
                <div className="space-y-8">
                    {blogPosts.map((post, index) => (
                        <motion.article
                            key={post.slug}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div
                                onClick={() => navigate(`/blog/${post.slug}`)}
                                className="block terminal-card glow-border group cursor-pointer"
                            >
                                {/* Post Header */}
                                <div className="p-6 md:p-8 border-b border-terminal">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-terminal-green text-sm font-mono">
                                                {String(index + 1).padStart(2, "0")}//
                                            </span>
                                            <h2 className="font-display text-2xl md:text-3xl font-bold text-white group-hover:text-terminal-green transition-colors">
                                                {post.title}
                                            </h2>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {post.github && (
                                                <a
                                                    href={post.github}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-2 border border-terminal text-terminal-muted hover:text-terminal-green hover:border-terminal-green transition-colors"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Github className="w-4 h-4" />
                                                </a>
                                            )}
                                            <ArrowUpRight className="w-5 h-5 text-terminal-muted group-hover:text-terminal-green group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                        </div>
                                    </div>

                                    <p className="text-terminal-green text-sm mt-2 md:ml-14">
                                        {post.subtitle}
                                    </p>
                                </div>

                                {/* Post Content Preview */}
                                <div className="p-6 md:p-8">
                                    {/* Meta info */}
                                    <div className="flex flex-wrap items-center gap-4 mb-6 text-xs text-terminal-muted">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(post.date).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {post.readTime}
                                        </span>
                                    </div>

                                    <p className="text-terminal-muted leading-relaxed mb-8">
                                        {post.summary}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-3">
                                        {post.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 text-xs border border-terminal text-terminal-muted group-hover:text-terminal-cyan group-hover:border-terminal-cyan/50 transition-colors"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Read More Footer */}
                                <div className="flex items-center justify-between p-4 md:px-8 border-t border-terminal text-terminal-muted group-hover:text-terminal-green group-hover:bg-terminal-green/5 transition-all">
                                    <span className="text-sm">Read full article</span>
                                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {/* More Coming Soon */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-20 terminal-card p-8 md:p-12 text-center"
                >
                    <h3 className="font-display text-2xl font-bold text-white mb-4">
                        More posts coming soon.
                    </h3>
                    <p className="text-terminal-muted">
                        I write about ML systems, GPU programming, and the things that break
                        along the way.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default BlogPage;
