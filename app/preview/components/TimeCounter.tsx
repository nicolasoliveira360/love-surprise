"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TimeCounterProps {
  startDate: string;
}

export default function TimeCounter({ startDate }: TimeCounterProps) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateTime = () => {
      const start = new Date(startDate).getTime();
      const now = new Date().getTime();
      const diff = now - start;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTime({ days, hours, minutes, seconds });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <div className="text-center space-y-2">
      <p className="text-sm text-gray-400">Juntos há</p>
      <div className="flex flex-col gap-2">
        {/* Primeira linha: Dias e Horas */}
        <div className="flex justify-center items-center gap-3">
          <div className="flex items-center">
            <motion.span
              key={time.days}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-base sm:text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text min-w-[1ch] text-center"
            >
              {time.days}
            </motion.span>
            <span className="text-gray-400 ml-1 text-sm sm:text-base">
              {time.days === 1 ? 'dia' : 'dias'}
            </span>
          </div>

          <div className="flex items-center">
            <motion.span
              key={time.hours}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-base sm:text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text min-w-[1ch] text-center"
            >
              {time.hours}
            </motion.span>
            <span className="text-gray-400 ml-1 text-sm sm:text-base">
              {time.hours === 1 ? 'hora' : 'horas'}
            </span>
          </div>
        </div>

        {/* Segunda linha: Minutos e Segundos */}
        <div className="flex justify-center items-center gap-3">
          <div className="flex items-center">
            <motion.span
              key={time.minutes}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-base sm:text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text min-w-[1ch] text-center"
            >
              {time.minutes}
            </motion.span>
            <span className="text-gray-400 ml-1 text-sm sm:text-base">
              {time.minutes === 1 ? 'minuto' : 'minutos'}
            </span>
          </div>

          <span className="text-gray-400 text-sm sm:text-base">e</span>

          <div className="flex items-center">
            <motion.span
              key={time.seconds}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-base sm:text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text min-w-[1ch] text-center"
            >
              {time.seconds}
            </motion.span>
            <span className="text-gray-400 ml-1 text-sm sm:text-base">
              {time.seconds === 1 ? 'segundo' : 'segundos'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 