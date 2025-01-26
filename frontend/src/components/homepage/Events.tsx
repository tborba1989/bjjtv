"use client";

import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { MapPin, Calendar } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@/styles/homepage/Events.css';

interface Event {
  id: number;
  data: string;
  nome: string;
  local: string;
  horario: string;
  imagem_url: string;
}

const EventCard: React.FC<Event> = ({ id, data, nome, local, horario, imagem_url }) => {
  const eventDate = new Date(data);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase();

  return (
    <div className="event-card bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative">
        <img
          src={imagem_url || '/images/banner-event.webp'}
          alt={nome}
          className="w-full h-64 object-cover"
          onError={(e) => (e.currentTarget.src = '/images/banner-event.webp')}
        />
        <div className="absolute bottom-0 left-0 bg-yellow-400 p-3 text-center">
          <div className="text-4xl font-bold">{day}</div>
          <div className="text-sm font-medium">{month}</div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="event-name text-xl font-semibold mb-2">{nome}</h3>
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <MapPin size={16} />
          <span className="text-sm">{local}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={16} />
          <span className="text-sm">{horario}</span>
        </div>
      </div>
    </div>
  );
};

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/competicoes');
        if (!response.ok) {
          throw new Error('Erro ao carregar competições');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError('Erro ao carregar os dados.');
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
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="loader" />
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
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="events-title">Próximas Competições</h2>
        </div>

        <Slider {...settings} className="events-slider">
          {events.map((event) => (
            <div key={event.id} className="px-2">
              <EventCard
                id={event.id}
                data={event.data}
                nome={event.nome}
                local={event.local}
                horario={event.horario}
                imagem_url={event.imagem_url}
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Events;
