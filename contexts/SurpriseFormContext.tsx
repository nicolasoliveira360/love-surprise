"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface SurpriseFormData {
  coupleName: string;
  startDate: string;
  message: string;
  youtubeLink: string;
  photos: File[];
  previewUrls: string[];
  plan: 'basic' | 'premium';
}

export const SurpriseFormContext = createContext<{
  formData: SurpriseFormData;
  updateFormData: (data: Partial<SurpriseFormData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  resetForm: () => void;
}>({
  formData: {
    coupleName: '',
    startDate: '',
    message: '',
    youtubeLink: '',
    photos: [],
    previewUrls: [],
    plan: 'basic'
  },
  updateFormData: () => {},
  currentStep: 0,
  setCurrentStep: () => {},
  resetForm: () => {}
});

export function SurpriseFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<SurpriseFormData>({
    coupleName: '',
    startDate: '',
    message: '',
    youtubeLink: '',
    photos: [],
    previewUrls: [],
    plan: 'basic'
  });
  const [currentStep, setCurrentStep] = useState(0);

  const updateFormData = (newData: Partial<SurpriseFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const resetForm = () => {
    setFormData({
      coupleName: '',
      startDate: '',
      message: '',
      youtubeLink: '',
      photos: [],
      previewUrls: [],
      plan: 'basic'
    });
    setCurrentStep(0);
  };

  return (
    <SurpriseFormContext.Provider 
      value={{ 
        formData, 
        updateFormData, 
        currentStep, 
        setCurrentStep,
        resetForm
      }}
    >
      {children}
    </SurpriseFormContext.Provider>
  );
}

export function useSurpriseForm() {
  const context = useContext(SurpriseFormContext);
  if (context === undefined) {
    throw new Error('useSurpriseForm must be used within a SurpriseFormProvider');
  }
  return context;
} 