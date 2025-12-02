import React from 'react';
import { WizardLayout, SelectionList } from '../../components/StepWizard';
import { ResponsibilityOwner } from '../../types';

interface NewTaskStep3OwnerProps {
  t: (key: string, options?: any) => string;
  step: number;
  owner: string | null;
  setOwner: (value: string | null) => void;
  onBack: () => void;
  onNext: () => void;
}

export const NewTaskStep3Owner: React.FC<NewTaskStep3OwnerProps> = ({
  t,
  step,
  owner,
  setOwner,
  onBack,
  onNext,
}) => (
  <WizardLayout
    title={t('newTask.step3.title')}
    subtitle={t('newTask.step3.subtitle')}
    onBack={onBack}
    onNext={onNext}
    nextDisabled={!owner}
    currentStep={3}
    totalSteps={5}
  >
    <div key={step}>
      <SelectionList
        options={Object.values(ResponsibilityOwner)}
        selected={owner}
        onSelect={setOwner}
      />
      {owner && (
        <p className="mt-4 text-sm text-gray-500">
          {t('newTask.step3.boundaryReflection', {
            boundary: t(`owner.${owner as ResponsibilityOwner}`),
          })}
        </p>
      )}
    </div>
  </WizardLayout>
);
