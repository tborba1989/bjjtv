import React from 'react';

const Store = () => {
  return (
    <section
      className="store-container bg-cover bg-center py-24 md:py-32 text-center text-white"
      style={{ backgroundImage: `url('/images/banner-store.jpg')` }}
    >
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Encontre seu estilo</h1>
        <p className="text-lg md:text-xl mb-10">
          Confira nossa loja e encontre fightwears que carregam a essência da RN BJJ TV.
          Qualidade, estilo e performance para você treinar e competir com a nossa cara.
          Vista-se como um verdadeiro campeão!
        </p>
        <a
          href="/loja"
          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-8 rounded transition-colors"
          aria-label="Visite nossa loja"
        >
          VISITE NOSSA LOJA
        </a>
      </div>
    </section>
  );
};

export default Store;