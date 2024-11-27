"use client";

import { SurpriseFormProvider } from '@/contexts/SurpriseFormContext';

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return (
    <SurpriseFormProvider>
      {children}
    </SurpriseFormProvider>
  );
} 