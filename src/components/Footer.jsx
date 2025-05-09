// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaSpotify, FaInstagram, FaTwitter } from 'react-icons/fa';

const socials = [
  { 
    name: 'Spotify', 
    url: 'https://open.spotify.com/artist/2qpBZGqFiVcsYEaJkBahMo', 
    icon: <FaSpotify className="w-5 h-5" />
  },
  { 
    name: 'Instagram', 
    url: 'https://instagram.com/yoitsnils', 
    icon: <FaInstagram className="w-5 h-5" />
  },
  { 
    name: 'Twitter', 
    url: 'https://twitter.com/', 
    icon: <FaTwitter className="w-5 h-5" />
  },
];

const Footer = () => (
  <footer className="bg-dark border-t border-light/5">
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0">
          <Link to="/" className="text-xl font-heading font-bold text-light">
            Nils Matteson
          </Link>
          <p className="text-sm text-light/60 mt-1">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
        
        <div className="flex flex-col items-center md:items-end">
          <div className="flex space-x-4 mb-3">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-light/70 hover:text-accent transition-colors"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
          <p className="text-sm text-light/60">
            Contact: <a href="mailto:sendbeats2nils@gmail.com" className="hover:text-accent transition-colors">sendbeats2nils@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;