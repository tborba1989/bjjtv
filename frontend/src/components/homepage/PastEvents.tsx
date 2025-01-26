"use client";
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import '@/styles/homepage/PastEvents.css';

// Helper function to manage image paths
const getEventImage = (id, imageUrl) => {
  if (!imageUrl) {
    return '/images/banner-event.webp';
  }
  return imageUrl.startsWith('http') ? imageUrl : `/images/events/${id}.webp`;
};

const PastEventCard = ({ id, date, title, location, schedule, image }) => {
  const [imageError, setImageError] = useState(false);

  const eventDate = new Date(date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase();

  const handleImageError = () => {
    setImageError(true);
  };

  const displayImage = imageError ? '/images/banner-event.webp' : getEventImage(id, image);

  return (
    <div className="past-event-card">
      <div className="relative">
        <img
          src={displayImage}
          alt={title}
          className="event-image"
          onError={handleImageError}
        />
        <div className="date-overlay">
          <div className="date">{day}</div>
          <div className="month">{month}</div>
        </div>
      </div>

      <div className="event-details">
        <h3 className="event-title truncate">{title}</h3>
        <div className="event-info">
          <div className="info-item">
            <MapPin size={16} />
            <span>{location}</span>
          </div>
          <div className="info-item">
            <Calendar size={16} />
            <span>{schedule}</span>
          </div>
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
          throw new Error('Failed to load past events');
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
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <section className="past-events-section">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="past-events-title text-black">Competições Passadas</h2>
        </div>

        <Slider {...settings} className="events-slider">
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
    </section>
  );
};

export default PastEventsSection;