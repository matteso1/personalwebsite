// src/pages/Music.js
import React from 'react';

function Music() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>My Music</h1>
      <p>Listen to some of my original tracks:</p>
      <audio controls>
        <source src="/path-to-your-music-file.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default Music;