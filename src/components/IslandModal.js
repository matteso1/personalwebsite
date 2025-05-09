// src/components/IslandModal.js
import React from 'react';
import styles from './IslandModal.module.css';

const IslandModal = ({ onClose }) => (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContent}>
      <button className={styles.closeButton} onClick={onClose}>&times;</button>
      <div className={styles.section}>
        <h2>Under Construction</h2>
        <p>Our site is currently under construction. Thanks for your patience!</p>
        <p>
          Inquiries?{' '}
          <a href="mailto:sendbeats2nils@gmail.com">
            sendbeats2nils@gmail.com
          </a>
        </p>
      </div>
    </div>
  </div>
);

export default IslandModal;
