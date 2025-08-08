import React from "react";
import { motion } from "framer-motion";
import { Github, Instagram, Music2, Mail, PlayCircle, ArrowUpRight, Code2, Mic2, Sparkles, PenTool, Smartphone, ExternalLink, Download } from "lucide-react";

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

const ProjectCard = ({ title, blurb, tags = [], href, year, icon: Icon }) => (
  <a href={href} target="_blank" rel="noreferrer" className="group block rounded-2xl border p-5 hover:-translate-y-1 transition-all">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {Icon ? <Icon className="h-5 w-5 opacity-80" /> : <Code2 className="h-5 w-5 opacity-80" />}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <span className="text-xs opacity-60">{year}</span>
    </div>
    <p className="mt-3 text-sm opacity-80 leading-relaxed">{blurb}</p>
    <div className="mt-4 flex flex-wrap gap-2">
      {tags.map((t) => (
        <Chip key={t}>{t}</Chip>
      ))}
    </div>
    <div className="mt-4 inline-flex items-center gap-2 text-sm opacity-70 group-hover:opacity-100">
      <ExternalLink className="h-4 w-4" /> View project
    </div>
  </a>
);

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/65 border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 h-14">
          <a href="#top" className="font-semibold tracking-wide">NILS MATTESON</a>
          <nav className="hidden sm:flex items-center gap-6 text-sm opacity-80">
            <a href="#work" className="hover:opacity-100">Work</a>
            <a href="#music" className="hover:opacity-100">Music</a>
            <a href="#now" className="hover:opacity-100">Now</a>
            <a href="#contact" className="hover:opacity-100">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="https://open.spotify.com/artist/" target="_blank" rel="noreferrer" className="p-2 rounded-xl border hover:-translate-y-0.5 transition"><Music2 className="h-4 w-4" /></a>
            <a href="https://instagram.com/" target="_blank" rel="noreferrer" className="p-2 rounded-xl border hover:-translate-y-0.5 transition"><Instagram className="h-4 w-4" /></a>
            <a href="https://github.com/matteso1" target="_blank" rel="noreferrer" className="p-2 rounded-xl border hover:-translate-y-0.5 transition"><Github className="h-4 w-4" /></a>
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
                Data science student, full-stack tinkerer, <span className="underline decoration-dashed underline-offset-8">artist</span>.
              </motion.h1>
              <p className="mt-6 text-base sm:text-lg opacity-80 max-w-2xl">
                I build playful, useful things on the web and make music that actually slaps. Currently at UW–Madison (DS + CS). Dual citizen (US/SE). Based in Madison for now.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <LinkBtn href="#work">See work</LinkBtn>
                <LinkBtn href="#music">Hear music</LinkBtn>
                <a href="/Nils_Matteson_Resume.pdf" className="group inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium hover:-translate-y-0.5 transition-all">
                  <Download className="h-4 w-4" /> Resume
                </a>
              </div>
              <div className="mt-6 flex items-center gap-3 text-sm">
                <Chip>React / Vite</Chip>
                <Chip>Python / ML</Chip>
                <Chip>Ableton</Chip>
                <Chip>Tailwind</Chip>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="rounded-3xl border p-6">
                <p className="text-sm uppercase tracking-widest opacity-60">Latest</p>
                <a href="https://open.spotify.com/track/" target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-3 group">
                  <PlayCircle className="h-10 w-10" />
                  <div>
                    <p className="font-medium leading-tight group-hover:underline">what do you dream about? (feat. skeen)</p>
                    <p className="text-xs opacity-70">Single · 2025</p>
                  </div>
                </a>
                <audio controls className="mt-4 w-full">
                  <source src="/audio/demo1.mp3" type="audio/mpeg" />
                </audio>
              </div>
            </div>
          </div>
        </section>

        {/* WORK */}
        <Section id="work" kicker="Selected" title="Projects that feel like me.">
          <div className="grid sm:grid-cols-2 gap-5">
            <ProjectCard
              title="Tempo Trends: Pop vs. Hip-Hop"
              blurb="Statistical analysis of BPM trends 1990–2024 with tidyverse/ggplot2, R Markdown report, and an interactive D3 chart."
              tags={["R", "ggplot2", "D3", "DataViz"]}
              year="2025"
              href="https://example.com/tempo"
              icon={PenTool}
            />
            <ProjectCard
              title="Studio Drummer Router"
              blurb="Kontakt multi-out Ableton template + JS utility for auto-routing drum mics."
              tags={["Ableton", "Kontakt", "JavaScript"]}
              year="2025"
              href="https://example.com/studio"
              icon={Mic2}
            />
            <ProjectCard
              title="SwipeLess Dating"
              blurb="A small social experiment: $5 flat-fee dating app prototype that hides photos until both opt in to chat."
              tags={["React", "Node", "Auth", "Product"]}
              year="2025"
              href="https://example.com/swipeless"
              icon={Smartphone}
            />
            <ProjectCard
              title="UW DS Notes — Open"
              blurb="Clean, searchable study notes for STAT/CS courses; notebook → site pipeline with mdx."
              tags={["Python", "MDX", "Education"]}
              year="2024–26"
              href="https://example.com/notes"
              icon={Code2}
            />
          </div>
        </Section>

        {/* MUSIC */}
        <Section id="music" kicker="Artist" title="Songs with teeth—danceable, emotional, honest.">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-2xl border p-6">
              <p className="text-sm opacity-70">Featured</p>
              <h3 className="text-xl font-semibold mt-1">“waiting room” — live edit</h3>
              <p className="mt-2 text-sm opacity-80">Vocoder as the voice of Death. Bon Iver-adjacent but still me.</p>
              <div className="mt-3">
                <audio controls className="w-full">
                  <source src="/audio/waiting-room-live.mp3" type="audio/mpeg" />
                </audio>
              </div>
            </div>
            <div className="rounded-2xl border p-6">
              <p className="text-sm opacity-70">Playlist</p>
              <h3 className="text-xl font-semibold mt-1">Inspiration — album mode</h3>
              <p className="mt-2 text-sm opacity-80">The 1975, The Hellp, Porter Robinson, Dominic Fike, Jane Remover.</p>
              <div className="mt-3 aspect-video rounded-xl overflow-hidden border">
                <iframe
                  title="spotify"
                  className="w-full h-full"
                  src="https://open.spotify.com/embed/playlist/"
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* NOW / UPDATES */}
        <Section id="now" kicker="Now" title="Current focus & tiny updates.">
          <ul className="space-y-3 text-sm">
            <li>• Rebuilding personal site (this!) with React + Tailwind. Shipping v2 soon.</li>
            <li>• Finalizing EP tracklist; mixing vocals w/ Waves EV2 and new Ableton template.</li>
            <li>• Running 5x/week; finishing DS degree; interviewing for fall internships.</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Chip>Open to collabs</Chip>
            <Chip>Madison, WI</Chip>
            <Chip>US/SE dual citizen</Chip>
          </div>
        </Section>

        {/* CONTACT */}
        <Section id="contact" kicker="Contact" title="Say hi or send beats.">
          <div className="space-y-4">
            <p className="opacity-80">Email works best. DMs are fine too.</p>
            <div className="flex flex-wrap gap-3">
              <LinkBtn href="mailto:sendbeats2nils@gmail.com"><Mail className="h-4 w-4" /> sendbeats2nils@gmail.com</LinkBtn>
              <LinkBtn href="https://instagram.com/"><Instagram className="h-4 w-4" /> Instagram</LinkBtn>
              <LinkBtn href="https://github.com/matteso1"><Github className="h-4 w-4" /> GitHub</LinkBtn>
            </div>
          </div>
        </Section>
      </main>

      {/* FOOTER */}
      <footer className="border-t">
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
