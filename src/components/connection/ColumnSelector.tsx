import { useState, useEffect, useRef } from 'react';
import { Settings, GripVertical, X, ChevronRight, ChevronDown } from 'lucide-react';
import type { ColumnConfig } from '../../types/connection';
import { useFocusTrap } from '../../hooks/useFocusTrap';

/**
 * @deprecated This component is deprecated and should not be used in new code.
 * Please use ColumnVisibilityPopover with useColumnVisibility hook instead.
 *
 * Example:
 * ```tsx
 * import { ColumnVisibilityPopover } from '../common/ColumnVisibilityPopover';
 * import { useColumnVisibility } from '../../hooks/useColumnVisibility';
 *
 * const { visibleColumns, isVisible } = useColumnVisibility(TABLE_ID);
 * ```
 *
 * This component will be removed in a future version.
 */

interface ColumnSelectorProps {
  columns: ColumnConfig[];
  onChange: (columns: ColumnConfig[]) => void;
  onOpenChange?: (isOpen: boolean) => void;
}

export function ColumnSelector({ 
  columns, 
  onChange,
  onOpenChange 
}: ColumnSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAllOptions, setShowAllOptions] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const modalRef = useFocusTrap(isOpen);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const handleColumnToggle = (columnId: string) => {
    const updatedColumns = columns.map(col => 
      col.id === columnId ? { ...col, visible: !col.visible } : col
    );
    onChange(updatedColumns);
  };

  const handleAddColumn = (field: { id: string; label: string }) => {
    if (!columns.find(col => col.id === field.id)) {
      onChange([...columns, { 
        id: field.id, 
        label: field.label, 
        visible: true, 
        sortable: true,
        width: '15%' // Default width for new columns
      }]);
    }
  };

  const handleDragStart = (columnId: string) => {
    setDraggedColumn(columnId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === columnId) return;

    const draggedIndex = columns.findIndex(col => col.id === draggedColumn);
    const dropIndex = columns.findIndex(col => col.id === columnId);

    const newColumns = [...columns];
    const [draggedItem] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(dropIndex, 0, draggedItem);

    onChange(newColumns);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
    if (!open) {
      setShowAllOptions(false);
    }
  };

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen && 
        modalContentRef.current && 
        !modalContentRef.current.contains(event.target as Node) &&
        triggerRef.current && 
        !triggerRef.current.contains(event.target as Node)
      ) {
        handleOpenChange(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        handleOpenChange(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  // Position the modal relative to the trigger button
  useEffect(() => {
    if (isOpen && modalContentRef.current && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const modalRect = modalContentRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // Calculate position
      let top = triggerRect.bottom + 8;
      let left = triggerRect.right - modalRect.width;
      
      // Ensure the modal stays within viewport
      if (top + modalRect.height > viewportHeight) {
        top = triggerRect.top - modalRect.height - 8;
      }
      
      if (left < 0) {
        left = triggerRect.left;
      }
      
      if (left + modalRect.width > viewportWidth) {
        left = viewportWidth - modalRect.width - 16;
      }
      
      modalContentRef.current.style.top = `${top}px`;
      modalContentRef.current.style.left = `${left}px`;
    }
  }, [isOpen, showAllOptions]);

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        onClick={() => handleOpenChange(!isOpen)}
        className="p-2 text-fw-bodyLight hover:text-fw-bodyLight rounded-full hover:bg-fw-neutral transition-colors"
        title="Customize Columns"
        aria-label="Customize table columns"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <Settings className="h-5 w-5" />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-200"
            style={{ zIndex: 1000 }}
            onClick={() => handleOpenChange(false)}
            aria-hidden="true"
          />
          
          {/* Modal */}
          <div 
            ref={modalRef}
            className="fixed z-[1001] overflow-hidden"
          >
            <div
              ref={modalContentRef}
              className={`
                bg-fw-base rounded-lg shadow-xl border border-fw-secondary
                transform transition-all duration-200 ease-out
                ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
              `}
              style={{ 
                width: showAllOptions ? '480px' : '320px',
                maxHeight: '80vh',
                overflow: 'auto'
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="column-selector-title"
            >
              {showAllOptions ? (
                // All Options View
                <div>
                  <div className="sticky top-0 px-4 py-3 border-b border-fw-secondary flex items-center justify-between bg-fw-base z-10">
                    <h3 id="column-selector-title" className="text-figma-base font-medium text-fw-heading">All Available Fields</h3>
                    <button
                      onClick={() => setShowAllOptions(false)}
                      className="text-fw-bodyLight hover:text-fw-bodyLight focus:outline-none focus:ring-2 focus:ring-brand-blue rounded-full p-1"
                      aria-label="Back to column list"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 56px)' }}>
                    {Object.entries(ALL_DATA_POINTS).map(([category, { label, fields }]) => (
                      <div key={category} className="mb-6 last:mb-0">
                        <h4 className="text-figma-base font-medium text-fw-heading mb-3">{label}</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {fields.map((field) => {
                            const isActive = columns.some(col => col.id === field.id);
                            return (
                              <button
                                key={field.id}
                                onClick={() => handleAddColumn(field)}
                                className={`
                                  flex items-center justify-between p-2 rounded text-figma-base
                                  ${isActive 
                                    ? 'bg-fw-accent text-fw-linkHover hover:bg-fw-accent' 
                                    : 'bg-fw-wash text-fw-body hover:bg-fw-neutral'
                                  }
                                  focus:outline-none focus:ring-2 focus:ring-brand-blue
                                `}
                              >
                                <span>{field.label}</span>
                                {isActive && <span className="text-figma-sm">Added</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Current Columns View
                <div>
                  <div className="sticky top-0 px-4 py-3 border-b border-fw-secondary bg-fw-base z-10">
                    <h3 id="column-selector-title" className="text-figma-base font-medium text-fw-heading">Customize Columns</h3>
                  </div>
                  <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 56px)' }}>
                    <div className="space-y-2">
                      {columns.map((column) => (
                        <div
                          key={column.id}
                          draggable
                          onDragStart={() => handleDragStart(column.id)}
                          onDragOver={(e) => handleDragOver(e, column.id)}
                          className="flex items-center justify-between p-2 bg-fw-base hover:bg-fw-wash rounded cursor-move"
                        >
                          <div className="flex items-center">
                            <GripVertical className="h-4 w-4 text-fw-bodyLight mr-2" />
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={column.visible}
                                onChange={() => handleColumnToggle(column.id)}
                                className="rounded border-fw-secondary text-fw-link focus:ring-fw-active mr-2"
                              />
                              <span className="text-figma-base text-fw-body">{column.label}</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowAllOptions(true)}
                      className="mt-4 w-full flex items-center justify-between px-4 py-2 text-figma-base text-fw-link hover:bg-fw-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    >
                      <span>See All Available Fields</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <div className="mt-4 text-figma-sm text-fw-bodyLight">
                      Drag columns to reorder. Toggle visibility using checkboxes.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// All possible connection data points
const ALL_DATA_POINTS = {
  basic: {
    label: 'Basic Information',
    fields: [
      { id: 'name', label: 'Name' },
      { id: 'type', label: 'Type' },
      { id: 'status', label: 'Status' },
      { id: 'bandwidth', label: 'Bandwidth' },
      { id: 'location', label: 'Location' },
      { id: 'provider', label: 'Provider' }
    ]
  },
  performance: {
    label: 'Performance Metrics',
    fields: [
      { id: 'latency', label: 'Latency' },
      { id: 'packetLoss', label: 'Packet Loss' },
      { id: 'jitter', label: 'Jitter' },
      { id: 'uptime', label: 'Uptime' },
      { id: 'tunnels', label: 'Tunnel Status' }
    ]
  },
  security: {
    label: 'Security',
    fields: [
      { id: 'encryption', label: 'Encryption' },
      { id: 'firewall', label: 'Firewall Status' },
      { id: 'ddosProtection', label: 'DDoS Protection' },
      { id: 'ipSecEnabled', label: 'IPSec Status' }
    ]
  },
  features: {
    label: 'Features',
    fields: [
      { id: 'dedicatedConnection', label: 'Dedicated Connection' },
      { id: 'redundantPath', label: 'Redundant Path' },
      { id: 'autoScaling', label: 'Auto Scaling' },
      { id: 'loadBalancing', label: 'Load Balancing' }
    ]
  }
};