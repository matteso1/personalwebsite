import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import site from "../content/site.json";

const ProjectsPage = () => {
  const SkillTag = ({ children }) => (
    <motion.span 
      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/80 backdrop-blur-sm"
      whileHover={{ scale: 1.05, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.span>
  );

  const ProjectCard = ({ project, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.8 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="group"
    >
      <div className="h-full p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-300">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium">
                {project.status}
              </div>
              <span className="text-white/40 text-sm">{project.year}</span>
            </div>
            <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
              {project.title}
            </h3>
            {project.subtitle && (
              <p className="text-purple-400 font-medium">{project.subtitle}</p>
            )}
          </div>

          {/* Description */}
          <p className="text-white/70 leading-relaxed">
            {project.description}
          </p>

          {/* Highlights */}
          {project.highlights && (
            <div className="space-y-2">
              <h4 className="text-white font-semibold text-sm">Key Features:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-center gap-2 text-white/60 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                    {highlight}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm">Technologies:</h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <SkillTag key={tech}>{tech}</SkillTag>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-xl transition-colors text-sm font-medium"
            >
              <ExternalLink className="h-4 w-4 inline mr-2" />
              View Demo
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm font-medium"
            >
              <Github className="h-4 w-4 inline mr-2" />
              Source Code
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/20 mb-6">
            <span className="text-sm font-medium text-white/80">PORTFOLIO</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {site.projects.title}
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            {site.projects.description}
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {site.projects.featured.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-amber-500/10 border border-white/10 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-4">More Projects Coming Soon</h2>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              I'm constantly working on new projects and experiments. Follow my blog for updates on current work and new releases.
            </p>
            <motion.a
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-xl transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Follow My Progress
              <ArrowRight className="h-4 w-4" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectsPage;
