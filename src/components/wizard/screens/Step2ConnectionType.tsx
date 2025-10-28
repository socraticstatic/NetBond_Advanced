import { Globe, Lock, Network, Cog } from 'lucide-react';
import { ConnectionType } from '../../../types/connection';
import { WizardState } from '../../../hooks/useWizard';

const CONNECTION_TYPES = [
  {
    type: 'Internet to Cloud' as ConnectionType,
    icon: Globe,
    description: 'High-performance internet connectivity to cloud services',
    features: [
      'High-bandwidth dedicated internet access',
      'Low latency to major cloud providers',
      'Built-in DDoS protection',
      'Scalable bandwidth options',
    ],
    disabled: false,
  },
  {
    type: 'Cloud to Cloud' as ConnectionType,
    icon: Lock,
    description: 'Secure connectivity between cloud environments',
    features: [
      'Private secure connections',
      'Multi-cloud architecture support',
      'Enhanced data transfer speeds',
      'Reduced egress costs',
    ],
    disabled: true,
  },
  {
    type: 'VPN to Cloud' as ConnectionType,
    icon: Lock,
    description: 'Securely links your network to cloud services',
    features: [
      'Encrypted site-to-cloud VPN',
      'Managed VPN gateway',
      'Multiple tunnel support',
      'Automatic failover capability',
    ],
    disabled: true,
  },
  {
    type: 'DataCenter/CoLocation to Cloud' as ConnectionType,
    icon: Network,
    description: 'Direct connectivity from data centers to cloud services',
    features: [
      'Private dedicated connections',
      'Low latency direct peering',
      'Carrier-neutral connectivity',
      'Multiple bandwidth tiers',
    ],
    disabled: true,
  },
  {
    type: 'Site to Cloud' as ConnectionType,
    icon: Network,
    description: 'Secure branch connectivity to cloud services',
    features: [
      'SD-WAN ready infrastructure',
      'Branch office optimization',
      'Quality of Service (QoS)',
      'Centralized management',
    ],
    disabled: true,
  },
];

interface Step2ConnectionTypeProps {
  wizard: WizardState;
  onUpdateWizard: (updates: Partial<WizardState>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function Step2ConnectionType({ wizard, onUpdateWizard, onNext, onPrevious }: Step2ConnectionTypeProps) {
  const handleSelect = (type: ConnectionType) => {
    onUpdateWizard({ connectionType: type });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Connection Type</h2>
        <p className="text-gray-600">Select your connection type</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {CONNECTION_TYPES.map(({ type, icon: Icon, description, features, disabled }) => (
          <div key={type} className="relative">
            <button
              onClick={() => !disabled && handleSelect(type)}
              disabled={disabled}
              className={`
                w-full p-6 border-2 rounded-xl text-left transition-all duration-200
                ${
                  disabled
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                    : wizard.connectionType === type
                    ? 'border-brand-blue bg-brand-lightBlue shadow-lg transform scale-[1.01]'
                    : 'border-gray-200 hover:border-brand-blue/30 hover:bg-brand-lightBlue/30'
                }
              `}
            >
              <div className="flex items-start">
                <Icon
                  className={`h-8 w-8 mt-1 ${
                    wizard.connectionType === type ? 'text-brand-blue' : 'text-gray-400'
                  }`}
                />
                <div className="ml-4 flex-1">
                  <div
                    className={`text-lg font-semibold ${
                      wizard.connectionType === type ? 'text-brand-blue' : 'text-gray-900'
                    }`}
                  >
                    {type}
                  </div>
                  <div className="text-sm text-gray-600 mt-1 mb-4">{description}</div>
                  <div className="grid grid-cols-2 gap-2">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <Cog className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </button>

            {disabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[0.5px] rounded-xl">
                <span className="px-3 py-1 bg-gray-900/50 text-white text-sm font-medium rounded-full">
                  Coming Soon
                </span>
              </div>
            )}
          </div>
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
          disabled={!wizard.connectionType}
          className={`
            px-8 py-3 rounded-full font-semibold transition-all duration-200
            ${
              wizard.connectionType
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
