'use client'
import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const teamMembers = [
  {
    name: 'Thyago Borba',
    role: 'Desenvolvedor',
    image: '/images/team/thyagoborba.jpg',
    social: [
      { icon: Facebook, link: '#' },
      { icon: Instagram, link: '#' },
      { icon: Twitter, link: '#' }
    ]
  },
  {
    name: 'Helton Lucas',
    role: 'Idealizador',
    image: '/images/team/heltonlucas.jpg',
    social: [
      { icon: Facebook, link: '#' },
      { icon: Instagram, link: '#' },
      { icon: Twitter, link: '#' }
    ]
  },
  {
    name: 'Catarina Albuquerque',
    role: 'Diretora de Artes',
    image: '/images/team/catarinaalbuquerque.jpg',
    social: [
      { icon: Facebook, link: '#' },
      { icon: Instagram, link: '#' },
      { icon: Twitter, link: '#' }
    ]
  },
  {
    name: 'Andre Elali',
    role: 'Co-fundador',
    image: '/images/team/andreelali.jpg',
    social: [
      { icon: Facebook, link: '#' },
      { icon: Instagram, link: '#' },
      { icon: Twitter, link: '#' }
    ]
  }
];

const TeamMemberCard = ({ name, role, image, social }) => (
  <div className="group bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
    <div className="relative overflow-hidden">
      <div
        className="w-full h-64 bg-cover bg-center transform transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="flex gap-4">
          {social.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-yellow-400 transition-colors duration-300"
              >
                <Icon size={24} />
              </a>
            );
          })}
        </div>
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
      <p className="text-gray-600">{role}</p>
    </div>
  </div>
);

const Team = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Nossa Equipe
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMemberCard
              key={index}
              {...member}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;