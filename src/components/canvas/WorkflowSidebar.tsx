import { Button } from '@chakra-ui/react';
import { Box, Text, Separator, Stack } from '@chakra-ui/react';

interface WorkflowSidebarProps {
  onAddNode: (type: string, label: string) => void;
  onDeleteSelectedNodes: () => void;
  onDeleteSelectedEdges: () => void;
  onDisconnectSelectedNodes: () => void;
  onClearAllConnections: () => void;
  onClearCanvas: () => void;
  onResetCanvas: () => void;
  selectedNodesCount?: number;
  selectedEdgesCount?: number;
}

/**
 * WorkflowSidebar - Premium sidebar component for workflow tools and actions
 */
const WorkflowSidebar = ({
  onAddNode,
  onDeleteSelectedNodes,
  onDeleteSelectedEdges,
  onDisconnectSelectedNodes,
  onClearAllConnections,
  onClearCanvas,
  onResetCanvas,
  selectedNodesCount = 0,
  selectedEdgesCount = 0,
}: WorkflowSidebarProps) => {
  const hasSelection = selectedNodesCount > 0 || selectedEdgesCount > 0;
  return (
    <Box 
      width="320px" 
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      shadow="xl"
      display="flex"
      flexDirection="column"
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        bg: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      {/* Premium Header */}
      <Box p={6} borderBottom="1px solid" borderColor="gray.100">
        <Stack direction="row" gap={3} mb={3}>
          <Box
            w={10}
            h={10}
            borderRadius="lg"
            bg="linear-gradient(135deg, #3b82f6, #8b5cf6)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            shadow="md"
          >
            <Text color="white" fontSize="lg" fontWeight="bold">⚡</Text>
          </Box>
          <Box>
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              FlowForge
            </Text>
            <Text fontSize="sm" color="gray.500">
              Workflow Builder
            </Text>
          </Box>
        </Stack>
        {hasSelection ? (
          <Box bg="purple.50" p={3} borderRadius="lg" border="1px solid" borderColor="purple.200">
            <Text fontSize="xs" color="purple.700" fontWeight="medium" mb={2}>
              🎯 {selectedNodesCount} node{selectedNodesCount !== 1 ? 's' : ''} 
              {selectedEdgesCount > 0 && ` + ${selectedEdgesCount} edge${selectedEdgesCount !== 1 ? 's' : ''}`} selected
            </Text>
            <Text fontSize="xs" color="purple.600">
              Use buttons below or toolbar above canvas
            </Text>
          </Box>
        ) : (
          <Box bg="blue.50" p={3} borderRadius="lg" border="1px solid" borderColor="blue.100">
            <Text fontSize="xs" color="blue.700" fontWeight="medium">
              💡 Hold Ctrl + click to multi-select items
            </Text>
          </Box>
        )}
      </Box>

      {/* Node Library */}
      <Box p={6}>
        <Text fontSize="sm" fontWeight="bold" color="gray.800" mb={4}>
          Node Library
        </Text>
        <Stack gap={2}>
          {/* Task Node */}
          <Button
            h={12}
            variant="ghost"
            justifyContent="flex-start"
            px={4}
            borderRadius="xl"
            onClick={() => onAddNode('default', 'New Task')}
            _hover={{ 
              bg: 'blue.50', 
              transform: 'translateY(-1px)',
              shadow: 'md'
            }}
            transition="all 0.2s"
          >
            <Stack direction="row" gap={3} width="full" align="center">
              <Box
                w={8}
                h={8}
                borderRadius="lg"
                bg="linear-gradient(135deg, #3b82f6, #1d4ed8)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                shadow="sm"
              >
                <Text color="white" fontSize="sm">⚡</Text>
              </Box>
              <Box textAlign="left" flex="1">
                <Text fontWeight="semibold" color="gray.800" fontSize="sm">
                  Task Node
                </Text>
                <Text color="gray.500" fontSize="xs">
                  Process or action step
                </Text>
              </Box>
            </Stack>
          </Button>
          
          {/* API Call Node */}
          <Button
            h={12}
            variant="ghost"
            justifyContent="flex-start"
            px={4}
            borderRadius="xl"
            onClick={() => onAddNode('default', 'API Call')}
            _hover={{ 
              bg: 'green.50', 
              transform: 'translateY(-1px)',
              shadow: 'md'
            }}
            transition="all 0.2s"
          >
            <Stack direction="row" gap={3} width="full" align="center">
              <Box
                w={8}
                h={8}
                borderRadius="lg"
                bg="linear-gradient(135deg, #10b981, #059669)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                shadow="sm"
              >
                <Text color="white" fontSize="sm">🌐</Text>
              </Box>
              <Box textAlign="left" flex="1">
                <Text fontWeight="semibold" color="gray.800" fontSize="sm">
                  API Call
                </Text>
                <Text color="gray.500" fontSize="xs">
                  HTTP request or webhook
                </Text>
              </Box>
            </Stack>
          </Button>

          {/* Decision Node */}
          <Button
            h={12}
            variant="ghost"
            justifyContent="flex-start"
            px={4}
            borderRadius="xl"
            onClick={() => onAddNode('default', 'Decision')}
            _hover={{ 
              bg: 'purple.50', 
              transform: 'translateY(-1px)',
              shadow: 'md'
            }}
            transition="all 0.2s"
          >
            <Stack direction="row" gap={3} width="full" align="center">
              <Box
                w={8}
                h={8}
                borderRadius="lg"
                bg="linear-gradient(135deg, #8b5cf6, #7c3aed)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                shadow="sm"
              >
                <Text color="white" fontSize="sm">🔀</Text>
              </Box>
              <Box textAlign="left" flex="1">
                <Text fontWeight="semibold" color="gray.800" fontSize="sm">
                  Decision
                </Text>
                <Text color="gray.500" fontSize="xs">
                  Conditional branching
                </Text>
              </Box>
            </Stack>
          </Button>

          {/* Database Node */}
          <Button
            h={12}
            variant="ghost"
            justifyContent="flex-start"
            px={4}
            borderRadius="xl"
            onClick={() => onAddNode('default', 'Database')}
            _hover={{ 
              bg: 'orange.50', 
              transform: 'translateY(-1px)',
              shadow: 'md'
            }}
            transition="all 0.2s"
          >
            <Stack direction="row" gap={3} width="full" align="center">
              <Box
                w={8}
                h={8}
                borderRadius="lg"
                bg="linear-gradient(135deg, #f59e0b, #d97706)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                shadow="sm"
              >
                <Text color="white" fontSize="sm">🗄️</Text>
              </Box>
              <Box textAlign="left" flex="1">
                <Text fontWeight="semibold" color="gray.800" fontSize="sm">
                  Database
                </Text>
                <Text color="gray.500" fontSize="xs">
                  Data storage operation
                </Text>
              </Box>
            </Stack>
          </Button>
        </Stack>
      </Box>

      <Separator borderColor="gray.200" />

      {/* Actions */}
      <Box p={6}>
        <Text fontSize="sm" fontWeight="bold" color="gray.800" mb={4}>
          Actions
        </Text>
        <Stack gap={2}>
          <Button
            size="sm"
            variant="ghost"
            justifyContent="flex-start"
            borderRadius="lg"
            onClick={onDeleteSelectedNodes}
            _hover={{ bg: 'red.50', color: 'red.600' }}
          >
            <Stack direction="row" gap={3}>
              <Text fontSize="sm">🗑️</Text>
              <Text fontSize="sm" fontWeight="medium">Delete Selected</Text>
            </Stack>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            justifyContent="flex-start"
            borderRadius="lg"
            onClick={onDeleteSelectedEdges}
            _hover={{ bg: 'red.50', color: 'red.600' }}
          >
            <Stack direction="row" gap={3}>
              <Text fontSize="sm">✂️</Text>
              <Text fontSize="sm" fontWeight="medium">Cut Connections</Text>
            </Stack>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            justifyContent="flex-start"
            borderRadius="lg"
            onClick={onDisconnectSelectedNodes}
            _hover={{ bg: 'yellow.50', color: 'yellow.700' }}
          >
            <Stack direction="row" gap={3}>
              <Text fontSize="sm">🔌</Text>
              <Text fontSize="sm" fontWeight="medium">Disconnect Nodes</Text>
            </Stack>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            justifyContent="flex-start"
            borderRadius="lg"
            onClick={onClearAllConnections}
            _hover={{ bg: 'gray.50' }}
          >
            <Stack direction="row" gap={3}>
              <Text fontSize="sm">🚫</Text>
              <Text fontSize="sm" fontWeight="medium">Clear Connections</Text>
            </Stack>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            justifyContent="flex-start"
            borderRadius="lg"
            onClick={onClearCanvas}
            _hover={{ bg: 'gray.50' }}
          >
            <Stack direction="row" gap={3}>
              <Text fontSize="sm">🧹</Text>
              <Text fontSize="sm" fontWeight="medium">Clear Canvas</Text>
            </Stack>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            justifyContent="flex-start"
            borderRadius="lg"
            onClick={onResetCanvas}
            _hover={{ bg: 'blue.50', color: 'blue.600' }}
          >
            <Stack direction="row" gap={3}>
              <Text fontSize="sm">🔄</Text>
              <Text fontSize="sm" fontWeight="medium">Reset to Default</Text>
            </Stack>
          </Button>
        </Stack>
      </Box>

      {/* Premium Footer */}
      <Box p={6} bg="gray.50" borderTop="1px solid" borderColor="gray.200" mt="auto">
        <Text fontSize="xs" fontWeight="semibold" color="gray.700" mb={3}>
          ⌨️ Keyboard Shortcuts
        </Text>
        <Stack gap={2}>
          <Stack direction="row" justify="space-between">
            <Text fontSize="xs" color="gray.600">Delete selected</Text>
            <Box bg="white" px={2} py={1} borderRadius="md" border="1px solid" borderColor="gray.200">
              <Text fontSize="xs" color="gray.500" fontFamily="mono" fontWeight="medium">Del</Text>
            </Box>
          </Stack>
          <Stack direction="row" justify="space-between">
            <Text fontSize="xs" color="gray.600">Multi-select</Text>
            <Box bg="white" px={2} py={1} borderRadius="md" border="1px solid" borderColor="gray.200">
              <Text fontSize="xs" color="gray.500" fontFamily="mono" fontWeight="medium">Ctrl+Click</Text>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default WorkflowSidebar;