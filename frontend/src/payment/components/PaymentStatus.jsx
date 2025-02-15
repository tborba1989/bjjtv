/**
 * src/payment/components/PaymentStatus.jsx
 * Componente para exibir o status do pagamento
 */

import React from 'react';
import PropTypes from 'prop-types';
import { PAYMENT_STATUS } from '../config/paypalConfig';

export const PaymentStatus = ({ status, errorMessage }) => {
  const getStatusConfig = () => {
    switch (status) {
      case PAYMENT_STATUS.COMPLETED:
        return {
          className: "bg-green-50 border-green-200 text-green-800",
          message: "Pagamento realizado com sucesso!"
        };
      case PAYMENT_STATUS.PENDING:
        return {
          className: "bg-yellow-50 border-yellow-200 text-yellow-800",
          message: "Processando pagamento..."
        };
      case PAYMENT_STATUS.FAILED:
        return {
          className: "bg-red-50 border-red-200 text-red-800",
          message: errorMessage || "Erro ao processar pagamento"
        };
      case PAYMENT_STATUS.CANCELLED:
        return {
          className: "bg-gray-50 border-gray-200 text-gray-800",
          message: "Pagamento cancelado"
        };
      default:
        return {
          className: "bg-gray-50 border-gray-200 text-gray-800",
          message: "Status desconhecido"
        };
    }
  };

  const { className, message } = getStatusConfig();

  return (
    <div className={`p-4 rounded-lg border ${className}`}>
      <p className="font-medium">{message}</p>
      {errorMessage && status === PAYMENT_STATUS.FAILED && (
        <p className="text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

PaymentStatus.propTypes = {
  status: PropTypes.oneOf(Object.values(PAYMENT_STATUS)).isRequired,
  errorMessage: PropTypes.string
};

export default PaymentStatus;