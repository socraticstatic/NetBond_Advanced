import { Edit2, CheckCircle2, MapPin, Gauge, Shield, Network, Settings, Server, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CloudProvider } from '../../../types/connection';
import { BillingPreview } from '../BillingPreview';
import { wizardToDesigner } from '../../../utils/wizardToDesigner';
import { getMetroById, formatBandwidth } from '../../../data/lmccService';

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
  const navigate = useNavigate();
  const providers = config.providers || (config.provider ? [config.provider] : []);
  const isAwsLmcc = providers.includes('AWS' as CloudProvider) && config.resiliencyLevel === 'maximum' && config.type === 'Internet to Cloud';
  const lmccMetroId = isAwsLmcc ? (selectedLocations['AWS'] || [])[0] : null;
  const lmccMetro = lmccMetroId ? getMetroById(lmccMetroId) : null;
  const resiliencyLabel = config.resiliencyLevel === 'geodiversity'
    ? 'Geodiversity'
    : config.resiliencyLevel === 'maximum'
      ? (isAwsLmcc ? 'Maximum Resiliency (AWS Max)' : 'Maximum Resiliency')
      : 'Standard Resiliency';

  const totalLocations = Object.values(selectedLocations).reduce((sum, locs) => sum + locs.length, 0);
  const bandwidthEntries = Object.entries(bandwidthSettings);
  const totalBandwidth = bandwidthEntries.reduce((sum, [, bw]) => sum + bw, 0);

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="bg-fw-base rounded-xl p-6 border border-fw-secondary text-center">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-fw-link flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
        </div>
        <h3 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] mb-2">Network Configuration Complete</h3>
        <p className="text-figma-base text-fw-bodyLight">
          Your cloud router <span className="font-semibold text-fw-link">{cloudRouterName || 'Unnamed'}</span> is configured and ready for deployment.
        </p>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-fw-link" />
            <span className="text-figma-sm text-fw-body">{providers.length} Provider{providers.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-fw-link" />
            <span className="text-figma-sm text-fw-body">{totalLocations} Connection{totalLocations !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-fw-link" />
            <span className="text-figma-sm text-fw-body">
              {totalBandwidth >= 1000 ? `${(totalBandwidth / 1000).toFixed(1)} Gbps` : `${totalBandwidth} Mbps`} Total
            </span>
          </div>
        </div>
      </div>

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

              // LMCC metro display for AWS + Maximum
              if (provider === 'AWS' && isAwsLmcc && lmccMetro) {
                return (
                  <div key={provider} className="mt-3 p-4 bg-fw-accent rounded-lg border border-fw-active/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-4 w-4 text-fw-link" />
                      <p className="text-figma-sm font-semibold text-fw-heading">AWS Max Metro: {lmccMetro.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {lmccMetro.datacenters.map((dc, i) => (
                        <div key={dc} className="flex items-center gap-2 p-2 bg-fw-base rounded-lg border border-fw-secondary">
                          <Server className="h-3.5 w-3.5 text-fw-bodyLight" />
                          <div>
                            <p className="text-figma-xs font-medium text-fw-heading">{dc}</p>
                            <p className="text-figma-xs text-fw-bodyLight">Site {i + 1} - 2 IPEs</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-figma-xs text-fw-body space-y-1">
                      <p>4 hosted connections auto-provisioned across 4 Juniper MX-304 devices</p>
                      <p>Contract: {config.configuration?.lmccContractTerm === 'trial' ? 'Trial (Preview)' : config.configuration?.lmccContractTerm || 'Trial'}</p>
                      <p>Transport: {config.configuration?.lmccTransport === 'mpls' ? 'MPLS (AT&T AVPN)' : 'Internet'}</p>
                    </div>
                    <div className="mt-3 flex items-start gap-2 p-2 rounded bg-fw-warningLight border border-fw-warning">
                      <AlertTriangle className="h-3.5 w-3.5 text-fw-warning shrink-0 mt-0.5" />
                      <p className="text-figma-xs text-fw-body">
                        99.99% SLA requires AWS Enterprise Support + Well-Architected Review
                      </p>
                    </div>
                  </div>
                );
              }

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
            {isAwsLmcc ? (
              <>
                {bandwidthSettings['AWS-lmcc'] && (
                  <>
                    <ReviewRow label="Per-Path Bandwidth" value={formatBandwidth(bandwidthSettings['AWS-lmcc'])} />
                    <ReviewRow label="Total Aggregate" value={formatBandwidth(bandwidthSettings['AWS-lmcc'] * 4)} />
                    <ReviewRow label="Paths" value="4 (auto-provisioned by AT&T)" />
                    <ReviewRow label="Bandwidth Mode" value="Fixed (AWS traffic policing enforced)" />
                  </>
                )}
              </>
            ) : (
              <>
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
              </>
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

        {/* Right Column: Topology + Billing */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-6">
            {/* Mini Topology Preview */}
            <div className="bg-fw-base rounded-xl p-5 border border-fw-secondary">
              <h4 className="text-figma-sm font-semibold text-fw-heading mb-4">Network Topology</h4>
              <svg viewBox="0 0 280 200" className="w-full" style={{ minHeight: 160 }}>
                {/* AT&T Core */}
                <rect x="10" y="80" width="60" height="40" rx="8" fill="var(--color-gray-100, #f0f2f5)" stroke="var(--color-purple-600, #7c3aed)" strokeWidth="1.5" />
                <text x="40" y="104" textAnchor="middle" className="text-[8px] font-semibold" fill="var(--color-purple-600, #7c3aed)">AT&T Core</text>

                {/* Cloud Router */}
                <rect x="100" y="75" width="70" height="50" rx="10" fill="var(--color-magenta-50, #fdf2f8)" stroke="var(--color-magenta-600, #db2777)" strokeWidth="1.5" />
                <text x="135" y="97" textAnchor="middle" className="text-[7px] font-semibold" fill="var(--color-magenta-600, #db2777)">{(cloudRouterName || 'Cloud Router').substring(0, 14)}</text>
                <text x="135" y="113" textAnchor="middle" className="text-[6px]" fill="var(--color-gray-500, #878c94)">Cloud Router</text>

                {/* Connection: Core to Router */}
                <line x1="70" y1="100" x2="100" y2="100" stroke="var(--color-purple-400, #a78bfa)" strokeWidth="1.5" strokeDasharray="4 2" />

                {/* Provider Nodes */}
                {providers.map((provider, i) => {
                  const total = Math.max(providers.length, 1);
                  const yStart = 200 / (total + 1);
                  const y = yStart * (i + 1);
                  const locs = selectedLocations[provider] || [];
                  return (
                    <g key={provider}>
                      <line x1="170" y1="100" x2="210" y2={y} stroke="var(--color-cobalt-300, #93c5fd)" strokeWidth="1" />
                      <rect x="210" y={y - 15} width="60" height="30" rx="6" fill="var(--color-cobalt-50, #eff6ff)" stroke="var(--color-cobalt-400, #60a5fa)" strokeWidth="1" />
                      <text x="240" y={y - 1} textAnchor="middle" className="text-[7px] font-semibold" fill="var(--color-cobalt-700, #1d4ed8)">{provider.length > 8 ? provider.substring(0, 8) : provider}</text>
                      <text x="240" y={y + 9} textAnchor="middle" className="text-[6px]" fill="var(--color-gray-500, #878c94)">{locs.length} loc{locs.length !== 1 ? 's' : ''}</text>
                    </g>
                  );
                })}
              </svg>
            </div>

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

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <button
          onClick={() => {
            const { nodes, edges } = wizardToDesigner({
              cloudRouterName,
              providers,
              selectedLocations,
              bandwidthSettings,
              connectionType: config.type,
              resiliencyLevel: config.resiliencyLevel,
            });
            navigate('/create', {
              state: {
                mode: 'visual',
                initialNodes: nodes,
                initialEdges: edges,
              },
            });
          }}
          className="inline-flex items-center gap-2 px-6 h-10 border border-fw-secondary rounded-full text-figma-base font-medium text-fw-body hover:bg-fw-wash transition-colors"
        >
          <Settings className="h-4 w-4" />
          Edit in Network Designer
        </button>
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
