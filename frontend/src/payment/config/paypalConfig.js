/**
 * src/payment/config/paypalConfig.js
 * Configurações do PayPal e constantes
 */

export const PAYPAL_CONFIG = {
  // Substitua por suas credenciais reais do PayPal
  CLIENT_ID: process.env.REACT_APP_PAYPAL_CLIENT_ID,
  CURRENCY: 'BRL',
  INTENT: 'CAPTURE',
  sandboxMode: process.env.NODE_ENV !== 'production'
};

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};