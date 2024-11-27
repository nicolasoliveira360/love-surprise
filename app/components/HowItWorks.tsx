"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const steps = [
  {
    number: '1',
    title: 'Preencha os dados',
    description: 'Insira as informações do seu relacionamento'
  },
  {
    number: '2',
    title: 'Faça o pagamento',
    description: 'Escolha o plano que mais combina com você'
  },
  {
    number: '3',
    title: 'Receba o seu site',
    description: 'Seu QR Code chegará no e-mail'
  },
  {
    number: '4',
    title: 'Surpreenda',
    description: 'Compartilhe o amor de forma única'
  }
];

export default function HowItWorks() {
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
          Como funciona
        </motion.h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2 }}
              className="bg-navy-800 p-6 rounded-2xl border border-pink-500/20 hover:border-pink-500/40 transition-all hover:transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm sm:text-base">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}