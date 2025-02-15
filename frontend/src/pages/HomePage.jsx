// src/pages/HomePage.jsx
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Ranking from '../components/Ranking';
import Events from '../components/Events';
import Sponsors from '../components/Sponsors';
import Store from '../components/Store';
import Channel from '../components/Channel';
import PastEvents from '../components/PastEvents';
import Services from '../components/Services';
import Team from '../components/Team';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Ranking />
      <Events />
      <Sponsors />
      <Store />
      <PastEvents />
      <Channel/>
      <Services />
      <Team />
      <Contact />
      <Footer />
    </>
  );
};

export default HomePage;