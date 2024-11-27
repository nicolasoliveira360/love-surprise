"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { HeartIcon, MusicalNoteIcon } from '@heroicons/react/24/solid';

interface MessageFormProps {
  onSubmit: (data: { message: string; youtubeLink?: string }) => void;
  initialData: {
    message: string;
    youtubeLink?: string;
  };
  isPremium: boolean;
  onBack: () => void;
}

export default function MessageForm({ onSubmit, initialData, isPremium, onBack }: MessageFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [focused, setFocused] = useState<'message' | 'youtube' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div
          className={`relative transition-all ${
            focused === 'message' ? 'scale-105' : ''
          }`}
        >
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
            Mensagem para seu Amor
          </label>
          <div className="relative">
            <HeartIcon className="absolute left-4 top-4 w-5 h-5 text-pink-500" />
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              onFocus={() => setFocused('message')}
              onBlur={() => setFocused(null)}
              placeholder="Escreva uma mensagem especial..."
              className="w-full pl-12 pr-4 py-3 bg-navy-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white h-32 resize-none transition-all"
              required
            />
            <div className="absolute right-3 bottom-3 text-xs text-gray-500">
              {formData.message.length}/500
            </div>
          </div>
        </div>

        {isPremium && (
          <div
            className={`relative transition-all ${
              focused === 'youtube' ? 'scale-105' : ''
            }`}
          >
            <label htmlFor="youtubeLink" className="block text-sm font-medium text-gray-300 mb-2">
              Música do Casal (YouTube)
            </label>
            <div className="relative">
              <MusicalNoteIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
              <input
                type="url"
                id="youtubeLink"
                value={formData.youtubeLink}
                onChange={(e) => setFormData(prev => ({ ...prev, youtubeLink: e.target.value }))}
                onFocus={() => setFocused('youtube')}
                onBlur={() => setFocused(null)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full pl-12 pr-4 py-3 bg-navy-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white transition-all"
              />
            </div>
          </div>
        )}
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
          Visualizar Surpresa
        </motion.button>
      </div>
    </form>
  );
}