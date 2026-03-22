import { Share2, Upload, LayoutGrid, FolderOpen } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
  onCreate: () => void;
  onChooseTemplate: () => void;
}

const OPTIONS = [
  {
    id: 'create',
    icon: Share2,
    title: 'Create',
    description: 'Start with AT&T Core and customize your cloud router.',
    action: 'create' as const,
  },
  {
    id: 'import',
    icon: Upload,
    title: 'Import',
    description: 'Upload diagram and let AI recreate it.',
    badge: '✦ AI',
    action: 'import' as const,
  },
  {
    id: 'choose',
    icon: LayoutGrid,
    title: 'Choose',
    description: 'Choose from pre-built enterprise patterns.',
    action: 'choose' as const,
  },
  {
    id: 'open',
    icon: FolderOpen,
    title: 'Open',
    description: 'Continue working on saved topologies.',
    badge: '3 saved',
    action: 'open' as const,
  },
];

export function WelcomeModal({ onClose, onCreate, onChooseTemplate }: WelcomeModalProps) {
  const handleClick = (action: string) => {
    switch (action) {
      case 'create':
        onCreate();
        break;
      case 'choose':
        onChooseTemplate();
        break;
      default:
        onClose();
        break;
    }
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-[700px] rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center" style={{ background: 'linear-gradient(180deg, #4a6a8a 0%, #3a5a7a 100%)' }}>
          <div className="mx-auto mb-3 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-figma-lg font-semibold text-white">Welcome to Cloud Designer</h2>
          <p className="text-figma-sm text-white/70 mt-1">
            Choose how you'd like to create your enterprise network
          </p>
        </div>

        {/* Options */}
        <div className="bg-fw-base px-6 py-6">
          <div className="grid grid-cols-4 gap-3">
            {OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleClick(opt.action)}
                className="group flex flex-col items-center text-center px-3 py-5 bg-transparent cursor-pointer transition-colors duration-150"
              >
                <opt.icon className="w-6 h-6 text-fw-bodyLight group-hover:text-fw-cobalt-600 transition-colors duration-150 mb-3" />
                <span className="text-figma-base font-semibold text-fw-heading group-hover:text-fw-cobalt-600 transition-colors duration-150 mb-1">{opt.title}</span>
                <span className="text-figma-xs text-fw-bodyLight leading-snug">{opt.description}</span>
                {opt.badge && (
                  <span className="mt-2 text-figma-xs text-fw-bodyLight">{opt.badge}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
