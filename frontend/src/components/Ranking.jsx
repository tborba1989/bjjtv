import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react';

const Ranking = () => {
  const [isLoading, setIsLoading] = useState(true);

  const powerBIUrl = "https://app.powerbi.com/view?r=eyJrIjoiMDYyZDA5ZDUtOGJmMC00N2JkLTllN2EtYTQ2ODNhYWIwZmUxIiwidCI6IjRhZmYyYzdjLWE1NTgtNGQwMy1iZTFkLTFkMWRkYzY1YWQxOSIsImMiOjZ9";

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-white p-6 space-y-8">
      {/* Seção de Introdução */}
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Ranking BJJ</h2>
        <p className="text-lg text-gray-600 mb-6">
          Bem-vindo ao ranking oficial de BJJ. Aqui você encontrará as classificações
          atualizadas dos atletas em diferentes categorias e faixas.
        </p>
      </div>

      {/* Seção do Vídeo Tutorial */}
      <div className="max-w-4xl mx-auto w-full">
        <a
          href="#"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <PlayCircle className="w-6 h-6" />
          <span className="text-lg">Assista o vídeo tutorial sobre como utilizar o ranking</span>
        </a>
      </div>

      {/* Power BI Dashboard */}
      <div className="w-full flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <div className={`w-full h-full ${isLoading ? 'invisible' : 'visible'}`}>
          <iframe
            title="BJJ Rankings Dashboard"
            src={powerBIUrl}
            frameBorder="0"
            allowFullScreen={true}
            className="w-full h-full rounded-lg shadow-lg"
            onLoad={handleIframeLoad}
            style={{
              minHeight: '70vh',
              aspectRatio: '16/9'
            }}
          />
        </div>
      </div>

      {/* Espaço adicional para próximo elemento */}
      <div className="h-16"></div>
    </div>
  );
};

export default Ranking;