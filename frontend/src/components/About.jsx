// src/components/About.jsx
import React from 'react';
import { getImageUrl } from '../config/env';

const About = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Sobre o nosso projeto</h2>
              <h6 className="text-lg text-gray-600">
                RN BJJ TV: levando a arte suave do Rio Grande do Norte para o mundo!
              </h6>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                A RN BJJ TV nasceu da paixão pelo Jiu-Jitsu e da vontade de promover
                e divulgar o talento potiguar dessa arte marcial. Nossa missão é
                proporcionar uma plataforma onde atletas, entusiastas e amantes do
                Jiu-Jitsu possam se conectar, acompanhar competições ao vivo, e ficar
                por dentro das últimas notícias e eventos do cenário local e nacional.
              </p>
              <p>
                Além das transmissões ao vivo, a RN BJJ TV oferece uma gama de
                conteúdos exclusivos, incluindo entrevistas com grandes nomes do
                esporte, análises técnicas, e cobertura de eventos especiais.
                Queremos ser mais que um canal de transmissão; queremos ser um
                ponto de encontro para a comunidade do Jiu-Jitsu.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-lg overflow-hidden border-8 border-gray-200">
              <img
                src={getImageUrl('about/welcome-1-485x479.jpg')}
                alt="BJJ Training"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;