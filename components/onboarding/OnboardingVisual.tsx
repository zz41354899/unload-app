import React from 'react';

type StepIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface OnboardingVisualProps {
  step: number;
  bg: string;
  color: string;
  Icon: StepIcon;
}

export const OnboardingVisual: React.FC<OnboardingVisualProps> = ({
  step,
  bg,
  color,
  Icon,
}) => (
  <div className={`relative w-full md:w-1/2 ${bg} transition-colors duration-500 flex flex-col items-center justify-center p-12 overflow-hidden`}>
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white blur-3xl mix-blend-overlay animate-pulse" />
      <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white blur-3xl mix-blend-overlay animate-pulse delay-700" />
    </div>

    <div key={`icon-${step}`} className="relative z-10 animate-in fade-in zoom-in duration-500">
      <div className="w-40 h-40 bg-white rounded-full shadow-xl shadow-black/5 flex items-center justify-center mb-8">
        <Icon className={`w-20 h-20 ${color}`} strokeWidth={1.5} />
      </div>
    </div>

    <div className="hidden md:flex gap-3 mt-8">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`h-2 rounded-full transition-all duration-300 ${
            s === step ? 'w-8 bg-slate-900' : 'w-2 bg-slate-300'
          }`}
        />
      ))}
    </div>
  </div>
);
