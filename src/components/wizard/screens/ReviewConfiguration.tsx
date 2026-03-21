import { CloudProvider } from '../../../types/connection';
import { BillingPreview } from '../BillingPreview';

interface ReviewConfigurationProps {
  config: {
    provider?: CloudProvider;
    type?: string;
    bandwidth?: string;
    location?: string;
    configuration?: {
      subnet?: string;
      stackType?: 'ipv4' | 'ipv6' | 'dual';
      bfdEnabled?: boolean;
      qosClassifier?: 'best-effort' | 'out-of-contract';
      peerAsn?: 'public' | 'private' | 'global';
      l3mtu?: number;
      awsAccountId?: string;
      stagVlanId?: string;
      serviceAccessType?: 'internet' | 'l3vmp' | 'restricted';
      ddosProtection?: boolean;
      advancedMonitoring?: boolean;
    };
  };
  billingChoice: {
    planId: string;
    term: string;
    addons: string[];
  };
  onBillingChange?: (updates: any) => void;
}

export function ReviewConfiguration({ config, billingChoice, onBillingChange = () => {} }: ReviewConfigurationProps) {
  // Format the connection type to include the provider
  const formattedConnectionType = config.type === 'Internet to Cloud' && config.provider 
    ? `Internet to ${config.provider} Cloud` 
    : config.type;

  // Safe handler for billing changes
  const handleBillingChange = (updates: any) => {
    if (typeof onBillingChange === 'function') {
      onBillingChange(updates);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] text-center mb-8">Review Your Configuration</h3>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Configuration Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Configuration */}
          <div className="bg-fw-base rounded-xl p-8 border border-fw-secondary">
            <h4 className="text-figma-lg font-medium text-fw-heading tracking-[-0.03em] mb-6">Basic Configuration</h4>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-figma-sm text-fw-bodyLight">Provider</p>
                <p className="text-figma-lg font-medium text-fw-heading">{config.provider}</p>
              </div>
              <div className="space-y-2">
                <p className="text-figma-sm text-fw-bodyLight">Connection Type</p>
                <p className="text-figma-lg font-medium text-fw-heading">{formattedConnectionType}</p>
              </div>
              <div className="space-y-2">
                <p className="text-figma-sm text-fw-bodyLight">Bandwidth</p>
                <p className="text-figma-lg font-medium text-fw-heading">{config.bandwidth}</p>
              </div>
              <div className="space-y-2">
                <p className="text-figma-sm text-fw-bodyLight">Region</p>
                <p className="text-figma-lg font-medium text-fw-heading">{config.location}</p>
              </div>
            </div>
          </div>

          {/* Network Configuration */}
          <div className="bg-fw-base rounded-xl p-8 border border-fw-secondary">
            <h4 className="text-figma-lg font-medium text-fw-heading tracking-[-0.03em] mb-6">Network Configuration</h4>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-figma-sm text-fw-bodyLight">Internet Subnet</p>
                <p className="text-figma-lg font-medium text-fw-heading">
                  {config.configuration?.subnet || 'Default'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-figma-sm text-fw-bodyLight">IP Stack Type</p>
                <p className="text-figma-lg font-medium text-fw-heading">
                  {config.configuration?.stackType?.toUpperCase() || 'IPv4'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-figma-sm text-fw-bodyLight">BFD Status</p>
                <p className="text-figma-lg font-medium text-fw-heading">
                  {config.configuration?.bfdEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-figma-sm text-fw-bodyLight">QoS Classifier</p>
                <p className="text-figma-lg font-medium text-fw-heading">
                  {config.configuration?.qosClassifier || 'Best Effort'}
                </p>
              </div>
            </div>
          </div>

          {/* Service Configuration */}
          <div className="bg-fw-base rounded-xl p-8 border border-fw-secondary">
            <h4 className="text-figma-lg font-medium text-fw-heading tracking-[-0.03em] mb-6">Service Configuration</h4>
            <div className="grid grid-cols-2 gap-6">
              {config.configuration?.awsAccountId && (
                <div className="space-y-2">
                  <p className="text-figma-sm text-fw-bodyLight">AWS Account ID</p>
                  <p className="text-figma-lg font-medium text-fw-heading">
                    {config.configuration.awsAccountId}
                  </p>
                </div>
              )}
              {config.configuration?.stagVlanId && (
                <div className="space-y-2">
                  <p className="text-figma-sm text-fw-bodyLight">STAG VLAN ID</p>
                  <p className="text-figma-lg font-medium text-fw-heading">
                    {config.configuration.stagVlanId}
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-figma-sm text-fw-bodyLight">Service Access Type</p>
                <p className="text-figma-lg font-medium text-fw-heading">
                  {config.configuration?.serviceAccessType || 'Internet'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <BillingPreview
              provider={config.provider}
              type={config.type as any}
              bandwidth={config.bandwidth as any}
              location={config.location}
              configuration={config.configuration}
              selectedPlanId={billingChoice.planId}
              onPlanChange={(planId) => handleBillingChange({ ...billingChoice, planId })}
            />
          </div>
        </div>
      </div>
      
      <div className="bg-fw-accent border border-fw-active rounded-xl p-4">
        <p className="text-figma-base text-fw-linkHover">
          <strong>Note:</strong> The connection will be created in an inactive state. 
          You can activate it from the management dashboard when ready.
        </p>
      </div>
    </div>
  );
}