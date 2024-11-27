"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase';
import { useSurpriseForm } from '@/contexts/SurpriseFormContext';
import { useSurprise } from '@/hooks/useSurprise';
import { useUser } from '@/hooks/useUser';
import { createNotification } from '@/lib/notifications';

// Componentes
import StepIndicator from './components/StepIndicator';
import PlanSelection from './components/PlanSelection';
import CoupleInfo from './components/CoupleInfo';
import PhotoUpload from './components/PhotoUpload';
import MessageForm from './components/MessageForm';
import PreviewForm from './components/PreviewForm';
import AuthForm from './components/AuthForm';

const steps = [
  { id: 'plan', title: 'Plano', description: 'Escolha o plano ideal' },
  { id: 'couple', title: 'Casal', description: 'Dados do relacionamento' },
  { id: 'photos', title: 'Fotos', description: 'Momentos especiais' },
  { id: 'message', title: 'Mensagem', description: 'Palavras do coração' },
  { id: 'preview', title: 'Preview', description: 'Visualizar surpresa' },
  { id: 'auth', title: 'Conta', description: 'Entrar ou cadastrar' }
];

export default function CreateSurprise() {
  const router = useRouter();
  const { createSurprise } = useSurprise();
  const { 
    formData, 
    updateFormData, 
    currentStep, 
    setCurrentStep,
    resetForm
  } = useSurpriseForm();
  const { user } = useUser();

  const handlePlanSelect = (plan: 'basic' | 'premium') => {
    updateFormData({ plan });
    setCurrentStep(1);
  };

  const handleCoupleInfoSubmit = (data: { coupleName: string; startDate: string }) => {
    updateFormData(data);
    setCurrentStep(2);
  };

  const handlePhotoUpload = (photos: File[], previewUrls: string[]) => {
    updateFormData({ photos, previewUrls });
  };

  const handlePhotoNext = () => {
    setCurrentStep(3);
  };

  const handleMessageSubmit = (data: { message: string; youtubeLink?: string }) => {
    updateFormData({
      message: data.message,
      youtubeLink: data.youtubeLink || ''
    });
    setCurrentStep(4);
  };

  const handleSaveAndContinue = async () => {
    try {
      const surprise = await createSurprise({
        coupleName: formData.coupleName,
        startDate: formData.startDate,
        message: formData.message,
        youtubeLink: formData.youtubeLink,
        plan: formData.plan,
        photos: formData.photos,
        status: 'draft'
      });

      if (!surprise?.id) {
        throw new Error('Não foi possível criar a surpresa');
      }

      await createNotification({
        userId: user.id,
        surpriseId: surprise.id,
        type: 'created',
        message: `Sua surpresa "${surprise.couple_name}" foi criada com sucesso!`
      });

      resetForm();
      router.push(`/payment?surpriseId=${surprise.id}`);
    } catch (error) {
      console.error('Erro ao salvar surpresa:', error);
      alert(error instanceof Error ? error.message : 'Erro ao salvar surpresa');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAuthComplete = async () => {
    handleSaveAndContinue();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PlanSelection 
            onSelect={handlePlanSelect} 
            selectedPlan={formData.plan} 
          />
        );
      case 1:
        return (
          <CoupleInfo 
            onSubmit={handleCoupleInfoSubmit} 
            initialData={{ 
              coupleName: formData.coupleName, 
              startDate: formData.startDate 
            }} 
            onBack={handleBack} 
          />
        );
      case 2:
        return (
          <PhotoUpload
            onSubmit={handlePhotoUpload}
            onNext={handlePhotoNext}
            maxPhotos={formData.plan === 'basic' ? 3 : 7}
            images={formData.photos}
            previewUrls={formData.previewUrls}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <MessageForm
            onSubmit={handleMessageSubmit}
            initialData={{ 
              message: formData.message, 
              youtubeLink: formData.youtubeLink 
            }}
            isPremium={formData.plan === 'premium'}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <PreviewForm
            data={formData}
            onBack={handleBack}
            onSave={() => {
              if (user) {
                handleSaveAndContinue();
              } else {
                setCurrentStep(5);
              }
            }}
          />
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold mb-2">Quase lá!</h2>
              <p className="text-gray-400">
                Entre ou crie sua conta para salvar sua surpresa
              </p>
            </div>
            <AuthForm onComplete={handleAuthComplete} />
            <div className="flex justify-center">
              <button
                onClick={handleBack}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Voltar para preview
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header com botão de voltar */}
          <div className="flex items-center mb-8">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-white hover:text-pink-500 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Voltar para home</span>
            </Link>
          </div>

          {/* Title and Description */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text mb-2">
              Criar Surpresa
            </h1>
            <p className="text-gray-400">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Step Indicator */}
          <StepIndicator 
            currentStep={currentStep} 
            steps={steps} 
            onStepClick={(step) => currentStep > step && setCurrentStep(step)}
          />

          {/* Form Container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-navy-800 rounded-2xl p-6 sm:p-8 shadow-neon-pink"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Progress */}
          <div className="mt-8 flex justify-between items-center text-sm text-gray-400">
            <span>Etapa {currentStep + 1} de {steps.length}</span>
            <div className="w-48 h-1 bg-navy-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}