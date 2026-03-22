import { useRef, useState, useCallback, memo } from 'react';
import * as LucideIcons from 'lucide-react';
import { useDesignerStore } from './store/useDesignerStore';
import type { NetworkNode } from './types/designer';

interface NodeProps {
  node: NetworkNode;
  isSelected: boolean;
  isEdgeTarget: boolean;
  hasValidationError: boolean;
  isCreatingEdge: boolean;
  onSelect: (id: string) => void;
  onDrag: (id: string, x: number, y: number) => void;
  onDragEnd: () => void;
  onEdgeClick: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export const Node = memo(function Node({
  node,
  isSelected,
  isEdgeTarget,
  hasValidationError,
  isCreatingEdge,
  onSelect,
  onDrag,
  onDragEnd,
  onEdgeClick,
  onRename,
}: NodeProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const zoomLevel = useDesignerStore((s) => s.zoomLevel);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(node.name);
  const hasDraggedRef = useRef(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isCreatingEdge) return;
      e.stopPropagation();

      // Pure delta approach: no DOM measurement during drag.
      // Capture start positions once, compute deltas from mouse movement.
      const startMouseX = e.clientX;
      const startMouseY = e.clientY;
      const startNodeX = node.x;
      const startNodeY = node.y;

      hasDraggedRef.current = false;
      let dragStarted = false;

      const handleMove = (me: MouseEvent) => {
        const dx = me.clientX - startMouseX;
        const dy = me.clientY - startMouseY;

        if (!dragStarted && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
          dragStarted = true;
          setIsDragging(true);
        }

        if (dragStarted) {
          hasDraggedRef.current = true;
          onDrag(node.id, startNodeX + dx / zoomLevel, startNodeY + dy / zoomLevel);
        }
      };

      const handleUp = () => {
        if (dragStarted) {
          setIsDragging(false);
          onDragEnd();
        }
        if (!hasDraggedRef.current) {
          onSelect(node.id);
        }
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleUp);
      };

      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
    },
    [node.id, node.x, node.y, zoomLevel, isCreatingEdge, onDrag, onDragEnd, onSelect]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isCreatingEdge) {
        onEdgeClick(node.id);
      }
    },
    [node.id, isCreatingEdge, onEdgeClick]
  );

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setEditName(node.name);
  }, [node.name]);

  const handleRenameSubmit = useCallback(() => {
    if (editName.trim()) {
      onRename(node.id, editName.trim());
    }
    setIsEditing(false);
  }, [node.id, editName, onRename]);

  // Resolve Lucide icon by name string
  const IconComponent = (LucideIcons as Record<string, any>)[node.icon] || LucideIcons.Box;

  // Build class list for 6 states
  let borderClass = 'border-fw-secondary';
  let ringClass = '';
  let shadowClass = 'shadow-sm';

  if (hasValidationError) {
    borderClass = 'border-red-500';
    ringClass = 'ring-2 ring-red-200';
  }
  if (isEdgeTarget) {
    ringClass = 'ring-2 ring-blue-300 animate-pulse';
  }
  if (isSelected) {
    borderClass = 'border-fw-active';
    ringClass = 'ring-2 ring-blue-200';
  }
  if (isDragging) {
    shadowClass = 'shadow-2xl';
  }

  return (
    <div
      ref={nodeRef}
      className={`
        absolute flex flex-col items-center justify-center
        w-16 h-16 rounded-xl border bg-fw-base
        transition-shadow duration-150
        ${borderClass} ${ringClass} ${shadowClass}
        ${isCreatingEdge ? 'cursor-crosshair' : isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        hover:shadow-md
      `}
      style={{
        transform: `translate(${node.x}px, ${node.y}px)${isDragging ? ' scale(1.05)' : ''}`,
        zIndex: isDragging ? 50 : isSelected ? 10 : 1,
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <IconComponent className="w-6 h-6 text-fw-heading" />

      {/* Node label */}
      {isEditing ? (
        <input
          autoFocus
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={handleRenameSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleRenameSubmit();
            if (e.key === 'Escape') setIsEditing(false);
          }}
          className="absolute -bottom-7 w-24 text-center text-figma-xs bg-fw-base border border-fw-secondary rounded px-1"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="absolute -bottom-6 text-figma-xs text-fw-body font-medium truncate max-w-[100px] text-center leading-tight">
          {node.name}
        </span>
      )}

      {/* Status dot */}
      <span
        className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-white ${
          node.status === 'active' ? 'bg-emerald-400' : 'bg-gray-300'
        }`}
      />
    </div>
  );
});
