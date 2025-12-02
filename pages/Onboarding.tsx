import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Feather, Layers, Zap, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OnboardingNavbar } from '../components/onboarding/OnboardingNavbar';
import { OnboardingVisual } from '../components/onboarding/OnboardingVisual';
import { OnboardingContent } from '../components/onboarding/OnboardingContent';
import { OnboardingActions } from '../components/onboarding/OnboardingActions';

interface OnboardingProps {
  navigate: (page: string) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ navigate }) => {
  const { completeOnboarding } = useAppStore();
  const routerNavigate = useNavigate();
  const [step, setStep] = useState(1);
  const { t, i18n } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const handleSkip = () => {
    completeOnboarding();
    // 同時更新舊的 currentPage 狀態與新的 URL 路由
    navigate('dashboard');
    routerNavigate('/app/dashboard');
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      completeOnboarding();
      // 完成最後一步時，同樣同步狀態與路由
      navigate('dashboard');
      routerNavigate('/app/dashboard');
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
      <OnboardingNavbar
        t={t}
        currentLanguage={i18n.language}
        isLangOpen={isLangOpen}
        onToggleLangMenu={() => setIsLangOpen((open) => !open)}
        onChangeLanguage={(lang) => {
          void i18n.changeLanguage(lang);
          setIsLangOpen(false);
        }}
      />

      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          <OnboardingVisual
            step={step}
            bg={currentStep.bg}
            color={currentStep.color}
            Icon={Icon}
          />

          <OnboardingContent
            step={step}
            currentStep={{
              title: currentStep.title,
              description: currentStep.description,
              points: currentStep.points,
              subtext: currentStep.subtext,
              color: currentStep.color,
            }}
          >
            <OnboardingActions
              t={t}
              step={step}
              onSkip={handleSkip}
              onNext={handleNext}
            />
          </OnboardingContent>
        </div>
      </div>
    </div>
  );
}
