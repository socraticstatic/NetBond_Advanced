import type { ReactNode } from 'react';
import { X, Trash2 } from 'lucide-react';

interface FloatingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onDelete?: () => void;
  deleteLabel?: string;
}

export function FloatingPanel({ isOpen, onClose, title, children, onDelete, deleteLabel = 'Delete' }: FloatingPanelProps) {
  return (
    <div
      className={`absolute right-4 top-16 z-30 w-80 max-h-[calc(100%-8rem)] overflow-y-auto bg-fw-base rounded-2xl shadow-lg border border-fw-secondary transition-transform duration-200 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-fw-secondary sticky top-0 bg-fw-base rounded-t-2xl">
        <span className="text-figma-sm font-semibold text-fw-heading">{title}</span>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-fw-bodyLight hover:bg-fw-wash transition-colors"
          title="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">{children}</div>

      {/* Delete button at bottom */}
      {onDelete && (
        <div className="px-4 pb-4">
          <button
            onClick={onDelete}
            className="w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-fw-error text-fw-error hover:bg-fw-errorLight transition-colors text-figma-base font-medium"
          >
            <Trash2 className="h-4 w-4" />
            {deleteLabel}
          </button>
        </div>
      )}
    </div>
  );
}
