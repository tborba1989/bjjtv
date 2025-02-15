// src/components/inscricao/ChecagemCPF.jsx
import React from 'react';
import PropTypes from 'prop-types';

export const ChecagemCPF = ({ cpf, setCpf, error, handleSubmit, loading }) => {
  return (
    <form id="cpfForm" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
          CPF do Atleta
        </label>
        <input
          type="text"
          id="cpf"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="Digite seu CPF"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}
    </form>
  );
};

ChecagemCPF.propTypes = {
  cpf: PropTypes.string.isRequired,
  setCpf: PropTypes.func.isRequired,
  error: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

export default ChecagemCPF;