// src/components/Layout.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <div className="flex flex-col min-h-screen bg-dark text-light font-sans">
      {/* NavBar will be transparent on home page, solid on other pages */}
      <NavBar transparent={isHomePage} />
      
      {/* No padding on main element for home page to allow full-screen sections */}
      <main className={`flex-grow ${!isHomePage ? 'pt-16 md:pt-20' : ''}`}>
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;