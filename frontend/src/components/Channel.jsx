// frontend/src/components/Channel.js
import React from 'react';
import { getImageUrl } from '../config/env';
import '../styles/Channel.css';

const Channel = () => {
  const handleSubscribe = () => {
    window.open('https://www.youtube.com/channel/SEU_CANAL', '_blank');
  };

  return (
    <section className="channel-section">
      <div
        className="channel-image"
        style={{ backgroundImage: `url(${getImageUrl('logo/youtube-banner.jpg')})` }}
      ></div>
      <div className="channel-content">
        <h2>Assine nosso Canal do YouTube</h2>
        <p>
          Inscreva-se e seja o primeiro a saber sobre novidades, ofertas especiais,
          eventos e promoções.
        </p>
        <button onClick={handleSubscribe} className="subscribe-button">INSCREVA-SE</button>
      </div>
    </section>
  );
};

export default Channel;
