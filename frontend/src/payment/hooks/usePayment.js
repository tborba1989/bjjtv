/**
 * src/payment/hooks/usePayment.js
 * Hook personalizado para gerenciar o estado do pagamento
 */

import { useState, useCallback } from 'react';
import { PAYMENT_STATUS } from '../config/paypalConfig';
import { paymentApi } from '../services/paymentApi';

const usePayment = (inscricao) => {
  const [status, setStatus] = useState(PAYMENT_STATUS.PENDING);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processPayment = useCallback(async (paymentDetails) => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await paymentApi.updatePaymentStatus(
        inscricao.id,
        PAYMENT_STATUS.COMPLETED,
        paymentDetails
      );

      setStatus(PAYMENT_STATUS.COMPLETED);
      return result;
    } catch (err) {
      setError(err.message);
      setStatus(PAYMENT_STATUS.FAILED);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [inscricao]);

  const resetPayment = useCallback(() => {
    setStatus(PAYMENT_STATUS.PENDING);
    setError(null);
    setIsProcessing(false);
  }, []);

  return {
    status,
    error,
    isProcessing,
    processPayment,
    resetPayment
  };
};

export default usePayment;