import { useMemo, useEffect } from 'react';
import { Shield, ShieldCheck, Globe, Info } from 'lucide-react';
import { getResiliencyConfig, Tier, getAvailableTiers } from '../../../data/providerResiliency';

export type ResiliencyLevel = Tier | '';

interface ResiliencySelectionProps {
  resiliencyLevel: ResiliencyLevel;
  onSelect: (level: ResiliencyLevel) => void;
  provider?: string;
  providers?: string[];
  type?: string;
}

const TIER_META = {
  standard: { title: 'Standard', icon: Shield, subtitle: 'Single-site, locally redundant' },
  maximum: { title: 'Maximum', icon: ShieldCheck, subtitle: 'Maximum resilience within one metro' },
  geodiversity: { title: 'Geodiversity', icon: Globe, subtitle: 'Geo-diverse, metro-independent redundancy' },
} as const;

// VPN uses encrypted tunnels over internet, not dedicated interconnect
const VPN_TYPES = ['VPN to Cloud'];

export function ResiliencySelection({ resiliencyLevel, onSelect, provider, providers, type }: ResiliencySelectionProps) {
  const primaryProvider = provider || (providers && providers[0]) || '';
  const isVpn = VPN_TYPES.includes(type || '');

  // Auto-select Standard for VPN
  useEffect(() => {
    if (isVpn && resiliencyLevel !== 'standard') {
      onSelect('standard');
    }
  }, [isVpn]);

  const options = useMemo(() => {
    const tiers = getAvailableTiers();
    return tiers.map(tier => {
      const config = getResiliencyConfig(primaryProvider, tier);
      const meta = TIER_META[tier];
      return {
        id: tier,
        title: meta.title,
        subtitle: meta.subtitle,
        icon: meta.icon,
        providerTierName: config.providerName,
        sla: config.sla,
        description: config.architecture,
        details: config.details,
        uiLabel: config.uiLabel,
      };
    });
  }, [primaryProvider]);

  // VPN: show message, auto-select Standard
  if (isVpn) {
    return (
      <div className="space-y-6">
        <h3 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] text-center mb-2">
          Resiliency
        </h3>
        <div className="max-w-xl mx-auto">
          <div className="flex items-start gap-3 p-5 rounded-xl bg-fw-accent border border-fw-active/20">
            <Info className="h-5 w-5 text-fw-link shrink-0 mt-0.5" />
            <div>
              <p className="text-figma-sm font-semibold text-fw-heading mb-1">VPN uses encrypted tunnels over the internet</p>
              <p className="text-figma-xs text-fw-bodyLight">
                VPN to Cloud does not use the provider's dedicated interconnect product. Resiliency is managed via redundant VPN endpoints, not physical path diversity. Standard resiliency has been selected automatically.
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 border-2 border-fw-active bg-fw-primary rounded-2xl">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-white" />
              <div>
                <p className="text-figma-base font-bold text-white">Standard</p>
                <p className="text-figma-xs text-white/70">Single-site, locally redundant</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] text-center mb-2">
        Choose Your Resiliency Level
      </h3>
      {primaryProvider && (
        <p className="text-figma-base text-fw-bodyLight text-center mb-6">
          {primaryProvider} maps these to: {options.map(o => o.providerTierName).join(' / ')}
        </p>
      )}

          <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
            {options.map((option) => {
              const isSelected = resiliencyLevel === option.id;
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => onSelect(option.id)}
                  className={`
                    p-6 border-2 rounded-2xl text-left transition-all duration-200
                    ${isSelected
                      ? 'border-fw-active bg-fw-primary shadow-lg transform scale-[1.02]'
                      : 'border-fw-secondary bg-fw-wash hover:border-fw-active/50 hover:bg-fw-base'
                    }
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center mb-4
                    ${isSelected ? 'bg-white/20' : 'bg-fw-wash border border-fw-secondary'}
                  `}>
                    <Icon className={`h-6 w-6 ${isSelected ? 'text-white' : 'text-fw-body'}`} />
                  </div>

                  <h4 className={`text-figma-base font-bold mb-0.5 ${isSelected ? 'text-white' : 'text-fw-heading'}`}>
                    {option.title}
                  </h4>

                  <p className={`text-figma-xs font-medium mb-2 ${isSelected ? 'text-white/80' : 'text-fw-bodyLight'}`}>
                    {option.subtitle}
                  </p>

                  {primaryProvider && (
                    <p className={`text-figma-xs font-medium mb-2 ${isSelected ? 'text-white/90' : 'text-fw-link'}`}>
                      {primaryProvider}: {option.providerTierName}
                      {option.sla !== 'None' && option.sla !== 'No SLA' && ` - ${option.sla} SLA`}
                    </p>
                  )}

                  <p className={`text-figma-xs mb-3 ${isSelected ? 'text-white/70' : 'text-fw-bodyLight'}`}>
                    {option.description}
                  </p>

                  <ul className="space-y-1.5">
                    {option.details.map((detail, i) => (
                      <li key={i} className={`text-figma-xs flex items-center gap-2 ${isSelected ? 'text-white/60' : 'text-fw-bodyLight'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-white/50' : 'bg-fw-bodyLight'}`} />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
    </div>
  );
}
