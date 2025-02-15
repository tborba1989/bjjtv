import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Função para tratar o carregamento de imagens com fallback
const getSponsorImage = (imageUrl) => {
  if (!imageUrl) {
    return '/images/sponsors/banner-default.webp';
  }
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  return imageUrl;
};

const Sponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/patrocinadores');
        if (!response.ok) {
          throw new Error('Erro ao carregar patrocinadores');
        }
        const data = await response.json();
        setSponsors(data.data);
      } catch (err) {
        console.error('Erro ao carregar patrocinadores:', err);
        setError('Erro ao carregar os dados.');
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Patrocinadores</h2>
        <p className="text-gray-600 text-center text-justify mb-12 max-w-2xl mx-auto leading-relaxed">
          Agradecemos aos nossos patrocinadores por tornarem possível cada evento. Confira os produtos e serviços de alta qualidade que eles oferecem, apoiando o crescimento do Jiu-Jitsu em nossa comunidade. Juntos, vamos mais longe!
        </p>

        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={3}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="sponsors-swiper"
        >
          {sponsors.map((sponsor) => (
            <SwiperSlide key={sponsor.id}>
              <div className="relative transition-transform duration-300 ease-in-out">
                <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
                  <img
                    src={getSponsorImage(sponsor.url_logo)}
                    alt={sponsor.nome}
                    className="w-full h-40 object-contain mb-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/sponsors/banner-default.webp';
                    }}
                  />
                  <h3 className="text-xl font-semibold text-center mb-2">{sponsor.nome}</h3>
                  <p className="text-gray-600 text-sm text-center mb-4">{sponsor.descricao}</p>
                  <div className="flex space-x-4 mt-4">
                    {sponsor.facebook && (
                      <a href={sponsor.facebook} target="_blank" rel="noopener noreferrer">
                        <FaFacebook className="text-blue-600 hover:text-blue-800 transition" />
                      </a>
                    )}
                    {sponsor.instagram && (
                      <a href={sponsor.instagram} target="_blank" rel="noopener noreferrer">
                        <FaInstagram className="text-pink-500 hover:text-pink-700 transition" />
                      </a>
                    )}
                    {sponsor.twitter && (
                      <a href={sponsor.twitter} target="_blank" rel="noopener noreferrer">
                        <FaTwitter className="text-blue-400 hover:text-blue-600 transition" />
                      </a>
                    )}
                    {sponsor.linkedin && (
                      <a href={sponsor.linkedin} target="_blank" rel="noopener noreferrer">
                        <FaLinkedin className="text-blue-700 hover:text-blue-900 transition" />
                      </a>
                    )}
                    {sponsor.youtube && (
                      <a href={sponsor.youtube} target="_blank" rel="noopener noreferrer">
                        <FaYoutube className="text-red-600 hover:text-red-800 transition" />
                      </a>
                    )}
                  </div>
                  {sponsor.url_site && (
                    <a
                      href={sponsor.url_site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Visitar site
                    </a>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx>{`
        .sponsors-swiper .swiper-slide {
          transition: transform 0.3s ease-in-out;
          transform: scale(0.7);
        }

        .sponsors-swiper .swiper-slide.swiper-slide-active {
          transform: scale(1.1);
        }

        .sponsors-swiper .swiper-button-next,
        .sponsors-swiper .swiper-button-prev {
          color: #2563eb;
        }

        .sponsors-swiper .swiper-pagination-bullet-active {
          background: #2563eb;
        }
      `}</style>
    </section>
  );
};

export default Sponsors;
