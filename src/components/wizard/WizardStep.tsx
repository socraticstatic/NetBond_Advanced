import { Check } from 'lucide-react';

interface WizardStepProps {
  title: string;
  description: string;
  number: number;
  isActive: boolean;
  isCompleted: boolean;
  isLast?: boolean;
}

export function WizardStep({
  title,
  number,
  isActive,
  isCompleted,
  isLast = false,
}: WizardStepProps) {
  return (
    <div className="flex-1">
      <div className="flex items-center">
        {/* Step circle with centered label */}
        <div className="relative flex-shrink-0">
          <div
            title={title}
            className={`
              flex items-center justify-center w-7 h-7 rounded-full
              transition-colors duration-300 ease-in-out
              ${isCompleted
                ? 'bg-fw-success text-white'
                : isActive
                  ? 'bg-fw-primary text-white ring-4 ring-fw-primary/20'
                  : 'bg-fw-disabled text-white'
              }
            `}
          >
            {isCompleted ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <span className="text-figma-xs font-semibold leading-none">{number}</span>
            )}
          </div>
          {/* Label centered under circle */}
          {isActive && (
            <p className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 text-figma-xs font-semibold text-fw-primary whitespace-nowrap">{title}</p>
          )}
        </div>
        {/* Connector line */}
        {!isLast && (
          <div className="flex-1 h-0.5 mx-1.5 bg-fw-secondary rounded-full overflow-hidden">
            <div className={`
              h-full origin-left
              transition-all duration-500 ease-in-out
              ${isCompleted ? 'bg-fw-success scale-x-100' : 'scale-x-0'}
            `} />
          </div>
        )}
      </div>
      {/* Spacer for label height */}
      <div className="h-7" />
    </div>
  );
}
