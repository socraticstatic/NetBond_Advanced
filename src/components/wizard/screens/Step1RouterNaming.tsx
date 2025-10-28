import { Router } from 'lucide-react';
import { WizardState } from '../../../hooks/useWizard';

interface Step1RouterNamingProps {
  wizard: WizardState;
  onUpdateWizard: (updates: Partial<WizardState>) => void;
  onNext: () => void;
}

export function Step1RouterNaming({ wizard, onUpdateWizard, onNext }: Step1RouterNamingProps) {
  const handleNext = () => {
    if (wizard.routerName.trim()) {
      onNext();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && wizard.routerName.trim()) {
      handleNext();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Router Name</h2>
        <p className="text-gray-600">Enter a name for your router</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-3 mb-4">
          <Router className="w-6 h-6 text-brand-blue" />
          <label className="text-lg font-semibold text-gray-900">Router Name</label>
        </div>

        <input
          type="text"
          value={wizard.routerName}
          onChange={(e) => onUpdateWizard({ routerName: e.target.value })}
          onKeyPress={handleKeyPress}
          placeholder="e.g., Production-East-Router-01"
          className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue hover:border-gray-400 transition-all duration-200 text-lg"
          autoFocus
        />
      </div>

      <div className="flex justify-end max-w-2xl mx-auto mt-12">
        <button
          onClick={handleNext}
          disabled={!wizard.routerName.trim()}
          className={`
            px-8 py-3 rounded-full font-semibold transition-all duration-200
            ${
              wizard.routerName.trim()
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
