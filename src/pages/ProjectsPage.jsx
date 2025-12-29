import React from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import site from "../content/site.json";

const ProjectsPage = () => {
  const ProjectCard = ({ project }) => (
    <div className="group space-y-4">
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <h3 className="text-xl font-bold text-white group-hover:text-zinc-300 transition-colors">
            {project.title}
          </h3>
          <span className="text-xs font-mono text-zinc-600">{project.year}</span>
        </div>
        <p className="text-sm font-medium text-zinc-500">{project.subtitle}</p>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
          {project.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-mono text-zinc-600">
        {project.tech.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </div>

      <div className="flex gap-4 pt-2">
        {project.links?.repo && (
          <a
            href={project.links.repo}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-white hover:text-zinc-400 transition-colors"
          >
            <Github className="w-3 h-3" /> Code
          </a>
        )}
        {project.links?.demo && (
          <a
            href={project.links.demo}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-white hover:text-zinc-400 transition-colors"
          >
            <ExternalLink className="w-3 h-3" /> Demo
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-12 py-20 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-24"
      >
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white mb-6">
          Selected <span className="text-zinc-600">Work.</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-xl">
          {site.projects.description}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid md:grid-cols-2 gap-12 sm:gap-16"
      >
        {site.projects.featured.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </motion.div>
    </div>
  );
};

export default ProjectsPage;
