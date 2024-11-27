"use client";

import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';

interface Step {
  id: string;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  currentStep: number;
  steps: Step[];
  onStepClick: (step: number) => void;
}

export default function StepIndicator({ currentStep, steps, onStepClick }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative">
            <motion.button
              onClick={() => onStepClick(index)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                index <= currentStep
                  ? 'cursor-pointer'
                  : 'cursor-not-allowed'
              } ${
                index < currentStep
                  ? 'bg-pink-500'
                  : index === currentStep
                  ? 'bg-pink-500 ring-4 ring-pink-500/20'
                  : 'bg-navy-800 border-2 border-pink-500/30'
              }`}
              whileHover={index <= currentStep ? { scale: 1.1 } : {}}
              whileTap={index <= currentStep ? { scale: 0.95 } : {}}
            >
              {index < currentStep ? (
                <CheckIcon className="w-5 h-5 text-white" />
              ) : (
                <span className="text-white font-medium">{index + 1}</span>
              )}
            </motion.button>
            
            <div className="absolute top-12 w-32 text-center">
              <span className={`text-sm font-medium ${
                index <= currentStep ? 'text-pink-500' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="absolute left-10 w-[calc(100%-2.5rem)] top-5 -z-10">
                <div className={`h-[2px] ${
                  index < currentStep ? 'bg-pink-500' : 'bg-pink-500/30'
                }`} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}