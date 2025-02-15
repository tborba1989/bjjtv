// frontend/src/components/Header.js
import React from 'react';
import { getImageUrl } from '../config/env';
import { MapPin, Clock } from 'lucide-react';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header-container">
      <div className="logo-container">
        <img src={getImageUrl('logo/logo.png')} alt="RN BJJ TV" className="logo" />
        <span className="subtitle">JIU-JITSU POTIGUAR</span>
      </div>
      <div className="info-container">
        <div className="info-item">
          <MapPin size={14} />
          <span>Sede Natal/RN</span>
        </div>
        <div className="info-item">
          <Clock size={14} />
          <span>Dom-Dom: 9:00 - 17:00</span>
        </div>
      </div>
      <button className="portal-button" onClick={() => window.location.href = '/login'}>
        Portal
      </button>
    </header>
  );
};

export default Header;