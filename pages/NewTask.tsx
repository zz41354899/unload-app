
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { WizardLayout, SelectionGrid, SelectionList, MultiSelectGrid } from '../components/StepWizard';
import { TaskCategory, TaskWorry, ResponsibilityOwner } from '../types';
import { useAppStore } from '../store';
import { getQuoteByControlLevel } from '../lib/quotes';
import { getControlLevelSuggestion, isControlLevelValid, getControlLevelWarning, getControlLevelAdvice } from '../lib/controlLevelSuggestion';
import { CheckCircle, ArrowRight, Brain, AlertCircle } from 'lucide-react';

interface NewTaskProps {
  navigate: (page: string) => void;
}

export const NewTask: React.FC<NewTaskProps> = ({ navigate }) => {
  const { addTask, showToast, openNps } = useAppStore();
  const [step, setStep] = useState(1);
  const [resultQuote, setResultQuote] = useState<string>('');
  const { t } = useTranslation();
  
  const [categories, setCategories] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState<string>('');
  
  const [worries, setWorries] = useState<string[]>([]);
  const [customWorry, setCustomWorry] = useState<string>('');
  
  const [owner, setOwner] = useState<string | null>(null);
  const [control, setControl] = useState<number>(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const pendingValueRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // 處理滑桿拖曳 - 使用 requestAnimationFrame 優化性能
  const handleSliderChange = (clientX: number) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    pendingValueRef.current = Math.round(percentage);

    // 使用 RAF 批量更新，避免頻繁重新渲染
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      setControl(pendingValueRef.current);
      rafRef.current = null;
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        handleSliderChange(e.clientX);
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingRef.current && e.touches.length > 0) {
        e.preventDefault();
        handleSliderChange(e.touches[0].clientX);
      }
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => {
    if (step === 1) navigate('dashboard');
    else setStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    // Determine final values: use custom input if '其他' is selected
    let finalCategories = [...categories];
    if (categories.includes(TaskCategory.Other) && customCategory.trim()) {
      finalCategories = finalCategories.filter(c => c !== TaskCategory.Other);
      finalCategories.push(customCategory.trim());
    }
    
    let finalWorries = [...worries];
    if (worries.includes(TaskWorry.Other) && customWorry.trim()) {
      finalWorries = finalWorries.filter(w => w !== TaskWorry.Other);
      finalWorries.push(customWorry.trim());
    }

    if (finalCategories.length > 0 && finalWorries.length > 0 && owner) {
      // 獲取控制力建議
      const suggestion = getControlLevelSuggestion(finalCategories, finalWorries, owner);
      
      // 檢查控制力是否符合建議
      if (!isControlLevelValid(control, suggestion)) {
        showToast(t('newTask.error.controlInvalid'), 'error');
        return;
      }

      addTask({
        category: finalCategories.length === 1 ? finalCategories[0] : finalCategories,
        worry: finalWorries.length === 1 ? finalWorries[0] : finalWorries,
        owner: owner as ResponsibilityOwner,
        controlLevel: control
      });
      // 根據掌控力獲取語錄
      const quote = getQuoteByControlLevel(control);
      setResultQuote(quote);
      setStep(5); // 進入結果頁面
    }
  };

  // Step 1: Category
  if (step === 1) {
    const isOtherSelected = categories.includes(TaskCategory.Other);
    const isValid = categories.length > 0 && (!isOtherSelected || customCategory.trim().length > 0);

    return (
      <WizardLayout
        title={t('newTask.step1.title')}
        subtitle={t('newTask.step1.subtitle')}
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={!isValid}
        currentStep={1}
      >
        <div key={step}>
            <MultiSelectGrid
            options={Object.values(TaskCategory)}
            selected={categories}
            onSelect={(vals) => {
                setCategories(vals);
                if (!vals.includes(TaskCategory.Other)) setCustomCategory('');
            }}
            />
            {isOtherSelected && (
                <div>
                    <input
                        type="text"
                        placeholder={t('newTask.step1.customPlaceholder')}
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="w-full mt-4 p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white text-text placeholder-gray-300"
                        autoFocus
                    />
                </div>
            )}
        </div>
      </WizardLayout>
    );
  }

  // Step 2: Worry
  if (step === 2) {
    const isOtherSelected = worries.includes(TaskWorry.Other);
    const isValid = worries.length > 0 && (!isOtherSelected || customWorry.trim().length > 0);

    return (
      <WizardLayout
        title={t('newTask.step2.title')}
        subtitle={t('newTask.step2.subtitle')}
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={!isValid}
        currentStep={2}
      >
        <div key={step}>
            <MultiSelectGrid
            options={Object.values(TaskWorry)}
            selected={worries}
            onSelect={(vals) => {
                setWorries(vals);
                if (!vals.includes(TaskWorry.Other)) setCustomWorry('');
            }}
            />
            {isOtherSelected && (
                <div>
                    <input
                        type="text"
                        placeholder={t('newTask.step2.customPlaceholder')}
                        value={customWorry}
                        onChange={(e) => setCustomWorry(e.target.value)}
                        className="w-full mt-4 p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white text-text placeholder-gray-300"
                        autoFocus
                    />
                </div>
            )}
        </div>
      </WizardLayout>
    );
  }

  // Step 3: Owner
  if (step === 3) {
    return (
      <WizardLayout
        title={t('newTask.step3.title')}
        subtitle={t('newTask.step3.subtitle')}
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={!owner}
        currentStep={3}
      >
        <div key={step}>
            <SelectionList
            options={Object.values(ResponsibilityOwner)}
            selected={owner}
            onSelect={setOwner}
            />
        </div>
      </WizardLayout>
    );
  }

  // Step 4: Control Slider
  if (step === 4) {
    const suggestion = getControlLevelSuggestion(categories, worries, owner);
    const isValid = isControlLevelValid(control, suggestion);
    const warning = getControlLevelWarning(control, suggestion);
    const advice = getControlLevelAdvice(suggestion);

    return (
      <WizardLayout
        title={t('newTask.step4.title')}
        subtitle={t('newTask.step4.subtitle')}
        onBack={handleBack}
        onNext={handleSubmit}
        nextLabel={t('newTask.step4.nextLabel')}
        nextDisabled={!isValid}
        currentStep={4}
      >
        <div key={step}>
            <div className="py-12 px-4">
            <div className="text-center text-6xl font-normal mb-12 text-text font-sans">
                {control}%
            </div>

            {/* 建議範圍提示 */}
            {advice && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800">{advice}</p>
              </div>
            )}

            {/* 警告訊息 */}
            {warning && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">{warning}</p>
              </div>
            )}

            <div className="mb-12">
              {/* 刻度標記 */}
              <div className="flex justify-between text-xs text-gray-400 mb-2 px-1">
                {[0, 25, 50, 75, 100].map((mark) => (
                  <span key={mark}>{mark}</span>
                ))}
              </div>

              <div 
                ref={sliderRef}
                className="relative h-10 flex items-center cursor-pointer group select-none"
                onClick={(e) => {
                  handleSliderChange(e.clientX);
                }}
                onMouseDown={(e) => {
                  handleMouseDown();
                }}
                onTouchStart={(e) => {
                  if (e.touches.length > 0) {
                    handleMouseDown();
                    handleSliderChange(e.touches[0].clientX);
                  }
                }}
              >
                      {/* 刻度線 */}
                      <div className="absolute left-0 right-0 h-2 flex pointer-events-none">
                        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((mark) => (
                          <div
                            key={mark}
                            className="absolute w-px h-1 bg-gray-300"
                            style={{ left: `${mark}%`, transform: 'translateX(-50%)' }}
                          />
                        ))}
                      </div>

                      {/* Visual Background Track (視覺軌道) */}
                      <div className="absolute left-0 right-0 h-2 bg-gray-200 rounded-full pointer-events-none">
                          <div 
                              className="h-full bg-accent rounded-full"
                              style={{ width: `${control}%` }}
                          ></div>
                      </div>
                      
                      {/* Custom Thumb Visual (跟隨數值的視覺圓點) */}
                      <div 
                          className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-accent rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110"
                          style={{ 
                              left: `calc(${control}% - 14px)`,
                              transition: isDraggingRef.current ? 'none' : 'all 75ms ease-out'
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleMouseDown();
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            if (e.touches.length > 0) {
                              handleMouseDown();
                              handleSliderChange(e.touches[0].clientX);
                            }
                          }}
                      >
                          <div className="w-3 h-3 bg-white rounded-full opacity-40"></div>
                      </div>
              </div>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mb-12">
                <span>{t('newTask.step4.scaleMin')}</span>
                <span>{t('newTask.step4.scaleMax')}</span>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                <h4 className="font-bold mb-2 text-sm">{t('newTask.step4.hintTitle')}</h4>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                    <li>{t('newTask.step4.hint1')}</li>
                    <li>{t('newTask.step4.hint2')}</li>
                    <li>{t('newTask.step4.hint3')}</li>
                </ul>
            </div>
            </div>
        </div>
      </WizardLayout>
    );
  }

  // Step 5: Result with Quote
  if (step === 5) {
    // 獲取課題相關的回饋訊息
    const getResultFeedback = (): string => {
      const categoryLabels = (Array.isArray(categories) ? categories : [categories]).map((cat) =>
        cat ? t(`taskCategory.${cat}`) : ''
      );
      const worryLabels = (Array.isArray(worries) ? worries : [worries]).map((worry) =>
        worry ? t(`taskWorry.${worry}`) : ''
      );
      const categoryStr = categoryLabels.filter(Boolean).join('\u3001');
      const worryStr = worryLabels.filter(Boolean).join('\u3001');
      
      if (control < 20) {
        return t('newTask.result.feedback.low', { category: categoryStr, worry: worryStr, control });
      } else if (control < 60) {
        return t('newTask.result.feedback.mid', { category: categoryStr, worry: worryStr, control });
      } else {
        return t('newTask.result.feedback.high', { category: categoryStr, worry: worryStr, control });
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-background">
        <div className="max-w-2xl w-full">
          {/* Success Card */}
          <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-xl border border-gray-100">
            {/* Success Icon */}
            <div className="flex justify-center mb-6 md:mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                <CheckCircle className="w-16 md:w-20 h-16 md:h-20 text-primary relative" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-1 md:mb-2 text-text">{t('newTask.result.title')}</h1>
            <p className="text-center text-gray-500 text-sm md:text-base mb-6 md:mb-12">{t('newTask.result.subtitle')}</p>

            {/* Quote Section */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl md:rounded-2xl p-4 md:p-8 mb-6 md:mb-12 border border-primary/10">
              <p className="text-center text-base md:text-lg leading-relaxed text-text font-medium">
                "{resultQuote}"
              </p>
            </div>

            {/* Result Feedback */}
            <div className="bg-blue-50 rounded-lg md:rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-blue-100">
              <p className="text-xs md:text-sm text-blue-900 leading-relaxed">
                {getResultFeedback()}
              </p>
            </div>

            {/* Reflection Prompt */}
            <div className="bg-gray-50 rounded-lg md:rounded-xl p-4 md:p-6 mb-8 md:mb-12">
              <div className="flex gap-2 mb-2">
                <Brain className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs md:text-sm text-gray-600"><strong>{t('newTask.result.reflectionTitle')}</strong></p>
              </div>
              <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                {control < 20 
                  ? t('newTask.result.reflection.low')
                  : control < 60
                  ? t('newTask.result.reflection.mid')
                  : t('newTask.result.reflection.high')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 md:gap-3">
              <button 
                onClick={() => {
                  navigate('journal');
                }}
                className="w-full bg-primary text-white px-4 md:px-6 py-3 md:py-4 rounded-lg md:rounded-xl hover:bg-[#1e2b1e] transition-all font-medium flex items-center justify-center gap-2 shadow-lg shadow-primary/20 text-sm md:text-base"
              >
                <CheckCircle className="w-4 md:w-5 h-4 md:h-5" />
                {t('newTask.result.toJournal')}
              </button>
              <button 
                onClick={() => {
                  navigate('dashboard');
                }}
                className="w-full bg-gray-100 text-text px-4 md:px-6 py-3 md:py-4 rounded-lg md:rounded-xl hover:bg-gray-200 transition-all font-medium flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <ArrowRight className="w-4 md:w-5 h-4 md:h-5" />
                {t('newTask.result.toDashboard')}
              </button>
            </div>
          </div>
        </div>

      </div>
    );
  }

  return null;
};
