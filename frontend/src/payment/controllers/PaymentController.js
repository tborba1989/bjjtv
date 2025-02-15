/**
 * src/payment/controllers/PaymentController.js
 * Controlador das operações de pagamento
 */

import { paymentApi } from '../services/paymentApi';
import { PAYMENT_STATUS } from '../config/paypalConfig';

export class PaymentController {
  static async createPayment(inscricao) {
    try {
      const payment = await paymentApi.createPayment({
        inscricaoId: inscricao.id,
        valor: inscricao.valorTotal,
        descricao: `Inscrição - ${inscricao.categorias.map(c => c.nome).join(', ')}`
      });

      return payment;
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      throw error;
    }
  }

  static async processPayment(paymentDetails, inscricao) {
    try {
      // Primeiro captura o pagamento
      const capturedPayment = await paymentApi.capturePayment(paymentDetails.orderID);

      // Depois atualiza o status no sistema
      await paymentApi.updatePaymentStatus(
        inscricao.id,
        PAYMENT_STATUS.COMPLETED,
        capturedPayment
      );

      return capturedPayment;
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      // Atualiza o status como falho em caso de erro
      await paymentApi.updatePaymentStatus(
        inscricao.id,
        PAYMENT_STATUS.FAILED,
        { error: error.message }
      );
      throw error;
    }
  }
}