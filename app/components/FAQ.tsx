"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useInView } from 'react-intersection-observer';

const faqs = [
  {
    question: 'O que é o LoveSurprise?',
    answer: 'LoveSurprise é uma plataforma que permite criar páginas personalizadas para surpreender alguém especial. Você pode adicionar fotos, textos e músicas para criar um momento único.'
  },
  {
    question: 'Como recebo minha página personalizada após o pagamento?',
    answer: 'Após a confirmação do pagamento, você receberá um e-mail com o QR Code e o link da sua página personalizada em até 24 horas.'
  },
  {
    question: 'A página personalizada tem validade?',
    answer: 'Depende do plano escolhido. O plano básico tem validade de 1 mês, enquanto o plano premium não tem prazo de expiração.'
  },
  {
    question: 'Posso editar minha página depois de criada?',
    answer: 'Sim! Você pode editar o conteúdo da sua página a qualquer momento dentro do período de validade do seu plano.'
  },
  {
    question: 'Quais são as formas de pagamento?',
    answer: 'Aceitamos PIX, cartão de crédito e boleto bancário. Todas as transações são processadas de forma segura.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-navy-800/50" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 lg:mb-16"
        >
          Perguntas Frequentes
        </motion.h2>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="bg-navy-800 border border-pink-500/20 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-pink-500/5 transition-colors"
              >
                <span className="font-medium text-white">{faq.question}</span>
                <ChevronDownIcon 
                  className={`w-5 h-5 text-pink-500 transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-48' : 'max-h-0'
                }`}
              >
                <p className="px-6 pb-4 text-gray-400">{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}