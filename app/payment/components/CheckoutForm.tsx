"use client";

import { useState, FormEvent } from 'react';
import { CreditCardIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface CheckoutFormProps {
  onSubmit: (paymentMethodId: string) => Promise<void>;
  isProcessing: boolean;
}

export default function CheckoutForm({ onSubmit, isProcessing }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [cardholderName, setCardholderName] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements || !cardholderName.trim()) {
      setError('Por favor, preencha o nome do titular do cartão');
      return;
    }

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Erro ao processar cartão');
      }

      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: cardholderName.trim(),
        },
      });

      if (stripeError) {
        let errorMessage = 'Erro ao processar cartão';
        switch (stripeError.code) {
          case 'card_declined':
            errorMessage = 'Cartão recusado. Por favor, tente outro cartão.';
            break;
          case 'expired_card':
            errorMessage = 'Cartão expirado.';
            break;
          case 'incorrect_cvc':
            errorMessage = 'Código de segurança inválido.';
            break;
          case 'processing_error':
            errorMessage = 'Erro ao processar o cartão. Tente novamente.';
            break;
          default:
            errorMessage = stripeError.message || 'Erro ao processar pagamento';
        }
        setError(errorMessage);
        return;
      }

      if (!paymentMethod?.id) {
        throw new Error('PaymentMethod não criado');
      }

      await onSubmit(paymentMethod.id);
    } catch (err) {
      console.error('Erro no processamento:', err);
      setError('Erro ao processar pagamento. Tente novamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-navy-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <CreditCardIcon className="w-6 h-6 text-pink-500" />
          Dados do Pagamento
        </h2>
        
        <div className="space-y-6">
          {/* Nome do Titular */}
          <div className="space-y-2">
            <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-300">
              Nome do Titular do Cartão
            </label>
            <input
              type="text"
              id="cardholderName"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className="w-full px-4 py-3 bg-navy-900/50 border border-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              placeholder="Nome como está no cartão"
              required
            />
          </div>

          {/* Dados do Cartão */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Dados do Cartão
            </label>
            <div className="bg-navy-900/50 p-4 rounded-lg border border-gray-700/50">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#fff',
                      '::placeholder': {
                        color: '#6b7280',
                      },
                      iconColor: '#fff',
                    },
                    invalid: {
                      color: '#ef4444',
                      iconColor: '#ef4444',
                    },
                  },
                  hidePostalCode: true,
                }}
              />
            </div>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Botão de Pagamento */}
          <button
            type="submit"
            disabled={!stripe || isProcessing || !cardholderName.trim()}
            className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all ${
              isProcessing || !cardholderName.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Processando...
              </>
            ) : (
              <>
                <LockClosedIcon className="w-5 h-5" />
                Pagar com Cartão
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
} 