// src/components/inscricao/Pagamento.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export const Pagamento = ({ resumo, onError }) => {
  const [loading, setLoading] = useState(false);

  const iniciarPagamentoPayPal = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/pagamento/paypal/criar', {
        valor: resumo.valorTotal,
        descricao: `Inscrição ${resumo.numeroInscricao}`,
        inscricaoId: resumo.numeroInscricao
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (response.data?.approvalUrl) {
        window.location.href = response.data.approvalUrl;
      } else {
        throw new Error('URL de aprovação não recebida');
      }
    } catch (error) {
      onError('Erro ao iniciar pagamento. Por favor, tente novamente.');
      console.error('Erro no pagamento:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <p className="text-gray-700">
          Total a pagar: <span className="font-bold">R$ {resumo.valorTotal.toFixed(2)}</span>
        </p>
      </div>

      <button
        onClick={iniciarPagamentoPayPal}
        disabled={loading}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin">⭮</span>
            Processando...
          </>
        ) : (
          <>
            <img
              src="/paypal-logo.png"
              alt="PayPal"
              className="h-5 w-auto"
            />
            Pagar com PayPal
          </>
        )}
      </button>

      <p className="text-sm text-gray-500 mt-2 text-center">
        Você será redirecionado para o PayPal para concluir o pagamento.
      </p>
    </div>
  );
};

Pagamento.propTypes = {
  resumo: PropTypes.shape({
    numeroInscricao: PropTypes.string.isRequired,
    valorTotal: PropTypes.number.isRequired
  }).isRequired,
  onError: PropTypes.func.isRequired
};

export default Pagamento;