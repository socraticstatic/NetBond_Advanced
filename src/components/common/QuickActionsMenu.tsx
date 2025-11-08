import { useState, useRef, useEffect } from 'react';
import { Plus, Zap, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function QuickActionsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsOpen(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const actions: QuickAction[] = [
    {
      id: 'new-connection',
      label: 'New Connection',
      icon: <Plus className="h-5 w-5" />,
      shortcut: 'Ctrl+N',
      onClick: () => {
        navigate('/create');
        setIsOpen(false);
      },
      variant: 'primary'
    },
    {
      id: 'network-designer',
      label: 'Network Designer',
      icon: <Zap className="h-5 w-5" />,
      onClick: () => {
        navigate('/network-designer');
        setIsOpen(false);
      }
    }
  ];

  return (
    <div
      ref={menuRef}
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      }`}
    >
      {/* Action Menu */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 mb-2 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden animate-slide-up">
          <div className="p-3 border-b border-gray-100 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-xs text-gray-500 mt-0.5">Common tasks and shortcuts</p>
          </div>
          <div className="py-2">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={action.onClick}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-lg
                    ${action.variant === 'primary'
                      ? 'bg-brand-blue text-white'
                      : 'bg-gray-100 text-gray-700 group-hover:bg-brand-lightBlue group-hover:text-brand-blue'
                    }
                    transition-colors
                  `}>
                    {action.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {action.label}
                    </div>
                    {action.shortcut && (
                      <div className="text-xs text-gray-500">
                        {action.shortcut}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              Press <kbd className="px-1 py-0.5 text-xs font-mono bg-white border border-gray-300 rounded">?</kbd> for all shortcuts
            </p>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          group relative w-14 h-14 rounded-full shadow-lg
          flex items-center justify-center
          transition-all duration-300 hover:shadow-xl
          ${isOpen
            ? 'bg-gray-700 hover:bg-gray-800 rotate-45'
            : 'bg-brand-blue hover:bg-brand-darkBlue'
          }
        `}
        aria-label="Quick actions menu"
        aria-expanded={isOpen}
      >
        <Plus className="h-6 w-6 text-white transition-transform duration-300" />

        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute right-full mr-3 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Quick Actions
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
              <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          </div>
        )}
      </button>
    </div>
  );
}
