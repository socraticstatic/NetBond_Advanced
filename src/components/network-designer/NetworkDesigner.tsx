import { useState, useRef, useEffect } from 'react';
import { ConnectionConfig } from './types';
import { Canvas } from './Canvas';
import { Toolbar } from './Toolbar';
import { StatusBar } from './StatusBar';
import { NodeConfigPanel } from './NodeConfigPanel';
import { EdgeConfigPanel } from './EdgeConfigPanel';
import { AbstractionLevelSelector } from './AbstractionLevelSelector';
import { GlobalView } from './global-view/GlobalView';
import { CircuitView } from './circuit-view/CircuitView';
import { TemplatesManager } from './panels/TemplatesManager';
import { SaveTemplateModal } from './SaveTemplateModal';
import { HistoryDrawer } from './HistoryDrawer';
import { NetworkSimulation } from './simulation/NetworkSimulation';
import {
  useNetworkHistory,
  useNetworkManager,
  useSelectionManager,
  useEdgeCreator,
  useTemplatesManager
} from '../../hooks';
import {
  runSimulation,
  pauseSimulation,
  resumeSimulation,
  cancelSimulation,
  injectLatency,
  injectPacketLoss,
  injectBandwidthLimit
} from './simulation/runSimulation';
import { getNodeIcon } from '../../utils/nodeUtils';
import { Z_INDEX, DEFAULT_NETWORK_CONFIG, CANVAS_BOUNDS } from '../../utils/designer-constants';
import { NetworkNode, NetworkEdge } from './types';

interface NetworkDesignerProps {
  onComplete: (config: ConnectionConfig) => void;
  onCancel: () => void;
}

type AbstractionLevel = 'global' | 'network' | 'circuit';

interface CustomTemplate {
  id: string;
  name: string;
  description: string;
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  isCustom?: boolean;
}

export function NetworkDesigner({ onComplete, onCancel }: NetworkDesignerProps) {
  // Refs
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Abstraction level state
  const [abstractionLevel, setAbstractionLevel] = useState<AbstractionLevel>('network');
  
  // Custom templates state
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);

  // History drawer state
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  
  // Network history management
  const { saveToHistory, undo, redo, canUndo, canRedo, history: networkHistory } = useNetworkHistory();
  
  // Network state management
  const {
    nodes,
    edges,
    networkScores,
    setNodes,
    setEdges,
    addNode,
    updateNode,
    deleteNode,
    updateEdge,
    deleteEdge,
    clearNetwork,
    applyTemplate
  } = useNetworkManager(saveToHistory);
  
  // Selection management
  const {
    selectedNode,
    selectedEdge,
    selectedNodeObject,
    selectedEdgeObject,
    showNodeConfig,
    showEdgeConfig,
    handleNodeSelection,
    handleEdgeSelection,
    clearSelection,
    setShowNodeConfig,
    setShowEdgeConfig
  } = useSelectionManager(nodes, edges);
  
  // Templates management
  const {
    showTemplatesDrawer,
    openTemplatesDrawer,
    closeTemplatesDrawer
  } = useTemplatesManager();
  
  // Edge creation
  const {
    isCreatingEdge,
    edgeStart,
    toggleEdgeCreation,
    handleNodeClickForEdge,
    cancelEdgeCreation
  } = useEdgeCreator(edges, setEdges, (edge) => {
    handleEdgeSelection(edge);
  });
  
  // UI state
  const [isRunningScenario, setIsRunningScenario] = useState(false);
  
  // Simulation data
  const [simulationData, setSimulationData] = useState({
    progress: 0,
    metrics: {
      bandwidth: { current: 0, max: 100 },
      latency: { current: 0, max: 100 },
      packets: { sent: 0, received: 0, errors: 0 }
    },
    phase: 'idle' as 'idle' | 'initializing' | 'running' | 'completed' | 'error' | 'paused',
    networkScores
  });
  
  // Cancel simulation on unmount to prevent stale state updates
  useEffect(() => {
    return () => {
      cancelSimulation();
    };
  }, []);

  // Update simulation network scores when networkScores change
  useEffect(() => {
    setSimulationData(prev => ({
      ...prev,
      networkScores
    }));
  }, [networkScores]);
  
  // Handle node click in canvas
  const handleNodeClick = (node: NetworkNode | null) => {
    if (!node) {
      clearSelection();
      if (isCreatingEdge) {
        cancelEdgeCreation();
      }
      return;
    }

    // If we're creating an edge, handle edge creation
    if (isCreatingEdge) {
      const handled = handleNodeClickForEdge(node.id, node.id);
      if (handled) return;
    }

    // Otherwise, handle node selection
    handleNodeSelection(node);
  };

  // Handle node selection without opening config (for single-click)
  const handleNodeSelect = (node: NetworkNode | null) => {
    if (!node) {
      clearSelection();
      return;
    }

    // If we're creating an edge, handle edge creation
    if (isCreatingEdge) {
      const handled = handleNodeClickForEdge(node.id, node.id);
      return;
    }

    // Select the node visually but don't open config
    handleNodeSelection(node);
    setShowNodeConfig(false);
  };

  // Handle node double-click to open config
  const handleNodeDoubleClick = (node: NetworkNode | null) => {
    if (!node || isCreatingEdge) return;

    // Select and open config panel
    handleNodeSelection(node);
    setShowNodeConfig(true);
  };
  
  // Handle node drag
  const handleNodeDrag = (nodeId: string, x: number, y: number) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    // Update node position
    setNodes(prev => 
      prev.map(n => n.id === nodeId ? { ...n, x, y: Math.min(y, CANVAS_BOUNDS.MAX_Y - CANVAS_BOUNDS.NODE_SIZE) } : n)
    );
  };
  
  // Handle node drag end
  const handleNodeDragEnd = () => {
    // Apply snap-to-grid at the END of dragging, not during
    // This prevents the jumping issue while still maintaining grid alignment
    const gridSize = CANVAS_BOUNDS.GRID_SIZE;
    const snappedNodes = nodes.map(node => ({
      ...node,
      x: Math.round(node.x / gridSize) * gridSize,
      y: Math.round(node.y / gridSize) * gridSize
    }));

    setNodes(snappedNodes);
    saveToHistory(snappedNodes, edges);
  };
  
  // Handle undo
  const handleUndo = () => {
    const restored = undo();
    if (restored) {
      setNodes(restored.nodes);
      setEdges(restored.edges);
      clearSelection();
    }
  };

  // Handle redo
  const handleRedo = () => {
    const restored = redo();
    if (restored) {
      setNodes(restored.nodes);
      setEdges(restored.edges);
      clearSelection();
    }
  };

  // Handle running simulation
  const handleRunSimulation = async () => {
    await runSimulation(
      nodes,
      edges,
      setNodes,
      setEdges,
      setSimulationData as any,
      setIsRunningScenario
    );
  };

  // Handle pausing simulation
  const handlePauseSimulation = () => {
    pauseSimulation();
  };

  // Handle resuming simulation
  const handleResumeSimulation = () => {
    resumeSimulation();
  };

  // Handle injecting latency
  const handleInjectLatency = (amount: number) => {
    injectLatency(amount);
    window.addToast({
      type: 'info',
      title: 'Latency Injection',
      message: `Added ${amount}ms of latency to the network`,
      duration: 3000
    });
  };

  // Handle injecting packet loss
  const handleInjectPacketLoss = (amount: number) => {
    injectPacketLoss(amount);
    window.addToast({
      type: 'info',
      title: 'Packet Loss Injection',
      message: `Added ${amount}% packet loss to the network`,
      duration: 3000
    });
  };

  // Handle limiting bandwidth
  const handleInjectBandwidthLimit = (amount: number) => {
    injectBandwidthLimit(amount);
    window.addToast({
      type: 'info',
      title: 'Bandwidth Limit',
      message: `Limited bandwidth to ${amount}% of maximum`,
      duration: 3000
    });
  };
  
  // Handle creating connections
  const handleCreateConnections = () => {
    if (!edges.length) {
      window.addToast({
        type: 'error',
        title: 'No Connections',
        message: 'Please create at least one connection first',
        duration: 3000
      });
      return;
    }

    // Convert edges to Connection objects
    const connections = edges.map((edge, index) => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);

      if (!sourceNode || !targetNode) {
        return null;
      }

      const connectionName = `${sourceNode.label} to ${targetNode.label}`;
      const connectionType = determineConnectionType(sourceNode, targetNode);

      return {
        id: edge.id,
        name: connectionName,
        type: connectionType,
        status: 'Inactive' as const,
        bandwidth: edge.bandwidth || '1 Gbps',
        location: targetNode.location || 'Custom',
        provider: targetNode.provider as any,
        features: {
          dedicatedConnection: true,
          redundantPath: false,
          autoScaling: false,
          loadBalancing: false
        },
        security: {
          encryption: 'AES-256',
          firewall: true,
          ddosProtection: true,
          ipSecEnabled: true
        },
        performance: {
          latency: edge.latency || '<10ms',
          packetLoss: '<0.1%',
          uptime: '99.9%',
          throughput: '0%',
          tunnels: 'Inactive',
          bandwidthUtilization: 0,
          currentUsage: '0 Gbps',
          utilizationTrend: [0, 0, 0, 0, 0, 0, 0]
        },
        billing: {
          baseFee: 999.99,
          usage: 0,
          total: 999.99,
          currency: 'USD'
        },
        createdAt: new Date().toISOString(),
        configuration: {
          sourceNode: sourceNode.id,
          targetNode: targetNode.id,
          visualDesign: { nodes, edges }
        }
      };
    }).filter(Boolean);

    if (connections.length === 0) {
      window.addToast({
        type: 'error',
        title: 'Invalid Network',
        message: 'Could not create connections from the network design',
        duration: 3000
      });
      return;
    }

    // Return connections array to wizard
    onComplete(connections as any);
  };

  // Helper to determine connection type based on node types
  const determineConnectionType = (sourceNode: NetworkNode, targetNode: NetworkNode): string => {
    const sourceType = sourceNode.type.toLowerCase();
    const targetType = targetNode.type.toLowerCase();

    if (sourceType.includes('internet') && targetType.includes('cloud')) {
      return 'Internet to Cloud';
    }
    if (sourceType.includes('cloud') && targetType.includes('cloud')) {
      return 'Cloud to Cloud';
    }
    if (sourceType.includes('datacenter') && targetType.includes('cloud')) {
      return 'DataCenter/CoLocation to Cloud';
    }
    if (sourceType.includes('site') && targetType.includes('cloud')) {
      return 'Site to Cloud';
    }

    return 'Internet to Cloud';
  };
  
  // Handle saving the current network as a template
  const handleSaveTemplate = () => {
    setShowSaveTemplateModal(true);
  };
  
  // Handle save template submission
  const handleSaveTemplateSubmit = (name: string, description: string) => {
    const newTemplate: CustomTemplate = {
      id: `custom-${Date.now()}`,
      name,
      description,
      nodes: [...nodes],
      edges: [...edges],
      isCustom: true
    };
    
    setCustomTemplates([...customTemplates, newTemplate]);
    setShowSaveTemplateModal(false);
    
    window.addToast({
      type: 'success',
      title: 'Template Saved',
      message: `Your network has been saved as template "${name}"`,
      duration: 3000
    });
  };
  
  // Handle deleting a custom template
  const handleDeleteCustomTemplate = (id: string) => {
    setCustomTemplates(customTemplates.filter(template => template.id !== id));
    
    window.addToast({
      type: 'success',
      title: 'Template Deleted',
      message: 'Custom template has been deleted',
      duration: 3000
    });
  };
  
  // Handle applying pattern from outcome selector
  const handleApplyOutcomePattern = (patternNodes: NetworkNode[], patternEdges: NetworkEdge[]) => {
    // If we already have nodes, position new ones appropriately
    if (nodes.length > 0) {
      // Calculate average position of existing nodes
      const existingXs = nodes.map(n => n.x);
      const existingYs = nodes.map(n => n.y);
      const avgX = existingXs.reduce((sum, x) => sum + x, 0) / existingXs.length;
      const avgY = existingYs.reduce((sum, y) => sum + y, 0) / existingYs.length;
      
      // Map to keep track of old IDs to new IDs
      const idMap = new Map<string, string>();
      
      // Create nodes with new IDs and adjusted positions
      const newNodes = patternNodes.map(node => {
        const newId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        idMap.set(node.id, newId);
        
        // Position new nodes to the side of existing ones
        const adjustedX = avgX > 400 ? node.x - 200 : node.x + 200;
        
        return {
          ...node,
          id: newId,
          x: adjustedX,
          y: node.y
        };
      });
      
      // Create edges with updated node references
      const newEdges = patternEdges.map(edge => {
        const newSource = idMap.get(edge.source) || edge.source;
        const newTarget = idMap.get(edge.target) || edge.target;
        
        return {
          ...edge,
          id: `edge-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          source: newSource,
          target: newTarget
        };
      });
      
      // Add new nodes and edges to existing ones
      setNodes([...nodes, ...newNodes]);
      setEdges([...edges, ...newEdges]);
      saveToHistory([...nodes, ...newNodes], [...edges, ...newEdges]);
    } else {
      // If no existing nodes, just use the pattern nodes and edges
      setNodes(patternNodes);
      setEdges(patternEdges);
      saveToHistory(patternNodes, patternEdges);
    }
    
    window.addToast({
      type: 'success',
      title: 'Pattern Applied',
      message: 'Network pattern has been applied',
      duration: 3000
    });
  };
  
  // Handle parameter change
  const handleParameterChange = (parameter: string, value: number) => {
    setSimulationData(prev => ({
      ...prev,
      networkScores: {
        ...prev.networkScores,
        [parameter]: value
      }
    }));
  };
  
  // Handle zoom to specific node in circuit view
  const handleZoomToNode = (nodeId: string) => {
    handleNodeSelection(nodes.find(n => n.id === nodeId) || null);
    setAbstractionLevel('network');
  };
  
  // Helper to render the current abstraction level view
  const renderAbstractionLevelView = () => {
    switch (abstractionLevel) {
      case 'global':
        return (
          <GlobalView
            nodes={nodes}
            edges={edges}
            onNodeSelect={handleZoomToNode}
            onZoomIn={(datacenterId) => {
              handleNodeSelection(nodes.find(n => n.id === datacenterId) || null);
              setAbstractionLevel('network');
            }}
          />
        );
        
      case 'network':
        return (
          <Canvas
            nodes={nodes}
            edges={edges}
            selectedNode={selectedNode}
            selectedEdge={selectedEdge}
            isCreatingEdge={isCreatingEdge}
            edgeStart={edgeStart}
            onNodeClick={handleNodeClick}
            onNodeSelect={handleNodeSelect}
            onNodeDoubleClick={handleNodeDoubleClick}
            onNodeDrag={handleNodeDrag}
            onNodeDragEnd={handleNodeDragEnd}
            onEdgeClick={handleEdgeSelection}
            maxY={800}
            ref={canvasRef}
          />
        );
        
      case 'circuit':
        return (
          <CircuitView
            nodes={nodes}
            edges={edges}
            selectedNode={selectedNode}
            onNodeSelect={handleNodeSelection}
            onZoomOut={() => setAbstractionLevel('network')}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 rounded-xl border-2 border-gray-200 relative overflow-hidden">
      {/* Main Content Area */}
      <div className="relative h-[600px] md:h-[700px] lg:h-[800px]">
        {/* Abstraction Level Selector - Positioned on left side, vertically centered */}
        <div style={{ zIndex: Z_INDEX.UI_CONTROLS }}>
          <AbstractionLevelSelector
            currentLevel={abstractionLevel}
            onLevelChange={setAbstractionLevel}
            onHistoryClick={() => setShowHistoryDrawer(true)}
          />
        </div>

        {/* Status Bar - Positioned at top center with high z-index */}
        <div style={{ zIndex: Z_INDEX.UI_CONTROLS }}>
          <StatusBar
            nodes={nodes}
            edges={edges}
            canvasRef={canvasRef}
            onRefresh={() => {
              window.addToast({
                type: 'info',
                title: 'Refreshing Network',
                message: 'Updating network status and metrics...',
                duration: 2000
              });
            }}
          />
        </div>

        {/* Render the current abstraction level view */}
        <div className="absolute inset-0" style={{ zIndex: Z_INDEX.CANVAS }}>
          {renderAbstractionLevelView()}
        </div>

        {/* Toolbar - Only show in network view with highest z-index */}
        {abstractionLevel === 'network' && (
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: Z_INDEX.TOOLBAR }}>
            <div className="pointer-events-auto">
              <Toolbar
                onAddNode={addNode}
                onToggleEdgeCreation={toggleEdgeCreation}
                isCreatingEdge={isCreatingEdge}
                onCancel={handleUndo}
                hasConnections={edges.length > 0}
                canUndo={canUndo}
                onRunScenario={handleRunSimulation}
                isRunningScenario={isRunningScenario}
                onCreateConnections={handleCreateConnections}
                onSaveTemplate={handleSaveTemplate}
                onClearCanvas={clearNetwork}
                onOpenTemplates={openTemplatesDrawer}
              />
            </div>
          </div>
        )}
        
        {/* Node Configuration Panel - Only in network view */}
        {abstractionLevel === 'network' && selectedNodeObject && showNodeConfig && (
          <div style={{ zIndex: Z_INDEX.MODAL }}>
            <NodeConfigPanel
              node={selectedNodeObject}
              isVisible={showNodeConfig}
              onClose={() => setShowNodeConfig(false)}
              onUpdate={(updates) => updateNode(selectedNodeObject.id, updates)}
              onDelete={deleteNode}
              containerRef={canvasRef}
            />
          </div>
        )}

        {/* Edge Configuration Panel - Only in network view */}
        {abstractionLevel === 'network' && selectedEdgeObject && showEdgeConfig && (
          <div style={{ zIndex: Z_INDEX.MODAL }}>
            <EdgeConfigPanel
              edge={selectedEdgeObject}
              nodes={nodes}
              isVisible={showEdgeConfig}
              onClose={() => setShowEdgeConfig(false)}
              onUpdate={(updates) => updateEdge(selectedEdgeObject.id, updates)}
              onDelete={() => deleteEdge(selectedEdgeObject.id)}
              containerRef={canvasRef}
            />
          </div>
        )}

        {/* Simulation Overlay */}
        <div style={{ zIndex: Z_INDEX.OVERLAY }}>
          <NetworkSimulation
            isRunning={isRunningScenario}
            simulationData={simulationData as any}
            onPause={handlePauseSimulation}
            onResume={handleResumeSimulation}
            onInjectLatency={handleInjectLatency}
            onInjectPacketLoss={handleInjectPacketLoss}
            onInjectBandwidthLimit={handleInjectBandwidthLimit}
          />
        </div>
        
        {/* Save Template Modal */}
        <SaveTemplateModal
          isOpen={showSaveTemplateModal}
          onClose={() => setShowSaveTemplateModal(false)}
          onSave={handleSaveTemplateSubmit}
        />
      </div>


      {/* Templates Manager */}
      <TemplatesManager
        isOpen={showTemplatesDrawer}
        onClose={closeTemplatesDrawer}
        onApplyTemplate={applyTemplate}
        customTemplates={customTemplates}
        onDeleteCustomTemplate={handleDeleteCustomTemplate}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={showHistoryDrawer}
        onClose={() => setShowHistoryDrawer(false)}
        history={networkHistory.nodes.map((nodeSet, index) => ({
          id: `history-${index}`,
          timestamp: Date.now() - (networkHistory.nodes.length - 1 - index) * 1000,
          nodes: nodeSet,
          edges: networkHistory.edges[index] || [],
          preview: `${nodeSet.length} node${nodeSet.length !== 1 ? 's' : ''}, ${(networkHistory.edges[index] || []).length} edge${(networkHistory.edges[index] || []).length !== 1 ? 's' : ''}`
        })).reverse()}
        onRestoreTopology={(nodes, edges) => {
          setNodes(nodes);
          setEdges(edges);
          saveToHistory(nodes, edges);
          window.addToast({
            type: 'success',
            title: 'Topology Restored',
            message: 'Previous topology has been restored',
            duration: 3000
          });
        }}
      />
    </div>
  );
}