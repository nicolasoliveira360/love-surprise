"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, KeyIcon, UserIcon } from '@heroicons/react/24/outline';

interface AuthFormProps {
  onComplete: () => void;
  initialMode?: boolean;
}

export default function AuthForm({ onComplete, initialMode = true }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(initialMode);
  const [focused, setFocused] = useState<'email' | 'password' | 'name' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          {isLogin ? 'Bem-vindo de volta!' : 'Criar sua conta'}
        </h2>
        <p className="text-gray-400">
          {isLogin ? 'Entre para continuar' : 'Registre-se para continuar'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className={`relative transition-all ${
            focused === 'name' ? 'scale-105' : ''
          }`}>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
              <input
                type="text"
                placeholder="Seu nome"
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
                className="w-full pl-12 pr-4 py-3 bg-navy-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white transition-all"
                required
              />
            </div>
          </div>
        )}

        <div className={`relative transition-all ${
          focused === 'email' ? 'scale-105' : ''
        }`}>
          <div className="relative">
            <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
            <input
              type="email"
              placeholder="Seu e-mail"
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              className="w-full pl-12 pr-4 py-3 bg-navy-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white transition-all"
              required
            />
          </div>
        </div>

        <div className={`relative transition-all ${
          focused === 'password' ? 'scale-105' : ''
        }`}>
          <div className="relative">
            <KeyIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
            <input
              type="password"
              placeholder="Sua senha"
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
              className="w-full pl-12 pr-4 py-3 bg-navy-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white transition-all"
              required
            />
          </div>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:opacity-90 transition-all shadow-neon-pink mt-6"
        >
          {isLogin ? 'Entrar' : 'Criar conta'}
        </motion.button>
      </form>

      <div className="text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-pink-500 hover:text-pink-400 transition-colors text-sm"
        >
          {isLogin ? 'Não tem uma conta? Criar conta' : 'Já tem uma conta? Entrar'}
        </button>
      </div>
    </div>
  );
}