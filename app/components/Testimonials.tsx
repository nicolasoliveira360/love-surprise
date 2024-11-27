"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

const testimonials = [
  {
    image: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&q=80',
    text: 'Minha namorada amou a surpresa! Foi um momento super especial.',
    name: 'João Silva',
    date: '2 dias atrás'
  },
  {
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80',
    text: 'Nunca imaginei que seria tão fácil criar algo tão bonito!',
    name: 'Maria Santos',
    date: '1 semana atrás'
  },
  {
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
    text: 'A reação dela quando viu o QR Code foi incrível! Recomendo muito.',
    name: 'Pedro Costa',
    date: '3 dias atrás'
  },
  {
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80',
    text: 'Melhor presente que já dei. Vale muito a pena!',
    name: 'Ana Lima',
    date: '5 dias atrás'
  }
];

export default function Testimonials() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="py-12 sm:py-16 lg:py-20" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 text-white"
        >
          O que dizem sobre nós
        </motion.h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2 }}
              className="bg-navy-800 p-6 rounded-2xl border border-pink-500/20 hover:border-pink-500/40 transition-all hover:transform hover:scale-105"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                  <p className="text-sm text-gray-400">{testimonial.date}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm sm:text-base">{testimonial.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}