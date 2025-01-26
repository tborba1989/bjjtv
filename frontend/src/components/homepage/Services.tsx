'use client'

import React from 'react';

const services = [
  {
    id: '01',
    title: 'Inscrição para competições',
    description: 'Acesse o nosso link para conferir o calendário de eventos parceiros da RN BJJ TV e inscreva-se de forma rápida e fácil. Fique por dentro de todas as competições e participe dos melhores eventos de Jiu-Jitsu.'
  },
  {
    id: '02',
    title: 'Ranking RNBJJ',
    description: 'Acompanhe o ranking da RN BJJ TV e veja a classificação dos atletas nos campeonatos parceiros. Mantenha-se atualizado e acompanhe o desempenho dos melhores competidores.'
  },
  {
    id: '03',
    title: 'Coberturas de evento',
    description: 'Conheça o serviço de cobertura de eventos da RN BJJ TV. Cobrimos competições na capital, cidades próximas e até em estados vizinhos, trazendo o melhor do Jiu-Jitsu para você.'
  },
  {
    id: '04',
    title: 'RNBJJ on the mat',
    description: 'Acompanhe as visitas da RN BJJ TV às academias e conheça as histórias inspiradoras de seus líderes. Descubra como cada mestre contribui para o crescimento do Jiu-Jitsu na região.'
  }
];

const ServiceCard = ({ id, title, description }) => (
  <div className="flex gap-6 p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
    <span className="text-5xl font-bold text-gray-200">{id}</span>
    <div className="flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

const Services = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Saiba mais sobre o projeto
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;