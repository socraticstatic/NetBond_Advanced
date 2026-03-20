import { useState, useRef, useEffect, memo } from 'react';
import { NetworkNode } from '../types';
import { getNodeColors } from '../../utils/nodeUtils';
import { CANVAS_BOUNDS, Z_INDEX } from '../../utils/designer-constants';

interface NodeProps {
  node: NetworkNode;
  isSelected: boolean;
  isCreatingEdge: boolean;
  isReadOnly?: boolean;
  onClick: () => void;
  onSelect?: () => void;
  onDoubleClick?: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDrag: (x: number, y: number) => void;
  onNameChange?: (newName: string) => void;
  zoomLevel?: number;
  panOffset?: { x: number; y: number };
}

// Debug flag - set to true to enable detailed drag logging
const DEBUG_DRAG = true;

const debugLog = (...args: any[]) => {
  if (DEBUG_DRAG) {
    console.log('[Node Debug]', ...args);
  }
};

// Memoize the Node component for better performance
export const Node = memo(function Node({
  node,
  isSelected,
  isCreatingEdge,
  isReadOnly = false,
  onClick,
  onSelect,
  onDoubleClick: onDoubleClickProp,
  onDragStart,
  onDragEnd,
  onDrag,
  onNameChange,
  zoomLevel = 1,
  panOffset = { x: 0, y: 0 }
}: NodeProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isEditingName, setIsEditingName] = useState(false);
  const [nodeName, setNodeName] = useState(node.name);
  const [hasDragged, setHasDragged] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const initialNodePos = useRef({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const clickTimeoutRef = useRef<number | null>(null);
  const lastClickTime = useRef<number>(0);

  // Track node position
  const [position, setPosition] = useState({ x: node.x, y: node.y });

  // Update position when node coordinates change (but NOT during dragging)
  useEffect(() => {
    if (!isDragging) {
      debugLog('Position update (not dragging)', {
        oldPosition: position,
        newNodePosition: { x: node.x, y: node.y },
        isDragging
      });
      setPosition({ x: node.x, y: node.y });
    } else {
      debugLog('Position update skipped (dragging)', {
        currentPosition: position,
        nodePosition: { x: node.x, y: node.y },
        isDragging
      });
    }
  }, [node.x, node.y, isDragging]);

  // Handle drag events
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (nodeRef.current) {
        const rect = nodeRef.current.parentElement?.getBoundingClientRect();
        if (rect) {
          // Check if we've moved more than 10 pixels (threshold to detect drag)
          const deltaX = Math.abs(e.clientX - dragStartPos.current.x);
          const deltaY = Math.abs(e.clientY - dragStartPos.current.y);

          debugLog('Mouse move', {
            deltaX,
            deltaY,
            threshold: 10,
            hasDragged
          });

          // Only start actual dragging if moved beyond threshold
          if (deltaX > 10 || deltaY > 10) {
            if (!hasDragged) {
              setHasDragged(true);
              debugLog('Drag started - threshold exceeded');
            }

            // Calculate position accounting for zoom level and drag offset
            // CRITICAL FIX: rect.left and rect.top ALREADY include panOffset (parent transform)
            // We only need to account for zoomLevel and dragOffset
            const x = ((e.clientX - rect.left) / zoomLevel) - dragOffset.x;
            const y = ((e.clientY - rect.top) / zoomLevel) - dragOffset.y;

            debugLog('Drag position calculated (FIXED)', {
              mouseX: e.clientX,
              mouseY: e.clientY,
              rectLeft: rect.left,
              rectTop: rect.top,
              panOffsetIgnored: panOffset,
              zoomLevel,
              dragOffset,
              calculatedX: x,
              calculatedY: y,
              fix: 'Not subtracting panOffset - already in rect'
            });

            // Send raw coordinates to parent - let Canvas handle snapping
            debugLog('Calling onDrag with:', { x, y });
            onDrag(x, y);
          }
        }
      }
    };

    const handleMouseUp = () => {
      debugLog('Mouse up', {
        hasDragged,
        isDragging,
        currentPosition: position,
        nodePosition: { x: node.x, y: node.y }
      });

      setIsDragging(false);

      // Only call onDragEnd if we actually dragged
      if (hasDragged) {
        debugLog('Calling onDragEnd (drag completed)');
        onDragEnd();
      } else {
        debugLog('Skipping onDragEnd (no drag occurred)');
      }

      // Reset hasDragged after a short delay
      setTimeout(() => {
        setHasDragged(false);
        debugLog('=== MOUSEUP COMPLETE ===', {
          finalPosition: position,
          finalNodePosition: { x: node.x, y: node.y }
        });
      }, 100);

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onDrag, onDragEnd, zoomLevel, hasDragged, panOffset]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  const Icon = node.icon;

  // Get node colors
  const colors = getNodeColors(node);
  const background = isSelected ? 'bg-blue-50' : isDragging ? 'bg-gray-50' : colors.background;
  const iconColor = isSelected ? 'text-blue-500' : isDragging ? 'text-gray-600' : colors.icon;

  const handleNameSubmit = () => {
    if (nodeName.trim() && onNameChange) {
      onNameChange(nodeName.trim());
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setNodeName(node.name);
      setIsEditingName(false);
    }
  };

  return (
    <>
      <div
        ref={nodeRef}
        className={`
          absolute w-16 h-16 flex items-center justify-center
          rounded-lg
          ${isDragging ? 'transition-shadow duration-200' : 'transition-all duration-200'}
          ${background}
          ${isReadOnly ? 'cursor-default' : isCreatingEdge ? 'cursor-crosshair' : isDragging ? 'cursor-grabbing' : 'cursor-grab'}
          ${isDragging ? 'shadow-lg' : 'shadow-sm hover:shadow-md'}
          border-2 ${isSelected ? 'border-blue-500' : isCreatingEdge ? 'border-blue-400 border-dashed' : 'border-gray-200'}
        `}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          zIndex: Z_INDEX.NODES
        }}
        onMouseEnter={() => !isReadOnly && !isDragging && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={(e) => {
          e.stopPropagation();

          debugLog('onClick handler', {
            isCreatingEdge,
            isReadOnly,
            hasDragged,
            position,
            nodePosition: { x: node.x, y: node.y }
          });

          // Handle edge creation mode
          if (isCreatingEdge && !isReadOnly) {
            debugLog('Edge creation mode - calling onClick');
            onClick();
            return;
          }

          // Handle normal click - only if we didn't drag
          if (!isReadOnly && !hasDragged) {
            const now = Date.now();
            const timeSinceLastClick = now - lastClickTime.current;

            // Check if this is a double-click (within 300ms)
            if (timeSinceLastClick < 300) {
              // This is a double-click - open config panel
              if (clickTimeoutRef.current) {
                clearTimeout(clickTimeoutRef.current);
                clickTimeoutRef.current = null;
              }
              if (onDoubleClickProp) {
                onDoubleClickProp();
              } else {
                onClick();
              }
              setShowTooltip(false);
              lastClickTime.current = 0; // Reset to prevent triple-click issues
            } else {
              // This might be a single click - wait to see if double-click follows
              lastClickTime.current = now;

              // Set a timeout to handle single-click selection
              if (clickTimeoutRef.current) {
                clearTimeout(clickTimeoutRef.current);
              }
              clickTimeoutRef.current = window.setTimeout(() => {
                // Single click - just select (visual feedback)
                if (onSelect) {
                  onSelect();
                } else {
                  onClick();
                }
                clickTimeoutRef.current = null;
              }, 300);
            }
          }
        }}
        onMouseDown={(e) => {
          if (!isCreatingEdge && nodeRef.current && !isReadOnly) {
            e.stopPropagation();
            setShowTooltip(false);

            debugLog('=== MOUSEDOWN START ===');
            debugLog('Position vs Node:', {
              positionState: position,
              nodeFromStore: { x: node.x, y: node.y },
              inSync: position.x === node.x && position.y === node.y
            });

            // Store initial mouse position for drag detection
            dragStartPos.current = { x: e.clientX, y: e.clientY };

            // Store the initial node position - THIS IS KEY to prevent jumping
            initialNodePos.current = { x: node.x, y: node.y };
            setHasDragged(false);

            // Get the parent canvas element to calculate proper offset
            const parentRect = nodeRef.current.parentElement?.getBoundingClientRect();
            if (parentRect) {
              // CRITICAL FIX: getBoundingClientRect() returns coordinates AFTER parent transforms are applied
              // The parent has: transform: translate(panOffset.x, panOffset.y) scale(zoomLevel)
              // So rect.left and rect.top ALREADY include the panOffset translation
              // We should NOT subtract panOffset again - that causes double-accounting!
              //
              // The correct calculation is:
              // 1. Get mouse position relative to the transformed parent
              // 2. Only divide by zoomLevel to account for scale
              const mouseXInCanvas = (e.clientX - parentRect.left) / zoomLevel;
              const mouseYInCanvas = (e.clientY - parentRect.top) / zoomLevel;

              // Store how far the mouse is from the node's top-left corner
              // This offset stays constant throughout the drag
              const calculatedOffset = {
                x: mouseXInCanvas - node.x,
                y: mouseYInCanvas - node.y
              };

              debugLog('Mouse down - initializing drag (FIXED)', {
                mouseClient: { x: e.clientX, y: e.clientY },
                rectLeft: parentRect.left,
                rectTop: parentRect.top,
                panOffsetIgnored: panOffset,
                zoomLevel,
                mouseXInCanvas,
                mouseYInCanvas,
                nodePosition: { x: node.x, y: node.y },
                calculatedOffset,
                fix: 'getBoundingClientRect includes parent transform'
              });

              setDragOffset(calculatedOffset);
            }

            setIsDragging(true);
            onDragStart();
          }
        }}
      >
        {/* Background Glow Effect */}
        {isSelected && (
          <div className="absolute inset-0 rounded-lg blur-sm opacity-20 bg-blue-400" />
        )}

        {/* Icon */}
        <Icon className={`
          h-8 w-8 transition-all duration-200
          ${iconColor}
          ${isDragging ? 'scale-90' : 'scale-100'}
        `} />
        
        {/* Node Label */}
        <div 
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
          style={{ fontSize: `${Math.max(12, 12 / zoomLevel)}px` }}
        >
          {isEditingName ? (
            <input
              key={node.id}
              ref={nameInputRef}
              type="text"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={handleNameKeyDown}
              className="px-1 py-0.5 text-xs font-medium bg-white border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ 
                minWidth: '100px',
                fontSize: `${Math.max(12, 12 / zoomLevel)}px`
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span 
              className={`
                text-xs font-medium transition-all duration-200
                ${isSelected ? 'text-blue-700' : 'text-gray-600'}
                hover:text-blue-600 cursor-text
              `}
              onClick={(e) => {
                e.stopPropagation();
                if (!isReadOnly) {
                  setIsEditingName(true);
                }
              }}
              style={{ fontSize: `${Math.max(12, 12 / zoomLevel)}px` }}
            >
              {node.name}
            </span>
          )}
        </div>

        {/* Status Indicator */}
        {!isReadOnly && (
          <div className="absolute -top-1 -right-1">
            <div className={`w-3 h-3 rounded-full ${colors.status}`} />
          </div>
        )}

        {/* Connection Points */}
        {isCreatingEdge && (
          <>
            <div className="absolute inset-0 rounded-lg border-2 border-blue-500 border-dashed" />
            <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500" />
            <div className="absolute top-1/2 -translate-y-1/2 -right-2 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500" />
          </>
        )}

        {/* Tooltip */}
        {showTooltip && !isEditingName && !isCreatingEdge && node.name !== 'AT&T Core' && (
          <div
            className="absolute -top-14 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap pointer-events-none z-50 shadow-lg"
            style={{ fontSize: `${Math.max(11, 11 / zoomLevel)}px` }}
          >
            <div className="text-center">
              <div>Click to select</div>
              <div className="opacity-75">Double-click to configure</div>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
              <div className="border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        )}
      </div>

    </>
  );
});