import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const isFullscreen = size === 'fullscreen';

  const sizeClasses = {
    sm: 'sm:max-w-md',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-xl',
    xl: 'sm:max-w-4xl',
    fullscreen: 'max-w-none'
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className={`flex items-center justify-center ${isFullscreen ? 'min-h-screen' : 'min-h-screen px-4 py-8'}`}>
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className={`relative z-10 w-full flex flex-col text-left transform bg-fw-base shadow-xl ${
          isFullscreen
            ? 'h-screen max-h-screen p-8'
            : 'max-h-[calc(100vh-4rem)] px-4 pt-5 pb-4 rounded-lg sm:p-6'
        } ${sizeClasses[size]}`}>
          {/* Close button */}
          <div className="absolute top-0 right-0 pt-4 pr-4 z-20">
            <Button
              onClick={onClose}
              variant="outline"
              className="!p-1 border-0 text-fw-bodyLight hover:text-fw-body"
              type="button"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Title */}
          {title && (
            <div className="mb-4 flex-shrink-0">
              <h3 className="text-lg font-medium text-fw-heading">{title}</h3>
            </div>
          )}

          {/* Content */}
          <div className="overflow-y-auto flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}