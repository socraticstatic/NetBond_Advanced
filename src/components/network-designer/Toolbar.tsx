import { useEffect, useRef, useState } from 'react';
import { Share2, Undo2, Trash2, Maximize2, Minimize2, Check, ChevronDown, LayoutTemplate } from 'lucide-react';
import { NODE_CATEGORIES } from '../constants/nodeTypes';

interface ToolbarProps {
  onAddNode: (type: string, subType?: string, meta?: Record<string, string>) => void;
  onToggleEdgeCreation: () => void;
  isCreatingEdge: boolean;
  onUndo: () => void;
  canUndo: boolean;
  onClearCanvas: () => void;
  onToggleMaximize: () => void;
  isMaximized: boolean;
  onCreateConnections: () => void;
  hasConnections: boolean;
}

export function Toolbar({
  onAddNode,
  onToggleEdgeCreation,
  isCreatingEdge,
  onUndo,
  canUndo,
  onClearCanvas,
  onToggleMaximize,
  isMaximized,
  onCreateConnections,
  hasConnections,
}: ToolbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  function handleSelect(categoryKey: string, item: { type?: string; provider?: string }) {
    setDropdownOpen(false);
    if (categoryKey === 'cloud' && item.provider) {
      onAddNode('destination', item.provider, { cloudProvider: item.provider });
    } else if (categoryKey === 'datacenter' && item.provider) {
      onAddNode('datacenter', item.provider, { dcProvider: item.provider });
    } else if (categoryKey === 'network' && item.type) {
      onAddNode('network', item.type);
    } else if (categoryKey === 'function' && item.type) {
      onAddNode('function', item.type);
    }
  }

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-3 py-2 rounded-full shadow-lg border border-fw-secondary bg-fw-base">

      {/* Add Node dropdown */}
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setDropdownOpen(prev => !prev)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-figma-base font-medium text-fw-heading hover:bg-fw-wash rounded-full transition-colors"
          title="Add node"
        >
          <ChevronDown className="h-4 w-4" />
          <span>Add Node</span>
        </button>

        {dropdownOpen && (
          <div className="absolute bottom-full mb-2 left-0 w-56 bg-fw-base rounded-xl shadow-lg border border-fw-secondary z-30 overflow-hidden">
            {(Object.entries(NODE_CATEGORIES) as [string, { label: string; items: Array<{ type?: string; provider?: string; label: string }> }][]).map(([categoryKey, category]) => (
              <div key={categoryKey}>
                <div className="px-3 pt-3 pb-1 text-figma-xs font-bold text-fw-bodyLight uppercase tracking-wider">
                  {category.label}
                </div>
                {category.items.map((item) => {
                  const key = 'type' in item ? item.type : item.provider;
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelect(categoryKey, item)}
                      className="w-full text-left px-3 py-1.5 text-figma-sm text-fw-heading hover:bg-fw-wash transition-colors"
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-5 bg-fw-secondary mx-1" />

      {/* Connect toggle */}
      <button
        onClick={onToggleEdgeCreation}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-figma-base font-medium rounded-full transition-colors ${
          isCreatingEdge
            ? 'text-fw-link bg-fw-accent'
            : 'text-fw-heading hover:bg-fw-wash'
        }`}
        title={isCreatingEdge ? 'Cancel connection' : 'Connect nodes'}
      >
        <Share2 className="h-4 w-4" />
        <span>{isCreatingEdge ? 'Cancel Connect' : 'Connect'}</span>
      </button>

      <div className="w-px h-5 bg-fw-secondary mx-1" />

      {/* Undo */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo"
        className={`p-2 rounded-full transition-colors ${
          canUndo
            ? 'text-fw-heading hover:bg-fw-wash'
            : 'text-fw-disabled cursor-not-allowed'
        }`}
      >
        <Undo2 className="h-4 w-4" />
      </button>

      {/* Clear */}
      <button
        onClick={onClearCanvas}
        title="Clear canvas"
        className="p-2 rounded-full text-fw-heading hover:bg-fw-wash transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {/* Maximize/Minimize toggle */}
      <button
        onClick={onToggleMaximize}
        title={isMaximized ? 'Minimize' : 'Maximize'}
        className="p-2 rounded-full text-fw-heading hover:bg-fw-wash transition-colors"
      >
        {isMaximized ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
      </button>

      {/* Templates placeholder */}
      <button
        onClick={() => console.log('Templates: not yet implemented')}
        title="Templates"
        className="p-2 rounded-full text-fw-heading hover:bg-fw-wash transition-colors"
      >
        <LayoutTemplate className="h-4 w-4" />
      </button>

      <div className="w-px h-5 bg-fw-secondary mx-1" />

      {/* Create */}
      <button
        onClick={onCreateConnections}
        disabled={!hasConnections}
        title="Create connections"
        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-figma-base font-medium transition-colors ${
          hasConnections
            ? 'bg-fw-wash text-fw-heading hover:bg-fw-neutral'
            : 'bg-fw-neutral text-fw-disabled cursor-not-allowed'
        }`}
      >
        <Check className="h-4 w-4" />
        Create
      </button>
    </div>
  );
}
