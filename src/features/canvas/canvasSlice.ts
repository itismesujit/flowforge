import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Node, Edge } from 'reactflow';

interface CanvasState {
  nodes: Node[];
  edges: Edge[];
  selectedNodes: string[];
  selectedEdges: string[];
  isDragging: boolean;
  isPanning: boolean;
  zoom: number;
  viewport: { x: number; y: number; zoom: number };
  isNodePaletteOpen: boolean;
  isPropertiesPanelOpen: boolean;
  selectedNodeForEdit: string | null;
  clipboardData: {
    nodes: Node[];
    edges: Edge[];
  } | null;
}

const initialState: CanvasState = {
  nodes: [],
  edges: [],
  selectedNodes: [],
  selectedEdges: [],
  isDragging: false,
  isPanning: false,
  zoom: 1,
  viewport: { x: 0, y: 0, zoom: 1 },
  isNodePaletteOpen: true,
  isPropertiesPanelOpen: true,
  selectedNodeForEdit: null,
  clipboardData: null,
};

const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload;
    },
    addNode: (state, action: PayloadAction<Node>) => {
      state.nodes.push(action.payload);
    },
    updateNode: (state, action: PayloadAction<{ id: string; updates: Partial<Node> }>) => {
      const { id, updates } = action.payload;
      const nodeIndex = state.nodes.findIndex(node => node.id === id);
      if (nodeIndex !== -1) {
        state.nodes[nodeIndex] = { ...state.nodes[nodeIndex], ...updates };
      }
    },
    removeNode: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload;
      state.nodes = state.nodes.filter(node => node.id !== nodeId);
      state.edges = state.edges.filter(edge => 
        edge.source !== nodeId && edge.target !== nodeId
      );
      state.selectedNodes = state.selectedNodes.filter(id => id !== nodeId);
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
    },
    addEdge: (state, action: PayloadAction<Edge>) => {
      state.edges.push(action.payload);
    },
    removeEdge: (state, action: PayloadAction<string>) => {
      const edgeId = action.payload;
      state.edges = state.edges.filter(edge => edge.id !== edgeId);
      state.selectedEdges = state.selectedEdges.filter(id => id !== edgeId);
    },
    setSelectedNodes: (state, action: PayloadAction<string[]>) => {
      state.selectedNodes = action.payload;
    },
    setSelectedEdges: (state, action: PayloadAction<string[]>) => {
      state.selectedEdges = action.payload;
    },
    clearSelection: (state) => {
      state.selectedNodes = [];
      state.selectedEdges = [];
      state.selectedNodeForEdit = null;
    },
    setDragging: (state, action: PayloadAction<boolean>) => {
      state.isDragging = action.payload;
    },
    setPanning: (state, action: PayloadAction<boolean>) => {
      state.isPanning = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    setViewport: (state, action: PayloadAction<{ x: number; y: number; zoom: number }>) => {
      state.viewport = action.payload;
    },
    toggleNodePalette: (state) => {
      state.isNodePaletteOpen = !state.isNodePaletteOpen;
    },
    togglePropertiesPanel: (state) => {
      state.isPropertiesPanelOpen = !state.isPropertiesPanelOpen;
    },
    setSelectedNodeForEdit: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeForEdit = action.payload;
    },
    copyToClipboard: (state) => {
      const selectedNodeIds = state.selectedNodes;
      // const selectedEdgeIds = state.selectedEdges;
      
      const nodesToCopy = state.nodes.filter(node => selectedNodeIds.includes(node.id));
      const edgesToCopy = state.edges.filter(edge => 
        selectedNodeIds.includes(edge.source) && selectedNodeIds.includes(edge.target)
      );
      
      state.clipboardData = {
        nodes: nodesToCopy,
        edges: edgesToCopy,
      };
    },
    pasteFromClipboard: (state, action: PayloadAction<{ offsetX: number; offsetY: number }>) => {
      if (!state.clipboardData) return;
      
      const { offsetX, offsetY } = action.payload;
      const nodeIdMap: Record<string, string> = {};
      
      // Create new nodes with new IDs and offset positions
      const newNodes = state.clipboardData.nodes.map(node => {
        const newId = `${node.id}_copy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        nodeIdMap[node.id] = newId;
        
        return {
          ...node,
          id: newId,
          position: {
            x: node.position.x + offsetX,
            y: node.position.y + offsetY,
          },
          selected: false,
        };
      });
      
      // Create new edges with updated node IDs
      const newEdges = state.clipboardData.edges.map(edge => ({
        ...edge,
        id: `${edge.id}_copy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        source: nodeIdMap[edge.source],
        target: nodeIdMap[edge.target],
      }));
      
      state.nodes.push(...newNodes);
      state.edges.push(...newEdges);
      
      // Select the newly pasted nodes
      state.selectedNodes = newNodes.map(node => node.id);
      state.selectedEdges = [];
    },
    resetCanvas: (state) => {
      state.nodes = [];
      state.edges = [];
      state.selectedNodes = [];
      state.selectedEdges = [];
      state.selectedNodeForEdit = null;
      state.viewport = { x: 0, y: 0, zoom: 1 };
      state.zoom = 1;
    },
  },
});

export const {
  setNodes,
  addNode,
  updateNode,
  removeNode,
  setEdges,
  addEdge,
  removeEdge,
  setSelectedNodes,
  setSelectedEdges,
  clearSelection,
  setDragging,
  setPanning,
  setZoom,
  setViewport,
  toggleNodePalette,
  togglePropertiesPanel,
  setSelectedNodeForEdit,
  copyToClipboard,
  pasteFromClipboard,
  resetCanvas,
} = canvasSlice.actions;

export default canvasSlice.reducer;