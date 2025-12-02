import React from 'react';
import { ArrowRight } from 'lucide-react';

interface OnboardingActionsProps {
  t: (key: string, options?: any) => string;
  step: number;
  onSkip: () => void;
  onNext: () => void;
}

export const OnboardingActions: React.FC<OnboardingActionsProps> = ({
  t,
  step,
  onSkip,
  onNext,
}) => (
  <div className="mt-12 flex flex-col-reverse md:flex-row items-center gap-4 w-full md:w-auto">
    <button
      type="button"
      onClick={onSkip}
      className="w-full md:w-auto px-6 py-4 text-slate-500 font-medium hover:text-slate-800 transition-colors text-center"
    >
      {t('onboarding.action.skip')}
    </button>

    <button
      type="button"
      onClick={onNext}
      className="w-full md:w-auto group relative px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 overflow-hidden"
    >
      <span className="relative z-10">{step === 4 ? t('onboarding.action.start') : t('onboarding.action.next')}</span>
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
      <div className="absolute inset-0 bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  </div>
);
