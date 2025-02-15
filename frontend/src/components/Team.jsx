// frontend/src/components/Team.js
import React from 'react';
import '../styles/Team.css';
import { getImageUrl } from '../config/env';

const teamMembers = [
  {
    name: 'Thyago Borba',
    role: 'Desenvolvedor',
    image: getImageUrl('team/thyagoborba.jpg'),
    social: [
      { icon: 'fa-facebook', link: '#' },
      { icon: 'fa-instagram', link: '#' },
      { icon: 'fa-twitter', link: '#' }
    ]
  },
  {
    name: 'Helton Lucas',
    role: 'Idealizador',
    image: getImageUrl('team/heltonlucas.jpg'),
    social: [
      { icon: 'fa-facebook', link: '#' },
      { icon: 'fa-instagram', link: '#' },
      { icon: 'fa-twitter', link: '#' }
    ]
  },
  {
    name: 'Catarina Albuquerque',
    role: 'Diretora de Artes',
    image: getImageUrl('team/catarinaalbuquerque.jpg'),
    social: [
      { icon: 'fa-facebook', link: '#' },
      { icon: 'fa-instagram', link: '#' },
      { icon: 'fa-twitter', link: '#' }
    ]
  },
  {
    name: 'Andre Elali',
    role: 'Co-fundador',
    image: getImageUrl('team/andreelali.jpg'),
    social: [
      { icon: 'fa-facebook', link: '#' },
      { icon: 'fa-instagram', link: '#' },
      { icon: 'fa-twitter', link: '#' }
    ]
  }
];

const Team = () => {
  return (
    <section className="team-section">
      <h2>Nossa Equipe</h2>
      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-member">
            <div className="image-wrapper">
              <img src={member.image} alt={member.name} />
            </div>
            <h3>{member.name}</h3>
            <p>{member.role}</p>
            <div className="social-icons">
              {member.social.map((social, i) => (
                <a key={i} href={social.link} target="_blank" rel="noopener noreferrer">
                  <i className={`fa ${social.icon}`}></i>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Team;