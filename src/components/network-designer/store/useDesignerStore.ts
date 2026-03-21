import { create } from 'zustand';
import type { NetworkNode, NetworkEdge } from '../types/designer';
import { snapToGrid } from '../constants/canvasBounds';

interface HistoryEntry {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

interface DesignerState {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  panOffset: { x: number; y: number };
  zoomLevel: number;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  isCreatingEdge: boolean;
  edgeStartNodeId: string | null;
  isMaximized: boolean;
  history: HistoryEntry[];
  historyIndex: number;

  setNodes: (nodes: NetworkNode[]) => void;
  setEdges: (edges: NetworkEdge[]) => void;
  setPanOffset: (offset: { x: number; y: number }) => void;
  setZoomLevel: (level: number) => void;
  addNode: (node: NetworkNode) => void;
  updateNode: (id: string, updates: Partial<NetworkNode>) => void;
  removeNode: (id: string) => void;
  moveNode: (id: string, x: number, y: number) => void;
  addEdge: (edge: NetworkEdge) => void;
  updateEdge: (id: string, updates: Partial<NetworkEdge>) => void;
  removeEdge: (id: string) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  startEdgeCreation: () => void;
  setEdgeStartNode: (id: string | null) => void;
  cancelEdgeCreation: () => void;
  saveToHistory: () => void;
  undo: () => void;
  clearCanvas: () => void;
  toggleMaximize: () => void;
  loadTemplate: (nodes: NetworkNode[], edges: NetworkEdge[]) => void;
}

export const useDesignerStore = create<DesignerState>((set, get) => ({
  nodes: [],
  edges: [],
  panOffset: { x: 0, y: 0 },
  zoomLevel: 1,
  selectedNodeId: null,
  selectedEdgeId: null,
  isCreatingEdge: false,
  edgeStartNodeId: null,
  isMaximized: false,
  history: [],
  historyIndex: -1,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setPanOffset: (offset) => set({ panOffset: offset }),
  setZoomLevel: (level) => set({ zoomLevel: Math.max(0.5, Math.min(level, 3.0)) }),

  addNode: (node) => set((s) => ({ nodes: [...s.nodes, node] })),
  updateNode: (id, updates) =>
    set((s) => ({
      nodes: s.nodes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    })),
  removeNode: (id) =>
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
    })),
  moveNode: (id, x, y) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, x: snapToGrid(x), y: snapToGrid(y) } : n
      ),
    })),

  addEdge: (edge) => set((s) => ({ edges: [...s.edges, edge] })),
  updateEdge: (id, updates) =>
    set((s) => ({
      edges: s.edges.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    })),
  removeEdge: (id) =>
    set((s) => ({
      edges: s.edges.filter((e) => e.id !== id),
      selectedEdgeId: s.selectedEdgeId === id ? null : s.selectedEdgeId,
    })),

  selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),

  startEdgeCreation: () => set({ isCreatingEdge: true, edgeStartNodeId: null }),
  setEdgeStartNode: (id) => set({ edgeStartNodeId: id }),
  cancelEdgeCreation: () => set({ isCreatingEdge: false, edgeStartNodeId: null }),

  saveToHistory: () => {
    const { nodes, edges, history, historyIndex } = get();
    const newEntry: HistoryEntry = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };
    const truncated = history.slice(0, historyIndex + 1);
    set({
      history: [...truncated, newEntry],
      historyIndex: truncated.length,
    });
  },
  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      set({
        nodes: JSON.parse(JSON.stringify(prev.nodes)),
        edges: JSON.parse(JSON.stringify(prev.edges)),
        historyIndex: historyIndex - 1,
        selectedNodeId: null,
        selectedEdgeId: null,
      });
    }
  },

  clearCanvas: () => {
    get().saveToHistory();
    set({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      selectedEdgeId: null,
      isCreatingEdge: false,
      edgeStartNodeId: null,
    });
  },
  toggleMaximize: () => set((s) => ({ isMaximized: !s.isMaximized })),
  loadTemplate: (nodes, edges) => {
    get().saveToHistory();
    set({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      selectedNodeId: null,
      selectedEdgeId: null,
    });
  },
}));
