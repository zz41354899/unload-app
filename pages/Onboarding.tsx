import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Compass, Layers, Zap, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { OnboardingActions } from '../components/onboarding/OnboardingActions';

interface OnboardingProps {
  onClose?: () => void;
  navigatePage: (page: string) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onClose, navigatePage }) => {
  const { completeOnboarding, guideStep, setGuideStep } = useAppStore();
  const [step, setStep] = useState(1);
  const { t, i18n } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSkip = () => {
    completeOnboarding();
    if (onClose) {
      onClose();
    }
  };

  const handleNext = () => {
    if (guideStep === 1) {
      setGuideStep(2);
      navigatePage('new-task');
      navigate('/app/new-task');
      setStep(2);
      return;
    }

    if (guideStep === 2) {
      // 確保目前在新增探索第一步，再導回儀表板
      if (location.pathname === '/app/new-task') {
        setGuideStep(3);
        navigatePage('dashboard');
        navigate('/app/dashboard');
        setStep(3);
        return;
      }
    }

    if (guideStep === 3) {
      // 最後一步：確保在含側邊欄的畫面（/app/dashboard），結束引導
      if (location.pathname === '/app/dashboard') {
        completeOnboarding();
        if (onClose) {
          onClose();
        }
        return;
      }
    }

    if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      completeOnboarding();
      if (onClose) {
        onClose();
      }
    }
  };

  const handleBack = () => {
    // 從步驟 2 回到步驟 1：導回儀表板並同步 guideStep
    if (guideStep === 2) {
      setGuideStep(1);
      navigatePage('dashboard');
      navigate('/app/dashboard');
      setStep(1);
      return;
    }

    // 從步驟 3 回到步驟 2：導向新增探索第一步
    if (guideStep === 3) {
      setGuideStep(2);
      navigatePage('new-task');
      navigate('/app/new-task');
      setStep(2);
      return;
    }

    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  // Content for each step：使用 i18n，並沿用原本 onboarding.* 文案，這裡只取前三步作為引導
  const steps = [
    {
      id: 1,
      icon: Compass,
      title: t('onboarding.step1.title'),
      description: t('onboarding.step1.description'),
      points: undefined,
      subtext: undefined,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      id: 2,
      icon: Layers,
      title: t('onboarding.step2.title'),
      description: t('onboarding.step2.description'),
      points: [
        t('onboarding.step2.point1'),
        t('onboarding.step2.point2'),
        t('onboarding.step2.point3'),
      ],
      subtext: t('onboarding.step2.subtext'),
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
    {
      id: 3,
      icon: Sparkles,
      title: t('onboarding.step3.title'),
      description: t('onboarding.step3.description'),
      points: [
        t('onboarding.step3.point1'),
        t('onboarding.step3.point2'),
        t('onboarding.step3.point3'),
      ],
      subtext: t('onboarding.step3.subtext'),
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6 md:py-10 bg-black/60 font-sans">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl shadow-slate-200/60 px-5 py-6 md:px-10 md:py-10 flex flex-col gap-6 max-h-[90vh]">
        {/* 步驟指示 */}
        <div className="flex items-center justify-between text-xs md:text-sm text-gray-400">
          <span>
            {t('onboarding.action.start')} · {step} / 3
          </span>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`h-1.5 w-4 rounded-full transition-colors ${
                  s === step ? 'bg-slate-900' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 標題與說明 */}
        <div className="space-y-3">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug">
            {currentStep.title}
          </h1>
          {currentStep.description && (
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              {currentStep.description}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* 要點列表 */}
          {currentStep.points && (
            <ul className="space-y-2 text-sm md:text-base text-slate-700">
              {currentStep.points.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}

          {currentStep.subtext && (
            <p className="text-xs md:text-sm text-slate-400 italic">
              {currentStep.subtext}
            </p>
          )}
        </div>

        {/* 操作按鈕 */}
        <div className="pt-1 md:pt-2 border-t border-slate-100 mt-2">
          <OnboardingActions t={t} step={step} onSkip={handleSkip} onBack={handleBack} onNext={handleNext} />
        </div>
      </div>
    </div>
  );
};
