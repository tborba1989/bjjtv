/**
 * src/payment/components/PayPalButton.jsx
 * Componente do botão do PayPal
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { PAYPAL_CONFIG } from '../config/paypalConfig';

export const PayPalButton = ({ valorTotal, onSuccess, onError, disabled }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadPayPalScript = () => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CONFIG.CLIENT_ID}&currency=${PAYPAL_CONFIG.CURRENCY}`;
      script.async = true;
      script.onload = () => setLoaded(true);
      script.onerror = () => {
        console.error('Erro ao carregar script do PayPal');
        onError(new Error('Não foi possível carregar o PayPal'));
      };
      document.body.appendChild(script);

      return script;
    };

    const script = loadPayPalScript();
    return () => {
      document.body.removeChild(script);
    };
  }, [onError]);

  useEffect(() => {
    if (!loaded || disabled) return;

    try {
      window.paypal
        .Buttons({
          style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'pay'
          },
          createOrder: (_, actions) => {
            return actions.order.create({
              intent: PAYPAL_CONFIG.INTENT,
              purchase_units: [
                {
                  amount: {
                    currency_code: PAYPAL_CONFIG.CURRENCY,
                    value: valorTotal.toString()
                  }
                }
              ]
            });
          },
          onApprove: async (data, actions) => {
            try {
              const orderDetails = await actions.order.capture();
              onSuccess(orderDetails);
            } catch (error) {
              console.error('Erro ao capturar pagamento:', error);
              onError(error);
            }
          },
          onError: (err) => {
            console.error('Erro no PayPal:', err);
            onError(err);
          },
          onCancel: () => {
            console.log('Pagamento cancelado pelo usuário');
          }
        })
        .render('#paypal-button-container');
    } catch (error) {
      console.error('Erro ao renderizar botão do PayPal:', error);
      onError(error);
    }
  }, [loaded, valorTotal, onSuccess, onError, disabled]);

  if (disabled) {
    return null;
  }

  return (
    <div id="paypal-button-container" className="w-full min-h-[150px]" />
  );
};

PayPalButton.propTypes = {
  valorTotal: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

PayPalButton.defaultProps = {
  disabled: false
};

export default PayPalButton;