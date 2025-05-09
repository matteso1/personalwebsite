// src/components/NavBar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const links = [
  { name: 'Home', to: '/' },
  { name: 'Music', to: '/music' },
  { name: 'About', to: '/about' },
  { name: 'Journal', to: '/journal' },
  { name: 'Contact', to: '/contact' },
];

const NavBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed w-full z-30 bg-white bg-opacity-70 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-2xl font-bold">
          Nils Matteson
        </Link>
        {/* Desktop links */}
        <nav className="hidden md:flex space-x-6">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-gray-800 hover:text-indigo-600">
              {l.name}
            </Link>
          ))}
        </nav>
        {/* Mobile toggle */}
        <button className="md:hidden text-2xl" onClick={() => setOpen((o) => !o)}>
          {open ? '✕' : '☰'}
        </button>
      </div>
      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="block px-4 py-3 text-gray-800 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              {l.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default NavBar;