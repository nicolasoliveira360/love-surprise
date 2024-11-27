"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';

interface CoupleInfoProps {
  onSubmit: (data: { coupleName: string; startDate: string }) => void;
  initialData: {
    coupleName: string;
    startDate: string;
  };
  onBack: () => void;
}

export default function CoupleInfo({ onSubmit, initialData, onBack }: CoupleInfoProps) {
  const [formData, setFormData] = useState(initialData);
  const [focused, setFocused] = useState<'name' | 'date' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div
          className={`relative transition-all ${
            focused === 'name' ? 'scale-105' : ''
          }`}
        >
          <label htmlFor="coupleName" className="block text-sm font-medium text-gray-300 mb-2">
            Nome do Casal
          </label>
          <div className="relative">
            <HeartIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
            <input
              type="text"
              id="coupleName"
              value={formData.coupleName}
              onChange={(e) => setFormData(prev => ({ ...prev, coupleName: e.target.value }))}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
              placeholder="Ex: Maria & João"
              className="w-full pl-12 pr-4 py-3 bg-navy-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white transition-all"
              required
            />
          </div>
        </div>

        <div
          className={`relative transition-all ${
            focused === 'date' ? 'scale-105' : ''
          }`}
        >
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-2">
            Data de Início do Relacionamento
          </label>
          <input
            type="date"
            id="startDate"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            onFocus={() => setFocused('date')}
            onBlur={() => setFocused(null)}
            className="w-full px-4 py-3 bg-navy-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white transition-all"
            required
          />
        </div>
      </div>

      <div className="flex gap-4">
        <motion.button
          type="button"
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 bg-navy-900 text-white rounded-full font-semibold border border-pink-500/30 hover:border-pink-500 transition-all"
        >
          Voltar
        </motion.button>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:opacity-90 transition-all shadow-neon-pink"
        >
          Continuar
        </motion.button>
      </div>
    </form>
  );
}