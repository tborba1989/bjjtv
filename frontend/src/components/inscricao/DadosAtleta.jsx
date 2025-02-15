// src/components/inscricao/DadosAtleta.jsx
import React from 'react';
import PropTypes from 'prop-types';

export const DadosAtleta = ({ atletaData, setAtletaData, error, faixas, onSubmit }) => {
  return (
    <form id="cadastroForm" onSubmit={onSubmit} className="space-y-6">
      {/* Nome e Apelido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo *
          </label>
          <input
            type="text"
            value={atletaData.nome_competidor}
            onChange={(e) => setAtletaData({...atletaData, nome_competidor: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apelido *
          </label>
          <input
            type="text"
            value={atletaData.apelido}
            onChange={(e) => setAtletaData({...atletaData, apelido: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      {/* CPF, Faixa e Peso */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CPF *
          </label>
          <input
            type="text"
            value={atletaData.cpf}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Faixa *
          </label>
          <select
            value={atletaData.faixa}
            onChange={(e) => setAtletaData({ ...atletaData, faixa: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Selecione a faixa</option>
            {faixas.map((faixa) => (
              <option key={faixa} value={faixa}>
                {faixa}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Peso (kg) *
          </label>
          <input
            type="number"
            step="0.1"
            value={atletaData.peso}
            onChange={(e) => setAtletaData({ ...atletaData, peso: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      {/* Data de Nascimento, Sexo e Celular */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Nascimento *
          </label>
          <input
            type="date"
            value={atletaData.data_nascimento}
            onChange={(e) => setAtletaData({...atletaData, data_nascimento: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sexo *
          </label>
          <select
            value={atletaData.sexo}
            onChange={(e) => setAtletaData({...atletaData, sexo: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Selecione o sexo</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Celular *
          </label>
          <input
            type="tel"
            value={atletaData.celular}
            onChange={(e) => setAtletaData({...atletaData, celular: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
            placeholder="(00) 00000-0000"
          />
        </div>
      </div>

      {/* Equipe e Professor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Equipe *
          </label>
          <input
            type="text"
            value={atletaData.equipe}
            onChange={(e) => setAtletaData({...atletaData, equipe: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Professor *
          </label>
          <input
            type="text"
            value={atletaData.professor}
            onChange={(e) => setAtletaData({...atletaData, professor: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}
    </form>
  );
};

DadosAtleta.propTypes = {
  atletaData: PropTypes.shape({
    nome_competidor: PropTypes.string.isRequired,
    cpf: PropTypes.string.isRequired,
    apelido: PropTypes.string.isRequired,
    faixa: PropTypes.string.isRequired,
    peso: PropTypes.string,
    celular: PropTypes.string,
    equipe: PropTypes.string,
    professor: PropTypes.string,
    sexo: PropTypes.string.isRequired,
    data_nascimento: PropTypes.string
  }).isRequired,
  setAtletaData: PropTypes.func.isRequired,
  error: PropTypes.string,
  faixas: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default DadosAtleta;