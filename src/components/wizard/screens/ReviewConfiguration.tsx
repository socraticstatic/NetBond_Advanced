import { Edit2, CheckCircle2, MapPin, Gauge, Shield, Network } from 'lucide-react';
import { CloudProvider } from '../../../types/connection';
import { BillingPreview } from '../BillingPreview';

interface ReviewConfigurationProps {
  cloudRouterName?: string;
  config: {
    provider?: CloudProvider;
    providers?: CloudProvider[];
    type?: string;
    bandwidth?: string;
    location?: string;
    resiliencyLevel?: string;
    configuration?: {
      subnet?: string;
      internetSubnets?: string[];
      stackType?: 'ipv4' | 'ipv6' | 'dual';
      bfdEnabled?: boolean;
      qosClassifier?: 'best-effort' | 'out-of-contract';
      peerAsn?: 'public' | 'private' | 'global';
      l3mtu?: number;
      vifType?: string;
      serviceAccessType?: 'internet' | 'l3vmp' | 'restricted';
      ddosProtection?: boolean;
      advancedMonitoring?: boolean;
      azureSubscriptionId?: string;
      expressRouteCircuitKey?: string;
      gcpPairingKey?: string;
      gcpInterconnectType?: string;
      oracleOcid?: string;
      oracleCompartmentId?: string;
    };
  };
  selectedLocations?: Record<string, string[]>;
  bandwidthSettings?: Record<string, number>;
  billingChoice: {
    planId: string;
    term: string;
    addons: string[];
  };
  onBillingChange?: (updates: any) => void;
  onEditStep?: (step: number) => void;
}

function SectionHeader({ icon: Icon, title, step, onEdit }: { icon: any; title: string; step?: number; onEdit?: (step: number) => void }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-fw-accent rounded-lg">
          <Icon className="h-5 w-5 text-brand-blue" />
        </div>
        <h4 className="text-figma-lg font-semibold text-fw-heading tracking-[-0.03em]">{title}</h4>
      </div>
      {onEdit && step !== undefined && (
        <button
          onClick={() => onEdit(step)}
          className="inline-flex items-center gap-1 text-figma-sm font-medium text-fw-link hover:text-fw-linkHover"
        >
          <Edit2 className="h-3.5 w-3.5" />
          Edit
        </button>
      )}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string | React.ReactNode }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-fw-secondary last:border-0">
      <span className="text-figma-sm text-fw-bodyLight">{label}</span>
      <span className="text-figma-sm font-medium text-fw-heading text-right max-w-[60%]">{value}</span>
    </div>
  );
}

export function ReviewConfiguration({
  cloudRouterName,
  config,
  selectedLocations = {},
  bandwidthSettings = {},
  billingChoice,
  onBillingChange = () => {},
  onEditStep,
}: ReviewConfigurationProps) {
  const providers = config.providers || (config.provider ? [config.provider] : []);
  const resiliencyLabel = config.resiliencyLevel === 'maximum' ? 'Maximum Resiliency' : 'Local Resiliency';

  const totalLocations = Object.values(selectedLocations).reduce((sum, locs) => sum + locs.length, 0);
  const bandwidthEntries = Object.entries(bandwidthSettings);
  const totalBandwidth = bandwidthEntries.reduce((sum, [, bw]) => sum + bw, 0);

  return (
    <div className="space-y-6">
      <h3 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] text-center mb-8">Review Your Configuration</h3>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Cloud Router */}
          <div className="bg-fw-base rounded-xl p-6 border border-fw-secondary">
            <SectionHeader icon={Network} title="Cloud Router" step={0} onEdit={onEditStep} />
            <ReviewRow label="Cloud Router Name" value={cloudRouterName || 'Not named'} />
            <ReviewRow label="Resiliency" value={resiliencyLabel} />
          </div>

          {/* Providers & Locations */}
          <div className="bg-fw-base rounded-xl p-6 border border-fw-secondary">
            <SectionHeader icon={MapPin} title="Providers & Locations" step={1} onEdit={onEditStep} />
            <ReviewRow label="Providers" value={providers.join(', ') || 'None selected'} />
            <ReviewRow label="Connection Type" value={config.type || 'Not selected'} />
            <ReviewRow label="Total Locations" value={`${totalLocations} across ${providers.length} provider${providers.length !== 1 ? 's' : ''}`} />

            {providers.map(provider => {
              const locs = selectedLocations[provider] || [];
              if (locs.length === 0) return null;
              return (
                <div key={provider} className="mt-3 p-3 bg-fw-wash rounded-lg">
                  <p className="text-figma-xs font-semibold text-fw-heading mb-2">{provider}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {locs.map(loc => (
                      <span key={loc} className="inline-flex items-center gap-1 px-2 py-0.5 bg-fw-accent text-brand-blue rounded text-figma-xs font-medium">
                        <CheckCircle2 className="h-3 w-3" />
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bandwidth */}
          <div className="bg-fw-base rounded-xl p-6 border border-fw-secondary">
            <SectionHeader icon={Gauge} title="Bandwidth" step={5} onEdit={onEditStep} />
            <ReviewRow
              label="Total Bandwidth"
              value={totalBandwidth >= 1000 ? `${(totalBandwidth / 1000).toFixed(1)} Gbps` : `${totalBandwidth} Mbps`}
            />
            <ReviewRow label="Connections" value={`${bandwidthEntries.length}`} />

            {bandwidthEntries.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {bandwidthEntries.map(([key, bw]) => {
                  const [provider, location] = key.split(':');
                  const bwLabel = bw >= 1000 ? `${(bw / 1000).toFixed(1)} Gbps` : `${bw} Mbps`;
                  return (
                    <div key={key} className="flex items-center justify-between p-2 bg-fw-wash rounded text-figma-xs">
                      <span className="text-fw-body">{provider} / {location}</span>
                      <span className="font-medium text-fw-heading">{bwLabel}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Network Configuration */}
          <div className="bg-fw-base rounded-xl p-6 border border-fw-secondary">
            <SectionHeader icon={Network} title="Network Configuration" step={6} onEdit={onEditStep} />
            <ReviewRow label="IP Stack" value={(config.configuration?.stackType || 'ipv4').toUpperCase()} />
            <ReviewRow label="BFD" value={config.configuration?.bfdEnabled ? 'Enabled' : 'Disabled'} />
            <ReviewRow label="QoS Classifier" value={config.configuration?.qosClassifier || 'Best Effort'} />
            <ReviewRow label="Peer ASN" value={config.configuration?.peerAsn || 'Public'} />
            <ReviewRow label="Layer 3 MTU" value={`${config.configuration?.l3mtu || 1500}`} />

            {config.configuration?.internetSubnets && config.configuration.internetSubnets.length > 0 && (
              <ReviewRow
                label="Subnets"
                value={
                  <div className="space-y-0.5">
                    {config.configuration.internetSubnets.filter(Boolean).map((s, i) => (
                      <span key={i} className="block font-mono text-figma-xs">{s}</span>
                    ))}
                  </div>
                }
              />
            )}
          </div>

          {/* Security */}
          <div className="bg-fw-base rounded-xl p-6 border border-fw-secondary">
            <SectionHeader icon={Shield} title="Security & Monitoring" step={6} onEdit={onEditStep} />
            <ReviewRow label="DDoS Protection" value={config.configuration?.ddosProtection ? 'Enabled' : 'Disabled'} />
            <ReviewRow label="Advanced Monitoring" value={config.configuration?.advancedMonitoring ? 'Enabled' : 'Disabled'} />
          </div>

          {/* Provider-specific */}
          {config.configuration?.vifType && (
            <div className="bg-fw-base rounded-xl p-6 border border-fw-secondary">
              <SectionHeader icon={Network} title="AWS Configuration" step={6} onEdit={onEditStep} />
              <ReviewRow label="VIF Type" value={config.configuration.vifType} />
              <ReviewRow label="Service Access" value={config.configuration.serviceAccessType || 'Internet'} />
            </div>
          )}
          {config.configuration?.azureSubscriptionId && (
            <div className="bg-fw-base rounded-xl p-6 border border-fw-secondary">
              <SectionHeader icon={Network} title="Azure Configuration" step={6} onEdit={onEditStep} />
              <ReviewRow label="Subscription ID" value={config.configuration.azureSubscriptionId} />
              {config.configuration.expressRouteCircuitKey && (
                <ReviewRow label="ExpressRoute Key" value={config.configuration.expressRouteCircuitKey} />
              )}
            </div>
          )}
          {config.configuration?.gcpPairingKey && (
            <div className="bg-fw-base rounded-xl p-6 border border-fw-secondary">
              <SectionHeader icon={Network} title="Google Cloud Configuration" step={6} onEdit={onEditStep} />
              <ReviewRow label="Interconnect Type" value={config.configuration.gcpInterconnectType || 'Partner'} />
              <ReviewRow label="Pairing Key" value={config.configuration.gcpPairingKey} />
            </div>
          )}
          {config.configuration?.oracleOcid && (
            <div className="bg-fw-base rounded-xl p-6 border border-fw-secondary">
              <SectionHeader icon={Network} title="Oracle Configuration" step={6} onEdit={onEditStep} />
              <ReviewRow label="OCID" value={config.configuration.oracleOcid} />
              {config.configuration.oracleCompartmentId && (
                <ReviewRow label="Compartment" value={config.configuration.oracleCompartmentId} />
              )}
            </div>
          )}
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
              onPlanChange={(planId) => onBillingChange({ ...billingChoice, planId })}
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
