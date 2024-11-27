"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useSurprise } from '@/hooks/useSurprise';
import HeartRain from '@/app/preview/components/HeartRain';
import TimeCounter from '@/app/preview/components/TimeCounter';
import Link from 'next/link';

type Props = {
  params: {
    id: string;
  };
};

export default function SurprisePreview({ params }: Props) {
  const router = useRouter();
  const { getSurpriseWithPhotos } = useSurprise();
  const [surprise, setSurprise] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSurprise = async () => {
      const data = await getSurpriseWithPhotos(params.id);
      if (data) {
        setSurprise(data);
      }
      setLoading(false);
    };

    loadSurprise();
  }, [params.id, getSurpriseWithPhotos]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando preview...</p>
        </div>
      </div>
    );
  }

  if (!surprise) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-900 via-purple-900/20 to-navy-900 pt-20 pb-12">
      <HeartRain />
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 text-white hover:text-pink-500 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Voltar para dashboard</span>
          </Link>
        </div>

        {/* Mobile Preview Container */}
        <div className="relative max-w-sm mx-auto">
          {/* Phone Frame */}
          <div className="absolute inset-0 border-[12px] border-navy-800 rounded-[3rem] shadow-2xl pointer-events-none z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-navy-800 rounded-b-xl"></div>
          </div>

          {/* Content */}
          <div className="relative bg-navy-800/80 backdrop-blur-sm rounded-[2rem] overflow-hidden">
            <div className="p-6 pt-10 space-y-8">
              {/* Nome do casal e contador */}
              <div className="text-center space-y-4">
                <motion.h1 
                  className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text px-4"
                  style={{ 
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    hyphens: 'auto'
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {surprise.couple_name}
                </motion.h1>
                <TimeCounter startDate={surprise.start_date} />
              </div>
              
              {/* Galeria de fotos */}
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl">
                {surprise.surprise_photos?.length > 0 && (
                  <motion.img
                    key={currentImageIndex}
                    src={surprise.surprise_photos[currentImageIndex].photo_url}
                    alt="Preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full h-full object-cover"
                  />
                )}
                
                {surprise.surprise_photos?.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {surprise.surprise_photos.map((_: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex ? 'bg-pink-500 scale-125' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Mensagem */}
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                  {surprise.message}
                </p>
                
                {surprise.youtube_link && (
                  <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${surprise.youtube_link.split('v=')[1]}`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 