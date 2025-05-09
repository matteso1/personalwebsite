// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <section className="relative w-full h-screen">
    {/* Background gradient */}
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-700" />
    {/* Content */}
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
      <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-4">
        Nils Matteson
      </h1>
      <p className="max-w-2xl text-xl md:text-2xl text-indigo-100 mb-8">
        Grammy winner. Producer. Storyteller. Blending dance-rock with confessional songwriting.
      </p>
      <Link to="/music" className="btn-primary">
        Listen Now
      </Link>
    </div>
  </section>
);

export default Home;