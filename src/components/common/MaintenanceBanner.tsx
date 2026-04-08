import { Wrench, X } from 'lucide-react';

interface MaintenanceBannerProps {
  onDismiss: () => void;
}

export function MaintenanceBanner({ onDismiss }: MaintenanceBannerProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-[9998] bg-fw-warnLight/40 border-b border-fw-warn/30 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-fw-warnLight flex items-center justify-center shrink-0">
            <Wrench className="w-4 h-4 text-fw-warn" />
          </div>
          <div>
            <p className="text-figma-sm font-semibold text-fw-heading tracking-[-0.03em]">
              Scheduled Maintenance &mdash; Portal is Read-Only
            </p>
            <p className="text-figma-xs text-fw-body tracking-[-0.03em] mt-0.5">
              March 25, 2026 &middot; 02:00 AM &ndash; 06:00 AM EST &middot; All configuration changes are temporarily disabled
            </p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 rounded hover:bg-fw-warn/10 transition-colors shrink-0"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4 text-fw-warn" />
        </button>
      </div>
    </div>
  );
}
