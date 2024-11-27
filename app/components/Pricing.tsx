"use client";

import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import Link from 'next/link';

const plans = [
  {
    name: 'Básico',
    price: 29,
    features: [
      '1 mês de acesso',
      '3 fotos',
      'Sem música'
    ],
    popular: false
  },
  {
    name: 'Premium',
    price: 49,
    features: [
      'Pra sempre',
      '7 fotos',
      'Com música'
    ],
    popular: true
  }
];

export default function Pricing() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 text-white"
        >
          Preços
        </motion.h2>
        
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={clsx(
                'rounded-2xl p-6 sm:p-8',
                plan.popular ? 'bg-gradient-to-b from-pink-500/20 to-purple-500/20 border-2 border-pink-500' : 'bg-navy-800 border border-gray-700'
              )}
            >
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl sm:text-4xl font-bold text-white">R${plan.price}</span>
                {plan.popular && (
                  <span className="text-xs sm:text-sm font-normal text-pink-500 ml-2">MAIS ESCOLHIDO</span>
                )}
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-300 text-sm sm:text-base">
                    <CheckIcon className="h-5 w-5 text-pink-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link href={`/create?plan=${plan.name.toLowerCase()}`}>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={clsx(
                    'w-full py-3 sm:py-4 rounded-full font-semibold transition-all',
                    plan.popular ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90 shadow-neon-pink' : 'bg-white text-gray-900 hover:bg-gray-100'
                  )}
                >
                  Quero fazer meu site
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}