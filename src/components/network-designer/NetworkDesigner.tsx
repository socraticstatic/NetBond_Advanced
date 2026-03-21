import { useEffect, useCallback } from 'react';
import { Minimize2 } from 'lucide-react';
import type { Connection, NetworkNode as LegacyNetworkNode, NetworkEdge as LegacyNetworkEdge } from '../../types';
import type { NetworkNode, NetworkEdge } from './types/designer';
import { useDesignerStore } from './store/useDesignerStore';
import { useNetworkManager } from './hooks/useNetworkManager';
import { useSelectionManager } from './hooks/useSelectionManager';
import { useEdgeCreator } from './hooks/useEdgeCreator';
import { useNetworkHistory } from './hooks/useNetworkHistory';
import { Canvas } from './Canvas';
import { Node } from './Node';
import { Edge } from './Edge';
import { ZoomControls } from './ZoomControls';
import { Toolbar } from './Toolbar';
import { StatusBar } from './StatusBar';

// Preserve the props interface so LazyNetworkDesigner and ConnectionWizard still work
interface NetworkDesignerProps {
  onComplete: (config: Connection[]) => void;
  onCancel: () => void;
  initialNodes?: LegacyNetworkNode[];
  initialEdges?: LegacyNetworkEdge[];
  editMode?: boolean;
  connectionId?: string;
}

function legacyNodeToNew(n: LegacyNetworkNode): NetworkNode {
  return {
    id: n.id,
    type: n.type === 'source' || n.type === 'router' ? 'function' : (n.type as NetworkNode['type']),
    functionType: n.type,
    x: n.x,
    y: n.y,
    name: n.name,
    icon: 'Box',
    status: n.status === 'active' ? 'active' : 'inactive',
    config: n.config || {},
  };
}

function legacyEdgeToNew(e: LegacyNetworkEdge): NetworkEdge {
  return {
    id: e.id,
    source: e.source,
    target: e.target,
    type: e.type || 'Ethernet',
    bandwidth: e.bandwidth || '1 Gbps',
    status: e.status === 'active' ? 'active' : 'inactive',
  };
}

export function NetworkDesigner({
  onComplete,
  onCancel,
  initialNodes = [],
  initialEdges = [],
  editMode = false,
  connectionId,
}: NetworkDesignerProps) {
  // Store state
  const nodes = useDesignerStore((s) => s.nodes);
  const edges = useDesignerStore((s) => s.edges);
  const isMaximized = useDesignerStore((s) => s.isMaximized);
  const selectedNodeId = useDesignerStore((s) => s.selectedNodeId);
  const selectedEdgeId = useDesignerStore((s) => s.selectedEdgeId);
  const setNodes = useDesignerStore((s) => s.setNodes);
  const setEdges = useDesignerStore((s) => s.setEdges);
  const toggleMaximize = useDesignerStore((s) => s.toggleMaximize);
  const saveToHistoryStore = useDesignerStore((s) => s.saveToHistory);

  // Hooks
  const { addNode, moveNode, updateNode, deleteNode, deleteEdge, clearCanvas } = useNetworkManager();
  const { handleNodeSelection, handleEdgeSelection, clearSelection } = useSelectionManager();
  const { isCreatingEdge, edgeStartNodeId, toggleEdgeCreation, handleNodeClickForEdge, cancelEdgeCreation } = useEdgeCreator();
  const { undo, canUndo } = useNetworkHistory();

  // Initialize store with initial nodes/edges on mount
  useEffect(() => {
    if (initialNodes.length > 0 || initialEdges.length > 0) {
      const converted = initialNodes.map(legacyNodeToNew);
      const convertedEdges = initialEdges.map(legacyEdgeToNew);
      setNodes(converted);
      setEdges(convertedEdges);
      saveToHistoryStore();
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId) deleteNode(selectedNodeId);
        else if (selectedEdgeId) deleteEdge(selectedEdgeId);
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }

      if (e.key === 'Escape') {
        if (isCreatingEdge) {
          cancelEdgeCreation();
        } else {
          clearSelection();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, selectedEdgeId, isCreatingEdge, deleteNode, deleteEdge, undo, cancelEdgeCreation, clearSelection]);

  // Node handlers
  const handleNodeSelect = useCallback((id: string) => {
    if (!isCreatingEdge) {
      handleNodeSelection(id);
    }
  }, [isCreatingEdge, handleNodeSelection]);

  const handleNodeDrag = useCallback((id: string, x: number, y: number) => {
    moveNode(id, x, y);
  }, [moveNode]);

  const handleNodeDragEnd = useCallback(() => {
    saveToHistoryStore();
  }, [saveToHistoryStore]);

  const handleNodeEdgeClick = useCallback((id: string) => {
    handleNodeClickForEdge(id);
  }, [handleNodeClickForEdge]);

  const handleNodeRename = useCallback((id: string, name: string) => {
    updateNode(id, { name });
  }, [updateNode]);

  // Edge handler
  const handleEdgeClick = useCallback((id: string) => {
    handleEdgeSelection(id);
  }, [handleEdgeSelection]);

  // Add a router node (Phase 1 minimal - full dropdown in Task 10)
  const handleAddNode = useCallback(() => {
    addNode('function', 'router');
  }, [addNode]);

  // Build connections from edges and call onComplete
  const handleCreateConnections = useCallback(() => {
    if (edges.length === 0) {
      window.addToast?.({
        type: 'warning',
        title: 'No Connections',
        message: 'Please create at least one connection before proceeding',
        duration: 3000,
      });
      return;
    }

    const connections: Connection[] = edges.map((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);

      return {
        id: editMode && connectionId ? connectionId : `conn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: `${sourceNode?.name || 'Source'} to ${targetNode?.name || 'Target'}`,
        type: (edge.type as Connection['type']) || 'Internet to Cloud',
        status: 'Inactive',
        bandwidth: edge.bandwidth,
        location: sourceNode?.config?.region || targetNode?.config?.region || 'US East',
        provider: targetNode?.config?.provider,
      };
    });

    onComplete(connections);
  }, [edges, nodes, editMode, connectionId, onComplete]);

  // Layout
  const containerClass = isMaximized
    ? 'fixed inset-0 z-50 bg-fw-wash'
    : 'relative w-full h-[600px] bg-fw-wash rounded-2xl border border-fw-secondary overflow-hidden';

  // Render edges as SVG content, nodes as children
  const svgContent = (
    <>
      {edges.map((edge) => (
        <Edge
          key={edge.id}
          edge={edge}
          nodes={nodes}
          isSelected={edge.id === selectedEdgeId}
          onClick={handleEdgeClick}
        />
      ))}
    </>
  );

  const nodeChildren = (
    <>
      {nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          isSelected={node.id === selectedNodeId}
          isEdgeTarget={isCreatingEdge && node.id !== edgeStartNodeId}
          hasValidationError={false}
          isCreatingEdge={isCreatingEdge}
          onSelect={handleNodeSelect}
          onDrag={handleNodeDrag}
          onDragEnd={handleNodeDragEnd}
          onEdgeClick={handleNodeEdgeClick}
          onRename={handleNodeRename}
        />
      ))}
    </>
  );

  return (
    <div className={containerClass}>
      {/* Floating minimize button when maximized */}
      {isMaximized && (
        <button
          onClick={toggleMaximize}
          className="fixed top-4 right-4 z-[60] inline-flex items-center gap-2 h-9 px-4 text-figma-base font-medium text-fw-heading bg-fw-base border border-fw-secondary rounded-full shadow-lg hover:bg-fw-wash transition-colors"
        >
          <Minimize2 className="h-4 w-4" />
          Minimize
        </button>
      )}

      {/* StatusBar - top center */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <StatusBar nodes={nodes} edges={edges} />
      </div>

      {/* Canvas - fills the container */}
      <Canvas svgContent={svgContent}>
        {nodeChildren}
      </Canvas>

      {/* ZoomControls - bottom right */}
      <ZoomControls />

      {/* Toolbar - bottom center */}
      <Toolbar
        onAddNode={handleAddNode}
        onToggleEdgeCreation={toggleEdgeCreation}
        isCreatingEdge={isCreatingEdge}
        onUndo={undo}
        canUndo={canUndo}
        onClearCanvas={clearCanvas}
        onToggleMaximize={toggleMaximize}
        isMaximized={isMaximized}
        onCreateConnections={handleCreateConnections}
        hasConnections={edges.length > 0}
      />
    </div>
  );
}
