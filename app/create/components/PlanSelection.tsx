"use client";

import { motion } from 'framer-motion';
import { CheckIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { PLANS } from '@/constants/plans';

interface PlanSelectionProps {
  onSelect: (plan: 'basic' | 'premium') => void;
  selectedPlan: 'basic' | 'premium';
}

export default function PlanSelection({ onSelect, selectedPlan }: PlanSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        {Object.values(PLANS).map((plan) => (
          <motion.div
            key={plan.type}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
              selectedPlan === plan.type
                ? 'border-pink-500 bg-pink-500/5'
                : 'border-gray-700 hover:border-pink-500/50'
            }`}
            onClick={() => onSelect(plan.type)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <p className="text-2xl font-bold text-white mt-1">
                  R$ {plan.price.toFixed(2)}
                </p>
              </div>
              {plan.type === 'premium' && (
                <SparklesIcon className="w-6 h-6 text-pink-500" />
              )}
            </div>

            <ul className="space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckIcon className="w-4 h-4 text-pink-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="text-center text-gray-400 text-sm">
        Você pode mudar de plano a qualquer momento
      </div>
    </div>
  );
}