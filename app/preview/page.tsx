"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, HeartIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useTempSurprise } from '@/hooks/useTempSurprise';
import HeartRain from './components/HeartRain';
import TimeCounter from './components/TimeCounter';
import { useUser } from '@/hooks/useUser';
import { useSurprise } from '@/hooks/useSurprise';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import ImageSlideshow from './components/ImageSlideshow';
import { supabase } from '@/lib/supabase';

export default function Preview() {
  const router = useRouter();
  const { tempSurprise, clearTempSurprise } = useTempSurprise();
  const { user } = useUser();
  const { createSurprise } = useSurprise();
  const { handleAuthRedirect } = useAuthRedirect();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Remover o loading inicial após verificar os dados
    setIsLoading(false);
    
    // Redirecionar se não houver dados
    if (!tempSurprise && !isRedirecting && !isSaving) {
      console.log('Redirecionando: dados temporários não encontrados');
      router.push('/create');
    }
  }, [tempSurprise, router, isRedirecting, isSaving]);

  const handleSaveAndContinue = async () => {
    try {
      // Verificar autenticação primeiro
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        if (tempSurprise) {
          try {
            const serializableSurprise = {
              coupleName: tempSurprise.coupleName,
              startDate: tempSurprise.startDate,
              message: tempSurprise.message,
              youtubeLink: tempSurprise.youtubeLink || '',
              plan: tempSurprise.plan || 'basic',
              previewUrls: tempSurprise.previewUrls || [],
              photos: []
            };
            
            localStorage.setItem('tempSurprise', JSON.stringify(serializableSurprise));
            console.log('Dados temporários salvos:', serializableSurprise);
          } catch (err) {
            console.error('Erro ao salvar dados temporários:', err);
          }
          handleAuthRedirect('/payment');
          return;
        }
      }

      setIsSaving(true);
      setIsRedirecting(true);
      setErrorMessage(null);

      if (!tempSurprise) {
        throw new Error('Dados da surpresa não encontrados');
      }

      const surprise = await createSurprise({
        coupleName: tempSurprise.coupleName,
        startDate: tempSurprise.startDate,
        message: tempSurprise.message,
        youtubeLink: tempSurprise.youtubeLink || '',
        plan: tempSurprise.plan || 'basic',
        photos: tempSurprise.photos,
        status: 'draft'
      });

      if (!surprise) {
        throw new Error('Não foi possível criar a surpresa');
      }

      // Limpar dados temporários antes do redirecionamento
      clearTempSurprise();
      
      const redirectUrl = `/payment?surpriseId=${surprise.id}`;
      await router.push(redirectUrl);
      
      console.log('Redirecionamento e limpeza concluídos');
    } catch (error) {
      console.error('Erro detalhado ao salvar surpresa:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao salvar surpresa');
      setIsRedirecting(false);
      setIsSaving(false);
    }
  };

  // Função para gerar um link temporário
  const getTempPreviewUrl = () => {
    if (!tempSurprise) return '#';
    
    // Gerar um ID único para a surpresa temporária
    const tempId = Math.random().toString(36).substring(2, 15);
    return `/s/${tempId}`;
  };

  // Se não houver dados temporários e não estiver redirecionando/salvando, mostra loading
  if (!tempSurprise && (isRedirecting || isSaving)) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Processando...</p>
        </div>
      </div>
    );
  }

  // Se não houver dados temporários, não renderiza nada (será redirecionado)
  if (!tempSurprise) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-900 via-purple-900/20 to-navy-900 pt-20 pb-12">
      <HeartRain />
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/create" 
            className="flex items-center gap-2 text-white hover:text-pink-500 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Voltar para edição</span>
          </Link>
        </div>

        {/* Mobile Preview Container */}
        <div className="relative max-w-sm mx-auto">
          {/* Phone Frame */}
          <div className="absolute inset-0 border-[12px] border-navy-800 rounded-[3rem] shadow-2xl pointer-events-none z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-navy-800 rounded-b-xl"></div>
          </div>

          {/* Content */}
          <div className="relative bg-navy-800/80 backdrop-blur-sm rounded-[2rem] overflow-hidden">
            <div className="p-6 pt-10 space-y-8">
              {/* Nome do casal e contador */}
              <div className="text-center space-y-4">
                <motion.h1 
                  className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text px-4"
                  style={{ 
                    wordBreak: 'break-word',  // Permite quebra de palavras
                    overflowWrap: 'break-word', // Garante que palavras longas quebrem
                    hyphens: 'auto' // Adiciona hífens quando necessário
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {tempSurprise.coupleName}
                </motion.h1>
                <TimeCounter startDate={tempSurprise.startDate} />
              </div>
              
              {/* Galeria de fotos */}
              <div className="relative w-full aspect-[9/16] bg-navy-900 rounded-lg overflow-hidden shadow-2xl">
                {tempSurprise.previewUrls.length > 0 && (
                  <ImageSlideshow 
                    images={tempSurprise.previewUrls}
                    autoPlay={false}
                  />
                )}
              </div>

              {/* Mensagem */}
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                  {tempSurprise.message}
                </p>
                
                {tempSurprise.youtubeLink && (
                  <div className="space-y-4">
                    <p className="text-sm text-pink-500 font-medium italic">
                      ✨ Essa música me faz lembrar de você ✨
                    </p>
                    <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${tempSurprise.youtubeLink.split('v=')[1]}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Marca d'água e Link Temporário */}
        <div className="mt-8 space-y-6">
          {/* Botão de Preview em Nova Aba */}
          <Link 
            href={getTempPreviewUrl()} 
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-navy-900 text-white rounded-full font-semibold border border-pink-500/30 hover:border-pink-500 transition-all flex items-center justify-center gap-2"
            >
              <ArrowTopRightOnSquareIcon className="w-5 h-5" />
              Ver Preview Real
            </motion.button>
          </Link>

          {/* Marca d'água única no final */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy-900/50 backdrop-blur-sm rounded-full">
              <HeartIcon className="w-4 h-4 text-pink-500" />
              <p className="text-xs font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
                Criado com LoveSurprise
              </p>
            </div>
          </div>
        </div>

        {/* Adicionar mensagem de erro se houver */}
        {errorMessage && (
          <div className="mt-4 text-center">
            <p className="text-red-500 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Botão de Continuar */}
        <div className="mt-8 flex justify-center">
          <motion.button
            onClick={handleSaveAndContinue}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSaving}
            className={`flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-neon-pink ${
              isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
            ) : (
              <HeartIcon className="w-6 h-6" />
            )}
            {isSaving ? 'Salvando...' : 'Salvar e Continuar para Pagamento'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}