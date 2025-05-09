// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaMusic, FaInfoCircle, FaHeadphones } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="container px-6 py-12 max-w-lg mx-auto text-center">
        {/* Visual element */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-accent/20 flex items-center justify-center">
          <FaHeadphones className="text-accent" size={40} />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-heading font-bold text-white mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-heading font-medium text-white mb-6">
          Page Not Found
        </h2>
        
        <p className="text-white/70 mb-10">
          Looks like you've ventured into uncharted territory.
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* Navigation options */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link 
            to="/" 
            className="flex flex-col items-center p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-accent/30 transition-all group"
          >
            <FaHome className="text-accent mb-2" size={24} />
            <span className="text-white group-hover:text-accent transition-colors">Home</span>
          </Link>
          
          <Link 
            to="/music" 
            className="flex flex-col items-center p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-accent/30 transition-all group"
          >
            <FaMusic className="text-accent mb-2" size={24} />
            <span className="text-white group-hover:text-accent transition-colors">Music</span>
          </Link>
          
          <Link 
            to="/about" 
            className="flex flex-col items-center p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-accent/30 transition-all group"
          >
            <FaInfoCircle className="text-accent mb-2" size={24} />
            <span className="text-white group-hover:text-accent transition-colors">About</span>
          </Link>
          
          <Link 
            to="/contact" 
            className="flex flex-col items-center p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-accent/30 transition-all group"
          >
            <svg className="text-accent mb-2" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-white group-hover:text-accent transition-colors">Contact</span>
          </Link>
        </div>
        
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-full font-medium transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;