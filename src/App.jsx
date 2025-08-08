import React from "react";
import { motion } from "framer-motion";
import { Github, Instagram, Music2, Mail, ArrowUpRight, ExternalLink } from "lucide-react";
import AuroraCanvas from "./components/AuroraCanvas";
// Removed techy particle background to lean into a calmer notebook feel
import DemoGallery from "./components/DemoGallery";

// --- QUICK NOTES -------------------------------------------------------------
// • Drop this file in as src/App.jsx (or src/App.tsx with minor typing tweaks).
// • Make sure Tailwind is already configured (you have tailwind.config.js).
// • Install deps: npm i framer-motion lucide-react
// • Optional: add a /public/audio folder for previews + /public/images for art.
// • Swap dummy links with your real ones (Spotify, IG, GitHub, email, etc.).
// ----------------------------------------------------------------------------

// Simple chip component
const Chip = ({ children }) => (
  <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide">
    {children}
  </span>
);

const Section = ({ id, title, kicker, children, right }) => (
  <section id={id} className="relative w-full max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
    <div className="grid md:grid-cols-5 gap-10">
      <div className="md:col-span-2">
        <p className="mb-2 uppercase tracking-widest text-xs opacity-60">{kicker}</p>
        <h2 className="text-3xl sm:text-4xl font-semibold leading-tight">{title}</h2>
      </div>
      <div className="md:col-span-3">
        {children}
      </div>
    </div>
    {right}
  </section>
);

const LinkBtn = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium hover:-translate-y-0.5 transition-all">
    <span>{children}</span>
    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
  </a>
);

export default function App() {
  return (
    <div className="relative min-h-screen bg-[url('/noise.png')] bg-dark text-white [background-blend-mode:multiply]">
      <AuroraCanvas />
      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/50 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 h-14">
          <a href="#top" className="font-semibold tracking-wide">NILS MATTESON</a>
          <nav className="hidden sm:flex items-center gap-6 text-sm opacity-80">
            <a href="#music" className="hover:opacity-100">Music</a>
            <a href="#demos" className="hover:opacity-100">Demos</a>
            <a href="#notebook" className="hover:opacity-100">Notebook</a>
            <a href="#support" className="hover:opacity-100">Support</a>
            <a href="#contact" className="hover:opacity-100">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="https://open.spotify.com/artist/2qpBZGqFiVcsYEaJkBahMo" target="_blank" rel="noreferrer" className="p-2 rounded-xl border border-white/10 hover:-translate-y-0.5 transition"><Music2 className="h-4 w-4" /></a>
            <a href="https://instagram.com/yoitsnils" target="_blank" rel="noreferrer" className="p-2 rounded-xl border border-white/10 hover:-translate-y-0.5 transition"><Instagram className="h-4 w-4" /></a>
            <a href="https://github.com/matteso1" target="_blank" rel="noreferrer" className="p-2 rounded-xl border border-white/10 hover:-translate-y-0.5 transition"><Github className="h-4 w-4" /></a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <main id="top" className="relative">
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-28">
          <div className="grid md:grid-cols-5 gap-10 items-center">
            <div className="md:col-span-3">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05]"
              >
                An artist’s notebook.
              </motion.h1>
              <p className="mt-6 text-base sm:text-lg opacity-80 max-w-2xl">I’m Nils — songwriter/producer from Madison, WI. Guitar, piano, voice. I build small web things sometimes, but the music is the point.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <LinkBtn href="#demos">Demos</LinkBtn>
                <LinkBtn href="#music">Hear music</LinkBtn>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="rounded-3xl border border-white/10 p-6 bg-white/5">
                <p className="text-sm uppercase tracking-widest opacity-60">Latest demos</p>
                <div className="mt-3">
                  <DemoGallery />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DEMOS */}
        <Section id="demos" kicker="WIP" title="Demos — sketches, ideas, works-in-progress.">
          <DemoGallery />
        </Section>

        {/* MUSIC */}
        <Section id="music" kicker="Artist" title="Music">
          <div className="rounded-2xl border p-6">
            <div className="aspect-video rounded-xl overflow-hidden border">
              <iframe
                title="spotify-artist"
                className="w-full h-full"
                src="https://open.spotify.com/embed/artist/2qpBZGqFiVcsYEaJkBahMo"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              />
            </div>
            <div className="mt-6 rounded-xl border border-white/10 p-4 bg-white/5">
              <p className="text-sm opacity-80 mb-2">SoundCloud (alt):</p>
              <div className="aspect-video rounded-lg overflow-hidden border">
                <iframe
                  title="soundcloud"
                  className="w-full h-full"
                  allow="autoplay"
                  src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/sorryitsnils&color=%238b5cf6&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* NOTEBOOK */}
        <Section id="notebook" kicker="Bio" title="Who I am">
          <div className="rounded-2xl border p-6 bg-white/5">
            <p className="opacity-90 leading-relaxed">
              Born in Boise, based in Madison. I write, produce, and mix my own records. I like songs that feel human but still move a crowd.
              If you want to talk music, send stems, or book a show, reach out below. If you’re here for school/work stuff, my LinkedIn has the CS/DS bits.
            </p>
          </div>
        </Section>

        {/* SUPPORT */}
        <Section id="support" kicker="Support" title="If the music hits, keep the lights on:">
          <div className="flex flex-wrap gap-3">
            <LinkBtn href="https://venmo.com/u/friggoffmrlahey">Venmo (@friggoffmrlahey)</LinkBtn>
            <LinkBtn href="https://www.paypal.com/donate?business=nilsmatteson%40icloud.com&currency_code=USD">PayPal</LinkBtn>
            <LinkBtn href="#store">Store</LinkBtn>
          </div>
        </Section>

        {/* CONTACT */}
        <Section id="contact" kicker="Contact" title="Say hi or send beats.">
          <div className="space-y-4">
            <p className="opacity-80">Email works best. DMs are fine too.</p>
            <div className="flex flex-wrap gap-3">
              <LinkBtn href="mailto:sendbeats2nils@gmail.com"><Mail className="h-4 w-4" /> sendbeats2nils@gmail.com</LinkBtn>
              <LinkBtn href="https://instagram.com/yoitsnils"><Instagram className="h-4 w-4" /> Instagram</LinkBtn>
              <LinkBtn href="https://www.linkedin.com/in/nils-matteson-198326249/"><ExternalLink className="h-4 w-4" /> LinkedIn</LinkBtn>
              <LinkBtn href="https://github.com/matteso1"><Github className="h-4 w-4" /> GitHub</LinkBtn>
            </div>
          </div>
        </Section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 text-sm flex flex-wrap items-center justify-between gap-3">
          <p className="opacity-70">© {new Date().getFullYear()} Nils Matteson. Built with React + Vite + Tailwind.</p>
          <div className="flex items-center gap-4">
            <a href="#top" className="underline">Back to top</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
