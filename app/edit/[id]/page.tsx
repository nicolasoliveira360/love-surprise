"use client";

import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, XMarkIcon, PhotoIcon, SparklesIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useSurprise } from '@/hooks/useSurprise';
import { useUser } from '@/hooks/useUser';
import Image from 'next/image';
import type { Surprise, SurprisePhoto } from '@/types';

interface FormData {
  coupleName: string;
  startDate: string;
  message: string;
  youtubeLink: string;
}

const plans = [
  {
    name: 'Basic',
    type: 'basic',
    price: 29.90,
    features: [
      'Contador personalizado',
      'Até 5 fotos',
      'Link compartilhável',
      'QR Code exclusivo'
    ]
  },
  {
    name: 'Premium',
    type: 'premium',
    price: 49.90,
    features: [
      'Todas as features do Basic',
      'Fotos ilimitadas',
      'Música personalizada',
      'Validade permanente',
      'Temas exclusivos'
    ]
  }
];

export default function EditSurprise({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useUser();
  const { getSurpriseWithPhotos, updateSurprise } = useSurprise();
  const [surprise, setSurprise] = useState<Surprise | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    coupleName: '',
    startDate: '',
    message: '',
    youtubeLink: ''
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [deletedPhotoIds, setDeletedPhotoIds] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('basic');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadSurprise = async () => {
      if (!user || !params.id || isInitialized) return;

      try {
        setIsLoading(true);
        const data = await getSurpriseWithPhotos(params.id);
        
        if (data) {
          setSurprise(data);
          setSelectedPlan(data.plan);
          setFormData({
            coupleName: data.couple_name,
            startDate: data.start_date,
            message: data.message || '',
            youtubeLink: data.youtube_link || ''
          });
        }
      } catch (error) {
        console.error('Erro ao carregar surpresa:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    loadSurprise();
  }, [params.id, user, getSurpriseWithPhotos, isInitialized]);

  const handleAddPhotos = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentPhotosCount = (surprise?.surprise_photos?.length || 0) - deletedPhotoIds.length + photos.length;
    const maxPhotos = surprise?.plan === 'premium' ? 7 : 3;
    
    if (currentPhotosCount + files.length > maxPhotos) {
      alert(`Seu plano ${surprise?.plan} permite apenas ${maxPhotos} fotos. Faça upgrade para o plano Premium para adicionar mais fotos.`);
      return;
    }

    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    setPhotos(prev => [...prev, ...files]);
  };

  const handleRemoveExistingPhoto = (photoId: string) => {
    setDeletedPhotoIds(prev => [...prev, photoId]);
  };

  const handleRemoveNewPhoto = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const result = await updateSurprise(params.id, {
      couple_name: formData.coupleName,
      start_date: formData.startDate,
      message: formData.message,
      youtube_link: formData.youtubeLink,
      photos,
      deletedPhotoIds,
      plan: selectedPlan
    });

    if (result.success) {
      router.push(`/payment?surpriseId=${params.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!surprise) return null;

  return (
    <div className="min-h-screen bg-navy-900 pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 text-white hover:text-pink-500 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Voltar para dashboard</span>
            </Link>
          </div>

          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text mb-2">
              Editar Surpresa
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="coupleName" className="block text-sm font-medium text-gray-300 mb-2">
                Nome do Casal
              </label>
              <input
                type="text"
                id="coupleName"
                value={formData.coupleName}
                onChange={(e) => setFormData(prev => ({ ...prev, coupleName: e.target.value }))}
                className="w-full px-4 py-3 bg-navy-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-2">
                Data de Início
              </label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-4 py-3 bg-navy-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Mensagem (opcional)
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-4 py-3 bg-navy-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white h-32"
              />
            </div>

            {surprise.plan === 'premium' && (
              <div>
                <label htmlFor="youtubeLink" className="block text-sm font-medium text-gray-300 mb-2">
                  Link do YouTube (opcional)
                </label>
                <input
                  type="url"
                  id="youtubeLink"
                  value={formData.youtubeLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, youtubeLink: e.target.value }))}
                  className="w-full px-4 py-3 bg-navy-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            )}

            {/* Gerenciamento de Fotos */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-300">
                  Fotos do Casal
                </label>
                <span className="text-xs text-gray-400">
                  {(surprise?.surprise_photos?.length || 0) - deletedPhotoIds.length + photos.length} de {surprise?.plan === 'premium' ? '7' : '3'} fotos
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {/* Fotos Existentes */}
                {surprise?.surprise_photos
                  ?.filter((photo: SurprisePhoto) => !deletedPhotoIds.includes(photo.id))
                  .map((photo: SurprisePhoto) => (
                    <div key={photo.id} className="relative aspect-square">
                      <Image
                        src={photo.photo_url}
                        alt="Foto do casal"
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingPhoto(photo.id)}
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <XMarkIcon className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}

                {/* Novas Fotos */}
                {previewUrls.map((url, index) => (
                  <div key={url} className="relative aspect-square">
                    <Image
                      src={url}
                      alt={`Nova foto ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewPhoto(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}

                {/* Botão Adicionar Fotos - Desabilitado se atingiu limite */}
                {(surprise?.surprise_photos?.length || 0) - deletedPhotoIds.length + photos.length < (surprise?.plan === 'premium' ? 7 : 3) && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-gray-700 hover:border-pink-500 transition-colors flex items-center justify-center"
                  >
                    <PhotoIcon className="w-8 h-8 text-gray-500" />
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleAddPhotos}
                className="hidden"
              />

              {/* Mensagem de upgrade */}
              {surprise?.plan === 'basic' && (
                <p className="text-sm text-gray-400 mt-2">
                  Faça upgrade para o plano Premium para adicionar mais fotos e recursos exclusivos.
                </p>
              )}
            </div>

            {/* Seleção de Plano */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Plano
              </label>

              <div className="grid sm:grid-cols-2 gap-4">
                {plans.map((plan) => (
                  <div
                    key={plan.type}
                    onClick={() => setSelectedPlan(plan.type as 'basic' | 'premium')}
                    className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPlan === plan.type
                        ? 'border-pink-500 bg-pink-500/5'
                        : 'border-gray-700 hover:border-pink-500/50'
                    }`}
                  >
                    {/* Plano Atual Badge */}
                    {surprise?.plan === plan.type && (
                      <div className="absolute -top-3 left-4 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                        Plano Atual
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                        <p className="text-2xl font-bold text-white mt-1">
                          R$ {plan.price.toFixed(2)}
                        </p>
                      </div>
                      {plan.type === 'premium' && (
                        <SparklesIcon className="w-6 h-6 text-pink-500" />
                      )}
                    </div>

                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                          <CheckIcon className="w-4 h-4 text-pink-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Indicador de Seleção */}
                    <div className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 ${
                      selectedPlan === plan.type
                        ? 'border-pink-500 bg-pink-500'
                        : 'border-gray-500'
                    }`} />
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:opacity-90 transition-all shadow-neon-pink mt-8"
            >
              {surprise?.plan !== selectedPlan ? 'Salvar e Continuar para Pagamento' : 'Salvar Alterações'}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
} 