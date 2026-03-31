import { Gauge } from 'lucide-react';
import { CloudProvider } from '../../../types/connection';
import { BillingPreview } from '../BillingPreview';

const BANDWIDTH_OPTIONS = [
  { value: 100, label: '100 Mbps' },
  { value: 500, label: '500 Mbps' },
  { value: 1000, label: '1 Gbps' },
  { value: 2000, label: '2 Gbps' },
  { value: 5000, label: '5 Gbps' },
  { value: 10000, label: '10 Gbps' },
];

interface BandwidthConfigurationProps {
  selectedProviders: CloudProvider[];
  selectedLocations: Record<string, string[]>;
  bandwidthSettings: Record<string, number>;
  onBandwidthChange: (key: string, value: number) => void;
  type?: string;
  billingChoice: {
    planId: string;
    term: string;
    addons: string[];
  };
  onBillingChange: (updates: any) => void;
}

export function BandwidthConfiguration({
  selectedProviders,
  selectedLocations,
  bandwidthSettings,
  onBandwidthChange,
  type,
  billingChoice,
  onBillingChange,
}: BandwidthConfigurationProps) {
  // Build flat list of provider-location connections
  const connections = selectedProviders.flatMap(providerId => {
    const locations = selectedLocations[providerId] || [];
    return locations.map(location => ({
      providerId,
      location,
      key: `${providerId}-${location}`,
    }));
  });

  const totalBandwidth = connections.reduce((sum, c) => sum + (bandwidthSettings[c.key] || 1000), 0);

  // Get first bandwidth value for billing preview
  const firstBandwidthKey = connections[0]?.key;
  const firstBandwidth = firstBandwidthKey ? (bandwidthSettings[firstBandwidthKey] || 1000) : undefined;
  const firstBandwidthLabel = firstBandwidth
    ? BANDWIDTH_OPTIONS.find(o => o.value === firstBandwidth)?.label
    : undefined;

  return (
    <div className="space-y-6">
      <h3 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] text-center mb-8">
        Configure Bandwidth
      </h3>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div className="text-center">
            <p className="text-figma-sm text-fw-bodyLight mt-2">
              Set bandwidth allocation for each connection
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-fw-wash border border-fw-secondary text-figma-xs font-medium text-fw-body">
                <Gauge className="h-3.5 w-3.5" />
                {connections.length} connection{connections.length !== 1 ? 's' : ''}
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-fw-primary text-white text-figma-xs font-medium">
                {totalBandwidth >= 1000
                  ? `${(totalBandwidth / 1000).toFixed(1)} Gbps`
                  : `${totalBandwidth} Mbps`
                } total
              </span>
            </div>
          </div>

          <div className={`grid gap-6 ${connections.length > 1 ? 'grid-cols-2' : 'grid-cols-1 max-w-lg mx-auto'}`}>
            {connections.map(({ providerId, location, key }) => {
              const currentBw = bandwidthSettings[key] || 1000;
              const option = BANDWIDTH_OPTIONS.find(o => o.value === currentBw) || BANDWIDTH_OPTIONS[2];

              return (
                <div key={key} className="border border-fw-secondary rounded-2xl overflow-hidden">
                  {/* Header with provider + location */}
                  <div className="px-5 py-4 bg-fw-wash border-b border-fw-secondary">
                    <p className="text-figma-sm font-semibold text-fw-heading">{providerId}</p>
                    <p className="text-figma-xs text-fw-bodyLight">{location}</p>
                  </div>

                  {/* Bandwidth display */}
                  <div className="px-5 py-4 bg-fw-primary text-center">
                    <span className="text-figma-xl font-bold text-white">{option.label}</span>
                  </div>

                  {/* Controls */}
                  <div className="p-5 space-y-4">
                    <div>
                      <label className="block text-figma-xs text-fw-bodyLight mb-1.5">Bandwidth Allocation</label>
                      <select
                        value={currentBw}
                        onChange={(e) => onBandwidthChange(key, parseInt(e.target.value))}
                        className="h-9 px-3 rounded-lg border border-fw-secondary text-figma-base bg-fw-base w-full focus:outline-none focus:border-fw-link"
                      >
                        {BANDWIDTH_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-figma-xs text-fw-bodyLight mb-1.5">Connection Priority</label>
                      <select className="h-9 px-3 rounded-lg border border-fw-secondary text-figma-base bg-fw-base w-full focus:outline-none focus:border-fw-link">
                        <option>Primary Connection</option>
                        <option>Secondary/Backup</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-figma-xs text-fw-bodyLight mb-1.5">Quality of Service</label>
                      <select className="h-9 px-3 rounded-lg border border-fw-secondary text-figma-base bg-fw-base w-full focus:outline-none focus:border-fw-link">
                        <option>Standard</option>
                        <option>Premium</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1">
          <BillingPreview
            provider={selectedProviders[0] as any}
            type={type as any}
            bandwidth={firstBandwidthLabel as any}
            selectedPlanId={billingChoice.planId}
            onPlanChange={(planId) => onBillingChange({ ...billingChoice, planId })}
          />
        </div>
      </div>
    </div>
  );
}
