"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { QrCodeIcon, LinkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useRef } from 'react';
import QRCode from 'qrcode';
import { useSurprise } from '@/hooks/useSurprise';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isValidSession, setIsValidSession] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [shareableUrl, setShareableUrl] = useState<string>('');
  const [copied, copyToClipboard] = useCopyToClipboard();
  const { updateSurpriseStatus } = useSurprise();
  const [error, setError] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const validateAndUpdateSession = async () => {
      const sessionId = searchParams.get('session_id');
      const surpriseId = searchParams.get('surprise_id');

      if (!sessionId || !surpriseId) {
        router.push('/');
        return;
      }

      try {
        // Atualizar o status da surpresa para 'active'
        const success = await updateSurpriseStatus(surpriseId, 'active');
        if (!success) {
          throw new Error('Falha ao atualizar status da surpresa');
        }
        
        // Gerar URL compartilhável
        const baseUrl = window.location.origin;
        const url = `${baseUrl}/s/${surpriseId}`;
        setShareableUrl(url);
        
        // Gerar QR Code
        const qrCode = await QRCode.toDataURL(url);
        setQrCodeUrl(qrCode);
        
        setIsValidSession(true);
      } catch (error) {
        console.error('Erro ao atualizar status:', error);
        setError(error instanceof Error ? error.message : 'Erro ao processar pagamento');
        router.push('/');
      }
    };

    validateAndUpdateSession();
  }, [searchParams, router, updateSurpriseStatus]);

  const handleCopyLink = async () => {
    if (!shareableUrl) {
      console.error('URL compartilhável não disponível');
      return;
    }

    try {
      await copyToClipboard(shareableUrl);
    } catch (err) {
      console.error('Erro ao copiar:', err);
      // Fallback: Mostrar modal com o link
      alert(`Por favor, copie este link manualmente:\n${shareableUrl}`);
    }
  };

  const handleDownloadQR = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qrcode-surpresa.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-pink-500 hover:text-pink-400"
          >
            Voltar para dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Processando pagamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-900 via-purple-900/20 to-navy-900 flex items-center justify-center py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center"
          >
            <CheckIcon className="w-12 h-12 text-green-500" />
          </motion.div>

          <h1 className="text-3xl font-bold text-white">Pagamento Confirmado!</h1>
          <p className="text-gray-400">
            Sua surpresa está pronta para ser compartilhada
          </p>
        </div>

        <div className="bg-navy-800 rounded-2xl p-6 space-y-6">
          {/* QR Code */}
          <div ref={qrRef} className="bg-white p-4 rounded-xl mb-6 flex justify-center">
            <img 
              src={qrCodeUrl} 
              alt="QR Code" 
              className="w-full max-w-[256px] h-auto"
            />
          </div>

          {/* Link de Compartilhamento */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-navy-900 rounded-lg">
              <LinkIcon className="w-5 h-5 text-pink-500 flex-shrink-0" />
              <input
                type="text"
                value={shareableUrl}
                readOnly
                onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                  e.currentTarget.select();
                  handleCopyLink();
                }}
                className="bg-transparent text-sm flex-1 outline-none text-gray-300 cursor-text"
              />
              <button
                onClick={handleCopyLink}
                className="flex-shrink-0 text-sm font-medium text-pink-500 hover:text-pink-400 transition-colors px-3 py-1 rounded hover:bg-pink-500/10"
              >
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>

            {/* Download QR Code */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownloadQR}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:opacity-90 transition-all shadow-neon-pink flex items-center justify-center gap-2"
            >
              <QrCodeIcon className="w-5 h-5" />
              Baixar QR Code
            </motion.button>

            <p className="text-center text-sm text-gray-400 mt-4">
              O QR Code também foi enviado para seu e-mail
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 