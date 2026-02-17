import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Github, Linkedin, Mail, Menu, X, Terminal, FileCode, User, Send, BookOpen, Gamepad2 } from "lucide-react";
import site from "../content/site.json";
import GameOfLife from "./GameOfLife";

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navigationItems = [
    { name: 'Index', path: '/', icon: Terminal, num: '01' },
    { name: 'Projects', path: '/projects', icon: FileCode, num: '02' },
    { name: 'Blog', path: '/blog', icon: BookOpen, num: '03' },
    { name: 'Arcade', path: '/arcade', icon: Gamepad2, num: '04' }
  ];

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden bg-terminal">
      {/* Game of Life Background */}
      <GameOfLife className="opacity-40" />

      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Scanlines */}
      <div className="scanlines" />

      {/* Sidebar Navigation - Desktop */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex fixed left-0 top-0 bottom-0 w-20 flex-col items-center py-8 z-50 border-r border-terminal bg-terminal/80 backdrop-blur-sm"
      >
        {/* Logo */}
        <Link to="/" className="mb-12 group">
          <div className="w-10 h-10 border border-terminal-green/50 flex items-center justify-center text-terminal-green font-bold text-lg group-hover:bg-terminal-green/10 group-hover:border-terminal-green transition-all">
            NM
          </div>
        </Link>

        {/* Nav Items */}
        <nav className="flex-1 flex flex-col items-center gap-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex flex-col items-center`}
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center border transition-all duration-300 ${isActive
                    ? 'border-terminal-green bg-terminal-green/10 text-terminal-green'
                    : 'border-terminal text-terminal-muted hover:border-terminal-green/50 hover:text-terminal-green'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-1 text-terminal-muted">{item.num}</span>

                {/* Tooltip */}
                <div className="absolute left-full ml-4 px-3 py-1 bg-terminal-surface border border-terminal text-terminal-green text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Social Links */}
        <div className="flex flex-col items-center gap-4 mt-auto">
          <a
            href={site.links.github}
            target="_blank"
            rel="noreferrer"
            className="text-terminal-muted hover:text-terminal-green transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href={site.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-terminal-muted hover:text-terminal-cyan transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href={site.links.email}
            className="text-terminal-muted hover:text-terminal-amber transition-colors"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>

        {/* Status indicator */}
        <div className="mt-6 text-[10px] text-terminal-muted text-center">
          <div className="text-terminal-green">ONLINE</div>
          <div>{currentTime.toLocaleTimeString('en-US', { hour12: false })}</div>
        </div>
      </motion.aside>

      {/* Top Bar - Mobile & Desktop */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="fixed top-0 left-0 lg:left-20 right-0 h-14 z-40 border-b border-terminal bg-terminal/90 backdrop-blur-sm flex items-center justify-between px-6"
      >
        {/* Left side - breadcrumb style */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-terminal-green">~</span>
          <span className="text-terminal-muted">/</span>
          <span className="text-terminal-green">nils-matteson</span>
          <span className="text-terminal-muted">/</span>
          <span className="text-white">
            {location.pathname === '/' ? 'index' : location.pathname.slice(1)}
          </span>
          <span className="text-terminal-green animate-pulse">_</span>
        </div>

        {/* Right side - status */}
        <div className="hidden md:flex items-center gap-6 text-xs text-terminal-muted">
          <span>UW-Madison '26</span>
          <span className="text-terminal-green">
            <span className="inline-block w-2 h-2 bg-terminal-green rounded-full mr-2 animate-pulse" />
            Available for opportunities
          </span>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 text-terminal-muted hover:text-terminal-green transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden bg-terminal/95 backdrop-blur-xl"
          >
            <div className="flex flex-col h-full pt-20 px-8">
              <nav className="flex-1">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-4 py-6 border-b border-terminal text-xl"
                      >
                        <span className="text-terminal-green text-sm">{item.num}//</span>
                        <Icon className="w-6 h-6 text-terminal-muted" />
                        <span className={location.pathname === item.path ? 'text-terminal-green' : 'text-white'}>
                          {item.name}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="py-8 border-t border-terminal">
                <div className="flex gap-6 mb-6">
                  <a href={site.links.github} target="_blank" rel="noreferrer" className="text-terminal-muted hover:text-terminal-green">
                    <Github className="w-6 h-6" />
                  </a>
                  <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="text-terminal-muted hover:text-terminal-cyan">
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a href={site.links.email} className="text-terminal-muted hover:text-terminal-amber">
                    <Mail className="w-6 h-6" />
                  </a>
                </div>
                <p className="text-terminal-muted text-sm">{site.links.email.replace('mailto:', '')}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative lg:ml-20 pt-14 min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative lg:ml-20 border-t border-terminal mt-20 bg-terminal/80">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8 text-sm">
            <div>
              <div className="section-label mb-4">Contact</div>
              <a href={site.links.email} className="text-terminal-green hover:underline">
                {site.links.email.replace('mailto:', '')}
              </a>
            </div>
            <div>
              <div className="section-label mb-4">Location</div>
              <p className="text-terminal-muted">Madison, WI</p>
              <p className="text-terminal-muted">University of Wisconsin-Madison</p>
            </div>
            <div className="text-right">
              <div className="section-label mb-4">Status</div>
              <p className="text-terminal-green">Open to opportunities</p>
              <p className="text-terminal-muted mt-2">{new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
