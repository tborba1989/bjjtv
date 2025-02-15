import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { MapPin, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
// Atualizando o caminho de importação para a nova estrutura
import { InscricaoForm } from '../components/inscricao/InscricaoForm';

// Função auxiliar para gerenciar o caminho das imagens (mantida igual)
const getEventImage = (id, imageUrl) => {
  if (!imageUrl) {
    return '/images/events/banner-default.webp';
  }
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  return `/images/events/${id}.webp`;
};

const EventCard = ({ id, date, title, location, schedule, image }) => {
  const [showInscricao, setShowInscricao] = useState(false);
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

  const handleCardClick = () => {
    setShowInscricao(true);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
      onClick={handleCardClick}
    >
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

      {/* Modal de Inscrição */}
      <InscricaoForm
        isOpen={showInscricao}
        onClose={() => setShowInscricao(false)}
        competicaoId={id}
        competicaoTitle={title}
      />
    </div>
  );
};

// EventsSection mantido igual
const EventsSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/competicoes');
        if (!response.ok) {
          throw new Error('Falha ao carregar competições');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
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
          <h2 className="text-3xl font-bold mb-4">Próximas Competições</h2>
          <Button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Inscreva-se
          </Button>
        </div>

        <div className="mt-8">
          <Slider {...settings}>
            {events.map((event) => (
              <div key={event.id} className="px-2">
                <EventCard
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

export default EventsSection;