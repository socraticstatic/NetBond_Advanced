import { useMemo } from 'react';
import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import { BillingPreview } from '../BillingPreview';
import { getResiliencyConfig } from '../../../data/providerResiliency';

export type ResiliencyLevel = 'local' | 'geo' | 'maximum' | '';

interface ResiliencySelectionProps {
  resiliencyLevel: ResiliencyLevel;
  onSelect: (level: ResiliencyLevel) => void;
  provider?: string;
  providers?: string[];
  type?: string;
  billingChoice: {
    planId: string;
    term: string;
    addons: string[];
  };
  onBillingChange: (updates: any) => void;
}

const TIER_META = {
  local: { title: 'Local Resiliency', icon: Shield },
  geo: { title: 'Geographic Resiliency', icon: ShieldAlert },
  maximum: { title: 'Maximum Resiliency', icon: ShieldCheck },
} as const;

export function ResiliencySelection({ resiliencyLevel, onSelect, provider, providers, type, billingChoice, onBillingChange }: ResiliencySelectionProps) {
  // Use the first selected provider for display, or fall back
  const primaryProvider = provider || (providers && providers[0]) || '';

  const options = useMemo(() => {
    const tiers: Array<'local' | 'geo' | 'maximum'> = ['local', 'geo', 'maximum'];
    return tiers.map(tier => {
      const config = getResiliencyConfig(primaryProvider, tier);
      const meta = TIER_META[tier];
      return {
        id: tier,
        title: meta.title,
        icon: meta.icon,
        providerTierName: config.providerName,
        sla: config.sla,
        description: config.architecture,
        details: config.details,
      };
    });
  }, [primaryProvider]);

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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
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

                  <h4 className={`text-figma-base font-bold mb-1 ${isSelected ? 'text-white' : 'text-fw-heading'}`}>
                    {option.title}
                  </h4>

                  {primaryProvider && (
                    <p className={`text-figma-xs font-medium mb-2 ${isSelected ? 'text-white/90' : 'text-fw-link'}`}>
                      {primaryProvider}: {option.providerTierName}
                      {option.sla !== 'None' && ` - ${option.sla} SLA`}
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

        <div className="lg:col-span-1">
          <BillingPreview
            provider={provider as any}
            type={type as any}
            redundancy={resiliencyLevel === 'maximum' || resiliencyLevel === 'geo'}
            selectedPlanId={billingChoice.planId}
            onPlanChange={(planId) => onBillingChange({ ...billingChoice, planId })}
          />
        </div>
      </div>
    </div>
  );
}
