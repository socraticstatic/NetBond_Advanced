import { ReactNode } from 'react';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';

interface SubNavProps {
  title: string | ReactNode;
  description?: string;
  action?: {
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
    to?: string;
  };
  children?: ReactNode;
}

export function SubNav({ title, description, action, children }: SubNavProps) {
  const navigate = useNavigate();

  const handleActionClick = () => {
    if (action?.to) {
      navigate(action.to);
    } else if (action?.onClick) {
      action.onClick();
    }
  };

  return (
    <>
      <div className="bg-fw-base border-b border-fw-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-figma-xl font-bold text-fw-heading leading-8 tracking-[-0.04em]">{title}</h1>
                {description && (
                  <p className="mt-1 text-figma-base font-medium text-fw-body">{description}</p>
                )}
              </div>
              {action && (
                <button
                  onClick={handleActionClick}
                  className="inline-flex items-center justify-center h-10 px-6 rounded-full border border-fw-active text-fw-link text-figma-base font-medium hover:bg-fw-ctaGhost transition-colors"
                >
                  {action.icon && action.icon}
                  {action.label}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Page content - constrained to same max-width as header */}
      {children && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
          {children}
        </div>
      )}
    </>
  );
}