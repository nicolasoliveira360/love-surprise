"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TimeCounterProps {
  startDate: string;
}

interface TimeData {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function TimeCounter({ startDate }: TimeCounterProps) {
  const [time, setTime] = useState<TimeData>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(startDate).getTime();
      const now = new Date().getTime();
      const difference = now - start;

      if (difference < 0) {
        setTime({
          years: 0,
          months: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        return;
      }

      // Cálculos aproximados
      const seconds = Math.floor(difference / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30.44); // Média de dias por mês
      const years = Math.floor(months / 12);

      setTime({
        years,
        months: months % 12,
        days: Math.floor(days % 30.44),
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: seconds % 60
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <div className="space-y-2">
      {/* Primeira linha: Anos, Meses e Dias */}
      <div className="flex justify-center items-center gap-3">
        <div className="flex items-center">
          <motion.span
            key={time.years}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-base sm:text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text min-w-[1ch] text-center"
          >
            {time.years}
          </motion.span>
          <span className="text-gray-400 ml-1 text-sm sm:text-base">
            {time.years === 1 ? 'ano' : 'anos'}
          </span>
        </div>

        <span className="text-gray-400 text-sm sm:text-base">e</span>

        <div className="flex items-center">
          <motion.span
            key={time.months}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-base sm:text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text min-w-[1ch] text-center"
          >
            {time.months}
          </motion.span>
          <span className="text-gray-400 ml-1 text-sm sm:text-base">
            {time.months === 1 ? 'mês' : 'meses'}
          </span>
        </div>

        <span className="text-gray-400 text-sm sm:text-base">e</span>

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
      </div>

      {/* Segunda linha: Horas, Minutos e Segundos */}
      <div className="flex justify-center items-center gap-3">
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

        <span className="text-gray-400 text-sm sm:text-base">e</span>

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
  );
}