"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center py-12 sm:py-16 lg:py-20 overflow-hidden mt-16">
      {/* Background Images */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/95 to-navy-900/90" />
        <Image
          src="https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&q=80"
          alt="Couple Background"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-1/2 text-center lg:text-left pt-8 sm:pt-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text leading-tight">
            O presente perfeito para surpreender seu amor
          </h1>
          <p className="text-gray-300 text-base sm:text-lg mb-8 max-w-lg mx-auto lg:mx-0">
            Crie uma página repleta de emoção e significado, onde cada detalhe expressa todo o seu afeto. 
            Uma experiência inesquecível que fortalecerá sua conexão.
          </p>
          <Link href="/create">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:opacity-90 transition-all shadow-neon-pink"
            >
              Quero fazer meu site
            </motion.button>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-1/2 hidden lg:block"
        >
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80"
              alt="Couple Moments"
              fill
              className="object-cover object-center hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(255,192,203,0.05),transparent_50%)]" />
    </div>
  );
}