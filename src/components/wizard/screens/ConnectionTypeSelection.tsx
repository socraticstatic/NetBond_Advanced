import { Globe, Lock, Network, Cog, Info } from 'lucide-react';
import { useState } from 'react';
import { ConnectionType } from '../../../types/connection';
import { BillingPreview } from '../BillingPreview';

const INTERNET_CONNECTION_TYPES = [
  {
    type: 'Internet to Cloud',
    icon: Globe,
    description: 'High-performance internet connectivity to cloud services',
    color: 'blue',
    features: [
      'Features coming soon',
      'Features coming soon',
      'Features coming soon',
      'Features coming soon',
    ],
    disabled: false,
  },
  {
    type: 'Cloud to Cloud',
    icon: Lock,
    description: 'Secure connectivity between cloud environments',
    color: 'green',
    features: [
      'Features coming soon',
      'Features coming soon',
      'Features coming soon',
      'Features coming soon',
    ],
    disabled: true,
  },
  {
    type: 'VPN to Cloud',
    icon: Lock,
    description: 'Securely links your network to cloud services',
    color: 'green',
    features: [
      'Features coming soon',
      'Features coming soon',
      'Features coming soon',
      'Features coming soon',
    ],
    disabled: true,
  },
  {
    type: 'DataCenter/CoLocation to Cloud',
    icon: Network,
    description: 'Direct connectivity from data centers to cloud services',
    color: 'purple',
    features: [
      'Features coming soon',
      'Features coming soon',
      'Features coming soon',
      'Features coming soon',
    ],
    disabled: true,
  },
  {
    type: 'Site to Cloud',
    icon: Network,
    description: 'Secure branch connectivity to cloud services',
    color: 'indigo',
    features: [
      'Features coming soon',
      'Features coming soon',
      'Features coming soon',
      'Features coming soon',
    ],
    disabled: true,
  },
];

interface ConnectionTypeSelectionProps {
  selectedType: ConnectionType | undefined;
  provider?: string;
  onSelect: (type: ConnectionType) => void;
  billingChoice: {
    planId: string;
    term: string;
    addons: string[];
  };
  onBillingChange: (updates: any) => void;
}

export function ConnectionTypeSelection({
  selectedType,
  provider,
  onSelect,
  billingChoice,
  onBillingChange
}: ConnectionTypeSelectionProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Use the connection types as is, without modifying the description to include provider
  const connectionTypes = INTERNET_CONNECTION_TYPES;

  const getProviderLogo = () => {
    const logos: Record<string, string> = {
      'AWS': 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
      'Azure': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg',
      'Google': 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg',
    };
    return provider ? logos[provider] : null;
  };

  const providerLogo = getProviderLogo();

  const tooltips: Record<string, string> = {
    'Internet to Cloud': 'High-performance internet connectivity with dedicated bandwidth to cloud services. Includes built-in security, DDoS protection, and 24/7 monitoring.',
    'Cloud to Cloud': 'Direct private connectivity between cloud environments without traversing the public internet for enhanced security and performance.',
    'VPN to Cloud': 'Encrypted tunnel from your network to cloud services using IPsec or SSL/TLS protocols for secure data transmission.',
    'DataCenter/CoLocation to Cloud': 'Direct fiber connection from your data center or colocation facility to cloud provider for maximum speed and reliability.',
    'Site to Cloud': 'Secure connectivity from branch offices or remote sites to centralized cloud services with automated failover.'
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 text-center mb-8">Choose Your Connection Type</h3>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Connection Types */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {connectionTypes.map(
              ({ type, icon: Icon, description, color, features, disabled }) => (
                <div key={type} className="relative">
                  <button
                    onClick={() => !disabled && onSelect(type as ConnectionType)}
                    disabled={disabled}
                    className={`
                      w-full p-6 border-2 rounded-lg wizard-card transition-all duration-200
                      ${disabled
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                        : selectedType === type
                          ? 'border-fw-active bg-fw-accent shadow-lg transform scale-[1.02]'
                          : 'border-gray-200 hover:border-fw-active hover:bg-fw-accent/50'
                      }
                    `}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {type === 'Internet to Cloud' && providerLogo ? (
                          <img
                            src={providerLogo}
                            alt={provider}
                            className="h-8 w-8 object-contain"
                          />
                        ) : (
                          <Icon
                            className={`h-8 w-8 ${
                              selectedType === type
                                ? 'text-fw-active'
                                : 'text-gray-400'
                            } mt-1`}
                          />
                        )}
                      </div>
                      <div className="ml-4 text-left flex-1">
                        <div className="flex items-center">
                          <span
                            className={`text-lg font-medium ${
                              selectedType === type
                                ? 'text-fw-active'
                                : 'text-gray-700'
                            }`}
                          >
                            {type}
                          </span>
                          <button
                            className="ml-2 text-gray-400 hover:text-gray-600"
                            onMouseEnter={() => setShowTooltip(type)}
                            onMouseLeave={() => setShowTooltip(null)}
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowTooltip(showTooltip === type ? null : type);
                            }}
                          >
                            <Info className="h-4 w-4" />
                          </button>
                        </div>
                        {showTooltip === type && (
                          <div className="absolute z-10 w-80 px-4 py-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl mt-2 left-0">
                            {tooltips[type]}
                          </div>
                        )}
                        <span className="text-sm text-gray-500 block mb-4 mt-1">
                          {description}
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center text-sm text-gray-600"
                            >
                              <Cog className="h-4 w-4 mr-2 text-gray-400" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Coming Soon Overlay */}
                  {disabled && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[0.5px] rounded-lg">
                      <span className="px-3 py-1 bg-gray-900/50 text-white text-sm font-medium rounded-full">
                        Coming Soon
                      </span>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Billing Preview */}
        <div className="lg:col-span-1">
          <BillingPreview 
            provider={provider as any} 
            type={selectedType}
            selectedPlanId={billingChoice.planId}
            onPlanChange={(planId) => onBillingChange({ ...billingChoice, planId })}
          />
        </div>
      </div>
    </div>
  );
}