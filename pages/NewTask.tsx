
import React, { useState } from 'react';
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
  const [control, setControl] = useState<number>(100);

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

  // Animation Wrapper
  const StepWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="animate-slide-up" key={step}>
        {children}
    </div>
  );

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
        <StepWrapper>
            <SelectionGrid
            options={Object.values(TaskCategory)}
            selected={category}
            onSelect={(val) => {
                setCategory(val);
                if (val !== TaskCategory.Other) setCustomCategory('');
            }}
            />
            {isOtherSelected && (
                <div className="animate-fade-in">
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
        </StepWrapper>
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
        <StepWrapper>
            <SelectionGrid
            options={Object.values(TaskWorry)}
            selected={worry}
            onSelect={(val) => {
                setWorry(val);
                if (val !== TaskWorry.Other) setCustomWorry('');
            }}
            />
            {isOtherSelected && (
                <div className="animate-fade-in">
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
        </StepWrapper>
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
        <StepWrapper>
            <SelectionList
            options={Object.values(ResponsibilityOwner)}
            selected={owner}
            onSelect={setOwner}
            />
        </StepWrapper>
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
        <StepWrapper>
            <div className="py-12 px-4">
            <div className="text-center text-6xl font-normal mb-12 text-text font-sans animate-scale-in">
                {control}%
            </div>

            <div className="relative mb-8">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={control}
                        onChange={(e) => setControl(parseInt(e.target.value))}
                        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                    {/* Custom Thumb Logic is handled via CSS in index.html */}
                    <style>{`
                    input[type=range]::-webkit-slider-thumb {
                            height: 24px;
                            width: 24px;
                            border-radius: 50%;
                            background: #ffffff;
                            border: 2px solid #1E2A22;
                            cursor: pointer;
                            margin-top: -10px; 
                    }
                    input[type=range]::-webkit-slider-runnable-track {
                            width: 100%;
                            height: 4px;
                            cursor: pointer;
                            background: #1E2A22;
                            border-radius: 2px;
                    }
                    `}</style>
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
        </StepWrapper>
      </WizardLayout>
    );
  }

  return null;
};
