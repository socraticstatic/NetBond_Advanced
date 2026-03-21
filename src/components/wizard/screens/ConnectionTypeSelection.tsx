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
    type: 'DataCenter/CoLocation to Cloud',
    icon: Lock,
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
    icon: Lock,
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
  {
    type: 'Internet Direct',
    icon: Lock,
    description: 'Direct internet connectivity with advanced security features',
    color: 'teal',
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
    'DataCenter/CoLocation to Cloud': 'Direct fiber connection from your data center or colocation facility to cloud provider for maximum speed and reliability.',
    'Site to Cloud': 'Secure connectivity from branch offices or remote sites to centralized cloud services with automated failover.',
    'Internet Direct': 'Direct internet connectivity with advanced security features including DDoS protection, WAF, and traffic optimization.'
  };

  return (
    <div className="space-y-6">
      {/* Content title: 24px w700 #1d2329 */}
      <h3 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] text-center mb-8">Choose Your Connection Type</h3>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Connection Types - full width cards */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {connectionTypes.map(
              ({ type, icon: Icon, description, color, features, disabled }) => (
                <div key={type} className="relative">
                  {/* Card: full-width, rounded-2xl (r=16), min-h ~180px */}
                  <button
                    onClick={() => !disabled && onSelect(type as ConnectionType)}
                    disabled={disabled}
                    className={`
                      w-full p-6 border rounded-2xl min-h-[180px] transition-all duration-200 text-left
                      ${disabled
                        ? 'bg-fw-wash border-fw-secondary cursor-not-allowed'
                        : selectedType === type
                          ? 'border-fw-active bg-fw-base shadow-lg hover:bg-fw-primary hover:border-fw-active group/card'
                          : 'border-fw-secondary bg-fw-wash hover:border-fw-active/50'
                      }
                    `}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {/* Card icon: 32x32 */}
                        {type === 'Internet to Cloud' && providerLogo ? (
                          <img
                            src={providerLogo}
                            alt={provider}
                            className="h-8 w-8 object-contain"
                          />
                        ) : (
                          <Icon
                            className={`h-8 w-8 ${
                              disabled
                                ? 'text-fw-disabled'
                                : selectedType === type
                                  ? 'text-fw-link'
                                  : 'text-fw-body'
                            } mt-1`}
                          />
                        )}
                      </div>
                      <div className="ml-4 text-left flex-1">
                        <div className="flex items-center">
                          {/* Card title: 16px w700 #0057b8 (selected) or #1d2329 (active) or 16px w500 #878c94 (disabled) */}
                          <span
                            className={`text-figma-lg ${
                              disabled
                                ? 'font-medium text-fw-disabled'
                                : selectedType === type
                                  ? 'font-bold text-fw-link'
                                  : 'font-bold text-fw-heading'
                            }`}
                          >
                            {type}
                          </span>
                          {!disabled && (
                            <button
                              className="ml-2 text-fw-disabled hover:text-fw-body"
                              onMouseEnter={() => setShowTooltip(type)}
                              onMouseLeave={() => setShowTooltip(null)}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowTooltip(showTooltip === type ? null : type);
                              }}
                            >
                              <Info className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        {showTooltip === type && (
                          <div className="absolute z-10 w-80 px-4 py-3 bg-fw-heading text-white text-figma-base rounded-lg shadow-xl mt-2 left-0">
                            {tooltips[type]}
                          </div>
                        )}
                        {/* Card desc: 14px w500 #454b52 (active) or #878c94 (disabled) */}
                        <span className={`text-figma-base font-medium block mb-4 mt-1 ${
                          disabled ? 'text-fw-disabled' : 'text-fw-body'
                        }`}>
                          {description}
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {features.map((feature, index) => (
                            <div
                              key={index}
                              className={`flex items-center text-figma-base font-medium ${
                                disabled ? 'text-fw-disabled' : 'text-fw-body'
                              }`}
                            >
                              <Cog className="h-5 w-5 mr-2 flex-shrink-0 text-fw-disabled" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Coming Soon Badge: bg-black text-white rounded-lg, 12px w500 */}
                  {disabled && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl">
                      <span className="badge-coming-soon badge-coming-soon-dark">
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
