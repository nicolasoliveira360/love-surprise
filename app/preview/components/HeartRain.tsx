"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function HeartRain() {
  const [hearts, setHearts] = useState<{ id: number; x: number; delay: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart = {
        id: Date.now(),
        x: Math.random() * 100, // posição horizontal aleatória
        delay: Math.random() * 0.5 // delay aleatório
      };
      setHearts(prev => [...prev, newHeart]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Remover corações antigos
  useEffect(() => {
    const cleanup = setInterval(() => {
      setHearts(prev => prev.filter(heart => Date.now() - heart.id < 3000));
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      <AnimatePresence>
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            initial={{ y: -20, x: `${heart.x}vw`, opacity: 0, scale: 0 }}
            animate={{ y: '100vh', opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 3,
              delay: heart.delay,
              ease: "linear"
            }}
            className="absolute text-2xl"
          >
            ❤️
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 