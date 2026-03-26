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
        {/* Step circle */}
        <div
          title={title}
          className={`
            relative flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0
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
      {/* Title only shown for active step */}
      <div className="mt-1.5 h-5">
        {isActive && (
          <p className="text-figma-xs font-semibold text-fw-primary whitespace-nowrap">{title}</p>
        )}
      </div>
    </div>
  );
}
