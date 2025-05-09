import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import QuantumFluxBackground from '../components/QuantumFluxBackground';
import { FaArrowRight, FaSpotify, FaInstagram, FaTwitter } from 'react-icons/fa';

const HomeScrollSection = ({ id, children }) => (
  <section id={id} className="min-h-screen flex items-center justify-center w-full py-16">
    <div className="container mx-auto px-4">
      {children}
    </div>
  </section>
);

const Home = () => {
  const [show, setShow] = useState(false);
  const heroRef = useRef(null);
  
  useEffect(() => {
    setShow(true);
    
    // Optional: smooth scroll to sections when ids are changed in URL
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <div className="relative">
      {/* Hero section with animated background */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <QuantumFluxBackground intensity="high" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div 
            className={`transition-all duration-1000 ${
              show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-4 leading-tight">
              <span className="inline-block">Nils</span>{' '}
              <span className="inline-block text-accent">Matteson</span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-xl md:text-2xl mb-8 text-light/90">
              Grammy winner. Producer. Storyteller.
              <span className="block mt-2">Blending dance-rock with confessional songwriting.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
              <Link 
                to="/music" 
                className="group bg-accent hover:bg-accent/90 text-white font-heading font-bold py-3 px-8 rounded-full transition-all flex items-center justify-center"
              >
                Listen Now
                <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <div className="flex items-center gap-3 mt-4 sm:mt-0">
                <a 
                  href="https://open.spotify.com/artist/2qpBZGqFiVcsYEaJkBahMo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-secondary/50 hover:bg-secondary p-3 rounded-full text-light hover:text-accent transition-all"
                  aria-label="Spotify"
                >
                  <FaSpotify className="w-5 h-5" />
                </a>
                <a 
                  href="https://instagram.com/yoitsnils" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-secondary/50 hover:bg-secondary p-3 rounded-full text-light hover:text-accent transition-all"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a 
                  href="https://twitter.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-secondary/50 hover:bg-secondary p-3 rounded-full text-light hover:text-accent transition-all"
                  aria-label="Twitter"
                >
                  <FaTwitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div 
            className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-1000 ${
              show ? 'opacity-60' : 'opacity-0'
            }`}
          >
            <div className="animate-bounce">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured music section */}
      <HomeScrollSection id="featured">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              <span className="text-accent">Latest</span> Releases
            </h2>
            <p className="text-lg mb-6 text-light/90">
              Experience my most recent musical explorations — a blend of electronic beats with raw, 
              heartfelt lyrics that tell stories from my journey.
            </p>
            <div className="bg-dark/50 backdrop-blur-sm rounded-lg p-6 border border-light/10 hover:border-accent/30 transition-all">
              <h3 className="text-xl font-heading font-bold mb-2">Featured Track</h3>
              <p className="text-light/80 mb-4">Listen to my latest single that's been gaining traction across streaming platforms.</p>
              <Link 
                to="/music" 
                className="inline-flex items-center text-accent hover:text-light transition-colors"
              >
                Explore all tracks <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-xl ring-1 ring-light/10 transform hover:scale-[1.01] transition-all">
            <iframe
              src="https://open.spotify.com/embed/track/25FM9yX68IPzFi7FDea91n"
              width="100%"
              height="380"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen"
              loading="lazy"
              title="Spotify Player"
              className="w-full"
            ></iframe>
          </div>
        </div>
      </HomeScrollSection>
      
      {/* Quick links section */}
      <HomeScrollSection id="explore">
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-12 text-center">
          <span className="text-accent">Explore</span> My World
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'About',
              description: 'Learn about my musical journey, influences, and creative process.',
              icon: (
                <svg className="w-12 h-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ),
              link: '/about'
            },
            {
              title: 'Music',
              description: 'Dive into my catalog of songs, albums, and collaborations.',
              icon: (
                <svg className="w-12 h-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              ),
              link: '/music'
            },
            {
              title: 'Journal',
              description: 'Read about my thoughts, experiences, and behind-the-scenes stories.',
              icon: (
                <svg className="w-12 h-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              ),
              link: '/journal'
            }
          ].map((item, i) => (
            <div 
              key={i} 
              className="bg-dark/50 backdrop-blur-sm rounded-lg p-8 border border-light/10 hover:border-accent/30 transition-all hover:transform hover:scale-[1.02] group"
            >
              <div className="mb-6">{item.icon}</div>
              <h3 className="text-2xl font-heading font-bold mb-3 group-hover:text-accent transition-colors">{item.title}</h3>
              <p className="text-light/80 mb-4">{item.description}</p>
              <Link 
                to={item.link} 
                className="inline-flex items-center text-accent group-hover:text-light transition-colors"
              >
                Learn more <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </HomeScrollSection>
    </div>
  );
};

export default Home;