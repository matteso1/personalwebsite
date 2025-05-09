// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaSpotify, FaInstagram, FaTwitter, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark relative">
      {/* Gradient top border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
      
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-heading font-bold text-white">NILS MATTESON</span>
            </Link>
            <p className="text-white/60 text-sm">
              Producer • Artist • Visionary<br />
              Creating unique sonic experiences since 2020
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://open.spotify.com/artist/2qpBZGqFiVcsYEaJkBahMo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-accent transition-colors"
                aria-label="Spotify"
              >
                <FaSpotify className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com/yoitsnils" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-accent transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-heading font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Music', 'About', 'Journal', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                    className="text-white/60 hover:text-accent transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Latest Updates */}
          <div>
            <h3 className="text-white font-heading font-bold text-lg mb-4">Latest Updates</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/journal" className="group">
                  <p className="text-accent/80 text-xs">May 5, 2025</p>
                  <p className="text-white/60 text-sm group-hover:text-accent transition-colors">
                    Working on New Tracks
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/journal" className="group">
                  <p className="text-accent/80 text-xs">April 20, 2025</p>
                  <p className="text-white/60 text-sm group-hover:text-accent transition-colors">
                    Featured on Spotify Playlist
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/journal" className="group">
                  <p className="text-accent/80 text-xs">April 15, 2025</p>
                  <p className="text-white/60 text-sm group-hover:text-accent transition-colors">
                    Website Launch
                  </p>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-white font-heading font-bold text-lg mb-4">Contact</h3>
            <p className="text-white/60 text-sm mb-2">
              Send me your beats or get in touch:
            </p>
            <a 
              href="mailto:sendbeats2nils@gmail.com" 
              className="text-accent hover:text-white transition-colors text-sm"
            >
              sendbeats2nils@gmail.com
            </a>
            <p className="text-white/60 text-sm mt-4">
              Follow on Instagram:
            </p>
            <a 
              href="https://instagram.com/yoitsnils" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-accent hover:text-white transition-colors text-sm"
            >
              @yoitsnils
            </a>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Nils Matteson. All rights reserved.
          </p>
          <p className="text-white/40 text-xs mt-2 md:mt-0 flex items-center">
            Crafted with <FaHeart className="mx-1 text-accent" size={10} /> in Madison, Wisconsin
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;