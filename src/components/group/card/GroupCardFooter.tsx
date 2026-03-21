import { ChevronRight } from 'lucide-react';

interface GroupCardFooterProps {
  onManageClick: (e: React.MouseEvent) => void;
}

export function GroupCardFooter({ onManageClick }: GroupCardFooterProps) {
  return (
    <div className="px-4 pb-4 pt-2">
      <button
        onClick={onManageClick}
        className="w-full flex items-center justify-center gap-2 rounded-[800px] text-figma-base font-medium text-fw-link hover:bg-fw-accent border border-fw-secondary transition-colors"
        style={{ height: '36px', maxWidth: '320px', margin: '0 auto' }}
      >
        <ChevronRight className="h-5 w-5" />
        Manage Pool
      </button>
    </div>
  );
}
