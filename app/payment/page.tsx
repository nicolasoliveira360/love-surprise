"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { HeartIcon, SparklesIcon, ArrowRightOnRectangleIcon, CreditCardIcon, CheckIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useUser } from '@/hooks/useUser';
import { useSurprise } from '@/hooks/useSurprise';
import { supabase } from '@/lib/supabase';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './components/CheckoutForm';
import { PLANS } from '@/constants/plans';
import type { Surprise } from '@/types';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function Payment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const surpriseId = searchParams?.get('surpriseId');
  const { user } = useUser();
  const { getSurpriseWithPhotos } = useSurprise();
  const [surprise, setSurprise] = useState<Surprise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSurprise = async () => {
      if (!surpriseId || !user) {
        setLoading(false);
        return;
      }

      try {
        if (surprise?.id === surpriseId) {
          setLoading(false);
          return;
        }

        console.log('Carregando surpresa:', surpriseId);
        const data = await getSurpriseWithPhotos(surpriseId, true);
        
        if (!isMounted) return;

        if (data) {
          console.log('Surpresa carregada:', {
            id: data.id,
            photosCount: data.surprise_photos?.length || 0
          });
          setSurprise(data);
        } else {
          setError('Surpresa não encontrada');
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Erro ao carregar surpresa:', err);
        setError('Erro ao carregar dados da surpresa');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSurprise();

    return () => {
      isMounted = false;
    };
  }, [surpriseId, user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const handlePayment = async (paymentMethodId: string) => {
    try {
      setIsProcessing(true);
      
      if (!surpriseId || !surprise?.plan || !user?.email || !paymentMethodId) {
        throw new Error('Dados incompletos para processamento');
      }
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          surpriseId,
          plan: surprise.plan,
          customerEmail: user.email,
          paymentMethodId
        }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Resposta não-JSON recebida:', await response.text());
        throw new Error('Resposta inválida do servidor');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar pagamento');
      }

      if (data.sessionId) {
        router.push(`/payment/success?session_id=${data.sessionId}&surprise_id=${surpriseId}`);
      } else {
        throw new Error('Sessão de pagamento não criada');
      }
    } catch (err) {
      console.error('Erro ao processar pagamento:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Erro ao processar pagamento. Por favor, tente novamente.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => router.push('/create')}
            className="text-pink-500 hover:text-pink-400"
          >
            Voltar para criação
          </button>
        </div>
      </div>
    );
  }

  if (!surprise) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-900 via-purple-900/20 to-navy-900 pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header com Steps */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text mb-4">
              Finalizar Pagamento
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center">1</div>
                <span className="text-gray-400">Criar Surpresa</span>
              </div>
              <div className="w-8 h-px bg-gray-700" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center">2</div>
                <span className="text-gray-400">Pagamento</span>
              </div>
              <div className="w-8 h-px bg-gray-700" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-700 text-gray-400 flex items-center justify-center">3</div>
                <span className="text-gray-400">Concluído</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Coluna da Esquerda - Detalhes do Plano */}
            <div className="space-y-6">
              {/* Card do Plano */}
              <div className="bg-navy-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-neon-pink border border-pink-500/20">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">
                      Plano {surprise && PLANS[surprise.plan].name}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Sua surpresa será ativada após o pagamento
                    </p>
                  </div>
                  {surprise?.plan === 'premium' && (
                    <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <SparklesIcon className="w-4 h-4" />
                      Premium
                    </span>
                  )}
                </div>

                {/* Lista de Benefícios */}
                <ul className="space-y-3 mb-6">
                  {surprise && PLANS[surprise.plan].features.map((feature: string) => (
                    <li key={feature} className="flex items-center gap-2 text-gray-300">
                      <CheckIcon className="w-5 h-5 text-pink-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Preço */}
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-white">
                    R$ {surprise && PLANS[surprise.plan].price.toFixed(2)}
                  </span>
                  <span className="text-gray-400">pagamento único</span>
                </div>
              </div>

              {/* Informações do Usuário */}
              <div className="bg-navy-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold mb-1">Logado como:</h3>
                      <p className="text-gray-400">{user.email}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 text-pink-500 hover:text-pink-400 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      Trocar Conta
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-400 mb-4">Faça login para continuar</p>
                    <button
                      onClick={() => router.push('/auth/login')}
                      className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors"
                    >
                      Login
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Coluna da Direita - Formulário de Pagamento */}
            {user && (
              <div className="space-y-6">
                <Elements stripe={stripePromise}>
                  <CheckoutForm 
                    onSubmit={handlePayment}
                    isProcessing={isProcessing}
                  />
                </Elements>

                {/* Informações de Segurança */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-2">
                    <LockClosedIcon className="w-4 h-4" />
                    <span>Pagamento 100% seguro</span>
                  </div>
                  <img 
                    src="/stripe-badge.png" 
                    alt="Powered by Stripe" 
                    className="h-8 mx-auto opacity-50 hover:opacity-75 transition-opacity"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}