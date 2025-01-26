"use client";

import React from 'react';
import '@/styles/homepage/Channel.css';

const Channel = () => {
  const handleSubscribe = () => {
    window.open('https://www.youtube.com/channel/SEU_CANAL', '_blank');
  };

  return (
    <section className="channel-section">
      <div
        className="channel-image"
        style={{ backgroundImage: `url('/images/banner-youtube.jpg')` }}
      ></div>
      <div className="channel-content">
        <h2 className="channel-title">Assine nosso Canal do YouTube</h2>
        <p className="channel-description">
          Inscreva-se e seja o primeiro a saber sobre novidades, ofertas especiais,
          eventos e promoções.
        </p>
        <button onClick={handleSubscribe} className="subscribe-button">
          INSCREVA-SE
        </button>
      </div>
    </section>
  );
};

export default Channel;