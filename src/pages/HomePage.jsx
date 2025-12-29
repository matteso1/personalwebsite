import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Github, Linkedin, Download } from "lucide-react";
import site from "../content/site.json";

const HomePage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-12 py-20 sm:py-32">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="space-y-8 mb-24"
      >
        <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-white leading-[0.9]">
          Hi, I'm <span className="text-zinc-500">Nils.</span>
        </h1>
        <h2 className="text-2xl sm:text-3xl text-zinc-400 font-medium max-w-2xl leading-snug">
          {site.hero.subtitle}
        </h2>
        <p className="text-lg text-zinc-400 max-w-xl leading-relaxed">
          {site.about.story} {site.about.approach}
        </p>

        <div className="flex flex-wrap gap-4 pt-4">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-zinc-200 transition-colors"
          >
            View Projects <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={site.links.resume}
            className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-800 text-white rounded-full font-medium hover:bg-zinc-900 transition-colors"
          >
            Resume <Download className="w-4 h-4" />
          </a>
        </div>
      </motion.section>

      {/* Tech Stack - Minimal List */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-24"
      >
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-600 mb-8">Tech Stack</h3>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-zinc-400 font-mono text-sm leading-relaxed">
          {site.about.skills.map((skill, i) => (
            <span key={i} className="hover:text-white transition-colors cursor-default">
              {skill}
            </span>
          ))}
        </div>
      </motion.section>

      {/* Education / Experience */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-24"
      >
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-600 mb-8">Education</h3>
        <div className="border-l border-zinc-800 pl-6 space-y-2">
          <h4 className="text-xl font-bold text-white">{site.education.degree}</h4>
          <p className="text-zinc-400">{site.education.institution}</p>
          <p className="text-zinc-500 text-sm">{site.education.status} • {site.education.location}</p>
        </div>
      </motion.section>

      {/* Contact Simple */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-600 mb-8">Connect</h3>
        <div className="flex gap-6">
          <a href={site.links.github} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors">
            <Github className="w-6 h-6" />
          </a>
          <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors">
            <Linkedin className="w-6 h-6" />
          </a>
          <a href={site.links.email} className="text-zinc-400 hover:text-white transition-colors">
            <Mail className="w-6 h-6" />
          </a>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
