// src/components/Footer.jsx
import React from 'react';

const socials = [
  { name: 'Spotify', url: 'https://open.spotify.com/artist/…' },
  { name: 'Instagram', url: 'https://instagram.com/…' },
  { name: 'Twitter', url: 'https://twitter.com/…' },
];

const Footer = () => (
  <footer className="bg-gray-100">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-6">
      <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} Nils Matteson.</p>
      <div className="flex space-x-4 mt-2 md:mt-0">
        {socials.map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-indigo-600 text-sm"
          >
            {s.name}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
