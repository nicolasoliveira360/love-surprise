"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { EnvelopeIcon, KeyIcon, ArrowLeftIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { useSurprise } from '@/hooks/useSurprise';

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams?.get('returnUrl') || '/dashboard';
  const [focused, setFocused] = useState<'email' | 'password' | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { signIn, loading, error } = useAuth();
  const { createSurprise } = useSurprise();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const authData = await signIn(formData.email, formData.password);
      
      if (authData?.user) {
        // Aguardar a autenticação ser completada
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verificar se há dados temporários da surpresa
        const tempSurpriseStr = localStorage.getItem('tempSurprise');
        
        if (tempSurpriseStr && returnUrl.includes('/payment')) {
          try {
            const tempSurprise = JSON.parse(tempSurpriseStr);
            console.log('Dados temporários encontrados:', tempSurprise);
            
            // Criar a surpresa com os dados temporários
            const surprise = await createSurprise({
              coupleName: tempSurprise.coupleName,
              startDate: tempSurprise.startDate,
              message: tempSurprise.message,
              youtubeLink: tempSurprise.youtubeLink || '',
              plan: tempSurprise.plan || 'basic',
              photos: [], // As fotos serão adicionadas depois
              status: 'draft'
            });

            if (surprise?.id) {
              console.log('Surpresa criada com sucesso:', surprise.id);
              localStorage.removeItem('tempSurprise');
              router.push(`/payment?surpriseId=${surprise.id}`);
              return;
            } else {
              throw new Error('Falha ao criar surpresa');
            }
          } catch (err) {
            console.error('Erro ao criar surpresa após login:', err);
            // Em caso de erro, manter os dados temporários
            router.push('/create');
            return;
          }
        } else {
          console.log('Redirecionando para:', returnUrl);
          router.push(returnUrl);
        }
      }
    } catch (err) {
      console.error('Erro no login:', err);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white hover:text-pink-500 transition-colors mb-8"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Voltar</span>
        </button>

        <div className="bg-navy-800 rounded-2xl p-6 sm:p-8 shadow-neon-pink">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Bem-vindo de volta!</h1>
            <p className="text-gray-400">Entre para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full pl-12 pr-4 py-3 bg-navy-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white transition-all"
                  required
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
              disabled={loading}
              className={`w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold transition-all shadow-neon-pink ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                'Entrar'
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/auth/register" 
              className="text-pink-500 hover:text-pink-400 transition-colors text-sm"
            >
              Não tem uma conta? Criar conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}