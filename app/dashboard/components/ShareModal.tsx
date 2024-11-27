"use client";

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  XMarkIcon, 
  QrCodeIcon, 
  LinkIcon, 
  SparklesIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

type ShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  surpriseId: string | null;
};

export default function ShareModal({ isOpen, onClose, surpriseId }: ShareModalProps) {
  const [copied, copyToClipboard] = useCopyToClipboard();
  const [shareUrl, setShareUrl] = useState('');
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (surpriseId) {
      const url = `${window.location.origin}/s/${surpriseId}`;
      setShareUrl(url);
    }
  }, [surpriseId]);

  const handleCopyLink = async () => {
    try {
      await copyToClipboard(shareUrl);
    } catch (err) {
      console.error('Erro ao copiar:', err);
      alert(`Por favor, copie este link manualmente:\n${shareUrl}`);
    }
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;

    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;

    try {
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `qrcode-surprise-${surpriseId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Erro ao baixar QR Code:', err);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-navy-800 p-6 shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-lg font-medium">
                    Compartilhar Surpresa
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* QR Code */}
                <div ref={qrRef} className="bg-white p-4 rounded-xl mb-6 flex justify-center">
                  <QRCodeCanvas
                    value={shareUrl}
                    size={256}
                    level="H"
                    includeMargin
                    className="w-full h-auto"
                  />
                </div>

                {/* Link de Compartilhamento */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-navy-900 rounded-lg">
                    <LinkIcon className="w-5 h-5 text-pink-500 flex-shrink-0" />
                    <input
                      type="text"
                      value={shareUrl}
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}