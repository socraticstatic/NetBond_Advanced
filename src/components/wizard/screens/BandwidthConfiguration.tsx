import { useState } from 'react';
import { Gauge, Zap, Lock, AlertTriangle, Info } from 'lucide-react';
import { CloudProvider } from '../../../types/connection';
import { getProviderBandwidth, getProviderBandwidthConfig } from '../../../data/providerBandwidth';

interface BandwidthConfigurationProps {
  selectedProviders: CloudProvider[];
  selectedLocations: Record<string, string[]>;
  bandwidthSettings: Record<string, number>;
  onBandwidthChange: (key: string, value: number) => void;
  type?: string;
}

/**
 * Provider burst rules from connection-builder skill reference:
 * - AWS: Fixed only. Traffic policed - excess dropped. No burst.
 * - Azure: Burstable up to 2x via redundancy link. Free but degrades failover.
 *   Metered plan: burst data still counted per-GB. Unlimited plan: no impact.
 * - Google: Soft limit - capacity approximate. Can exceed. Not guaranteed.
 * - Oracle: Fixed only. No burst capability. Billed per port-hour.
 */
function canBurst(provider: string): boolean {
  return provider === 'Azure' || provider === 'Google';
}

function getBurstRules(provider: string): { heading: string; rules: string[]; warning?: string } {
  switch (provider) {
    case 'AWS':
      return {
        heading: 'AWS Direct Connect: Fixed bandwidth only',
        rules: [
          'Traffic policing enforced at provisioned rate',
          'Excess packets are dropped, not queued',
          'Bursty traffic may see lower throughput than steady traffic',
        ],
      };
    case 'Azure':
      return {
        heading: 'Azure ExpressRoute: Burst up to 2x provisioned',
        rules: [
          'Uses redundancy link (secondary MSEE) for overflow',
          'Burst capacity is free - no additional charge',
          'Metered plan: outbound burst data still counted per-GB',
          'Unlimited plan: burst has zero billing impact',
        ],
        warning: 'Sustained bursting degrades your failover capacity. The secondary link is meant for redundancy.',
      };
    case 'Google':
      return {
        heading: 'Google Cloud Interconnect: Soft bandwidth limit',
        rules: [
          'Attachment capacity is approximate - traffic may exceed',
          'Egress from Google limited by capacity setting',
          'Ingress to Google is not limited by capacity',
          'No guaranteed burst - depends on available capacity',
        ],
        warning: 'Google recommends configuring rate limiters on your router for strict enforcement.',
      };
    case 'Oracle':
      return {
        heading: 'Oracle FastConnect: Fixed bandwidth only',
        rules: [
          'Provisioned bandwidth is strictly enforced',
          'Can modify bandwidth after provisioning (increase/decrease)',
          'Billed per port-hour, not data transfer',
        ],
      };
    default:
      return {
        heading: 'Fixed bandwidth',
        rules: ['Provisioned bandwidth is the committed rate.'],
      };
  }
}

export function BandwidthConfiguration({
  selectedProviders,
  selectedLocations,
  bandwidthSettings,
  onBandwidthChange,
  type,
}: BandwidthConfigurationProps) {
  // Per-connection bandwidth mode (fixed or burstable)
  const [bandwidthModes, setBandwidthModes] = useState<Record<string, 'fixed' | 'burstable'>>({});
  // Which card has burst rules expanded
  const [expandedBurstRules, setExpandedBurstRules] = useState<string | null>(null);

  const connections = selectedProviders.flatMap(providerId => {
    const locations = selectedLocations[providerId] || [];
    return locations.map(location => ({
      providerId,
      location,
      key: `${providerId}-${location}`,
    }));
  });

  const totalBandwidth = connections.reduce((sum, c) => sum + (bandwidthSettings[c.key] || 1000), 0);

  const toggleMode = (key: string, providerId: string) => {
    if (!canBurst(providerId)) return;
    setBandwidthModes(prev => ({
      ...prev,
      [key]: prev[key] === 'burstable' ? 'fixed' : 'burstable',
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] text-center mb-8">
        Configure Bandwidth
      </h3>

      <div className="space-y-8">
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
            const bandwidthOptions = getProviderBandwidth(providerId);
            const option = bandwidthOptions.find(o => o.value === currentBw) || bandwidthOptions[2] || bandwidthOptions[0];
            const mode = bandwidthModes[key] || 'fixed';
            const providerCanBurst = canBurst(providerId);
            const burstRules = getBurstRules(providerId);
            const isExpanded = expandedBurstRules === key;

            return (
              <div key={key} className="border border-fw-secondary rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 bg-fw-wash border-b border-fw-secondary">
                  <p className="text-figma-sm font-semibold text-fw-heading">{providerId}</p>
                  <p className="text-figma-xs text-fw-bodyLight">{location}</p>
                </div>

                {/* Bandwidth display */}
                <div className="px-5 py-4 bg-fw-primary text-center">
                  <span className="text-figma-xl font-bold text-white">
                    {option?.label || '1 Gbps'}
                  </span>
                  {mode === 'burstable' && providerCanBurst && (
                    <span className="block text-figma-xs text-white/70 mt-1">
                      {providerId === 'Azure' ? `Burst up to ${(currentBw * 2) >= 1000 ? `${((currentBw * 2) / 1000).toFixed(0)} Gbps` : `${currentBw * 2} Mbps`}` : 'Soft limit'}
                    </span>
                  )}
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
                      {bandwidthOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Bandwidth Mode: Fixed / Burstable */}
                  <div>
                    <label className="block text-figma-xs text-fw-bodyLight mb-1.5">Bandwidth Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setBandwidthModes(prev => ({ ...prev, [key]: 'fixed' }))}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-figma-xs font-medium transition-colors ${
                          mode === 'fixed'
                            ? 'border-fw-active bg-fw-accent text-fw-link'
                            : 'border-fw-secondary bg-fw-wash text-fw-body hover:border-fw-active/50'
                        }`}
                      >
                        <Lock className="h-3.5 w-3.5" />
                        Fixed
                      </button>
                      <button
                        type="button"
                        onClick={() => providerCanBurst && toggleMode(key, providerId)}
                        disabled={!providerCanBurst}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-figma-xs font-medium transition-colors ${
                          !providerCanBurst
                            ? 'border-fw-secondary bg-fw-wash text-fw-disabled cursor-not-allowed opacity-50'
                            : mode === 'burstable'
                              ? 'border-fw-active bg-fw-accent text-fw-link'
                              : 'border-fw-secondary bg-fw-wash text-fw-body hover:border-fw-active/50'
                        }`}
                      >
                        <Zap className="h-3.5 w-3.5" />
                        Burstable
                      </button>
                    </div>

                    {/* Burst rules summary */}
                    <button
                      type="button"
                      onClick={() => setExpandedBurstRules(isExpanded ? null : key)}
                      className="mt-2 text-figma-xs text-fw-link hover:text-fw-linkHover flex items-center gap-1"
                    >
                      <Info className="h-3 w-3" />
                      {providerCanBurst
                        ? mode === 'burstable' ? 'View burst rules and billing impact' : 'Why is burstable available?'
                        : 'Why is burstable unavailable?'
                      }
                    </button>

                    {/* Expanded burst rules */}
                    {isExpanded && (
                      <div className="mt-2 p-3 rounded-lg bg-fw-wash border border-fw-secondary text-figma-xs">
                        <p className="font-semibold text-fw-heading mb-2">{burstRules.heading}</p>
                        <ul className="space-y-1 text-fw-bodyLight">
                          {burstRules.rules.map((rule, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1 h-1 rounded-full bg-fw-bodyLight mt-1.5 shrink-0" />
                              {rule}
                            </li>
                          ))}
                        </ul>
                        {burstRules.warning && (
                          <div className="mt-2 flex items-start gap-2 text-fw-warn">
                            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                            <span>{burstRules.warning}</span>
                          </div>
                        )}
                      </div>
                    )}
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
    </div>
  );
}
