import { Server, Cloud, Router, Network, Plus, Undo, Play, Check, Save, Trash2, Sparkles } from 'lucide-react';
import { NetworkNode } from '../../types';

interface ToolbarProps {
  onAddNode: (type: NetworkNode['type']) => void;
  onToggleEdgeCreation: () => void;
  isCreatingEdge: boolean;
  onCancel: () => void;
  hasConnections: boolean;
  canUndo: boolean;
  onRunScenario?: () => void;
  isRunningScenario?: boolean;
  onCreateConnections?: () => void;
  onSaveTemplate?: () => void;
  onClearCanvas?: () => void;
}

export function Toolbar({
  onAddNode,
  onToggleEdgeCreation,
  isCreatingEdge,
  onCancel,
  hasConnections,
  canUndo,
  onRunScenario,
  isRunningScenario = false,
  onCreateConnections,
  onSaveTemplate,
  onClearCanvas
}: ToolbarProps) {
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-sm border border-fw-secondary p-2 flex items-center space-x-4 min-w-[800px]" style={{ zIndex: 50 }}>
      {/* Node Tools */}
      <div className="flex items-center space-x-4 border-r border-fw-secondary pr-4">
        <button
          onClick={() => onAddNode('source')}
          className="p-2 text-fw-body hover:text-fw-heading hover:bg-fw-wash rounded-full flex items-center space-x-2 transition-colors"
          title="Add Source Node"
        >
          <Server className="h-5 w-5" />
          <span className="text-sm">Source</span>
        </button>
        <button
          onClick={() => onAddNode('destination')}
          className="p-2 text-fw-body hover:text-fw-heading hover:bg-fw-wash rounded-full flex items-center space-x-2 transition-colors"
          title="Add Cloud Provider"
        >
          <Cloud className="h-5 w-5" />
          <span className="text-sm">Cloud</span>
        </button>
        <button
          onClick={() => onAddNode('router')}
          className="p-2 text-fw-body hover:text-fw-heading hover:bg-fw-wash rounded-full flex items-center space-x-2 transition-colors"
          title="Add Router"
        >
          <Router className="h-5 w-5" />
          <span className="text-sm">Router</span>
        </button>
        <button
          onClick={() => onAddNode('network')}
          className="p-2 text-fw-body hover:text-fw-heading hover:bg-fw-wash rounded-full flex items-center space-x-2 transition-colors"
          title="Add Network Device"
        >
          <Network className="h-5 w-5" />
          <span className="text-sm">Network</span>
        </button>
      </div>

      {/* Connection Tool */}
      <div className="relative group">
        <button
          onClick={onToggleEdgeCreation}
          className={`p-2 rounded-full transition-colors ${
            isCreatingEdge
              ? 'text-fw-link bg-fw-accent'
              : 'text-fw-body hover:text-fw-heading hover:bg-fw-wash'
          }`}
        >
          <Plus className="h-5 w-5" />
        </button>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-fw-heading rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Click on the nodes you wish to connect. Toggle when you're done.
        </div>
      </div>

      {/* Scenario Runner */}
      {onRunScenario && (
        <div className="flex items-center space-x-2 border-l border-fw-secondary pl-4">
          <div className="relative group">
            <button
              onClick={onRunScenario}
              disabled={!hasConnections || isRunningScenario}
              title="Run Network Scenario"
              className={`
                p-2 text-sm font-medium transition-colors no-rounded
                ${!hasConnections
                  ? 'bg-fw-disabled text-fw-disabled cursor-not-allowed'
                  : isRunningScenario
                  ? 'bg-fw-disabled text-fw-disabled cursor-not-allowed'
                  : 'text-fw-body hover:text-fw-heading hover:bg-fw-wash'
                }
              `}
            >
              {isRunningScenario
                ? <Sparkles className="h-5 w-5 animate-pulse text-green-500" />
                : <Play className="h-5 w-5" />
              }
            </button>
          </div>
        </div>
      )}

      {/* Save Template */}
      <div className="flex items-center space-x-2 border-l border-fw-secondary pl-4">
        <button
          onClick={onSaveTemplate}
          disabled={!hasConnections}
          title="Save as Template"
          className={`
            p-2 text-sm font-medium transition-colors no-rounded
            ${!hasConnections
              ? 'bg-fw-disabled text-fw-disabled cursor-not-allowed'
              : 'text-fw-body hover:text-fw-heading hover:bg-fw-wash'
            }
          `}
        >
          <Save className="h-5 w-5" />
        </button>
      </div>

      {/* History Controls */}
      <div className="flex items-center space-x-2 border-l border-fw-secondary pl-4">
        <button
          onClick={onCancel}
          disabled={!canUndo}
          title="Undo"
          className={`
            p-2 text-sm font-medium transition-colors no-rounded
            ${!canUndo
              ? 'bg-fw-disabled text-fw-disabled cursor-not-allowed'
              : 'text-fw-body hover:text-fw-heading hover:bg-fw-wash'
            }
          `}
        >
          <Undo className="h-5 w-5" />
        </button>
      </div>

      {/* Clear Canvas */}
      <div className="flex items-center space-x-2 border-l border-fw-secondary pl-4">
        <button
          onClick={onClearCanvas}
          disabled={!hasConnections}
          title="Clear Canvas"
          className={`
            p-2 text-sm font-medium transition-colors no-rounded
            ${!hasConnections
              ? 'bg-fw-disabled text-fw-disabled cursor-not-allowed'
              : 'text-fw-body hover:text-fw-heading hover:bg-fw-wash'
            }
          `}
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      {/* Create Connections */}
      <div className="flex items-center space-x-2 border-l border-fw-secondary pl-4">
        <button
          onClick={onCreateConnections}
          disabled={!hasConnections}
          title="Create Connections"
          className={`
            p-2 text-sm font-medium transition-colors no-rounded
            ${!hasConnections
              ? 'bg-fw-disabled text-fw-disabled cursor-not-allowed'
              : 'text-fw-body bg-fw-neutral hover:bg-fw-wash'
            }
          `}
        >
          <Check className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}