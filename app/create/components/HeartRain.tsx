"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Heart {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
}

export default function HeartRain() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart = {
        id: Date.now(),
        x: Math.random() * 100, // posição horizontal aleatória
        size: Math.random() * (30 - 15) + 15, // tamanho entre 15px e 30px
        delay: Math.random() * 0.5,
        duration: Math.random() * (5 - 3) + 3, // duração entre 3s e 5s
        rotation: Math.random() * 360 // rotação aleatória
      };
      setHearts(prev => [...prev, newHeart]);
    }, 300); // Reduzido o intervalo para mais corações

    return () => clearInterval(interval);
  }, []);

  // Remover corações antigos
  useEffect(() => {
    const cleanup = setInterval(() => {
      setHearts(prev => prev.filter(heart => Date.now() - heart.id < 5000));
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            initial={{ 
              y: -20, 
              x: `${heart.x}vw`, 
              opacity: 0, 
              scale: 0,
              rotate: heart.rotation
            }}
            animate={{ 
              y: '110vh', 
              opacity: [0, 1, 1, 0], 
              scale: [0, 1, 1, 0.5],
              rotate: heart.rotation + 360
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              fontSize: `${heart.size}px`
            }}
            className="will-change-transform"
          >
            ❤️
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 