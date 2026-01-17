import React from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, ArrowUpRight } from "lucide-react";
import site from "../content/site.json";

const ProjectsPage = () => {
  const projects = site.projects.featured;

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
          <div className="section-label mb-8">02 PROJECTS</div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Systems & Applications
          </h1>

          <p className="text-terminal-muted text-lg max-w-2xl">
            {site.projects.description} Built from scratch, optimized for performance, deployed to production.
          </p>
        </motion.div>

        {/* Projects List */}
        <div className="space-y-12">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="terminal-card glow-border group"
            >
              {/* Project Header */}
              <div className="p-6 md:p-8 border-b border-terminal">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-terminal-green text-sm font-mono">
                      {String(index + 1).padStart(2, '0')}//
                    </span>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-white group-hover:text-terminal-green transition-colors">
                      {project.title}
                    </h2>
                    {project.status === 'Active' && (
                      <span className="status-active text-xs">ACTIVE</span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-terminal-muted text-sm">{project.year}</span>
                    <div className="flex gap-3">
                      {project.links?.repo && (
                        <a
                          href={project.links.repo}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 border border-terminal text-terminal-muted hover:text-terminal-green hover:border-terminal-green transition-colors"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.links?.demo && (
                        <a
                          href={project.links.demo}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 border border-terminal text-terminal-muted hover:text-terminal-cyan hover:border-terminal-cyan transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-terminal-green text-sm mt-2 md:ml-14">
                  {project.subtitle}
                </p>
              </div>

              {/* Project Content */}
              <div className="p-6 md:p-8">
                <p className="text-terminal-muted leading-relaxed mb-8">
                  {project.description}
                </p>

                {/* Metrics / Highlights Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {project.highlights.map((highlight, i) => (
                    <div
                      key={highlight}
                      className="p-4 bg-terminal border border-terminal"
                    >
                      <div className="text-terminal-green text-xs mb-1">
                        {'>'} {String(i + 1).padStart(2, '0')}
                      </div>
                      <div className="text-white text-sm font-medium">
                        {highlight}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-3">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs border border-terminal text-terminal-muted hover:text-terminal-cyan hover:border-terminal-cyan/50 transition-colors cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* View Project Link */}
              {project.links?.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-4 md:px-8 border-t border-terminal text-terminal-muted hover:text-terminal-green hover:bg-terminal-green/5 transition-all group/link"
                >
                  <span className="text-sm">View live project</span>
                  <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                </a>
              )}
            </motion.article>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20 terminal-card p-8 md:p-12 text-center"
        >
          <h3 className="font-display text-2xl font-bold text-white mb-4">
            Want to see more?
          </h3>
          <p className="text-terminal-muted mb-6">
            Check out my GitHub for additional projects, experiments, and contributions.
          </p>
          <a
            href={site.links.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 bg-terminal-green text-terminal-bg font-semibold hover:bg-terminal-green/90 transition-colors"
          >
            <Github className="w-5 h-5" />
            View GitHub Profile
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectsPage;
