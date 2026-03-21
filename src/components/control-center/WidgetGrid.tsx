import { useSortable, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, GripVertical } from 'lucide-react';
import { Connection } from '../../types';
import { WidgetInstance } from './types';
import { AVAILABLE_WIDGETS } from './widgets';

interface WidgetGridProps {
  widgets: WidgetInstance[];
  activeId: string | null;
  onRemoveWidget: (id: string) => void;
  onUpdateWidget: (id: string, updates: Partial<WidgetInstance>) => void;
  connections: Connection[];
}

function SortableWidget({
  widget,
  widgetDef,
  connections,
  onRemove,
  onUpdate
}: {
  widget: WidgetInstance;
  widgetDef: any;
  connections: Connection[];
  onRemove: () => void;
  onUpdate: (updates: Partial<WidgetInstance>) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.5 : 1,
    gridColumn: `span ${widget.size.w}`,
    gridRow: `span ${widget.size.h}`
  };

  const Component = widgetDef.component;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`
        bg-fw-base rounded-2xl border border-fw-secondary shadow-sm
        hover:shadow-md transition-shadow duration-200
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
      `}
    >
      {/* Widget Header */}
      <div className="p-4 border-b border-fw-secondary flex items-center justify-between">
        <div className="flex items-center">
          <div className={`
            p-1.5 rounded-lg
            ${widgetDef.color === 'blue' ? 'bg-fw-accent' :
              widgetDef.color === 'green' ? 'bg-fw-successLight' :
              widgetDef.color === 'purple' ? 'bg-fw-purple/10' :
              widgetDef.color === 'orange' ? 'bg-fw-warnLight' :
              'bg-fw-wash'}
          `}>
            <widgetDef.icon className={`
              h-4 w-4
              ${widgetDef.color === 'blue' ? 'text-fw-link' :
                widgetDef.color === 'green' ? 'text-fw-success' :
                widgetDef.color === 'purple' ? 'text-fw-purple' :
                widgetDef.color === 'orange' ? 'text-fw-warn' :
                'text-fw-bodyLight'}
            `} />
          </div>
          <h3 className="ml-2 text-figma-base font-medium text-fw-heading tracking-[-0.03em]">
            {widgetDef.title}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            {...listeners}
            className="p-1 text-fw-bodyLight hover:text-fw-body rounded-lg hover:bg-fw-wash"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <button
            onClick={onRemove}
            className="p-1 text-fw-bodyLight hover:text-fw-error rounded-lg hover:bg-fw-error/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Widget Content */}
      <div className="p-4">
        <Component
          connections={connections}
          config={widget.config}
          onConfigChange={(config: any) => onUpdate({ config })}
        />
      </div>
    </div>
  );
}

export function WidgetGrid({
  widgets,
  activeId,
  onRemoveWidget,
  onUpdateWidget,
  connections
}: WidgetGridProps) {
  // Get all available widget definitions
  const allWidgets = Object.values(AVAILABLE_WIDGETS).flat();
  const items = widgets.map(w => w.id);

  return (
    <SortableContext items={items} strategy={rectSortingStrategy}>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-16">
        {widgets.map((widget) => {
          // Find widget definition
          const widgetDef = allWidgets.find(w => w.id === widget.widgetId);
          if (!widgetDef) return null;

          return (
            <SortableWidget
              key={widget.id}
              widget={widget}
              widgetDef={widgetDef}
              connections={connections}
              onRemove={() => onRemoveWidget(widget.id)}
              onUpdate={(updates) => onUpdateWidget(widget.id, updates)}
            />
          );
        })}

        {/* Empty State */}
        {widgets.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-fw-neutral rounded-full p-3 mb-4">
              <GripVertical className="h-6 w-6 text-fw-bodyLight" />
            </div>
            <h3 className="text-figma-lg font-bold text-fw-heading mb-2 tracking-[-0.03em]">
              Your Customized Insights are Waiting...
            </h3>
            <p className="text-figma-base font-medium text-fw-body max-w-md">
              Add widgets from the drawer on the right to customize your insights.
              Drag and drop widgets to rearrange them.
            </p>
          </div>
        )}
      </div>
    </SortableContext>
  );
}
