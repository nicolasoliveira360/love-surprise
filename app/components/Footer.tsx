"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { HeartIcon } from '@heroicons/react/24/solid';

export default function Footer() {
  return (
    <footer className="py-8 bg-navy-800/50 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-1">
            <span className="text-gray-400">Feito com</span>
            <HeartIcon className="w-4 h-4 text-pink-500" />
            <span className="text-gray-400">para todos os apaixonados</span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <Link href="/termos" className="hover:text-white transition-colors">
              Termos de uso
            </Link>
            <Link href="/privacidade" className="hover:text-white transition-colors">
              Política de privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}