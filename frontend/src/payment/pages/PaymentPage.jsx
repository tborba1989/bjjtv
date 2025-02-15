/**
 * src/payment/pages/PaymentPage.jsx
 * Página principal de pagamento
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PayPalButton } from '../components/PayPalButton';
import { PaymentStatus } from '../components/PaymentStatus';
import { paymentApi } from '../services/paymentApi';
import { PAYMENT_STATUS } from '../config/paypalConfig';

export const PaymentPage = ({ inscricao }) => {
  const [paymentStatus, setPaymentStatus] = useState(PAYMENT_STATUS.PENDING);
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentSuccess = async (paymentDetails) => {
    setIsProcessing(true);
    try {
      // Atualiza o status do pagamento no backend
      await paymentApi.updatePaymentStatus(
        inscricao.id,
        PAYMENT_STATUS.COMPLETED,
        paymentDetails
      );

      setPaymentStatus(PAYMENT_STATUS.COMPLETED);
      // Você pode adicionar aqui uma função de callback para notificar o componente pai
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      setPaymentStatus(PAYMENT_STATUS.FAILED);
      setErrorMessage('Não foi possível confirmar o pagamento. Entre em contato com o suporte.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error) => {
    console.error('Erro no pagamento:', error);
    setPaymentStatus(PAYMENT_STATUS.FAILED);
    setErrorMessage(error.message || 'Ocorreu um erro ao processar o pagamento');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Pagamento da Inscrição</h2>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Resumo do Pagamento</h3>
            <div className="space-y-2">
              <p><strong>Valor Total:</strong> R$ {inscricao.valorTotal.toFixed(2)}</p>
              {inscricao.categorias?.map((categoria, idx) => (
                <p key={idx} className="text-sm text-gray-600">
                  • {categoria.nome}
                </p>
              ))}
            </div>
          </div>

          <PaymentStatus
            status={paymentStatus}
            errorMessage={errorMessage}
          />

          {paymentStatus !== PAYMENT_STATUS.COMPLETED && (
            <div className="mt-6">
              <PayPalButton
                valorTotal={inscricao.valorTotal}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                disabled={isProcessing}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

PaymentPage.propTypes = {
  inscricao: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    valorTotal: PropTypes.number.isRequired,
    categorias: PropTypes.arrayOf(PropTypes.shape({
      nome: PropTypes.string.isRequired
    }))
  }).isRequired
};

export default PaymentPage;