import { useCallback, useEffect, useRef, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
} from 'reactflow';
import { Box, Button, HStack, Text, Badge } from '@chakra-ui/react';
import { FiTrash2, FiScissors, FiCopy } from 'react-icons/fi';
import WorkflowSidebar from './WorkflowSidebar';
import { useWorkflowSync } from '../../hooks/useWorkflowSync';
import 'reactflow/dist/style.css';

const nodeTypes = {};
const edgeTypes = {};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    position: { x: 100, y: 100 },
    data: { label: 'Start' },
  },
  {
    id: '2',
    type: 'default',
    position: { x: 300, y: 100 },
    data: { label: 'HTTP Request' },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
  },
];

/**
 * WorkflowCanvas - Main canvas component for building workflows
 */
const WorkflowCanvas = () => {
  const { currentWorkflow, syncWorkflowState } = useWorkflowSync();
  const prevWorkflowIdRef = useRef<string | null>(null);
  
  // Get initial nodes and edges from current workflow or use defaults
  const getInitialNodes = () => {
    if (currentWorkflow?.nodes && currentWorkflow.nodes.length > 0) {
      return currentWorkflow.nodes;
    }
    return initialNodes;
  };
  
  const getInitialEdges = () => {
    if (currentWorkflow?.edges && currentWorkflow.edges.length > 0) {
      return currentWorkflow.edges;
    }
    return initialEdges;
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(getInitialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(getInitialEdges());

  // Sync local state with Redux when workflow changes (only when ID changes)
  useEffect(() => {
    const currentId = currentWorkflow?.id || null;
    
    if (currentId !== prevWorkflowIdRef.current) {
      prevWorkflowIdRef.current = currentId;
      
      if (currentWorkflow) {
        if (currentWorkflow.nodes && currentWorkflow.nodes.length > 0) {
          setNodes(currentWorkflow.nodes);
        } else {
          setNodes(initialNodes);
        }
        
        if (currentWorkflow.edges && currentWorkflow.edges.length > 0) {
          setEdges(currentWorkflow.edges);
        } else {
          setEdges(initialEdges);
        }
      }
    }
  }, [currentWorkflow, setNodes, setEdges]);

  // Debounced auto-save when nodes or edges change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentWorkflow && (nodes.length > 0 || edges.length > 0)) {
        syncWorkflowState(nodes, edges);
      }
    }, 2000); // Save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [nodes, edges, currentWorkflow, syncWorkflowState]);

  // Track selected nodes and edges
  const selectedNodes = useMemo(() => nodes.filter(node => node.selected), [nodes]);
  const selectedEdges = useMemo(() => edges.filter(edge => edge.selected), [edges]);
  const hasSelection = selectedNodes.length > 0 || selectedEdges.length > 0;

  // Duplicate selected nodes
  const duplicateSelectedNodes = useCallback(() => {
    const duplicatedNodes = selectedNodes.map(node => ({
      ...node,
      id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
      selected: false,
    }));
    
    setNodes(nds => [...nds, ...duplicatedNodes]);
  }, [selectedNodes, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Custom node click handler with proper event handling
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    // Prevent ReactFlow's default selection behavior
    event.preventDefault();
    event.stopPropagation();
    
    const isMultiSelect = event.ctrlKey || event.metaKey;
    console.log('Node clicked:', node.id, 'Multi-select:', isMultiSelect);
    
    if (isMultiSelect) {
      // Multi-select: toggle the clicked node's selection
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? { ...n, selected: !n.selected }
            : n
        )
      );
    } else {
      // Single select: clear all selections and select only this node
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          selected: n.id === node.id,
        }))
      );
      // Clear edge selections
      setEdges((eds) =>
        eds.map((e) => ({
          ...e,
          selected: false,
        }))
      );
    }
  }, [setNodes, setEdges]);

  // Custom edge click handler with proper event handling
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    // Prevent ReactFlow's default selection behavior
    event.preventDefault();
    event.stopPropagation();
    
    const isMultiSelect = event.ctrlKey || event.metaKey;
    console.log('Edge clicked:', edge.id, 'Multi-select:', isMultiSelect);
    
    if (isMultiSelect) {
      // Multi-select: toggle the clicked edge's selection
      setEdges((eds) =>
        eds.map((e) =>
          e.id === edge.id
            ? { ...e, selected: !e.selected }
            : e
        )
      );
    } else {
      // Single select: clear all selections and select only this edge
      setEdges((eds) =>
        eds.map((e) => ({
          ...e,
          selected: e.id === edge.id,
        }))
      );
      // Clear node selections
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          selected: false,
        }))
      );
    }
  }, [setEdges, setNodes]);

  // Handle node label editing
  const onNodeDoubleClick = useCallback((_event: React.MouseEvent, node: Node) => {
    const newLabel = prompt('Enter new label:', node.data.label);
    if (newLabel && newLabel.trim()) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? { ...n, data: { ...n.data, label: newLabel.trim() } }
            : n
        )
      );
    }
  }, [setNodes]);



  // Handle canvas click to clear selections
  const onPaneClick = useCallback(() => {
    // Clear all selections when clicking on empty canvas
    setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
    setEdges((eds) => eds.map((e) => ({ ...e, selected: false })));
  }, [setNodes, setEdges]);

  // Add new node
  const addNode = useCallback((_type: string, label: string) => {
    const nodeCount = nodes.length + 1;
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'default',
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100
      },
      data: { label: `${label} ${nodeCount}` },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes, nodes.length]);

  // Delete selected nodes
  const deleteSelectedNodes = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => {
      const sourceSelected = nodes.find(n => n.id === edge.source)?.selected;
      const targetSelected = nodes.find(n => n.id === edge.target)?.selected;
      return !sourceSelected && !targetSelected;
    }));
  }, [setNodes, setEdges, nodes]);

  // Delete selected edges/connections
  const deleteSelectedEdges = useCallback(() => {
    setEdges((eds) => eds.filter((edge) => !edge.selected));
  }, [setEdges]);

  // Delete all connections from selected nodes
  const disconnectSelectedNodes = useCallback(() => {
    const selectedNodeIds = nodes.filter(n => n.selected).map(n => n.id);
    setEdges((eds) => eds.filter((edge) =>
      !selectedNodeIds.includes(edge.source) && !selectedNodeIds.includes(edge.target)
    ));
  }, [setEdges, nodes]);

  // Clear all edges only
  const clearAllConnections = useCallback(() => {
    setEdges([]);
  }, [setEdges]);

  // Clear all nodes and edges
  const clearCanvas = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  // Reset to initial state
  const resetCanvas = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges]);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#ffffff' }}>
      {/* Premium Modern Sidebar */}
      <WorkflowSidebar
        onAddNode={addNode}
        onDeleteSelectedNodes={deleteSelectedNodes}
        onDeleteSelectedEdges={deleteSelectedEdges}
        onDisconnectSelectedNodes={disconnectSelectedNodes}
        onClearAllConnections={clearAllConnections}
        onClearCanvas={clearCanvas}
        onResetCanvas={resetCanvas}
        selectedNodesCount={selectedNodes.length}
        selectedEdgesCount={selectedEdges.length}
      />

      {/* Canvas Container */}
      <div style={{ flex: 1, position: 'relative' }}>
        {/* Selection Toolbar */}
        {hasSelection && (
          <Box
            position="absolute"
            top={4}
            left="50%"
            transform="translateX(-50%)"
            zIndex={1000}
            bg="white"
            borderRadius="lg"
            shadow="lg"
            border="1px solid"
            borderColor="gray.200"
            px={4}
            py={2}
          >
            <HStack gap={2}>
              <Badge colorScheme="blue" fontSize="xs">
                {selectedNodes.length} node{selectedNodes.length !== 1 ? 's' : ''} {selectedEdges.length > 0 && `+ ${selectedEdges.length} edge${selectedEdges.length !== 1 ? 's' : ''}`} selected
              </Badge>
              
              <Text fontSize="xs" color="gray.500" mx={2}>|</Text>
              
              {selectedNodes.length > 0 && (
                <>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={duplicateSelectedNodes}
                    _hover={{ bg: 'blue.50' }}
                  >
                    <FiCopy size={12} />
                    Duplicate
                  </Button>
                  
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={disconnectSelectedNodes}
                    _hover={{ bg: 'orange.50' }}
                  >
                    <FiScissors size={12} />
                    Disconnect
                  </Button>
                </>
              )}
              
              <Button
                size="xs"
                variant="ghost"
                onClick={() => {
                  deleteSelectedNodes();
                  deleteSelectedEdges();
                }}
                colorScheme="red"
                _hover={{ bg: 'red.50' }}
              >
                <FiTrash2 size={12} />
                Delete
              </Button>
            </HStack>
          </Box>
        )}

        {/* Canvas with Instructions */}
        <Box position="relative" w="full" h="full">
          {!hasSelection && (
            <Box
              position="absolute"
              top={4}
              right={4}
              zIndex={100}
              bg="blue.50"
              border="1px solid"
              borderColor="blue.200"
              borderRadius="md"
              px={3}
              py={2}
              maxW="250px"
            >
              <Text fontSize="xs" color="blue.700" fontWeight="500">
                💡 Hold <Badge size="xs" colorScheme="blue">Ctrl</Badge> + click nodes/edges for multi-select
              </Text>
              <Text fontSize="xs" color="blue.600" mt={1}>
                Single click = select one, Ctrl+click = add to selection
              </Text>
            </Box>
          )}
          
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onNodeDoubleClick={onNodeDoubleClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            multiSelectionKeyCode={null}
            deleteKeyCode="Delete"
            selectionOnDrag={false}
            panOnDrag={true}
            nodesConnectable={true}
            nodesDraggable={true}
            elementsSelectable={false}
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </Box>
      </div>
    </div>
  );
};

export default WorkflowCanvas;