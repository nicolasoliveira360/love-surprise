"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { EnvelopeIcon, KeyIcon, UserIcon, ArrowLeftIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { useSurprise } from '@/hooks/useSurprise';

export default function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams?.get('returnUrl') || '/dashboard';
  const [focused, setFocused] = useState<'name' | 'email' | 'password' | 'confirmPassword' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { signUp, loading, error } = useAuth();
  const { createSurprise } = useSurprise();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    const data = await signUp(formData.email, formData.password, formData.name);
    if (data) {
      // Se houver uma surpresa temporária e estiver indo para pagamento
      const tempSurprise = localStorage.getItem('tempSurprise');
      if (tempSurprise && returnUrl === '/payment') {
        // Criar a surpresa antes de redirecionar
        const surpriseData = JSON.parse(tempSurprise);
        const surprise = await createSurprise(surpriseData);
        if (surprise) {
          localStorage.removeItem('tempSurprise');
          router.push('/payment');
          return;
        }
      }
      
      router.push(returnUrl);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-white hover:text-pink-500 transition-colors mb-8"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Voltar para home</span>
        </Link>

        <div className="bg-navy-800 rounded-2xl p-6 sm:p-8 shadow-neon-pink">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Criar sua conta</h1>
            <p className="text-gray-400">Registre-se para começar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={`relative transition-all ${
              focused === 'name' ? 'scale-105' : ''
            }`}>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                  className="w-full pl-12 pr-4 py-3 bg-navy-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white transition-all"
                  required
                />
              </div>
            </div>

            <div className={`relative transition-all ${
              focused === 'email' ? 'scale-105' : ''
            }`}>
              <div className="relative">
                <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  className={`w-full pl-12 pr-4 py-3 bg-navy-900 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white transition-all ${
                    error ? 'border-red-500' : 'border-gray-700'
                  }`}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className={`relative transition-all ${
              focused === 'confirmPassword' ? 'scale-105' : ''
            }`}>
              <div className="relative">
                <KeyIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
                <input
                  type="password"
                  placeholder="Confirme sua senha"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  onFocus={() => setFocused('confirmPassword')}
                  onBlur={() => setFocused(null)}
                  className={`w-full pl-12 pr-4 py-3 bg-navy-900 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white transition-all ${
                    error ? 'border-red-500' : 'border-gray-700'
                  }`}
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <ExclamationCircleIcon className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:opacity-90 transition-all shadow-neon-pink"
            >
              Criar conta
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/auth/login" 
              className="text-pink-500 hover:text-pink-400 transition-colors text-sm"
            >
              Já tem uma conta? Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}