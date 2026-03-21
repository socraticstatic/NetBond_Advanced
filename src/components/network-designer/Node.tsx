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
  const dragStartPos = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isCreatingEdge || !nodeRef.current) return;
      e.stopPropagation();

      const rect = nodeRef.current.getBoundingClientRect();
      const offset = {
        x: (e.clientX - rect.left) / zoomLevel,
        y: (e.clientY - rect.top) / zoomLevel,
      };
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      hasDraggedRef.current = false;

      let dragStarted = false;

      const handleMove = (me: MouseEvent) => {
        const dx = Math.abs(me.clientX - dragStartPos.current.x);
        const dy = Math.abs(me.clientY - dragStartPos.current.y);

        if (dx > 5 || dy > 5) {
          if (!dragStarted) {
            dragStarted = true;
            setIsDragging(true);
          }
          hasDraggedRef.current = true;

          const parentRect = nodeRef.current?.parentElement?.getBoundingClientRect();
          if (parentRect) {
            onDrag(
              node.id,
              (me.clientX - parentRect.left) / zoomLevel - offset.x,
              (me.clientY - parentRect.top) / zoomLevel - offset.y
            );
          }
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
    [node.id, zoomLevel, isCreatingEdge, onDrag, onDragEnd, onSelect]
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
  let scaleClass = '';
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
    scaleClass = 'scale-105';
    shadowClass = 'shadow-2xl';
  }

  return (
    <div
      ref={nodeRef}
      className={`
        absolute flex flex-col items-center justify-center
        w-16 h-16 rounded-xl border bg-fw-base
        transition-shadow duration-150
        ${borderClass} ${ringClass} ${scaleClass} ${shadowClass}
        ${isCreatingEdge ? 'cursor-crosshair' : isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        hover:shadow-md
      `}
      style={{
        transform: `translate(${node.x}px, ${node.y}px)`,
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
