"use client";

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { useUser } from '@/hooks/useUser';
import TimeCounter from '@/app/preview/components/TimeCounter';
import HeartRain from '@/app/preview/components/HeartRain';
import ImageSlideshow from '@/components/ImageSlideshow';

interface PreviewFormProps {
  data: {
    coupleName: string;
    startDate: string;
    message: string;
    youtubeLink?: string;
    previewUrls: string[];
    photos: File[];
  };
  onBack: () => void;
  onSave: () => void;
}

export default function PreviewForm({ data, onBack, onSave }: PreviewFormProps) {
  const router = useRouter();
  const { user } = useUser();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleSaveAndContinue = async () => {
    if (!user) {
      onSave();
      return;
    }
    onSave();
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Preview da Surpresa</h2>
        <p className="text-gray-400">
          Confira como ficará sua surpresa
        </p>
      </div>

      <div className="space-y-8">
        {/* Nome do casal e contador */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
            {data.coupleName}
          </h1>
          <TimeCounter startDate={data.startDate} />
        </div>

        {/* Galeria de fotos */}
        <div className="relative w-full aspect-[9/16] bg-navy-900 rounded-lg overflow-hidden">
          {data.previewUrls && data.previewUrls.length > 0 ? (
            <ImageSlideshow 
              images={data.previewUrls}
              autoPlay={true}
              interval={5000}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <HeartIcon className="w-12 h-12 text-pink-500/20" />
            </div>
          )}
        </div>

        {/* Mensagem */}
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
            {data.message}
          </p>
          
          {data.youtubeLink && (
            <div className="space-y-4">
              <p className="text-sm text-pink-500 font-medium italic">
                ✨ Essa música me faz lembrar de você ✨
              </p>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${data.youtubeLink.split('v=')[1]}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-between gap-4">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
        >
          Voltar
        </button>
        
        <motion.button
          onClick={handleSaveAndContinue}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:opacity-90 transition-all shadow-neon-pink"
        >
          Salvar Surpresa
        </motion.button>
      </div>
    </div>
  );
} 