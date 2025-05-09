import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Home from './pages/Home';
import Music from './pages/Music';
import About from './pages/About';
import Journal from './pages/Journal';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

const App = () => (
  <Layout>
    <Routes>
      <Route index element={<Home />} />
      <Route path="/music" element={<Music />} />
      <Route path="/about" element={<About />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Layout>
);

export default App;
