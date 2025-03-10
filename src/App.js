// /c:/Users/nilsm/OneDrive/Desktop/websiteProject/interactive-symphony/src/App.js
import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from './pages/Home';
import ThreeCanvas from './components/ThreeCanvas';
import IslandModal from './components/IslandModal';

function App() {
  const canvasRef = useRef(null);
  const [selectedIsland, setSelectedIsland] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!showPopup || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // Particle animation logic will be added later
  }, [showPopup]);

  const handleIslandClick = (type) => {
    console.log('Island clicked:', type); // Debug log
    setSelectedIsland(type);
    setShowPopup(true);
  };

  const handleBack = () => {
    console.log('Back clicked'); // Debug log
    if (window.returnToOverview) {
      window.returnToOverview();
    }
    setTimeout(() => {
      setShowPopup(false);
      setSelectedIsland(null);
    }, 2000);
  };

  // Always render the button, just control its visibility with CSS
  return (
    <Router>
      <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        {/* Add pointerEvents and zIndex to ThreeCanvas wrapper */}
        <Home></Home>
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: showPopup ? 'none' : 'auto'
        }}>
          <ThreeCanvas onIslandClick={handleIslandClick} />
        </div>




        {/* Overlay */}
        {showPopup && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 999
          }} />
        )}

        {/* Island Modal */}
        {showPopup && (
          <IslandModal 
            type={selectedIsland} 
            onClose={() => {
              setShowPopup(false);
              // Force return to overview
              if (window.returnToOverview) window.returnToOverview();
            }}
          />
        )}
      </div>
    </Router>
  );
}

export default App;