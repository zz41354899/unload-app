import React from 'react';
import { WizardLayout } from '../../components/StepWizard';

interface NewTaskStep4PerspectiveProps {
  t: (key: string, options?: any) => string;
  step: number;
  selectedPerspective: 'reality' | 'distance' | 'value' | 'observe' | null;
  setSelectedPerspective: (value: 'reality' | 'distance' | 'value' | 'observe' | null) => void;
  reflectionReality: string;
  setReflectionReality: (value: string) => void;
  reflectionDistance: string;
  setReflectionDistance: (value: string) => void;
  reflectionValue: string;
  setReflectionValue: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export const NewTaskStep4Perspective: React.FC<NewTaskStep4PerspectiveProps> = ({
  t,
  step,
  selectedPerspective,
  setSelectedPerspective,
  reflectionReality,
  setReflectionReality,
  reflectionDistance,
  setReflectionDistance,
  reflectionValue,
  setReflectionValue,
  onBack,
  onNext,
}) => (
  <WizardLayout
    title={t('newTask.step4.title')}
    subtitle={t('newTask.step4.subtitle')}
    onBack={onBack}
    onNext={onNext}
    nextLabel={t('wizard.next')}
    nextDisabled={!selectedPerspective}
    currentStep={4}
    totalSteps={5}
  >
    <div key={step}>
      <div className="py-4 px-4">
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setSelectedPerspective('reality')}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                selectedPerspective === 'reality'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold mb-1">{t('newTask.perspective.reality.title')}</div>
              <div className="text-gray-500 text-xs">{t('newTask.perspective.reality.q1')}</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPerspective('distance')}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                selectedPerspective === 'distance'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold mb-1">{t('newTask.perspective.distance.title')}</div>
              <div className="text-gray-500 text-xs">{t('newTask.perspective.distance.q1')}</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPerspective('value')}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                selectedPerspective === 'value'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold mb-1">{t('newTask.perspective.value.title')}</div>
              <div className="text-gray-500 text-xs">{t('newTask.perspective.value.q1')}</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPerspective('observe')}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                selectedPerspective === 'observe'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold mb-1">{t('newTask.perspective.observe.title')}</div>
              <div className="text-gray-500 text-xs">{t('newTask.perspective.observe.q1')}</div>
            </button>
          </div>

          {selectedPerspective === 'reality' && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('newTask.perspective.reality.title')}
              </label>
              <textarea
                value={reflectionReality}
                onChange={(e) => setReflectionReality(e.target.value)}
                placeholder={t('newTask.perspective.reality.q2')}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none min-h-[96px]"
              />
            </div>
          )}

          {selectedPerspective === 'distance' && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('newTask.perspective.distance.title')}
              </label>
              <textarea
                value={reflectionDistance}
                onChange={(e) => setReflectionDistance(e.target.value)}
                placeholder={t('newTask.perspective.distance.q2')}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none min-h-[96px]"
              />
            </div>
          )}

          {selectedPerspective === 'value' && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('newTask.perspective.value.title')}
              </label>
              <textarea
                value={reflectionValue}
                onChange={(e) => setReflectionValue(e.target.value)}
                placeholder={t('newTask.perspective.value.q2')}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none min-h-[96px]"
              />
            </div>
          )}

          {selectedPerspective && (
            <p className="mt-4 text-xs md:text-sm text-gray-500">
              {selectedPerspective === 'reality' && t('newTask.perspective.reality.hint')}
              {selectedPerspective === 'distance' && t('newTask.perspective.distance.hint')}
              {selectedPerspective === 'value' && t('newTask.perspective.value.hint')}
              {selectedPerspective === 'observe' && t('newTask.perspective.observe.hint')}
            </p>
          )}
        </div>
      </div>
    </div>
  </WizardLayout>
);
