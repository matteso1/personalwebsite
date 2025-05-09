// src/components/NavBar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { name: 'Home', to: '/' },
  { name: 'Music', to: '/music' },
  { name: 'About', to: '/about' },
  { name: 'Journal', to: '/journal' },
  { name: 'Contact', to: '/contact' },
];

const NavBar = ({ transparent = false }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Handle scroll events to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Determine background class based on transparency and scroll position
  const bgClass = transparent && !scrolled 
    ? 'bg-transparent'
    : 'bg-dark/95 backdrop-blur-sm shadow-md';
    
  // Smooth transition for background changes
  const navClasses = `fixed w-full z-30 ${bgClass} transition-all duration-300`;

  return (
    <header className={navClasses}>
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-2xl font-heading font-bold text-light">
          Nils Matteson
        </Link>
        
        {/* Desktop links */}
        <nav className="hidden md:flex space-x-6">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link 
                key={link.to} 
                to={link.to} 
                className={`text-light/80 hover:text-accent transition-colors ${
                  isActive ? 'text-accent font-medium' : ''
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
        
        {/* Mobile toggle */}
        <button 
          className="md:hidden text-light/90 hover:text-accent p-1"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-dark/95 backdrop-blur-sm border-t border-light/10">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 hover:bg-secondary/50 ${
                  isActive ? 'text-accent' : 'text-light/80'
                }`}
                onClick={() => setOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default NavBar;