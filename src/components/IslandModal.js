// /c:/Users/nilsm/OneDrive/Desktop/websiteProject/interactive-symphony/src/components/IslandModal.js
import React from 'react';
import styles from './IslandModal.module.css';

const IslandModal = ({ type, onClose }) => {
  const renderContent = () => {
    if (!type) return <p>Select a section to explore</p>;
    switch(type.toLowerCase()) {
      
      case 'music':
        return (
          <div className={styles.section} data-type="music">
            <h2>Music Studio</h2>
            <div className={styles.contentGrid}>
              <div className={styles.player}>
                <h3>Latest Track</h3>
                <div className={styles.waveform}></div>
                <div className={styles.controls}>
                  <button className={styles.playButton}>▶</button>
                  <span className={styles.trackTime}>2:34 / 4:12</span>
                </div>
              </div>
              <div className={styles.playlist}>
                <h3>Discography</h3>
                <ul>
                  <li>"Digital Dreams" (2024) <span className={styles.newBadge}>NEW</span></li>
                  <li>"Synthwave Nights" (2023)</li>
                  <li>"Binary Melodies" (2022)</li>
                </ul>
              </div>
            </div>
          </div>
        );
        
      case 'shop':
        return (
          <div className={styles.section} data-type="shop">
            <h2>Digital Marketplace</h2>
            <div className={styles.productGrid}>
              <div className={styles.productCard}>
                <div className={styles.productImage} style={{background: '#ff6600'}}></div>
                <h3>Sound Pack Vol.1</h3>
                <p>Collection of 150+ unique synth sounds</p>
                <button className={styles.buyButton}>$29.99</button>
              </div>
              <div className={styles.productCard}>
                <div className={styles.productImage} style={{background: '#0099ff'}}></div>
                <h3>Sample Library</h3>
                <p>500MB of royalty-free samples</p>
                <button className={styles.buyButton}>$49.99</button>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className={styles.section} data-type="about">
            <h2>Creator Hub</h2>
            <div className={styles.aboutContent}>
              <div className={styles.bio}>
                <p>Digital artist & sound designer exploring the intersection of technology and creativity.</p>
                <div className={styles.socialLinks}>
                  <button className={styles.socialButton}>Twitter</button>
                  <button className={styles.socialButton}>Bandcamp</button>
                  <button className={styles.socialButton}>GitHub</button>
                </div>
              </div>
              <div className={styles.achievements}>
                <h3>Milestones</h3>
                <ul>
                  <li>10+ years music production</li>
                  <li>50+ released tracks</li>
                  <li>Open source contributor</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return <p>Select a section to explore</p>;
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        {renderContent()}
      </div>
    </div>
  );
};

export default IslandModal;