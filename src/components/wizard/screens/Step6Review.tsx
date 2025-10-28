import { CheckCircle, Router, Network, Shield, MapPin, Gauge } from 'lucide-react';
import { WizardState } from '../../../hooks/useWizard';

interface Step6ReviewProps {
  wizard: WizardState;
  onPrevious: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function Step6Review({ wizard, onPrevious, onSubmit, isSubmitting = false }: Step6ReviewProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <CheckCircle className="w-16 h-16 text-brand-blue mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Review Configuration</h2>
        <p className="text-gray-600">Verify your settings before creating the connection</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="p-6 border-2 border-gray-200 rounded-xl bg-white">
          <div className="flex items-center space-x-3 mb-4">
            <Router className="w-5 h-5 text-brand-blue" />
            <h3 className="text-lg font-semibold text-gray-900">Router Name</h3>
          </div>
          <p className="text-gray-700 ml-8">{wizard.routerName}</p>
        </div>

        <div className="p-6 border-2 border-gray-200 rounded-xl bg-white">
          <div className="flex items-center space-x-3 mb-4">
            <Network className="w-5 h-5 text-brand-blue" />
            <h3 className="text-lg font-semibold text-gray-900">Connection Type</h3>
          </div>
          <p className="text-gray-700 ml-8">{wizard.connectionType}</p>
        </div>

        <div className="p-6 border-2 border-gray-200 rounded-xl bg-white">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-5 h-5 text-brand-blue" />
            <h3 className="text-lg font-semibold text-gray-900">Resiliency Level</h3>
          </div>
          <p className="text-gray-700 ml-8 capitalize">{wizard.resiliencyLevel} Resiliency</p>
        </div>

        <div className="p-6 border-2 border-gray-200 rounded-xl bg-white">
          <div className="flex items-center space-x-3 mb-4">
            <MapPin className="w-5 h-5 text-brand-blue" />
            <h3 className="text-lg font-semibold text-gray-900">Provider Configuration</h3>
          </div>
          <div className="ml-8 space-y-4">
            {wizard.selectedProviders.map((provider) => {
              const config = wizard.providerConfigurations[provider];
              return (
                <div key={provider} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <div className="font-semibold text-gray-900">{provider}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {config.location}
                        </span>
                        <span className="flex items-center">
                          <Gauge className="w-4 h-4 mr-1" />
                          {config.bandwidth}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-between max-w-4xl mx-auto mt-12">
        <button
          onClick={onPrevious}
          disabled={isSubmitting}
          className="px-8 py-3 border-2 border-gray-300 rounded-full font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`
            px-8 py-3 rounded-full font-semibold transition-all duration-200
            ${
              isSubmitting
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-brand-blue text-white hover:bg-brand-darkBlue shadow-md hover:shadow-lg'
            }
          `}
        >
          {isSubmitting ? 'Creating...' : 'Create Connection'}
        </button>
      </div>
    </div>
  );
}
