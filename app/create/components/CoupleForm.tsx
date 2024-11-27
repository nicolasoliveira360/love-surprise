"use client";

import { type FC, type FormEvent, useState } from 'react';

interface FormData {
  coupleName: string;
  startDate: string;
}

interface CoupleFormProps {
  initialData: FormData;
  onSubmit: (data: FormData) => void;
  onNext: () => void;
}

const CoupleForm: FC<CoupleFormProps> = ({ 
  initialData, 
  onSubmit, 
  onNext 
}: CoupleFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    coupleName: initialData.coupleName || '',
    startDate: initialData.startDate || ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Nome do Casal
        </label>
        <input
          type="text"
          value={formData.coupleName}
          onChange={(e) => setFormData((prev: FormData) => ({ 
            ...prev, 
            coupleName: e.target.value 
          }))}
          className="w-full px-4 py-2 bg-navy-900 border border-gray-700 rounded-lg focus:ring-pink-500 focus:border-pink-500"
          placeholder="Ex: João & Maria"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Data de Início
        </label>
        <input
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData((prev: FormData) => ({ 
            ...prev, 
            startDate: e.target.value 
          }))}
          className="w-full px-4 py-2 bg-navy-900 border border-gray-700 rounded-lg focus:ring-pink-500 focus:border-pink-500"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:opacity-90 transition-all shadow-neon-pink"
      >
        Continuar
      </button>
    </form>
  );
};

export default CoupleForm; 