import { Globe, Lock, Network, Cog, Info } from 'lucide-react';
import { useState, useMemo } from 'react';
import { ConnectionType } from '../../../types/connection';
import { getAvailableConnectionTypes } from '../../../data/providerConnectionTypes';

const INTERNET_CONNECTION_TYPES = [
  {
    type: 'Internet to Cloud',
    icon: Globe,
    description: 'High-performance internet connectivity to cloud services',
    features: [
      'Dedicated bandwidth',
      'Built-in DDoS protection',
      '24/7 monitoring',
      'Auto-scaling support',
    ],
    disabled: false,
  },
  {
    type: 'Cloud to Cloud',
    icon: Network,
    description: 'Secure connectivity between cloud environments',
    features: [
      'Private backbone transit',
      'Multi-cloud routing',
      'Low-latency peering',
      'Encrypted tunnels',
    ],
    disabled: false,
  },
  {
    type: 'DataCenter/CoLocation to Cloud',
    icon: Network,
    description: 'Direct connectivity from data centers to cloud services',
    features: [
      'Cross-connect provisioning',
      'Layer 2 and Layer 3 options',
      'Sub-millisecond latency',
      'Dedicated fiber paths',
    ],
    disabled: false,
  },
  {
    type: 'VPN to Cloud',
    icon: Lock,
    description: 'Encrypted tunnel over internet. Does not use the provider\'s dedicated interconnect product.',
    features: [
      'IPSec/IKEv2 encryption',
      'Split-tunnel support',
      'Redundant endpoints',
      'Can coexist as failover alongside dedicated connections',
    ],
    disabled: false,
  },
  {
    type: 'Site to Cloud',
    icon: Lock,
    description: 'Secure branch connectivity to cloud services',
    features: [
      'SD-WAN integration',
      'Branch auto-discovery',
      'Zero-touch provisioning',
      'Automated failover',
    ],
    disabled: true,
  },
];

interface ConnectionTypeSelectionProps {
  selectedType: ConnectionType | undefined;
  provider?: string;
  providers?: string[];
  onSelect: (type: ConnectionType) => void;
}

export function ConnectionTypeSelection({
  selectedType,
  provider,
  providers = [],
  onSelect,
}: ConnectionTypeSelectionProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Filter connection types based on selected provider(s)
  const availableTypes = useMemo(() => {
    const allProviders = providers.length > 0 ? providers : provider ? [provider] : [];
    return getAvailableConnectionTypes(allProviders);
  }, [provider, providers]);

  const connectionTypes = INTERNET_CONNECTION_TYPES.map(ct => ({
    ...ct,
    // Disable types not available for selected provider(s), unless it's Site to Cloud (already disabled)
    disabled: ct.disabled || !availableTypes.includes(ct.type),
  }));

  // Provider-specific product name for each connection type
  const getProviderContext = (connType: string): string | null => {
    if (!provider) return null;
    const contexts: Record<string, Record<string, string>> = {
      'AWS': {
        'Internet to Cloud': 'Provisions an AWS Direct Connect hosted connection',
        'Cloud to Cloud': 'Uses Transit VIF on Direct Connect',
        'DataCenter/CoLocation to Cloud': 'Provisions a Dedicated Direct Connect',
        'VPN to Cloud': 'Uses AWS Site-to-Site VPN (not Direct Connect)',
      },
      'Azure': {
        'Internet to Cloud': 'Provisions an Azure ExpressRoute circuit',
        'Cloud to Cloud': 'Uses ExpressRoute Global Reach',
        'DataCenter/CoLocation to Cloud': 'Provisions ExpressRoute Direct',
        'VPN to Cloud': 'Uses Azure VPN Gateway (not ExpressRoute)',
      },
      'Google': {
        'Internet to Cloud': 'Provisions a Google Partner Interconnect',
        'Cloud to Cloud': 'Uses multiple VLAN Attachments',
        'DataCenter/CoLocation to Cloud': 'Provisions a Dedicated Interconnect',
        'VPN to Cloud': 'Uses Google Cloud VPN (not Interconnect)',
      },
      'Oracle': {
        'Internet to Cloud': 'Provisions an Oracle FastConnect virtual circuit',
        'Cloud to Cloud': 'Uses multiple FastConnect virtual circuits',
        'DataCenter/CoLocation to Cloud': 'Provisions FastConnect Direct',
        'VPN to Cloud': 'Uses OCI Site-to-Site VPN (not FastConnect)',
      },
    };
    return contexts[provider]?.[connType] || null;
  };

  const tooltips: Record<string, string> = {
    'Internet to Cloud': 'High-performance internet connectivity with dedicated bandwidth to cloud services. Includes built-in security, DDoS protection, and 24/7 monitoring.',
    'Cloud to Cloud': 'Direct private connectivity between cloud environments without traversing the public internet for enhanced security and performance.',
    'DataCenter/CoLocation to Cloud': 'Direct fiber connection from your data center or colocation facility to cloud provider for maximum speed and reliability.',
    'VPN to Cloud': 'Encrypted IPSec/IKEv2 tunnel from any site to cloud services. Supports split-tunnel, redundant endpoints, and policy-based routing.',
    'Site to Cloud': 'Secure connectivity from branch offices or remote sites to centralized cloud services with automated failover.',
  };

  return (
    <div className="space-y-6">
      {/* Content title: 24px w700 #1d2329 */}
      <h3 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] text-center mb-8">Choose Your Connection Type</h3>

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
                        {/* Connection type icon - AT&T concept, not provider */}
                          <Icon
                            className={`h-8 w-8 ${
                              disabled
                                ? 'text-fw-disabled'
                                : selectedType === type
                                  ? 'text-fw-link'
                                  : 'text-fw-body'
                            } mt-1`}
                          />
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
                          {disabled && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-[8px] text-[10px] font-medium" style={{ color: '#686e74', backgroundColor: 'rgba(104,110,116,0.16)' }}>
                              Coming Soon
                            </span>
                          )}
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
                        <span className={`text-figma-base font-medium block mb-2 mt-1 ${
                          disabled ? 'text-fw-disabled' : 'text-fw-body'
                        }`}>
                          {description}
                        </span>
                        {/* Provider-specific context from decision tree */}
                        {!disabled && getProviderContext(type) && (
                          <span className="text-figma-xs text-fw-link block mb-3">
                            {getProviderContext(type)}
                          </span>
                        )}
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

                  {/* Reserved for future badge overlays */}
                </div>
              )
            )}
          </div>
    </div>
  );
}
