"use client";

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useRef, useEffect } from 'react';
import { XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface PhotoUploadProps {
  onSubmit: (files: File[], urls: string[]) => void;
  maxPhotos: number;
  images: File[];
  previewUrls: string[];
  onBack: () => void;
  onNext: () => void;
}

export default function PhotoUpload({ onSubmit, maxPhotos, images, previewUrls, onBack, onNext }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPhotos = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > maxPhotos) {
      alert(`Você pode adicionar no máximo ${maxPhotos} fotos`);
      return;
    }

    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    
    onSubmit([...images, ...files], [...previewUrls, ...newPreviewUrls]);
  }, [images, previewUrls, maxPhotos, onSubmit]);

  const removeImage = useCallback((index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviewUrls = previewUrls.filter((_, i) => i !== index);
    
    onSubmit(updatedImages, updatedPreviewUrls);
  }, [images, previewUrls, onSubmit]);

  const handleContinue = () => {
    if (images.length === 0) {
      alert('Adicione pelo menos uma foto para continuar');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-gray-400">
          Adicione até {maxPhotos} fotos especiais do casal
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {previewUrls.map((url, index) => (
            <motion.div
              key={url}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              layout
              className="relative aspect-square group"
            >
              <Image
                src={url}
                alt={`Foto ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XMarkIcon className="w-4 h-4 text-white" />
              </motion.button>
            </motion.div>
          ))}
          
          {images.length < maxPhotos && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-700 hover:border-pink-500 transition-colors flex items-center justify-center"
            >
              <ArrowUpTrayIcon className="w-8 h-8 text-gray-500" />
            </button>
          )}
        </AnimatePresence>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleAddPhotos}
        className="hidden"
      />

      <div className="flex justify-between gap-4 mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
        >
          Voltar
        </button>
        
        <motion.button
          onClick={handleContinue}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:opacity-90 transition-all shadow-neon-pink"
          disabled={images.length === 0}
        >
          Continuar
        </motion.button>
      </div>
    </div>
  );
}