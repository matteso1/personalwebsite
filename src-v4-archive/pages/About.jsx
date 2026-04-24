// src/pages/About.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSpotify, FaInstagram, FaTwitter, FaQuoteLeft, FaArrowRight } from 'react-icons/fa';

// Section Title Component
const SectionTitle = ({ children, className = '' }) => (
  <h2 className={`text-2xl md:text-3xl font-heading font-bold text-white mb-6 ${className}`}>
    {children}
  </h2>
);

// Section Component
const Section = ({ children, className = '', id = '' }) => (
  <section id={id} className={`py-16 ${className}`}>
    <div className="container mx-auto px-6">
      {children}
    </div>
  </section>
);

// Timeline Item Component
const TimelineItem = ({ year, title, description }) => (
  <div className="relative pl-10 pb-10 border-l border-white/20 last:border-0 last:pb-0">
    <div className="absolute left-0 top-0 transform -translate-x-1/2 w-4 h-4 rounded-full bg-accent"></div>
    <div className="text-accent font-medium mb-1">{year}</div>
    <h3 className="text-lg font-heading font-medium text-white mb-2">{title}</h3>
    <p className="text-white/70">{description}</p>
  </div>
);

// Skill Pill Component
const SkillPill = ({ children }) => (
  <div className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm text-white/80">
    {children}
  </div>
);

// Quote Component
const Quote = ({ text, author, role }) => (
  <div className="p-6 md:p-8 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 relative">
    <FaQuoteLeft className="absolute top-6 left-6 text-accent/20" size={30} />
    <div className="ml-6 mt-4">
      <p className="text-white/80 italic text-lg md:text-xl mb-4">"{text}"</p>
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mr-3">
          <span className="text-accent font-bold">{author.charAt(0)}</span>
        </div>
        <div>
          <p className="text-white font-medium">{author}</p>
          <p className="text-white/60 text-sm">{role}</p>
        </div>
      </div>
    </div>
  </div>
);

// Main About Component
const About = () => {
  const [fadeIn, setFadeIn] = useState(false);
  
  useEffect(() => {
    setFadeIn(true);
  }, []);
  
  return (
    <div className={`min-h-screen bg-dark transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hero Section */}
      <Section className="pt-24 md:pt-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
              About <span className="text-accent">Nils</span>
            </h1>
            <p className="text-white/80 text-lg mb-8">
              I'm Nils Matteson, a music artist based in Madison. My sound blends electronic elements 
              with atmospheric textures and introspective lyrics, creating a unique sonic landscape 
              that invites listeners into my world.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <FaSpotify />, url: "https://open.spotify.com/artist/2qpBZGqFiVcsYEaJkBahMo" },
                { icon: <FaInstagram />, url: "https://instagram.com/yoitsnils" },
                { icon: <FaTwitter />, url: "https://twitter.com/" }
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent/80 transition-colors duration-300"
                  aria-label={`Visit ${social.url.split('/')[2]}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 p-1">
              <div className="w-full h-full rounded-lg bg-dark/50 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto rounded-full bg-accent/20 flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-accent/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <p className="text-white/80 italic mb-6">
                    "My journey in music began with my background, and I've been crafting my sound ever since."
                  </p>
                  <div className="mt-4 font-heading font-bold text-white">Nils Matteson</div>
                  <div className="text-sm text-white/60">Producer • Artist • Visionary</div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/10 rounded-full filter blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full filter blur-xl"></div>
          </div>
        </div>
      </Section>
      
      {/* My Story Section */}
      <Section id="story" className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-0"></div>
        <div className="relative z-10">
          <SectionTitle>My Story</SectionTitle>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <p className="text-white/80 mb-4">
                My journey in music began with my background, and I've been crafting my sound ever since. 
                I'm influenced by artists like [your influences], but I'm committed to creating something 
                that's authentically my own.
              </p>
              <p className="text-white/80 mb-4">
                Currently working on my debut album, I'm excited to share my artistic vision with the world. 
                Each track is a piece of my story, and I can't wait for you to hear it.
              </p>
              <p className="text-white/80">
                My sound blends electronic elements with atmospheric textures and introspective lyrics, 
                creating a unique sonic landscape that invites listeners into my world.
              </p>
            </div>
            
            <div className="md:col-span-2">
              <Quote 
                text="Nils creates sounds that transport you to another dimension. His atmospheric approach to production is truly unique."
                author="Music Blog"
                role="Industry Review"
              />
            </div>
          </div>
        </div>
      </Section>
      
      {/* Timeline Section */}
      <Section id="journey" className="bg-gradient-to-b from-dark/50 to-dark">
        <SectionTitle>My Journey</SectionTitle>
        
        <div className="mt-10 ml-4">
          <TimelineItem 
            year="2025"
            title="Working on Debut Album"
            description="Currently in the studio finalizing my debut album, representing my artistic journey so far."
          />
          <TimelineItem 
            year="2024"
            title="First Spotify Feature"
            description="My track was featured on a major Spotify playlist, reaching new audiences worldwide."
          />
          <TimelineItem 
            year="2023"
            title="Collaborations"
            description="Worked with several producers and artists to expand my sound and creative approach."
          />
          <TimelineItem 
            year="2022"
            title="Started Music Production"
            description="Began creating my own tracks, experimenting with electronic sounds and atmospheric textures."
          />
          <TimelineItem 
            year="2020"
            title="Musical Beginnings"
            description="Started my musical journey, learning instruments and exploring different genres."
          />
        </div>
      </Section>
      
      {/* Skills & Approach Section */}
      <Section id="approach">
        <SectionTitle>My Approach & Skills</SectionTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <p className="text-white/80 mb-6">
              My creative process combines technical production skills with emotional storytelling. 
              I focus on creating immersive soundscapes that connect with listeners on a deeper level.
            </p>
            
            <div className="flex flex-wrap gap-3 mt-8">
              <SkillPill>Electronic Production</SkillPill>
              <SkillPill>Songwriting</SkillPill>
              <SkillPill>Mixing</SkillPill>
              <SkillPill>Synthesizers</SkillPill>
              <SkillPill>Vocal Production</SkillPill>
              <SkillPill>Sound Design</SkillPill>
              <SkillPill>Ableton Live</SkillPill>
              <SkillPill>FL Studio</SkillPill>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-heading font-bold text-white mb-4">Musical Influences</h3>
            <p className="text-white/80 mb-4">
              My sound is shaped by a diverse range of influences, from electronic pioneers to 
              contemporary indie artists. Some of my key influences include:
            </p>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                Electronic dance music with emotional depth
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                Atmospheric and ambient soundscapes
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                Introspective songwriting that tells stories
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                Bass-driven production with clean, punchy mixes
              </li>
            </ul>
          </div>
        </div>
      </Section>
      
      {/* CTA Section */}
      <Section className="text-center bg-gradient-to-b from-dark to-black">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
          Let's Connect
        </h2>
        <p className="text-white/80 max-w-2xl mx-auto mb-8">
          Ready to collaborate or just want to say hello? I'd love to hear from you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/contact" 
            className="px-8 py-3 bg-accent hover:bg-accent/90 text-white rounded-full font-medium transition-all duration-300 flex items-center justify-center"
          >
            Get in Touch <FaArrowRight className="ml-2" />
          </Link>
          <Link 
            to="/music" 
            className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-all duration-300"
          >
            Explore My Music
          </Link>
        </div>
      </Section>
    </div>
  );
};

export default About;