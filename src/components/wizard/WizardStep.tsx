import { Check } from 'lucide-react';

interface WizardStepProps {
  /** Step title */
  title: string;
  /** Step description */
  description: string;
  /** Step number */
  number: number;
  /** Whether this step is active */
  isActive: boolean;
  /** Whether this step is completed */
  isCompleted: boolean;
  /** Whether this is the last step */
  isLast?: boolean;
}

/**
 * Component for displaying individual wizard steps
 * Figma spec: 20x20 circles, 2px connector lines, specific colors per state
 */
export function WizardStep({
  title,
  description,
  number,
  isActive,
  isCompleted,
  isLast = false,
}: WizardStepProps) {
  return (
    <div className="flex-1">
      <div className="flex items-center">
        {/* Step circle: 20x20 (w-5 h-5) */}
        <div className={`
          relative flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0
          transition-colors duration-300 ease-in-out
          ${isCompleted
            ? 'bg-fw-success text-white'
            : isActive
              ? 'bg-fw-primary text-white'
              : 'bg-fw-disabled text-white'
          }
        `}>
          {isCompleted ? (
            <Check className="w-3 h-3" />
          ) : (
            <span className="text-figma-base font-medium leading-none">{number}</span>
          )}
        </div>
        {/* Connector line: h-0.5 (2px), bg-fw-neutral, rounded-full */}
        {!isLast && (
          <div className="flex-1 h-0.5 mx-2 bg-fw-secondary rounded-full overflow-hidden">
            <div className={`
              h-full origin-left
              transition-all duration-500 ease-in-out
              ${isCompleted ? 'bg-fw-success scale-x-100' : 'scale-x-0'}
            `} />
          </div>
        )}
      </div>
      <div className="mt-2">
        {/* Step title: 16px w500 #1d2329 */}
        <p className="text-figma-lg font-medium text-fw-heading whitespace-nowrap">{title}</p>
        {/* Step description: 14px w500 #454b52, wrapping ~100px */}
        <p className="text-figma-base font-medium text-fw-body mt-1 whitespace-normal max-w-[100px]">{description}</p>
      </div>
    </div>
  );
}
