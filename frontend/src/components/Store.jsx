// frontend/src/components/Store.js
import React from 'react';
import '../styles/Store.css';
import { getImageUrl } from '../config/env';

const Store = () => {
  return (
    <section
      className="store-container"
      style={{ backgroundImage: `url(${getImageUrl('logo/store-banner.jpg')})` }}
    >
      <div className="store-content">
        <h1>Encontre seu estilo</h1>
        <p>
          Confira nossa loja e encontre fightwears que carregam a essência da RN BJJ TV.
          Qualidade, estilo e performance para você treinar e competir com a nossa cara.
          Vista-se como um verdadeiro campeão!
        </p>
        <a href="/loja" className="btn-loja">VISITE NOSSA LOJA</a>
      </div>
    </section>
  );
};

export default Store;