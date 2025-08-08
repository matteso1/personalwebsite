import React, { useMemo, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Github, Instagram, Music2, Mail, ArrowUpRight, ExternalLink, Play, Headphones, Sparkles } from "lucide-react";
import AuroraCanvas from "./components/AuroraCanvas";
import Spotlight from "./components/Spotlight";
import InkBorder from "./components/InkBorder";
import DemoGallery from "./components/DemoGallery";
import site from "./content/site.json";

// --- QUICK NOTES -------------------------------------------------------------
// • Drop this file in as src/App.jsx (or src/App.tsx with minor typing tweaks).
// • Make sure Tailwind is already configured (you have tailwind.config.js).
// • Install deps: npm i framer-motion lucide-react
// • Optional: add a /public/audio folder for previews + /public/images for art.
// • Swap dummy links with your real ones (Spotify, IG, GitHub, email, etc.).
// ----------------------------------------------------------------------------

// Enhanced components with artistic styling
const Chip = ({ children, variant = "default" }) => {
  const variants = {
    default: "glass border-white/20 text-white/80",
    accent: "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-purple-400/30 text-white",
    warm: "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-400/30 text-white"
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium tracking-wide backdrop-blur-sm transition-all hover:scale-105 ${variants[variant]}`}>
      {children}
    </span>
  );
};

const Section = ({ id, title, kicker, children, className = "" }) => (
  <section id={id} className={`relative w-full max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-32 ${className}`}>
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="grid lg:grid-cols-5 gap-12"
    >
      <div className="lg:col-span-2">
        {kicker && (
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mb-4 uppercase tracking-[0.2em] text-sm font-medium text-white/60"
          >
            {kicker}
          </motion.p>
        )}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
          style={{ fontSize: 'var(--fs-h2)' }}
        >
          {title}
        </motion.h2>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="lg:col-span-3"
      >
        {children}
      </motion.div>
    </motion.div>
  </section>
);

const ArtCard = ({ children, className = "", hover = true, glow = false }) => (
  <motion.div 
    className={`art-card ${glow ? 'animate-glow' : ''} ${className}`}
    whileHover={hover ? { scale: 1.01, y: -2 } : {}}
    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
  >
    <div className="relative z-10 p-8">
      {children}
    </div>
  </motion.div>
);

const LinkBtn = ({ href, children, variant = "default", icon: Icon }) => {
  const variants = {
    default: "glass border-white/20 hover:border-white/40 text-white hover:text-white",
    primary: "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-transparent",
    ghost: "border-white/10 hover:border-white/30 text-white/80 hover:text-white backdrop-blur-sm"
  };

  return (
    <motion.a 
      href={href} 
      target="_blank" 
      rel="noreferrer" 
      className={`group inline-flex items-center gap-3 rounded-2xl px-6 py-3 text-sm font-medium transition-all duration-300 ${variants[variant]}`}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{children}</span>
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </motion.a>
  );
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



export default function App() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    setMounted(true);
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

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
      <AuroraCanvas />
      <Spotlight />
      
      {/* Enhanced Navigation */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 w-full z-50 glass border-b border-white/10"
        style={{ backdropFilter: 'blur(24px) saturate(1.8)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-8 h-16">
          <motion.a 
            href="#top" 
            className="font-display font-bold text-xl tracking-tight hover:text-purple-400 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            {site.name}
          </motion.a>
          
          <nav className="hidden sm:flex items-center gap-8 text-sm font-medium">
            {['Music', 'Demos', 'About', 'Contact'].map((item) => (
              <motion.a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                className="text-white/80 hover:text-white transition-colors relative group"
                whileHover={{ y: -2 }}
              >
                {item}
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </motion.a>
            ))}
          </nav>
          
          {/* Mobile Menu Button */}
          <motion.button
            className="sm:hidden p-2 rounded-xl glass border-white/10"
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="w-5 h-5 flex flex-col justify-center space-y-1">
              <span className={`h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </motion.button>
          
          <div className="flex items-center gap-3">
            {[
              { href: site.links.spotifyArtist, icon: Music2, label: "Spotify" },
              { href: site.links.instagram, icon: Instagram, label: "Instagram" },
              { href: site.links.github, icon: Github, label: "GitHub" }
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
              {['Music', 'Demos', 'About', 'Contact'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block p-4 rounded-2xl glass border-white/10 text-white hover:text-purple-400 transition-colors text-lg font-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </motion.a>
              ))}
            </nav>
            
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex justify-center gap-4">
                {[
                  { href: site.links.spotifyArtist, icon: Music2, label: "Spotify" },
                  { href: site.links.instagram, icon: Instagram, label: "Instagram" },
                  { href: site.links.github, icon: Github, label: "GitHub" }
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

      {/* Enhanced Hero Section */}
      <main id="top" className="relative">
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate={mounted ? "show" : "hidden"}
              className="grid lg:grid-cols-12 gap-12 items-center"
            >
              <div className="lg:col-span-7 space-y-8">
                <motion.div variants={fadeInUp} className="space-y-4">
                  <motion.div 
                    className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border-white/20"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-medium">{site.tagline}</span>
                  </motion.div>
                  
                  <h1 className="font-display font-bold tracking-tight leading-[0.95]" style={{ fontSize: 'var(--fs-hero)' }}>
                    <span className="block">{site.hero.title}</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-600">
                      {site.hero.subtitle}
                    </span>
                  </h1>
                </motion.div>
                
                <motion.p 
                  variants={fadeInUp}
                  className="text-xl text-white/80 max-w-2xl leading-relaxed"
                  style={{ fontSize: 'var(--fs-hero-sub)' }}
                >
                  {site.hero.description}
                </motion.p>
                
                <motion.div 
                  variants={fadeInUp}
                  className="flex flex-wrap gap-4"
                >
                  <LinkBtn href="#music" variant="primary" icon={Play}>
                    Listen Now
                  </LinkBtn>
                  <LinkBtn href="#demos" variant="ghost" icon={Sparkles}>
                    Explore Demos
                  </LinkBtn>
                </motion.div>
              </div>
              
              <motion.div 
                variants={fadeInUp}
                className="lg:col-span-5"
                style={{ y: y1 }}
              >
                <ArtCard className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-amber-500/10"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-white">Latest Demos</h3>
                      <Chip variant="accent">Live</Chip>
                    </div>
                    <div className="pt-4">
                      <DemoGallery />
                    </div>
                  </div>
                </ArtCard>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Floating elements for visual interest */}
          <motion.div 
            className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-purple-500/10 to-cyan-500/10 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-gradient-to-br from-amber-500/10 to-purple-500/10 blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </section>

        {/* Enhanced Demos Section */}
        <Section id="demos" kicker="Work in Progress" title={site.demos.title}>
          <motion.div className="space-y-6">
            <p className="text-xl text-white/80 leading-relaxed mb-8">{site.demos.description}</p>
            <ArtCard className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-amber-500/10"></div>
              <div className="relative z-10">
                <DemoGallery />
              </div>
            </ArtCard>
          </motion.div>
        </Section>

        {/* Enhanced Music Section */}
        <Section id="music" kicker="Listen" title={site.music.title}>
          <div className="space-y-8">
            <p className="text-xl text-white/80 leading-relaxed">{site.music.description}</p>
            
            {/* Spotify Player */}
            <ArtCard className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/3 to-green-500/5"></div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">Spotify</h3>
                  <Chip variant="accent">Listen</Chip>
                </div>
                <div className="w-full h-96 rounded-2xl overflow-hidden border border-white/20 bg-black/20">
                  <iframe
                    title="spotify-artist"
                    className="w-full h-full"
                    src={`https://open.spotify.com/embed/artist/${site.links.spotifyArtist.split('/').pop()}?utm_source=generator&theme=0&view=list&t=0`}
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    style={{ 
                      border: 'none', 
                      borderRadius: '16px',
                      transform: 'scale(1)',
                      imageRendering: 'auto'
                    }}
                  />
                </div>
              </div>
            </ArtCard>

            {/* SoundCloud Player */}
            <ArtCard className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-red-500/3 to-orange-500/5"></div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">SoundCloud</h3>
                  <Chip variant="warm">Stream</Chip>
                </div>
                <div className="w-full h-96 rounded-2xl overflow-hidden border border-white/20 bg-black/20">
                  <iframe
                    title="soundcloud"
                    className="w-full h-full"
                    allow="autoplay"
                    src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(site.links.soundcloud)}&color=%23000000&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`}
                    style={{ 
                      border: 'none', 
                      borderRadius: '16px',
                      transform: 'scale(1)',
                      imageRendering: 'auto'
                    }}
                  />
                </div>
              </div>
            </ArtCard>
          </div>
        </Section>

        {/* Enhanced About Section */}
        <Section id="about" kicker="Artist" title={site.about.title}>
          <div className="grid lg:grid-cols-2 gap-8">
            <ArtCard>
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white">My Story</h3>
                <p className="text-white/80 leading-relaxed">{site.about.story}</p>
                <p className="text-white/80 leading-relaxed">{site.about.approach}</p>
              </div>
            </ArtCard>
            
            <ArtCard>
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white">Skills & Tools</h3>
                <div className="flex flex-wrap gap-3">
                  {site.about.skills.map((skill) => (
                    <SkillTag key={skill}>{skill}</SkillTag>
                  ))}
                </div>
                <div className="pt-4">
                  <p className="text-white/60 text-sm mb-4">Currently working on:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      <span className="text-white/80">Debut album production</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                      <span className="text-white/80">New collaboration projects</span>
                    </div>
                  </div>
                </div>
              </div>
            </ArtCard>
          </div>
        </Section>

        {/* Enhanced Support Section */}
        <Section id="support" kicker="Support" title={site.support.title}>
          <div className="space-y-6">
            <p className="text-xl text-white/80 leading-relaxed">{site.support.description}</p>
            <ArtCard className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-cyan-500/10"></div>
              <div className="relative z-10">
                <div className="grid sm:grid-cols-3 gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} className="text-center p-6">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">V</span>
                    </div>
                    <h3 className="font-semibold text-white mb-2">Venmo</h3>
                    <LinkBtn href={site.links.venmo} variant="ghost">@friggoffmrlahey</LinkBtn>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} className="text-center p-6">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">P</span>
                    </div>
                    <h3 className="font-semibold text-white mb-2">PayPal</h3>
                    <LinkBtn href={site.links.paypal} variant="ghost">Donate</LinkBtn>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} className="text-center p-6">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <h3 className="font-semibold text-white mb-2">Store</h3>
                    <LinkBtn href="#store" variant="ghost">Coming Soon</LinkBtn>
                  </motion.div>
                </div>
              </div>
            </ArtCard>
          </div>
        </Section>

        {/* Enhanced Contact Section */}
        <Section id="contact" kicker="Connect" title={site.contact.title}>
          <div className="grid lg:grid-cols-2 gap-8">
            <ArtCard>
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white">Get in Touch</h3>
                <p className="text-white/80 leading-relaxed">{site.contact.description}</p>
                <p className="text-white/60 italic">{site.contact.cta}</p>
                
                <div className="space-y-4 pt-4">
                  <LinkBtn href={site.links.email} variant="primary" icon={Mail}>
                    sendbeats2nils@gmail.com
                  </LinkBtn>
                  <div className="grid grid-cols-2 gap-3">
                    <LinkBtn href={site.links.instagram} variant="ghost" icon={Instagram}>
                      Instagram
                    </LinkBtn>
                    <LinkBtn href={site.links.linkedin} variant="ghost" icon={ExternalLink}>
                      LinkedIn
                    </LinkBtn>
                  </div>
                </div>
              </div>
            </ArtCard>
            
            <ArtCard>
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white">Quick Links</h3>
                <div className="space-y-3">
                  {[
                    { href: site.links.spotifyArtist, label: "Spotify" },
                    { href: site.links.soundcloud, label: "SoundCloud" },
                    { href: site.links.instagram, label: "Instagram" },
                    { href: site.links.github, label: "GitHub" }
                  ].map(({ href, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="block p-4 rounded-xl glass border-white/20 hover:border-white/40 text-white/80 hover:text-white transition-all duration-300 text-center font-medium"
                      whileHover={{ scale: 1.01, y: -1 }}
                    >
                      {label}
                    </motion.a>
                  ))}
                </div>
              </div>
            </ArtCard>
          </div>
        </Section>
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
              <motion.a 
                href="#top" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border-white/20 hover:border-purple-400/50 text-white/80 hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                Back to top
                <ArrowUpRight className="h-4 w-4" />
              </motion.a>
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
}
