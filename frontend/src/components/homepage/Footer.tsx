'use client'
import React from 'react';
import { Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import '@/styles/homepage/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: Instagram,
      url: 'https://www.instagram.com/rn_bjjtv/',
      label: 'Instagram',
      className: 'instagram-icon'
    },
    {
      icon: Youtube,
      url: 'https://www.youtube.com/@RN_BJJTV',
      label: 'YouTube',
      className: 'youtube-icon'
    }
  ];

  const quickLinks = [
    { name: 'Início', href: '/' },
    { name: 'Sobre', href: '/about' },
    { name: 'Serviços', href: '/services' },
    { name: 'Contato', href: '/contact' }
  ];

  return (
    <footer className="footer bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="footer-content footer-grid grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div>
            <Link href="/" className="footer-logo inline-block">
              <img
                src="/images/rnbjj-logo.png"
                alt="RN BJJ TV Logo"
                width="120"
                height="40"
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm text-gray-300">
              Sua fonte principal de informações sobre o Jiu-Jitsu Potiguar.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Links Rápidos
            </h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="footer-link nav-link text-base text-gray-300 hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Contato
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="contact-info-item text-gray-300">
                <Phone className="h-5 w-5 mr-2 text-gray-400" />
                <span>(84) 99997-4736</span>
              </li>
              <li className="contact-info-item text-gray-300">
                <Mail className="h-5 w-5 mr-2 text-gray-400" />
                <span>contato@rnbjjtv.com.br</span>
              </li>
              <li className="contact-info-item text-gray-300">
                <MapPin className="h-5 w-5 mr-2 text-gray-400 mt-1" />
                <span>Natal, Rio Grande do Norte<br />Brasil</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Redes Sociais
            </h3>
            <div className="mt-4 social-container">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`social-icon text-gray-400 hover:text-white ${social.className}`}
                  aria-label={social.label}
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}

              {/* WhatsApp */}
              <a
                href="https://api.whatsapp.com/send?phone=5584999974736&text=Desejo%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20servi%C3%A7o%20de%20coberturas%20de%20eventos!"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon text-gray-400 hover:text-green-400 whatsapp-icon"
                aria-label="WhatsApp"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright com borda mais escura para combinar com o fundo */}
        <div className="copyright mt-12 pt-8 border-t border-gray-700">
          <p className="text-center text-sm text-gray-400">
            RN BJJ TV &copy; {currentYear}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;