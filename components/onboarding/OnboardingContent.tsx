import React from 'react';
import { CheckCircle } from 'lucide-react';

interface OnboardingStepContent {
  title: string;
  description?: string;
  points?: string[];
  subtext?: string;
  color: string;
}

interface OnboardingContentProps {
  step: number;
  currentStep: OnboardingStepContent;
  children?: React.ReactNode;
}

export const OnboardingContent: React.FC<OnboardingContentProps> = ({ step, currentStep, children }) => (
  <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white relative">
    <div className="flex md:hidden justify-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            s === step ? 'w-6 bg-slate-900' : 'w-1.5 bg-slate-300'
          }`}
        />
      ))}
    </div>

    <div key={`content-${step}`} className="animate-in slide-in-from-right-8 fade-in duration-500 flex flex-col h-full">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6 leading-tight">
        {currentStep.title}
      </h1>

      {currentStep.description && (
        <p className="text-slate-600 text-lg leading-relaxed mb-6">
          {currentStep.description}
        </p>
      )}

      {currentStep.points && (
        <ul className="space-y-4 mb-8">
          {currentStep.points.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3 text-slate-700 font-medium">
              <CheckCircle className={`w-5 h-5 ${currentStep.color} shrink-0 mt-0.5`} />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}

      {currentStep.subtext && (
        <p className="text-slate-400 text-sm font-medium italic mb-4">
          {currentStep.subtext}
        </p>
      )}

      <div className="mt-8 md:mt-auto">
        {children}
      </div>
    </div>
  </div>
);
