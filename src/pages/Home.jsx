// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-black to-dark">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            NILS MATTESON
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Producer • Artist • Visionary
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/music"
              className="bg-accent hover:bg-accent/80 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Listen Now
            </Link>
            <Link
              to="/contact"
              className="bg-transparent border border-white text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Track Section */}
      <section className="py-16 bg-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Featured Track
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://open.spotify.com/embed/track/25FM9yX68IPzFi7FDea91n"
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen"
                loading="lazy"
                title="Spotify Player"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">About Me</h2>
              <p className="text-gray-300 mb-6">
                I'm Nils Matteson, a music producer and artist from Madison. My sound blends electronic elements with atmospheric textures and introspective lyrics, creating unique sonic landscapes.
              </p>
              <Link
                to="/about"
                className="text-accent hover:text-white transition-colors inline-flex items-center"
              >
                Learn More 
                <svg className="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            <div className="bg-dark p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-4">Latest Updates</h3>
              <div className="space-y-4">
                <div className="border-l-2 border-accent pl-4">
                  <p className="text-sm text-gray-400">May 5, 2025</p>
                  <p className="text-white">Working on new tracks for my upcoming album</p>
                </div>
                <div className="border-l-2 border-accent pl-4">
                  <p className="text-sm text-gray-400">April 20, 2025</p>
                  <p className="text-white">Featured on Spotify Playlist</p>
                </div>
                <div className="border-l-2 border-accent pl-4">
                  <p className="text-sm text-gray-400">April 15, 2025</p>
                  <p className="text-white">Website Launch</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-dark text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Connect With Me
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Follow me on social media or reach out directly to collaborate, book shows, or just say hello.
          </p>
          <Link
            to="/contact"
            className="bg-accent hover:bg-accent/80 text-white px-6 py-3 rounded-lg transition-colors inline-block"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;