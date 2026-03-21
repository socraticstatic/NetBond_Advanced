import { AlertCircle } from 'lucide-react';

interface EmptyAlertStateProps {
  message?: string;
  isMobile?: boolean;
}

export function EmptyAlertState({ 
  message = 'No active alerts for the selected connection',
  isMobile = false
}: EmptyAlertStateProps) {
  if (isMobile) {
    return (
      <div className="py-6 text-center text-fw-bodyLight">
        <AlertCircle className="h-8 w-8 mx-auto mb-2 text-fw-bodyLight" />
        <p className="text-figma-base">{message}</p>
      </div>
    );
  }

  return (
    <div className="bg-fw-base rounded-lg border border-fw-secondary p-3">
      <div className="flex items-center justify-center text-fw-bodyLight">
        <AlertCircle className="h-4 w-4 mr-2" />
        <span className="text-figma-base">{message}</span>
      </div>
    </div>
  );
}