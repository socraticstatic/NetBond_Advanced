import { X } from 'lucide-react';
import type { NetworkNode, NetworkEdge, DesignerTemplate } from './types/designer';
import { DESIGNER_TEMPLATES } from './templates/templateDefinitions';
import { TemplateCard } from './templates/TemplateCard';

interface TemplatesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadTemplate: (nodes: NetworkNode[], edges: NetworkEdge[]) => void;
}

export function TemplatesDrawer({ isOpen, onClose, onLoadTemplate }: TemplatesDrawerProps) {
  if (!isOpen) return null;

  function handleLoad(template: DesignerTemplate) {
    onLoadTemplate(template.nodes, template.edges);
    onClose();
  }

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-80 z-30 bg-fw-base rounded-2xl border border-fw-secondary shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-fw-secondary">
        <h2 className="text-figma-base font-semibold text-fw-heading">Templates</h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-fw-bodyLight hover:bg-fw-wash transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Template grid */}
      <div className="max-h-[480px] overflow-y-auto divide-y divide-fw-secondary/50">
        {DESIGNER_TEMPLATES.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onLoad={handleLoad}
          />
        ))}
      </div>
    </div>
  );
}
