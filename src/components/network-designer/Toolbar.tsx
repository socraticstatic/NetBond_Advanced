import { Plus, Share2, Undo2, Trash2, Maximize2, Minimize2, Check } from 'lucide-react';

interface ToolbarProps {
  onAddNode: () => void;
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
  return (
    <div
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-3 py-2 rounded-full shadow-lg border border-fw-secondary bg-fw-base"
    >
      {/* Add node */}
      <button
        onClick={onAddNode}
        className="flex items-center gap-1.5 px-3 py-1.5 text-figma-base font-medium text-fw-heading hover:bg-fw-wash rounded-full transition-colors"
        title="Add router node"
      >
        <Plus className="h-4 w-4" />
        <span>Add Node</span>
      </button>

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
