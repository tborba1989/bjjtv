/**
 * src/payment/services/paymentApi.js
 * Serviço para comunicação com o backend
 */

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const paymentApi = {
  async createPayment(data) {
    try {
      const response = await fetch(`${API_BASE}/api/pagamentos/criar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Erro ao criar pagamento');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      throw error;
    }
  },

  async capturePayment(orderId) {
    try {
      const response = await fetch(`${API_BASE}/api/pagamentos/capturar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId })
      });

      if (!response.ok) {
        throw new Error('Erro ao capturar pagamento');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao capturar pagamento:', error);
      throw error;
    }
  },

  async updatePaymentStatus(inscricaoId, status, paymentDetails) {
    try {
      const response = await fetch(`${API_BASE}/api/pagamentos/atualizar-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inscricaoId,
          status,
          paymentDetails
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status do pagamento');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  }
};