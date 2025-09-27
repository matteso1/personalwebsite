import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Download, Code, BookOpen, User, Mail } from "lucide-react";
import site from "../content/site.json";

const HomePage = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const SkillTag = ({ children }) => (
    <motion.span 
      className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/80 backdrop-blur-sm"
      whileHover={{ scale: 1.05, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.span>
  );

  const ActionCard = ({ icon: Icon, title, description, to, external = false }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {external ? (
        <a 
          href={to}
          target="_blank"
          rel="noreferrer"
          className="block p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-300"
        >
          <Icon className="h-8 w-8 text-purple-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-white/70 text-sm">{description}</p>
        </a>
      ) : (
        <Link 
          to={to}
          className="block p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-300"
        >
          <Icon className="h-8 w-8 text-purple-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-white/70 text-sm">{description}</p>
        </Link>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid lg:grid-cols-12 gap-12 items-center"
          >
            {/* Left Column - Main Content */}
            <div className="lg:col-span-8 space-y-8">
              <motion.div variants={fadeInUp} className="space-y-6">
                <motion.div 
                  className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/20"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-white/90">Available for opportunities</span>
                </motion.div>
                
                <h1 className="font-display font-bold tracking-tight leading-[1.1] mb-6" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)' }}>
                  <span className="block text-white mb-2">Hi, I'm {site.name.split(' ')[0]}</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-600">
                    {site.hero.subtitle}
                  </span>
                </h1>
                
                <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
                  {site.hero.description}
                </p>
              </motion.div>
              
              <motion.div 
                variants={fadeInUp}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white rounded-2xl font-medium transition-all duration-300 hover:scale-105"
                >
                  <Code className="h-4 w-4" />
                  View Projects
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-medium transition-all duration-300 hover:scale-105"
                >
                  <Download className="h-4 w-4" />
                  Resume
                </a>
              </motion.div>
            </div>
            
            {/* Right Column - Profile Card */}
            <motion.div 
              variants={fadeInUp}
              className="lg:col-span-4"
            >
              <div className="relative">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden border-2 border-white/20">
                      <img 
                        src="/profile-photo.jpg" 
                        alt="Nils Matteson" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{site.education.degree}</h3>
                      <p className="text-white/70 mb-1">{site.education.institution}</p>
                      <p className="text-purple-400 text-sm font-medium">{site.education.status}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {site.about.skills.slice(0, 6).map((skill) => (
                        <SkillTag key={skill}>{skill}</SkillTag>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Decorative gradient blobs */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-500/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-cyan-500/20 rounded-full blur-xl"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-black/20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Explore My Work
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Discover my projects, read about my journey, and get to know more about my experience in tech.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ActionCard
              icon={Code}
              title="Projects"
              description="End-to-end ML systems and data products"
              to="/projects"
            />
            <ActionCard
              icon={BookOpen}
              title="Blog & Updates"
              description="Journey in tech and project insights"
              to="/blog"
            />
            <ActionCard
              icon={User}
              title="About Me"
              description="Background, education, and experience"
              to="/about"
            />
            <ActionCard
              icon={Mail}
              title="Contact"
              description="Let's connect and collaborate"
              to="/contact"
            />
          </motion.div>
        </div>
      </section>

      {/* Featured Project Highlight */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured Project
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <Link to="/projects" className="block group">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-amber-500/10 border border-white/10 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-300 group-hover:scale-[1.02]">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium">
                      {site.projects.featured[0].status}
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                      {site.projects.featured[0].title}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {site.projects.featured[0].description.slice(0, 200)}...
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {site.projects.featured[0].tech.slice(0, 4).map((tech) => (
                        <SkillTag key={tech}>{tech}</SkillTag>
                      ))}
                    </div>
                  </div>
                  <div className="relative h-64 rounded-2xl bg-gradient-to-br from-purple-600/20 to-cyan-600/20 flex items-center justify-center">
                    <div className="text-center text-white/60">
                      <Code className="h-16 w-16 mx-auto mb-4" />
                      <p className="text-sm">Interactive Demo Coming Soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
