import type { DesignerTemplate } from '../types/designer';

interface TemplateCardProps {
  template: DesignerTemplate;
  onLoad: (template: DesignerTemplate) => void;
}

export function TemplateCard({ template, onLoad }: TemplateCardProps) {
  return (
    <button
      onClick={() => onLoad(template)}
      className="bg-fw-base rounded-xl border border-fw-secondary p-4 hover:shadow-md cursor-pointer text-left w-full transition-shadow duration-150"
    >
      <h3 className="text-figma-base font-semibold text-fw-heading mb-1">{template.name}</h3>
      <p className="text-figma-sm text-fw-bodyLight mb-3 line-clamp-2">{template.description}</p>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-fw-neutral text-figma-xs text-fw-body">
          {template.nodeCount} nodes
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-fw-neutral text-figma-xs text-fw-body">
          {template.edgeCount} edges
        </span>
      </div>
    </button>
  );
}
