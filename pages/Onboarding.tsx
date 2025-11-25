import React, { useState } from 'react';
import { useAppStore } from '../store';
import { ArrowRight, CheckCircle, Feather, Layers, Zap, Sparkles, Globe2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface OnboardingProps {
  navigate: (page: string) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ navigate }) => {
  const { completeOnboarding } = useAppStore();
  const [step, setStep] = useState(1);
  const { t, i18n } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const handleSkip = () => {
    completeOnboarding();
    navigate('dashboard');
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      completeOnboarding();
      navigate('dashboard');
    }
  };

  // Content for each step
  const steps = [
    {
      id: 1,
      icon: Feather,
      title: t('onboarding.step1.title'),
      description: t('onboarding.step1.description'),
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      id: 2,
      icon: Layers,
      title: t('onboarding.step2.title'),
      description: t('onboarding.step2.description'),
      points: [
        t('onboarding.step2.point1'),
        t('onboarding.step2.point2'),
        t('onboarding.step2.point3')
      ],
      subtext: t('onboarding.step2.subtext'),
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      id: 3,
      icon: Zap,
      title: t('onboarding.step3.title'),
      description: t('onboarding.step3.description'),
      points: [
        t('onboarding.step3.point1'),
        t('onboarding.step3.point2'),
        t('onboarding.step3.point3')
      ],
      subtext: t('onboarding.step3.subtext'),
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      id: 4,
      icon: Sparkles,
      title: t('onboarding.step4.title'),
      description: t('onboarding.step4.description'),
      points: [
        t('onboarding.step4.point1'),
        t('onboarding.step4.point2'),
        t('onboarding.step4.point3')
      ],
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    }
  ];

  const currentStep = steps[step - 1];
  const Icon = currentStep.icon;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 font-sans relative">
      {/* Navbar */}
      <nav className="w-full px-6 py-6 md:px-12 flex justify-between items-center shrink-0">
        <img src="/logo.svg" alt="Unload Logo" className="w-[140px] h-[40px]" />

        {/* Language Toggle */}
        <div className="relative z-50">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangOpen((open) => !open)}
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-white/80 transition-colors shadow-sm bg-white/50 backdrop-blur-sm"
              aria-label="Toggle language menu"
            >
              <Globe2 className="w-5 h-5" />
            </button>
            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-32 rounded-xl bg-white border border-gray-200 shadow-lg py-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    void i18n.changeLanguage('zh-TW');
                    setIsLangOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${i18n.language === 'zh-TW' ? 'font-semibold text-gray-900' : 'text-gray-600'
                    }`}
                >
                  {t('login.language.zh')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void i18n.changeLanguage('en');
                    setIsLangOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${i18n.language === 'en' ? 'font-semibold text-gray-900' : 'text-gray-600'
                    }`}
                >
                  {t('login.language.en')}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 overflow-hidden flex flex-col md:flex-row min-h-[600px]">

          {/* Left Side: Visual Area */}
          <div className={`relative w-full md:w-1/2 ${currentStep.bg} transition-colors duration-500 flex flex-col items-center justify-center p-12 overflow-hidden`}>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white blur-3xl mix-blend-overlay animate-pulse" />
              <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white blur-3xl mix-blend-overlay animate-pulse delay-700" />
            </div>

            <div key={`icon-${step}`} className="relative z-10 animate-in fade-in zoom-in duration-500">
              <div className="w-40 h-40 bg-white rounded-full shadow-xl shadow-black/5 flex items-center justify-center mb-8">
                <Icon className={`w-20 h-20 ${currentStep.color}`} strokeWidth={1.5} />
              </div>
            </div>

            {/* Progress Dots (Mobile: Hidden, Desktop: Shown here) */}
            <div className="hidden md:flex gap-3 mt-8">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-slate-900' : 'w-2 bg-slate-300'
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Right Side: Content Area */}
          <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white relative">
            {/* Mobile Progress Dots */}
            <div className="flex md:hidden justify-center gap-2 mb-8">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${s === step ? 'w-6 bg-slate-900' : 'w-1.5 bg-slate-300'
                    }`}
                />
              ))}
            </div>

            <div key={`content-${step}`} className="animate-in slide-in-from-right-8 fade-in duration-500">
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
                <p className="text-slate-400 text-sm font-medium italic">
                  {currentStep.subtext}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-12 flex flex-col-reverse md:flex-row items-center gap-4 w-full md:w-auto">
              <button
                onClick={handleSkip}
                className="w-full md:w-auto px-6 py-4 text-slate-500 font-medium hover:text-slate-800 transition-colors text-center"
              >
                {t('onboarding.action.skip')}
              </button>

              <button
                onClick={handleNext}
                className="w-full md:w-auto group relative px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 overflow-hidden"
              >
                <span className="relative z-10">{step === 4 ? t('onboarding.action.start') : t('onboarding.action.next')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
