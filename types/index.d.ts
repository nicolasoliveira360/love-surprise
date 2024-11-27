import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import type { StaticImageData } from 'next/image';

// Tipos de eventos
export interface FormInputEvent extends FormEvent<HTMLFormElement> {
  target: HTMLFormElement & {
    elements: {
      [key: string]: HTMLInputElement | HTMLTextAreaElement;
    };
  };
}

export interface InputChangeEvent extends ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement;
}

export interface TextAreaChangeEvent extends ChangeEvent<HTMLTextAreaElement> {
  target: HTMLTextAreaElement;
}

// Tipos de planos
export type PlanType = 'basic' | 'premium';

export interface PlanLimits {
  maxPhotos: number;
  hasYoutube: boolean;
  validityDays: number | null;
}

export interface Plan {
  name: string;
  type: PlanType;
  price: number;
  features: string[];
  limits: PlanLimits;
}

export interface Plans {
  [key: string]: Plan;
}

// Tipos de surpresa
export interface SurprisePhoto {
  id: string;
  photo_url: string;
  surprise_id: string;
  order_index: number;
}

export interface Surprise {
  id: string;
  couple_name: string;
  start_date: string;
  message?: string;
  youtube_link?: string;
  plan: PlanType;
  surprise_photos?: SurprisePhoto[];
  status: 'draft' | 'active' | 'expired';
}

// Tipos de componentes
export interface ComponentBaseProps {
  children?: ReactNode;
  className?: string;
}

export interface ImageSlideshowProps {
  images: Array<string | StaticImageData>;
  autoPlay?: boolean;
  interval?: number;
}

// Declarações de módulos
declare module '@heroicons/react/*';
declare module '@stripe/stripe-js';
declare module '@stripe/react-stripe-js';
declare module 'next/server';
declare module 'next/navigation';
declare module 'next/image';
declare module 'next/link';
declare module 'framer-motion';

// Tipos globais
declare global {
  interface Window {
    Stripe: any;
  }

  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_STRIPE_PUBLIC_KEY: string;
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      STRIPE_SECRET_KEY: string;
      NODE_ENV: 'development' | 'production';
    }
  }
} 