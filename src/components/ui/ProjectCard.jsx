import React from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, ArrowUpRight } from "lucide-react";

export const ProjectCard = ({ project, index = 0, featured = false }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  if (featured) {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="group relative mb-12"
      >
        {/* Glowing border effect */}
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-violet-500/50 via-purple-500/30 to-cyan-500/50 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm" />

        <div className="relative p-8 md:p-10 rounded-2xl bg-zinc-900/80 border border-zinc-800 group-hover:border-transparent transition-all duration-500 backdrop-blur-sm">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-3xl md:text-4xl font-black text-white group-hover:text-gradient-static transition-all duration-300">
                  {project.title}
                </h3>
                <span className="text-sm font-mono text-zinc-600">{project.year}</span>
              </div>
              <p className="text-lg font-medium text-cyan-400">{project.subtitle}</p>
            </div>

            {/* Status badge */}
            <span
              className={`
                inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold
                ${project.status === "Active"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-zinc-800/80 text-zinc-400 border border-zinc-700"
                }
              `}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-2 ${project.status === "Active" ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"}`} />
              {project.status}
            </span>
          </div>

          {/* Description */}
          <p className="text-zinc-400 leading-relaxed mb-6 max-w-3xl">
            {project.description}
          </p>

          {/* Highlights */}
          {project.highlights && (
            <div className="flex flex-wrap gap-3 mb-6">
              {project.highlights.map((highlight) => (
                <span
                  key={highlight}
                  className="px-4 py-1.5 rounded-lg bg-violet-500/10 text-violet-300 text-sm font-medium border border-violet-500/20"
                >
                  {highlight}
                </span>
              ))}
            </div>
          )}

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-md text-xs font-mono text-zinc-500 bg-zinc-800/60 border border-zinc-700/50"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-6">
            {project.links?.repo && (
              <motion.a
                href={project.links.repo}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-white hover:text-violet-400 transition-colors group/link"
                whileHover={{ x: 4 }}
              >
                <Github className="w-5 h-5" />
                View Source
                <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
              </motion.a>
            )}
            {project.links?.demo && (
              <motion.a
                href={project.links.demo}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-white hover:text-cyan-400 transition-colors group/link"
                whileHover={{ x: 4 }}
              >
                <ExternalLink className="w-5 h-5" />
                Live Demo
                <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Regular card
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="group relative"
    >
      {/* Glowing border effect */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-violet-500/40 via-transparent to-cyan-500/40 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm" />

      <motion.div
        className="relative h-full p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 group-hover:border-transparent transition-all duration-500 backdrop-blur-sm"
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
      >
        {/* Status indicator */}
        <div className="absolute top-4 right-4">
          <span
            className={`
              px-3 py-1 rounded-full text-xs font-medium
              ${project.status === "Active"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-zinc-800 text-zinc-500 border border-zinc-700"
              }
            `}
          >
            {project.status}
          </span>
        </div>

        {/* Project header */}
        <div className="mb-4 pr-20">
          <div className="flex items-baseline gap-3">
            <h3 className="text-2xl font-bold text-white group-hover:text-violet-400 transition-colors">
              {project.title}
            </h3>
            <span className="text-xs font-mono text-zinc-600">{project.year}</span>
          </div>
          <p className="text-sm font-medium text-cyan-400 mt-1">{project.subtitle}</p>
        </div>

        {/* Description */}
        <p className="text-zinc-400 text-sm leading-relaxed mb-5">
          {project.description}
        </p>

        {/* Highlights */}
        {project.highlights && (
          <div className="flex flex-wrap gap-2 mb-5">
            {project.highlights.slice(0, 2).map((highlight) => (
              <span
                key={highlight}
                className="px-3 py-1 rounded-lg bg-violet-500/10 text-violet-300 text-xs font-medium border border-violet-500/20"
              >
                {highlight}
              </span>
            ))}
          </div>
        )}

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 rounded text-xs font-mono text-zinc-500 bg-zinc-800/50"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-4 pt-2 border-t border-zinc-800/50">
          {project.links?.repo && (
            <motion.a
              href={project.links.repo}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-white hover:text-violet-400 transition-colors"
              whileHover={{ x: 3 }}
            >
              <Github className="w-4 h-4" />
              Code
            </motion.a>
          )}
          {project.links?.demo && (
            <motion.a
              href={project.links.demo}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-white hover:text-cyan-400 transition-colors"
              whileHover={{ x: 3 }}
            >
              <ExternalLink className="w-4 h-4" />
              Demo
            </motion.a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectCard;
