// src/components/Layout.jsx
import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

const Layout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans">
    <NavBar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

export default Layout;