"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCardIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';

interface PaymentMethodsProps {
  onComplete: () => void;
  disabled?: boolean;
}

export default function PaymentMethods({ onComplete, disabled }: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState<'credit' | 'pix'>('credit');
  const [focused, setFocused] = useState<'card' | 'date' | 'cvv' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Forma de Pagamento</h2>
        <p className="text-gray-400">Escolha como deseja pagar</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { id: 'credit', icon: CreditCardIcon, label: 'Cartão de Crédito' },
          { id: 'pix', icon: QrCodeIcon, label: 'PIX' }
        ].map(method => (
          <motion.button
            key={method.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedMethod(method.id as 'credit' | 'pix')}
            className={`relative p-4 rounded-xl border-2 transition-all ${
              selectedMethod === method.id
                ? 'border-pink-500 bg-pink-500/10'
                : 'border-gray-700 hover:border-pink-500/50'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <method.icon className="w-6 h-6 text-pink-500" />
              <span className="text-sm">{method.label}</span>
            </div>
            {selectedMethod === method.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                <CheckIcon className="w-3 h-3 text-white" />
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {selectedMethod === 'credit' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={`relative transition-all ${
            focused === 'card' ? 'scale-105' : ''
          }`}>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Número do Cartão
            </label>
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              onFocus={() => setFocused('card')}
              onBlur={() => setFocused(null)}
              className="w-full px-4 py-3 bg-navy-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`relative transition-all ${
              focused === 'date' ? 'scale-105' : ''
            }`}>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Validade
              </label>
              <input
                type="text"
                placeholder="MM/AA"
                onFocus={() => setFocused('date')}
                onBlur={() => setFocused(null)}
                className="w-full px-4 py-3 bg-navy-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white transition-all"
                required
              />
            </div>

            <div className={`relative transition-all ${
              focused === 'cvv' ? 'scale-105' : ''
            }`}>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                CVV
              </label>
              <input
                type="text"
                placeholder="123"
                onFocus={() => setFocused('cvv')}
                onBlur={() => setFocused(null)}
                className="w-full px-4 py-3 bg-navy-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white transition-all"
                required
              />
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={disabled}
            className={`w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold transition-all shadow-neon-pink ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            Finalizar Pagamento
          </motion.button>
        </form>
      ) : (
        <div className="text-center space-y-6">
          <div className="bg-white p-6 rounded-lg mx-auto w-48 h-48 relative">
            <QrCodeIcon className="w-full h-full text-navy-900" />
          </div>
          <div className="space-y-2">
            <p className="text-gray-400">Escaneie o QR Code para pagar</p>
            <button
              onClick={onComplete}
              className="text-pink-500 hover:text-pink-400 transition-colors text-sm"
            >
              Já realizei o pagamento
            </button>
          </div>
        </div>
      )}
    </div>
  );
}