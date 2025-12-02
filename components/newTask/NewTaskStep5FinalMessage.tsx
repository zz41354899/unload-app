import React from 'react';
import { WizardLayout } from '../../components/StepWizard';

interface NewTaskStep5FinalMessageProps {
  t: (key: string, options?: any) => string;
  step: number;
  finalMessage: string;
  setFinalMessage: (value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export const NewTaskStep5FinalMessage: React.FC<NewTaskStep5FinalMessageProps> = ({
  t,
  step,
  finalMessage,
  setFinalMessage,
  onBack,
  onSubmit,
}) => (
  <WizardLayout
    title={t('newTask.finalMessage.label')}
    subtitle={t('newTask.finalMessage.placeholder')}
    onBack={onBack}
    onNext={onSubmit}
    nextLabel={t('newTask.step4.nextLabel')}
    nextDisabled={false}
    currentStep={5}
    totalSteps={5}
  >
    <div key={step}>
      <textarea
        value={finalMessage}
        onChange={(e) => setFinalMessage(e.target.value)}
        placeholder={t('newTask.finalMessage.placeholder')}
        className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white text-text placeholder-gray-300 resize-none min-h-[96px]"
      />
    </div>
  </WizardLayout>
);
