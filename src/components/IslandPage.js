import React from 'react';

const IslandPage = ({ type, onClose }) => {
  console.log('IslandPage rendered with type:', type); // Debug log

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <button
        onClick={() => {
          console.log('Back button clicked'); // Debug log
          if (window.returnToOverview) {
            window.returnToOverview();
          }
          onClose();
        }}
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          backgroundColor: 'white',
          color: 'black',
          border: 'none',
          padding: '15px 30px',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer',
          zIndex: 1001
        }}
      >
        ← Back
      </button>

      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '15px',
        maxWidth: '800px',
        width: '90%',
        color: 'black'
      }}>
        <h1>{type.toUpperCase()} ISLAND</h1>
        <p>This is the {type} island content.</p>
      </div>
    </div>
  );
};

export default IslandPage;