import { Shield, ShieldCheck } from 'lucide-react';
import { WizardState } from '../../../hooks/useWizard';

const RESILIENCY_OPTIONS = [
  {
    id: 'local' as const,
    name: 'Local Resiliency',
    icon: Shield,
    description: 'Single path with local redundancy',
  },
  {
    id: 'maximum' as const,
    name: 'Maximum Resiliency',
    icon: ShieldCheck,
    description: 'Multiple paths with full redundancy',
  },
];

interface Step4ResiliencySelectionProps {
  wizard: WizardState;
  onUpdateWizard: (updates: Partial<WizardState>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function Step4ResiliencySelection({
  wizard,
  onUpdateWizard,
  onNext,
  onPrevious,
}: Step4ResiliencySelectionProps) {
  const handleSelect = (level: 'local' | 'maximum') => {
    onUpdateWizard({ resiliencyLevel: level });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Resiliency Level</h2>
        <p className="text-gray-600">Choose your connection resiliency</p>
      </div>

      <div className="max-w-3xl mx-auto grid grid-cols-2 gap-6">
        {RESILIENCY_OPTIONS.map(({ id, name, icon: Icon, description }) => (
          <button
            key={id}
            onClick={() => handleSelect(id)}
            className={`
              p-8 border-2 rounded-xl text-center transition-all duration-200
              ${
                wizard.resiliencyLevel === id
                  ? 'border-brand-blue bg-brand-lightBlue shadow-lg transform scale-[1.02]'
                  : 'border-gray-200 hover:border-brand-blue/30 hover:bg-brand-lightBlue/30'
              }
            `}
          >
            <Icon
              className={`h-12 w-12 mx-auto mb-4 ${
                wizard.resiliencyLevel === id ? 'text-brand-blue' : 'text-gray-400'
              }`}
            />
            <div
              className={`text-lg font-semibold mb-2 ${
                wizard.resiliencyLevel === id ? 'text-brand-blue' : 'text-gray-900'
              }`}
            >
              {name}
            </div>
            <div className="text-sm text-gray-600">{description}</div>
          </button>
        ))}
      </div>

      <div className="flex justify-between max-w-3xl mx-auto mt-12">
        <button
          onClick={onPrevious}
          className="px-8 py-3 border-2 border-gray-300 rounded-full font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!wizard.resiliencyLevel}
          className={`
            px-8 py-3 rounded-full font-semibold transition-all duration-200
            ${
              wizard.resiliencyLevel
                ? 'bg-brand-blue text-white hover:bg-brand-darkBlue shadow-md hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Next
        </button>
      </div>
    </div>
  );
}
