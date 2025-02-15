import React from 'react';
import { getImageUrl } from '../config/env';

const HeroSection = () => {
  return (
    <section className="relative h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-gray-900"
        style={{
          backgroundImage: `url('${getImageUrl('logo/slide1.jpg')}')`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center">
        <div className="max-w-4xl px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Sua fonte oficial
          </h1>
          <h2 className="text-2xl md:text-4xl text-white mb-8">
            Para o Melhor do Jiu-jitsu Potiguar
          </h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300">
            Siga Nossas Redes
          </button>
        </div>
      </div>

      {/* Custom Pagination */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
        <button className="w-3 h-3 rounded-full bg-white opacity-50"></button>
        <button className="w-3 h-3 rounded-full bg-white"></button>
        <button className="w-3 h-3 rounded-full bg-white opacity-50"></button>
      </div>
    </section>
  );
};

export default HeroSection;