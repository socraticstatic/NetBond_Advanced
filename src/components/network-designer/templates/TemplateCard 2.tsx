import type { DesignerTemplate } from '../types/designer';

interface TemplateCardProps {
  template: DesignerTemplate;
  onLoad: (template: DesignerTemplate) => void;
}

export function TemplateCard({ template, onLoad }: TemplateCardProps) {
  return (
    <button
      onClick={() => onLoad(template)}
      className="group p-4 cursor-pointer text-left w-full transition-colors duration-150"
    >
      <h3 className="text-figma-base font-semibold text-fw-heading group-hover:text-fw-cobalt-600 transition-colors duration-150 mb-1">{template.name}</h3>
      <p className="text-figma-sm text-fw-bodyLight mb-3 line-clamp-2">{template.description}</p>
      <div className="flex items-center gap-3">
        <span className="text-figma-xs text-fw-bodyLight">{template.nodeCount} nodes</span>
        <span className="text-figma-xs text-fw-bodyLight">{template.edgeCount} edges</span>
      </div>
    </button>
  );
}
