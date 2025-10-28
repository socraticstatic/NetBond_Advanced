import { MapPin, Gauge } from 'lucide-react';
import { CloudProvider, LocationOption, BandwidthOption } from '../../../types/connection';
import { WizardState } from '../../../hooks/useWizard';

const LOCATIONS: LocationOption[] = ['US East', 'US West', 'EU West', 'Asia Pacific'];
const BANDWIDTH_OPTIONS: BandwidthOption[] = ['100 Mbps', '500 Mbps', '1 Gbps', '10 Gbps', '100 Gbps'];

interface Step5LocationBandwidthProps {
  wizard: WizardState;
  onUpdateProviderConfig: (provider: CloudProvider, updates: { location?: LocationOption; bandwidth?: BandwidthOption }) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function Step5LocationBandwidth({
  wizard,
  onUpdateProviderConfig,
  onNext,
  onPrevious,
}: Step5LocationBandwidthProps) {
  const allConfigured = wizard.selectedProviders.every(
    (provider) =>
      wizard.providerConfigurations[provider]?.location &&
      wizard.providerConfigurations[provider]?.bandwidth
  );

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Configuration</h2>
        <p className="text-gray-600">Configure location and bandwidth for each provider</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {wizard.selectedProviders.map((provider) => {
          const config = wizard.providerConfigurations[provider] || { location: '', bandwidth: '' };

          return (
            <div
              key={provider}
              className="p-6 border-2 border-gray-200 rounded-xl bg-white"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">{provider}</h3>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <MapPin className="w-5 h-5 text-brand-blue" />
                    <label className="text-sm font-semibold text-gray-900">Location</label>
                  </div>
                  <select
                    value={config.location}
                    onChange={(e) =>
                      onUpdateProviderConfig(provider, {
                        location: e.target.value as LocationOption,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue hover:border-gray-400 transition-all duration-200"
                  >
                    <option value="">Select location</option>
                    {LOCATIONS.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Gauge className="w-5 h-5 text-brand-blue" />
                    <label className="text-sm font-semibold text-gray-900">Bandwidth</label>
                  </div>
                  <select
                    value={config.bandwidth}
                    onChange={(e) =>
                      onUpdateProviderConfig(provider, {
                        bandwidth: e.target.value as BandwidthOption,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue hover:border-gray-400 transition-all duration-200"
                  >
                    <option value="">Select bandwidth</option>
                    {BANDWIDTH_OPTIONS.map((bandwidth) => (
                      <option key={bandwidth} value={bandwidth}>
                        {bandwidth}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between max-w-4xl mx-auto mt-12">
        <button
          onClick={onPrevious}
          className="px-8 py-3 border-2 border-gray-300 rounded-full font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!allConfigured}
          className={`
            px-8 py-3 rounded-full font-semibold transition-all duration-200
            ${
              allConfigured
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
