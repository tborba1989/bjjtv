"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaGlobe } from 'react-icons/fa';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

// Função para tratar o carregamento de imagens com fallback mais robusto
const getSponsorImage = (imageUrl) => {
  if (!imageUrl) {
    return '/images/banner-sponsors.webp';
  }
  return imageUrl.startsWith('http') ? imageUrl : `/images/sponsors/${imageUrl}`;
};

// Componente de carregamento
const SponsorsLoader = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
  </div>
);

// Componente de erro
const SponsorsError = ({ message }) => (
  <div className="text-center py-12 bg-red-50">
    <div className="max-w-md mx-auto">
      <h3 className="text-2xl font-bold text-red-600 mb-4">Ops! Algo deu errado</h3>
      <p className="text-red-500">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Tentar Novamente
      </button>
    </div>
  </div>
);

const Sponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/patrocinadores');
        if (!response.ok) {
          throw new Error('Não foi possível carregar os patrocinadores');
        }
        const data = await response.json();
        // Filtra sponsors ativos ou válidos
        const validSponsors = data.data.filter(sponsor =>
          sponsor.ativo !== false && sponsor.nome && sponsor.url_logo
        );
        setSponsors(validSponsors);
      } catch (err) {
        console.error('Erro ao carregar patrocinadores:', err);
        setError(err.message || 'Erro ao carregar os dados dos patrocinadores');
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  // Memoização dos sponsors para performance
  const memoizedSponsors = useMemo(() => sponsors, [sponsors]);

  // Renderização condicional
  if (loading) return <SponsorsLoader />;
  if (error) return <SponsorsError message={error} />;
  if (memoizedSponsors.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-6 text-gray-800">Nossos Patrocinadores</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12 leading-relaxed">
          Agradecemos aos nossos patrocinadores que são fundamentais para o sucesso de nossos eventos.
          Cada apoio contribui para o crescimento e desenvolvimento do Jiu-Jitsu.
        </p>

        <Swiper
          modules={[Autoplay, Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 40,
            }
          }}
          centeredSlides={false}
          loop={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          navigation
          pagination={{
            clickable: true
          }}
          scrollbar={{ draggable: true }}
          className="sponsors-swiper"
        >
          {memoizedSponsors.map((sponsor) => (
            <SwiperSlide key={sponsor.id} className="pb-12">
              <div className="sponsor-card bg-white rounded-lg shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-all duration-300">
                <div className="sponsor-image-container mb-4 w-full h-40 flex items-center justify-center">
                  <img
                    src={getSponsorImage(sponsor.url_logo)}
                    alt={`Logo ${sponsor.nome}`}
                    className="max-w-full max-h-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/banner-sponsors.webp';
                    }}
                  />
                </div>

                <h3 className="text-xl font-semibold text-center mb-2 text-gray-800">
                  {sponsor.nome}
                </h3>

                {sponsor.descricao && (
                  <p className="text-gray-600 text-sm text-center mb-4 line-clamp-3">
                    {sponsor.descricao}
                  </p>
                )}

                <div className="flex space-x-4 mt-4 mb-4">
                  {[
                    { icon: FaFacebook, url: sponsor.facebook, color: 'text-blue-600' },
                    { icon: FaInstagram, url: sponsor.instagram, color: 'text-pink-500' },
                    { icon: FaTwitter, url: sponsor.twitter, color: 'text-blue-400' },
                    { icon: FaLinkedin, url: sponsor.linkedin, color: 'text-blue-700' },
                    { icon: FaYoutube, url: sponsor.youtube, color: 'text-red-600' },
                  ].map(({ icon: Icon, url, color }) =>
                    url && (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${color} hover:opacity-75 transition`}
                      >
                        <Icon size={24} />
                      </a>
                    )
                  )}
                </div>

                {sponsor.url_site && (
                  <a
                    href={sponsor.url_site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors inline-flex items-center"
                  >
                    <FaGlobe className="mr-2" /> Visitar Site
                  </a>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Sponsors;