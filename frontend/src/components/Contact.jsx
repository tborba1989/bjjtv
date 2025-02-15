import React, { useState } from 'react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implementar lógica de envio
    console.log(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <section className="relative py-16 md:py-24">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/images/bg-image-12.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-75"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Entre em Contato
          </h2>
          <p className="text-gray-300">
            Deixe sua mensagem e retornaremos o mais breve possível
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu Nome"
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-gray-400 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition duration-200"
                  required
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Telefone"
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-gray-400 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition duration-200"
                />
              </div>
            </div>

            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Sua Mensagem"
                rows="4"
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-gray-400 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition duration-200"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E-mail"
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-gray-400 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition duration-200"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                >
                  Enviar Mensagem
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;