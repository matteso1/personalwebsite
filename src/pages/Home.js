import React from 'react';
import ThreeCanvas from '../components/ThreeCanvas';
import TerminalNav from '../components/TerminalNav';

function Home() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: '#000',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }}>
        <ThreeCanvas />
      </div>
      <div style={{
        position: 'relative',
        zIndex: 2
      }}>
        <TerminalNav />
      </div>
    </div>
  );
}

export default Home;