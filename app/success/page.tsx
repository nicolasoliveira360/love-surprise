"use client";

import { motion } from 'framer-motion';
import { CheckCircleIcon, ShareIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function Success() {
  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center"
        >
          <CheckCircleIcon className="w-12 h-12 text-green-500" />
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Surpresa Criada!</h1>
          <p className="text-gray-400">
            Seu presente especial está pronto para ser compartilhado
          </p>
        </div>

        <div className="bg-navy-800 rounded-2xl p-6 space-y-6 shadow-neon-pink">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-navy-900 rounded-lg">
              <div className="flex items-center gap-3">
                <QrCodeIcon className="w-6 h-6 text-pink-500" />
                <span className="text-sm">QR Code enviado para seu e-mail</span>
              </div>
              <SparklesIcon className="w-5 h-5 text-pink-500" />
            </div>

            <div className="flex items-center justify-between p-4 bg-navy-900 rounded-lg">
              <div className="flex items-center gap-3">
                <ShareIcon className="w-6 h-6 text-pink-500" />
                <span className="text-sm">Link disponível no seu e-mail</span>
              </div>
              <SparklesIcon className="w-5 h-5 text-pink-500" />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-700">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:opacity-90 transition-all shadow-neon-pink"
              >
                Voltar para Home
              </motion.button>
            </Link>
          </div>
        </div>

        <p className="text-sm text-gray-400">
          Precisa de ajuda? <a href="#" className="text-pink-500 hover:text-pink-400">Entre em contato</a>
        </p>
      </div>
    </div>
  );
}