// frontend/src/components/Services.js
import React from 'react';
import '../styles/Services.css';

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

const Services = () => {
  return (
    <section className="services-section">
      <h2>Saiba mais sobre o projeto</h2>
      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="service-item">
            <span className="service-number">{service.id}</span>
            <div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;