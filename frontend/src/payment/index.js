/**
 * src/payment/index.js
 * Arquivo principal para exportar todos os componentes do módulo de pagamento
 */

export { default as PayPalButton } from './components/PayPalButton';
export { default as PaymentStatus } from './components/PaymentStatus';
export { default as PaymentPage } from './pages/PaymentPage';
export { PaymentController } from './controllers/PaymentController';
export { paymentApi } from './services/paymentApi';
export { PAYPAL_CONFIG, PAYMENT_STATUS } from './config/paypalConfig';

// Também podemos exportar hooks personalizados se necessário
export { default as usePayment } from './hooks/usePayment';