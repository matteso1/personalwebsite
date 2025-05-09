// src/pages/Music.jsx
import React, { useState, useEffect } from 'react';
import { FaPlay, FaSpotify, FaHeadphones, FaCalendar } from 'react-icons/fa';

// Page Header Component
const PageHeader = ({ title, subtitle }) => (
  <div className="py-16 md:py-24 text-center relative">
    {/* Background Elements */}
    <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-accent/5 rounded-full filter blur-3xl"></div>
    <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-primary/5 rounded-full filter blur-3xl"></div>
    
    {/* Content */}
    <div className="relative z-10">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
        {title}
      </h1>
      {subtitle && (
        <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

// Featured Album Component
const FeaturedAlbum = () => (
  <div className="relative mb-20 overflow-hidden rounded-xl bg-dark/50 backdrop-blur-sm border border-white/10">
    <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-primary/10 z-0"></div>
    
    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
      {/* Album Art */}
      <div className="flex items-center justify-center">
        <div className="relative w-full max-w-xs aspect-square rounded-lg overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-primary/30 z-0"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FaHeadphones className="text-white/80" size={50} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-dark/80 backdrop-blur-sm p-4 text-center">
            <p className="text-white font-heading font-bold">UPCOMING ALBUM</p>
            <p className="text-white/70 text-sm">Coming Soon</p>
          </div>
        </div>
      </div>
      
      {/* Album Info */}
      <div className="flex flex-col justify-center">
        <div className="inline-flex items-center text-accent/80 text-sm mb-2">
          <FaCalendar className="mr-2" size={14} />
          Coming later this year
        </div>
        
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
          New Album in the Works
        </h2>
        
        <p className="text-white/70 mb-6">
          My debut album is in the works and represents my artistic journey so far. Stay tuned for updates and release dates.
          This collection will showcase my unique blend of electronic elements with introspective lyrics.
        </p>
        
        <div className="flex items-center">
          <button className="bg-accent/20 hover:bg-accent/30 text-white px-6 py-2 rounded-full transition-colors inline-flex items-center">
            <FaSpotify className="mr-2" /> Follow for Updates
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Section Title Component
const SectionTitle = ({ children }) => (
  <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-8">
    {children}
  </h2>
);

// Track Item Component
const TrackItem = ({ title, info, imageUrl, spotifyId, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="group relative rounded-xl overflow-hidden transition-all duration-500 transform hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-dark to-transparent z-10 transition-opacity duration-500 ${
        isHovered ? 'opacity-60' : 'opacity-90'
      }`}></div>
      
      {/* Background Image or Gradient */}
      {imageUrl ? (
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }}></div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-accent/30 to-primary/30"></div>
      )}
      
      {/* Content */}
      <div className="relative z-20 p-6 md:p-8 h-72 flex flex-col justify-end">
        <div className="absolute top-4 left-4 bg-accent/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white/90">
          Track {index}
        </div>
        
        {/* Play Button */}
        <div 
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            w-16 h-16 rounded-full bg-accent/80 backdrop-blur-md flex items-center justify-center
            transition-all duration-500 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <FaPlay className="text-white ml-1" size={20} />
        </div>
        
        <h3 className="text-xl font-heading font-bold text-white group-hover:text-accent transition-colors">{title}</h3>
        <p className="text-white/70 text-sm mt-2">{info}</p>
        
        <a 
          href={`https://open.spotify.com/track/${spotifyId}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center text-white/60 hover:text-accent transition-colors text-sm"
        >
          <FaSpotify className="mr-2" /> Listen on Spotify
        </a>
      </div>
    </div>
  );
};

// Main Music Component
const Music = () => {
  const [fadeIn, setFadeIn] = useState(false);
  
  useEffect(() => {
    setFadeIn(true);
  }, []);
  
  // Sample track data - in a real app, this would come from an API or CMS
  const tracks = [
    {
      id: '1',
      title: 'What Do You Dream About?',
      info: 'Latest single - Released May 2025',
      spotifyId: '25FM9yX68IPzFi7FDea91n',
      imageUrl: null
    },
    {
      id: '2',
      title: 'Night Vision',
      info: 'From the upcoming album',
      spotifyId: '25FM9yX68IPzFi7FDea91n',
      imageUrl: null
    },
    {
      id: '3',
      title: 'Quantum Theory',
      info: 'Collaboration with TechnoLab',
      spotifyId: '25FM9yX68IPzFi7FDea91n',
      imageUrl: null
    },
    {
      id: '4',
      title: 'Digital Dreams',
      info: 'Featured on Spotify "Electronic Chill" playlist',
      spotifyId: '25FM9yX68IPzFi7FDea91n', 
      imageUrl: null
    },
    {
      id: '5',
      title: 'Midnight Echoes',
      info: 'Deep house remix - April 2025',
      spotifyId: '25FM9yX68IPzFi7FDea91n',
      imageUrl: null
    },
    {
      id: '6',
      title: 'Neural Dawn',
      info: 'Instrumental track',
      spotifyId: '25FM9yX68IPzFi7FDea91n',
      imageUrl: null
    }
  ];
  
  return (
    <div className={`min-h-screen bg-dark py-20 transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto px-6">
        <PageHeader 
          title="My Music" 
          subtitle="Explore my catalog of dance-electronic tracks with confessional songwriting"
        />
        
        {/* Featured Album Section */}
        <FeaturedAlbum />
        
        {/* Featured Track Section */}
        <div className="mb-16">
          <SectionTitle>Featured Track</SectionTitle>
          
          <div className="rounded-xl overflow-hidden shadow-xl border border-white/10 bg-dark/30">
            <iframe
              src="https://open.spotify.com/embed/track/25FM9yX68IPzFi7FDea91n"
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen"
              loading="lazy"
              title="Spotify Player - Featured Track"
            ></iframe>
          </div>
        </div>
        
        {/* Track Grid */}
        <div className="mb-20">
          <SectionTitle>All Tracks</SectionTitle>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track, index) => (
              <TrackItem
                key={track.id}
                title={track.title}
                info={track.info}
                imageUrl={track.imageUrl}
                spotifyId={track.spotifyId}
                index={index + 1}
              />
            ))}
          </div>
        </div>
        
        {/* Spotify Profile Link */}
        <div className="text-center">
          <p className="text-white/70 mb-4">
            For more tracks and updates, follow me on Spotify
          </p>
          <a
            href="https://open.spotify.com/artist/2qpBZGqFiVcsYEaJkBahMo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-[#1DB954] hover:bg-[#1DB954]/90 text-white px-6 py-3 rounded-full transition-colors"
          >
            <FaSpotify className="mr-2" size={18} /> Visit Spotify Artist Page
          </a>
        </div>
      </div>
    </div>
  );
};

export default Music;