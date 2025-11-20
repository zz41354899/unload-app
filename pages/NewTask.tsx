
import React, { useState, useRef, useEffect } from 'react';
import { WizardLayout, SelectionGrid, SelectionList } from '../components/StepWizard';
import { TaskCategory, TaskWorry, ResponsibilityOwner } from '../types';
import { useAppStore } from '../store';

interface NewTaskProps {
  navigate: (page: string) => void;
}

export const NewTask: React.FC<NewTaskProps> = ({ navigate }) => {
  const { addTask, showToast } = useAppStore();
  const [step, setStep] = useState(1);
  
  const [category, setCategory] = useState<string | null>(null);
  const [customCategory, setCustomCategory] = useState<string>('');
  
  const [worry, setWorry] = useState<string | null>(null);
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
    const finalCategory = (category === TaskCategory.Other && customCategory.trim()) 
        ? customCategory.trim() 
        : category;
        
    const finalWorry = (worry === TaskWorry.Other && customWorry.trim()) 
        ? customWorry.trim() 
        : worry;

    if (finalCategory && finalWorry && owner) {
      addTask({
        category: finalCategory,
        worry: finalWorry,
        owner: owner as ResponsibilityOwner,
        controlLevel: control
      });
      showToast('課題已成功建立');
      navigate('dashboard');
    }
  };

  // Step 1: Category
  if (step === 1) {
    const isOtherSelected = category === TaskCategory.Other;
    const isValid = category && (!isOtherSelected || customCategory.trim().length > 0);

    return (
      <WizardLayout
        title="分離你的課題"
        subtitle="發生了什麼事了?"
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={!isValid}
        currentStep={1}
      >
        <div key={step}>
            <SelectionGrid
            options={Object.values(TaskCategory)}
            selected={category}
            onSelect={(val) => {
                setCategory(val);
                if (val !== TaskCategory.Other) setCustomCategory('');
            }}
            />
            {isOtherSelected && (
                <div>
                    <input
                        type="text"
                        placeholder="請輸入具體分類..."
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
    const isOtherSelected = worry === TaskWorry.Other;
    const isValid = worry && (!isOtherSelected || customWorry.trim().length > 0);

    return (
      <WizardLayout
        title="分離你的課題"
        subtitle="這讓你擔心什麼？"
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={!isValid}
        currentStep={2}
      >
        <div key={step}>
            <SelectionGrid
            options={Object.values(TaskWorry)}
            selected={worry}
            onSelect={(val) => {
                setWorry(val);
                if (val !== TaskWorry.Other) setCustomWorry('');
            }}
            />
            {isOtherSelected && (
                <div>
                    <input
                        type="text"
                        placeholder="請輸入具體擔憂..."
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
        title="分離你的課題"
        subtitle="最終後果由誰承擔？"
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
    return (
      <WizardLayout
        title="分離你的課題"
        subtitle="你對這個情況有多少控制力？"
        onBack={handleBack}
        onNext={handleSubmit}
        nextLabel="完成課題"
        currentStep={4}
      >
        <div key={step}>
            <div className="py-12 px-4">
            <div className="text-center text-6xl font-normal mb-12 text-text font-sans">
                {control}%
            </div>

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
                  e.preventDefault();
                  handleSliderChange(e.clientX);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
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
                            e.preventDefault();
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
                <span>無法控制</span>
                <span>完全控制</span>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                <h4 className="font-bold mb-2 text-sm">判斷提示：</h4>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    <li>如果只有 10-20% 能控制，通常這是「別人的課題」。</li>
                    <li>如果超過 60% 能控制，這才是你需要專注的「我的課題」。</li>
                </ul>
            </div>
            </div>
        </div>
      </WizardLayout>
    );
  }

  return null;
};
