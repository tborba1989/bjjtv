/**
 * src/payment/routes/paymentRoutes.js
 * Rotas relacionadas a pagamentos
 */

import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';

const router = Router();

// Criar novo pagamento
router.post('/criar', async (req, res) => {
  try {
    const pagamento = await PaymentController.createPayment(req.body);
    res.json(pagamento);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao criar pagamento',
      details: error.message
    });
  }
});

// Capturar pagamento
router.post('/capturar', async (req, res) => {
  try {
    const { orderId } = req.body;
    const result = await PaymentController.processPayment(orderId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao capturar pagamento',
      details: error.message
    });
  }
});

// Atualizar status do pagamento
router.post('/atualizar-status', async (req, res) => {
  try {
    const { inscricaoId, status, paymentDetails } = req.body;
    const result = await PaymentController.updatePaymentStatus(
      inscricaoId,
      status,
      paymentDetails
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao atualizar status do pagamento',
      details: error.message
    });
  }
});

export default router;