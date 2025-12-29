import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Github, Linkedin, Instagram, Menu, X } from "lucide-react";
import site from "../content/site.json";

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

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

  // Simplified Navigation
  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' }
  ];

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden bg-zinc-950">
      {/* Clean Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,255,0.1),rgba(0,0,0,0))] pointer-events-none" />

      {/* Enhanced Navigation */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 w-full z-50 glass border-b border-white/10"
        style={{ backdropFilter: 'blur(24px) saturate(1.8)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-8 h-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
          >
            <Link
              to="/"
              className="font-display font-bold text-xl tracking-tight hover:text-purple-400 transition-colors"
            >
              {site.name}
            </Link>
          </motion.div>

          <nav className="hidden sm:flex items-center gap-8 text-sm font-medium">
            {navigationItems.map((item) => (
              <motion.div key={item.name} whileHover={{ y: -2 }}>
                <Link
                  to={item.path}
                  className={`text-white/80 hover:text-white transition-colors relative group ${location.pathname === item.path ? 'text-white' : ''
                    }`}
                >
                  {item.name}
                  <span className={`absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 transition-transform origin-left ${location.pathname === item.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}></span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="sm:hidden p-2 rounded-xl glass border-white/10"
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>

          <div className="hidden sm:flex items-center gap-3">
            {[
              { href: site.links.github, icon: Github, label: "GitHub" },
              { href: site.links.linkedin, icon: Linkedin, label: "LinkedIn" },
              { href: site.links.instagram, icon: Instagram, label: "Instagram" }
            ].map(({ href, icon: Icon, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl glass border-white/10 hover:border-purple-400/50 hover:bg-purple-500/10 transition-all duration-300"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 sm:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative mt-16 mx-4 p-6 glass border-white/20 rounded-3xl"
          >
            <nav className="space-y-4">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className="block p-4 rounded-2xl glass border-white/10 text-white hover:text-purple-400 transition-colors text-lg font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex justify-center gap-4">
                {[
                  { href: site.links.github, icon: Github, label: "GitHub" },
                  { href: site.links.linkedin, icon: Linkedin, label: "LinkedIn" },
                  { href: site.links.instagram, icon: Instagram, label: "Instagram" }
                ].map(({ href, icon: Icon, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 rounded-2xl glass border-white/10 hover:border-purple-400/50 hover:bg-purple-500/10 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="relative pt-20">
        {children}
      </main>

      {/* Enhanced Footer */}
      <footer className="relative border-t border-white/10 mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div>
              <h3 className="font-display font-bold text-xl text-white mb-2">{site.name}</h3>
              <p className="text-white/60 text-sm">{site.tagline}</p>
            </div>

            <div className="text-center">
              <motion.button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border-white/20 hover:border-purple-400/50 text-white/80 hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                Back to top
              </motion.button>
            </div>

            <div className="text-right">
              <p className="text-white/60 text-sm">
                © {new Date().getFullYear()} {site.name}
              </p>
              <p className="text-white/40 text-xs mt-1">
                Built with React + Vite + Tailwind
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;