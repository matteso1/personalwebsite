import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Download, MapPin, Music, Code, Coffee } from "lucide-react";
import site from "../content/site.json";

// Typewriter effect component
const Typewriter = ({ text, delay = 0, speed = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [started, text, speed]);

  return (
    <span>
      {displayText}
      <span className="text-terminal-green animate-pulse">|</span>
    </span>
  );
};

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center px-6 md:px-12 lg:px-20 py-20">
        <div className="max-w-5xl">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="section-label mb-8"
          >
            01 INDEX
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8"
          >
            <span className="text-white">I'm </span>
            <span className="text-terminal-green animate-glow-pulse">Nils</span>
            <span className="text-white">.</span>
            <br />
            <span className="text-terminal-muted">I build systems that scale.</span>
          </motion.h1>

          {/* Subtitle with typewriter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-lg md:text-xl text-terminal-muted mb-12 max-w-2xl font-light"
          >
            <Typewriter
              text="Data Science & CS student at UW-Madison. I build distributed systems, ML pipelines, and high-performance applications. Looking for my first full-time role where I can learn fast and ship real products."
              delay={800}
              speed={25}
            />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/projects">
              <motion.button
                className="group flex items-center gap-3 px-6 py-3 bg-terminal-green text-terminal-bg font-semibold hover:bg-terminal-green/90 transition-colors"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                See my work
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <motion.a
              href={site.links.resume}
              className="flex items-center gap-3 px-6 py-3 border border-terminal text-terminal-muted hover:text-terminal-green hover:border-terminal-green transition-colors"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-4 h-4" />
              Resume
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* About / Story Section */}
      <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-terminal">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl"
        >
          <div className="section-label mb-12">02 ABOUT</div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Left column - story */}
            <div className="space-y-6">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-xl text-white leading-relaxed"
              >
                I care deeply about understanding how things work at a fundamental level.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-terminal-muted leading-relaxed"
              >
                I'm from the Pacific Northwest, studying Data Science and Computer Science at UW-Madison. I didn't start with tutorials - I started by building things I didn't know how to build, breaking them, and figuring out why.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-terminal-muted leading-relaxed"
              >
                That's how I ended up writing a distributed message queue from scratch, building real-time collaboration systems in Rust, and training ML models that outperform baseline approaches. I learn by doing the hard thing first.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-terminal-muted leading-relaxed"
              >
                Outside of engineering, I produce electronic music - it's taught me that great work comes from iteration and attention to detail.
              </motion.p>
            </div>

            {/* Right column - quick facts terminal style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="terminal-card p-6 glow-border"
            >
              <div className="text-terminal-green text-sm mb-4 font-medium">
                {`>`} cat ~/nils/facts.txt
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-terminal-green mt-0.5" />
                  <div>
                    <div className="text-white">Location</div>
                    <div className="text-terminal-muted">Madison, WI (from the Pacific Northwest)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Music className="w-4 h-4 text-terminal-green mt-0.5" />
                  <div>
                    <div className="text-white">Outside work</div>
                    <div className="text-terminal-muted">Electronic music production in Ableton</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Code className="w-4 h-4 text-terminal-green mt-0.5" />
                  <div>
                    <div className="text-white">Current focus</div>
                    <div className="text-terminal-muted">High-throughput systems and ML infrastructure</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Coffee className="w-4 h-4 text-terminal-green mt-0.5" />
                  <div>
                    <div className="text-white">Approach</div>
                    <div className="text-terminal-muted">Learn by building, iterate until it works</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* What I Do Section */}
      <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-terminal">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl"
        >
          <div className="section-label mb-12">03 WHAT I DO</div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: 'Distributed Systems',
                description: 'I build high-throughput systems from scratch. Message queues, consensus protocols, custom storage engines. The stuff that makes everything else possible.'
              },
              {
                num: '02',
                title: 'Machine Learning',
                description: 'End-to-end ML pipelines - from data ingestion to model serving. I care about models that work in production, not just notebooks.'
              },
              {
                num: '03',
                title: 'Full-Stack Development',
                description: 'Real-time apps, interactive experiences, WebAssembly optimization. If it runs in a browser and needs to be fast, I\'m interested.'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="terminal-card p-6 glow-border group"
              >
                <div className="text-terminal-green text-xs mb-4">{`// ${item.num}`}</div>
                <h3 className="font-display text-xl font-bold text-white mb-3 group-hover:text-terminal-green transition-colors">
                  {item.title}
                </h3>
                <p className="text-terminal-muted text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stack Section - Condensed */}
      <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-terminal">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl"
        >
          <div className="section-label mb-12">04 STACK</div>

          <div className="terminal-card p-8 glow-border">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: 'Languages', items: ['Go', 'Rust', 'Python', 'TypeScript', 'C/C++', 'SQL'] },
                { title: 'ML & Data', items: ['PyTorch', 'scikit-learn', 'pandas', 'XGBoost'] },
                { title: 'Systems', items: ['gRPC', 'Docker', 'Redis', 'PostgreSQL', 'AWS'] },
                { title: 'Web', items: ['React', 'FastAPI', 'WebAssembly', 'Three.js'] }
              ].map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h4 className="text-terminal-green text-sm font-medium mb-3">
                    {`// ${category.title}`}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((item) => (
                      <span
                        key={item}
                        className="text-xs text-terminal-muted hover:text-white transition-colors cursor-default"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Education Section */}
      <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-terminal">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl"
        >
          <div className="section-label mb-12">05 EDUCATION</div>

          <div className="terminal-card p-8 glow-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="font-display text-2xl font-bold text-white mb-2">
                  {site.education.institution}
                </h3>
                <p className="text-terminal-green mb-2">{site.education.degree}</p>
                <p className="text-terminal-muted text-sm">{site.education.status}</p>
              </div>
              <div className="text-right">
                <div className="text-terminal-green text-lg font-bold">2026</div>
                <div className="text-terminal-muted text-sm">{site.education.location}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contact CTA */}
      <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-terminal">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl"
        >
          <div className="section-label mb-12">06 LET'S TALK</div>

          <div className="terminal-card p-8 md:p-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Want to build something cool?
            </h2>
            <p className="text-terminal-muted mb-8 max-w-xl">
              I'm looking for internships and full-time roles in ML, systems engineering, or anything that involves making computers do impressive things. Let's chat.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={site.links.email}
                className="inline-flex items-center gap-3 px-6 py-3 bg-terminal-green text-terminal-bg font-semibold hover:bg-terminal-green/90 transition-colors"
              >
                Get in touch
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/projects"
                className="inline-flex items-center gap-3 px-6 py-3 border border-terminal text-terminal-muted hover:text-terminal-green hover:border-terminal-green transition-colors"
              >
                View my projects
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
