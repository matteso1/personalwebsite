// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSpotify, FaInstagram, FaTwitter, FaArrowDown, FaPlay } from 'react-icons/fa';

// Enhanced Background Component
const AnimatedBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black animate-gradient-x opacity-80"></div>
    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
  </div>
);

// Featured Track Component
const FeaturedTrack = () => (
  <div className="relative bg-dark/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-accent/50 transition duration-500 group">
    <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="p-6">
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mr-4 group-hover:bg-accent/30 transition-colors duration-500">
          <FaPlay className="text-white ml-1" />
        </div>
        <div>
          <h3 className="text-lg font-heading font-bold text-white">What Do You Dream About?</h3>
          <p className="text-sm text-white/70">Latest Release</p>
        </div>
      </div>
      
      <div className="relative h-1 bg-white/20 rounded-full overflow-hidden mt-3">
        <div className="absolute h-full w-2/3 bg-accent/80 rounded-full"></div>
      </div>
      
      <div className="flex justify-between mt-3 text-xs text-white/60">
        <span>2:14</span>
        <span>3:45</span>
      </div>
    </div>
  </div>
);

// Section Title Component
const SectionTitle = ({ children, accent, align = "left" }) => (
  <h2 className={`text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-8 ${align === "center" ? "text-center" : ""}`}>
    {accent ? <span className="text-accent">{accent}</span> : null}{" "}
    {children}
  </h2>
);

// Main Home Component
const Home = () => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    setVisible(true);
  }, []);

  const fadeIn = "transition-all duration-1000 ease-out";
  const initialState = "opacity-0 translate-y-10";
  const visibleState = "opacity-100 translate-y-0";
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center">
        <AnimatedBackground />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className={`${fadeIn} ${visible ? visibleState : initialState} delay-100`}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white leading-tight">
              NILS <span className="text-accent">MATTESON</span>
            </h1>
            
            <p className="mt-6 text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
              Producer • Artist • Storyteller
            </p>
            
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <Link 
                to="/music" 
                className="px-8 py-3 bg-accent hover:bg-accent/90 text-white rounded-full font-medium transition-all duration-300 transform hover:scale-105"
              >
                Listen Now
              </Link>
              
              <div className="flex items-center gap-4">
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
          </div>
          
          {/* Scroll Indicator */}
          <div className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 ${fadeIn} ${visible ? "opacity-60" : "opacity-0"} delay-500`}>
            <button 
              onClick={() => document.getElementById('featured').scrollIntoView({ behavior: 'smooth' })}
              className="animate-bounce p-2"
              aria-label="Scroll down"
            >
              <FaArrowDown className="text-white/80 hover:text-accent transition-colors" />
            </button>
          </div>
        </div>
      </section>
      
      {/* Featured Music Section */}
      <section id="featured" className="py-24 bg-dark relative">
        <div className="absolute inset-0 bg-gradient-to-b from-dark/90 to-dark"></div>
        <div className="container mx-auto px-6 relative z-10">
          <SectionTitle accent="Featured">Music</SectionTitle>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-white/80 mb-6">
                Experience the intersection of electronic beats and raw, introspective lyrics.
                My sound creates a unique sonic landscape that invites listeners into my world.
              </p>
              
              <FeaturedTrack />
            </div>
            
            <div>
              <div className="rounded-xl overflow-hidden shadow-xl border border-white/10">
                <iframe
                  src="https://open.spotify.com/embed/track/25FM9yX68IPzFi7FDea91n"
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen"
                  loading="lazy"
                  title="Spotify Player"
                  className="w-full"
                ></iframe>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              to="/music" 
              className="inline-flex items-center text-accent hover:text-white transition-colors"
            >
              Explore All Tracks
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Latest Updates Section */}
      <section className="py-24 bg-gradient-to-b from-dark to-black relative">
        <div className="container mx-auto px-6 relative z-10">
          <SectionTitle accent="Latest">Updates</SectionTitle>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                date: "May 5, 2025",
                title: "Working on New Tracks",
                description: "Currently in the studio finalizing the tracks for my upcoming album. Can't wait to share these sounds with you all soon!"
              },
              {
                date: "April 20, 2025",
                title: "Featured on Spotify Playlist",
                description: "Excited to share that I've been featured on a new track! Check out my collaboration on Spotify now."
              },
              {
                date: "April 15, 2025",
                title: "Website Launch",
                description: "Welcome to my new official website! This will be the home for all updates, music releases, and more."
              }
            ].map((update, idx) => (
              <div 
                key={idx} 
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-accent/30 transition-all hover:transform hover:scale-[1.02] group"
              >
                <div className="text-accent/80 text-sm mb-2">{update.date}</div>
                <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-accent transition-colors">{update.title}</h3>
                <p className="text-white/70 mb-4">{update.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              to="/journal" 
              className="inline-flex items-center text-accent hover:text-white transition-colors"
            >
              View All Updates
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* About Preview Section */}
      <section className="py-24 bg-black relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-dark/50 z-0"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <SectionTitle accent="About">Me</SectionTitle>
              <p className="text-white/80 mb-6">
                I'm Nils Matteson, a music artist based in Madison. My sound blends electronic elements 
                with atmospheric textures and introspective lyrics, creating a unique sonic landscape 
                that invites listeners into my world.
              </p>
              <Link 
                to="/about" 
                className="inline-flex items-center text-accent hover:text-white transition-colors"
              >
                Learn More About Me
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 p-1">
                <div className="w-full h-full rounded-lg bg-dark/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-24 h-24 mx-auto rounded-full bg-accent/20 flex items-center justify-center mb-4">
                      <svg className="w-12 h-12 text-accent/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <p className="text-white/80 italic">
                      "My journey in music began with my background, and I've been crafting my sound ever since."
                    </p>
                    <div className="mt-4 font-heading font-bold text-white">Nils Matteson</div>
                    <div className="text-sm text-white/60">Producer • Artist • Visionary</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;