import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TempSurpriseData = {
  coupleName: string;
  startDate: string;
  message: string;
  youtubeLink?: string;
  plan: 'basic' | 'premium';
  photos: string[];
  previewUrls: string[];
};

interface SurpriseState {
  tempData: TempSurpriseData | null;
  setTempData: (data: TempSurpriseData) => void;
  clearTempData: () => void;
}

export const useSurpriseStore = create<SurpriseState>()(
  persist(
    (set) => ({
      tempData: null,
      setTempData: (data) => set({ tempData: data }),
      clearTempData: () => set({ tempData: null })
    }),
    {
      name: 'surprise-storage',
      partialize: (state) => ({ tempData: state.tempData }),
    }
  )
); 