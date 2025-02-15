import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { MapPin, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';

// Função auxiliar para gerenciar o caminho das imagens
const getEventImage = (id, imageUrl) => {
  if (!imageUrl) {
    return '/images/events/banner-default.webp';
  }
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  return `/images/events/${id}.webp`;
};

const PastEventCard = ({ id, date, title, location, schedule, image }) => {
  const [imageError, setImageError] = useState(false);

  const eventDate = new Date(date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase();

  const handleImageError = () => {
    setImageError(true);
  };

  const displayImage = imageError
    ? '/images/events/banner-default.webp'
    : getEventImage(id, image);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative">
        <img
          src={displayImage}
          alt={title}
          className="w-full h-64 object-cover"
          onError={handleImageError}
        />
        <div className="absolute bottom-0 left-0 bg-yellow-400 p-3 text-center">
          <div className="text-4xl font-bold">{day}</div>
          <div className="text-sm font-medium">{month}</div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <MapPin size={16} />
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={16} />
          <span className="text-sm">{schedule}</span>
        </div>
      </div>
    </div>
  );
};

const PastEventsSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPastEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/competicoes/inativas');
        if (!response.ok) {
          throw new Error('Falha ao carregar competições passadas');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPastEvents();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Competições Passadas</h2>
        </div>

        <div className="mt-8">
          <Slider {...settings}>
            {events.map((event) => (
              <div key={event.id} className="px-2">
                <PastEventCard
                  id={event.id}
                  date={event.data}
                  title={event.nome}
                  location={event.local}
                  schedule={event.horario}
                  image={event.imagem_url}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default PastEventsSection;
