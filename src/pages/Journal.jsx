// src/pages/Journal.jsx
import React, { useState, useEffect } from 'react';
import { FaCalendar, FaTag, FaArrowRight } from 'react-icons/fa';

// Journal Entry Component
const JournalEntry = ({ date, title, excerpt, tags, featured = false }) => (
  <div className={`overflow-hidden rounded-xl transition-all duration-300 hover:transform hover:scale-[1.02] ${
    featured 
      ? 'bg-gradient-to-br from-accent/10 to-primary/10 backdrop-blur-sm border border-white/10' 
      : 'bg-white/5 backdrop-blur-sm border border-white/10'
  }`}>
    <div className="p-6">
      <div className="flex items-center text-sm text-white/60 mb-3">
        <FaCalendar className="mr-2" size={12} />
        {date}
        
        {featured && (
          <span className="ml-4 px-2 py-1 bg-accent/20 rounded-full text-xs text-white/90">
            Featured
          </span>
        )}
      </div>
      
      <h3 className="text-xl font-heading font-bold text-white mb-3 hover:text-accent transition-colors">
        {title}
      </h3>
      
      <p className="text-white/70 mb-4">{excerpt}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <div key={idx} className="flex items-center text-white/60 text-xs">
              <FaTag className="mr-1" size={10} />
              {tag}
            </div>
          ))}
        </div>
        
        <button className="text-accent hover:text-white flex items-center text-sm transition-colors">
          Read More <FaArrowRight className="ml-1" size={12} />
        </button>
      </div>
    </div>
  </div>
);

// Featured Entry Component
const FeaturedEntry = ({ date, title, excerpt, image, tags = [] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
    {/* Image Side */}
    <div className="h-60 md:h-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center">
        <span className="text-white text-lg font-heading font-bold">Latest Update</span>
      </div>
    </div>
    
    {/* Content Side */}
    <div className="p-6 md:p-8 flex flex-col justify-center">
      <div className="flex items-center text-sm text-white/60 mb-3">
        <FaCalendar className="mr-2" size={12} />
        {date}
        <span className="ml-4 px-2 py-1 bg-accent/20 rounded-full text-xs text-white/90">
          Featured
        </span>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
        {title}
      </h2>
      
      <p className="text-white/70 mb-6">{excerpt}</p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag, idx) => (
          <div key={idx} className="flex items-center text-white/60 text-xs px-3 py-1 bg-white/5 rounded-full">
            <FaTag className="mr-1" size={10} />
            {tag}
          </div>
        ))}
      </div>
      
      <button className="inline-flex items-center text-accent hover:text-white transition-colors">
        Read Full Post <FaArrowRight className="ml-2" />
      </button>
    </div>
  </div>
);

// Main Journal Component
const Journal = () => {
  const [fadeIn, setFadeIn] = useState(false);
  
  useEffect(() => {
    setFadeIn(true);
  }, []);
  
  // Sample journal entries data - in a real app, this would come from an API or CMS
  const entries = [
    {
      id: '1',
      date: 'May 9, 2025',
      title: 'Launched the New React Site',
      excerpt: 'Excited to share my newly redesigned website built with React and Tailwind CSS. This platform will serve as the hub for all my music updates, thoughts, and creative journey.',
      tags: ['Website', 'Updates'],
      featured: true
    },
    {
      id: '2',
      date: 'May 5, 2025',
      title: 'Studio Session: Finalizing the Album',
      excerpt: 'Just wrapped up another productive studio session. The album is coming together beautifully, and I can\'t wait to share these tracks with all of you soon.',
      tags: ['Music', 'Album'],
      featured: false
    },
    {
      id: '3',
      date: 'April 20, 2025',
      title: 'Featured on Spotify Playlist',
      excerpt: 'Thrilled to announce that my latest track has been featured on a major Spotify playlist! This is a huge milestone in my journey as an independent artist.',
      tags: ['Spotify', 'Achievement'],
      featured: false
    },
    {
      id: '4',
      date: 'April 15, 2025',
      title: 'Website Launch Announcement',
      excerpt: 'Welcome to my new official website! This will be the home for all updates, music releases, and more. Bookmark this page to stay in the loop.',
      tags: ['Website', 'Announcement'],
      featured: false
    },
    {
      id: '5',
      date: 'April 3, 2025',
      title: 'Behind the Scenes: New Music Video',
      excerpt: 'Spent the day filming for an upcoming music video. Working with an amazing team to bring my vision to life. Stay tuned for the release date!',
      tags: ['Video', 'Behind The Scenes'],
      featured: false
    },
    {
      id: '6',
      date: 'March 27, 2025',
      title: 'Reflection on My Musical Journey',
      excerpt: 'As I prepare to release my debut album, I\'ve been reflecting on my musical journey so far. From early influences to current inspirations, here\'s what has shaped my sound.',
      tags: ['Reflection', 'Journey'],
      featured: false
    }
  ];
  
  return (
    <div className={`min-h-screen bg-dark py-20 transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
            Journal
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Thoughts, updates, and behind-the-scenes glimpses into my creative process
          </p>
        </div>
        
        {/* Featured Entry */}
        <FeaturedEntry 
          date="May 9, 2025"
          title="Launched the New React Site"
          excerpt="Excited to share my newly redesigned website built with React and Tailwind CSS. This platform will serve as the hub for all my music updates, thoughts, and creative journey. I've put a lot of thought into creating a space that reflects my artistic vision and makes it easy for you to stay connected with my work."
          tags={['Website', 'Updates', 'Design']}
        />
        
        {/* Journal Entries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {entries.slice(1).map(entry => (
            <JournalEntry 
              key={entry.id}
              date={entry.date}
              title={entry.title}
              excerpt={entry.excerpt}
              tags={entry.tags}
              featured={entry.featured}
            />
          ))}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-lg overflow-hidden">
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border-r border-white/10 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-accent/80 hover:bg-accent text-white transition-colors">
              1
            </button>
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white transition-colors">
              2
            </button>
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border-l border-white/10 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;