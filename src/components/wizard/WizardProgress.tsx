import { Check } from 'lucide-react';

interface WizardProgressProps {
  currentStep: number;
  totalSteps?: number;
}

const STEP_LABELS = [
  'Router Name',
  'Connection Type',
  'Provider Selection',
  'Resiliency',
  'Configuration',
  'Review'
];

export function WizardProgress({ currentStep, totalSteps = 6 }: WizardProgressProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200
                  ${
                    step < currentStep
                      ? 'bg-brand-blue text-white'
                      : step === currentStep
                      ? 'bg-brand-blue text-white ring-4 ring-brand-lightBlue'
                      : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {step < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step
                )}
              </div>
              <div
                className={`
                  mt-2 text-xs font-medium text-center
                  ${step <= currentStep ? 'text-brand-blue' : 'text-gray-400'}
                `}
              >
                {STEP_LABELS[index]}
              </div>
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`
                  h-0.5 flex-1 mx-2 transition-all duration-200
                  ${step < currentStep ? 'bg-brand-blue' : 'bg-gray-200'}
                `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
