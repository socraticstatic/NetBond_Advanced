import { Shield, ShieldCheck } from 'lucide-react';

export type ResiliencyLevel = 'local' | 'maximum' | '';

interface ResiliencySelectionProps {
  resiliencyLevel: ResiliencyLevel;
  onSelect: (level: ResiliencyLevel) => void;
}

const OPTIONS = [
  {
    id: 'local' as const,
    title: 'Local Resiliency',
    description: 'Standard connectivity with single-site redundancy. Requires at least 1 location per provider.',
    icon: Shield,
    details: ['99.9% availability SLA', 'Single-site failover', 'Cost-effective'],
  },
  {
    id: 'maximum' as const,
    title: 'Maximum Resiliency',
    description: 'Enterprise-grade connectivity with multi-site redundancy. Requires at least 2 locations per provider.',
    icon: ShieldCheck,
    details: ['99.999% availability SLA', 'Geographic failover', 'Active/Active or Active/Standby'],
  },
];

export function ResiliencySelection({ resiliencyLevel, onSelect }: ResiliencySelectionProps) {
  return (
    <div className="space-y-8">
      <h3 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] text-center mb-8">
        Choose Your Resiliency Level
      </h3>

      <div className="grid grid-cols-2 gap-8 max-w-3xl mx-auto">
        {OPTIONS.map((option) => {
          const isSelected = resiliencyLevel === option.id;
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`
                p-8 border-2 rounded-2xl text-left transition-all duration-200
                ${isSelected
                  ? 'border-fw-active bg-fw-primary shadow-lg transform scale-[1.02]'
                  : 'border-fw-secondary bg-fw-wash hover:border-fw-active/50 hover:bg-fw-base'
                }
              `}
            >
              <div className={`
                w-14 h-14 rounded-xl flex items-center justify-center mb-5
                ${isSelected ? 'bg-white/20' : 'bg-fw-wash border border-fw-secondary'}
              `}>
                <Icon className={`h-7 w-7 ${isSelected ? 'text-white' : 'text-fw-body'}`} />
              </div>

              <h4 className={`text-figma-lg font-bold mb-2 ${isSelected ? 'text-white' : 'text-fw-heading'}`}>
                {option.title}
              </h4>

              <p className={`text-figma-sm mb-4 ${isSelected ? 'text-white/80' : 'text-fw-bodyLight'}`}>
                {option.description}
              </p>

              <ul className="space-y-2">
                {option.details.map((detail, i) => (
                  <li key={i} className={`text-figma-xs flex items-center gap-2 ${isSelected ? 'text-white/70' : 'text-fw-bodyLight'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/50' : 'bg-fw-bodyLight'}`} />
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
