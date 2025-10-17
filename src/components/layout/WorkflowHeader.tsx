{/* <FiZap size={22} color="white" /> */}
import { Box, Text, Button, IconButton, Badge, HStack, VStack, Flex } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FiSettings, FiShare2, FiDownload, FiSave, FiZap, FiPlus, FiUpload } from 'react-icons/fi';

interface WorkflowHeaderProps {
  projectName?: string;
  isAutoSaving?: boolean;
  onSave?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
  onShare?: () => void;
  onImport?: () => void;
  onProjectNameChange?: (name: string) => void;
  onRecentWorkflowClick?: (workflowName: string) => void;
  onNewWorkflow?: () => void;
}

const WorkflowHeader = ({
  projectName = "Untitled Workflow",
  isAutoSaving = false,
  onSave,
  onExport,
  onSettings,
  onShare,
  onProjectNameChange,
  onRecentWorkflowClick,
  onNewWorkflow,
  onImport,
}: WorkflowHeaderProps) => {
  const [isProjectNameEditing, setIsProjectNameEditing] = useState(false);
  const [editableProjectName, setEditableProjectName] = useState(projectName);

  // Update editableProjectName when projectName prop changes
  useEffect(() => {
    setEditableProjectName(projectName);
  }, [projectName]);

  const handleProjectNameEdit = () => {
    setIsProjectNameEditing(true);
  };

  const handleProjectNameSave = () => {
    setIsProjectNameEditing(false);
    if (onProjectNameChange && editableProjectName !== projectName) {
      onProjectNameChange(editableProjectName);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleProjectNameSave();
    }
    if (e.key === 'Escape') {
      setEditableProjectName(projectName);
      setIsProjectNameEditing(false);
    }
  };

  return (
    <Box bg="white" borderBottom="1px solid" borderColor="gray.200">
      {/* Main Header */}
      <Flex justify="space-between" align="center" px={6} py={4} gap={4}>
        {/* Left Section */}
        <HStack gap={6} flex={1}>
          {/* Brand */}
          <HStack gap={3} minW="fit-content">
            <Box
              w={10}
              h={10}
              borderRadius="xl"
              bgGradient="linear(to-br, #667eea, #764ba2)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 4px 15px rgba(102, 126, 234, 0.3)"
            >
              <FiZap size={22} color="white" />
            </Box>
            <VStack gap={0}>
              <Text fontSize="lg" fontWeight="bold" color="gray.900">
                FlowForge
              </Text>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                Workflow Builder
              </Text>
            </VStack>
          </HStack>

          {/* Project Name */}
          <Box
            px={4}
            py={2.5}
            bgGradient="linear(to-r, gray.50, gray.25)"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{
              borderColor: 'blue.300',
              bg: 'blue.50',
            }}
          >
            {isProjectNameEditing ? (
              <input
                value={editableProjectName}
                onChange={(e) => setEditableProjectName(e.target.value)}
                onBlur={handleProjectNameSave}
                onKeyDown={handleKeyPress}
                autoFocus
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1a202c',
                  minWidth: '180px',
                }}
              />
            ) : (
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color="gray.700"
                onClick={handleProjectNameEdit}
              >
                📄 {editableProjectName}
              </Text>
            )}
          </Box>

          {/* Auto-save Badge */}
          {isAutoSaving && (
            <Badge
              display="flex"
              alignItems="center"
              gap={2}
              px={3}
              py={1.5}
              borderRadius="full"
              bg="green.50"
              color="green.700"
              fontSize="xs"
              fontWeight="600"
              border="1px solid"
              borderColor="green.200"
            >
              <Box
                w={1.5}
                h={1.5}
                borderRadius="full"
                bg="green.500"
                animation="pulse 2s infinite"
              />
              Saving
            </Badge>
          )}
        </HStack>

        {/* Right Section */}
        <HStack gap={2}>
          {/* Action Buttons */}
          <Button
            size="sm"
            variant="ghost"
            onClick={onNewWorkflow}
            borderRadius="lg"
            transition="all 0.2s"
            _hover={{
              bg: 'purple.50',
              color: 'purple.600',
            }}
            _active={{
              bg: 'purple.100',
            }}
          >
            <FiPlus size={16} />
            New
          </Button>

          {/* Divider */}
          <Box w="1px" h={6} bg="gray.200" mx={1} />

          <Button
            size="sm"
            variant="ghost"
            onClick={onSave}
            borderRadius="lg"
            transition="all 0.2s"
            _hover={{
              bg: 'blue.50',
              color: 'blue.600',
            }}
            _active={{
              bg: 'blue.100',
            }}
          >
            <FiSave size={16} />
            Save
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onExport}
            borderRadius="lg"
            transition="all 0.2s"
            _hover={{
              bg: 'green.50',
              color: 'green.600',
            }}
            _active={{
              bg: 'green.100',
            }}
          >
            <FiDownload size={16} />
            Export
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onImport}
            borderRadius="lg"
            transition="all 0.2s"
            _hover={{
              bg: 'teal.50',
              color: 'teal.600',
            }}
            _active={{
              bg: 'teal.100',
            }}
          >
            <FiUpload size={16} />
            Import
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onShare}
            borderRadius="lg"
            transition="all 0.2s"
            _hover={{
              bg: 'purple.50',
              color: 'purple.600',
            }}
            _active={{
              bg: 'purple.100',
            }}
          >
            <FiShare2 size={16} />
            Share
          </Button>

          {/* Divider */}
          <Box w="1px" h={6} bg="gray.200" mx={1} />

          {/* Settings Button */}
          <IconButton
            size="sm"
            variant="ghost"
            borderRadius="lg"
            onClick={onSettings}
            transition="all 0.2s"
            _hover={{
              bg: 'gray.100',
            }}
            aria-label="Settings"
          >
            <FiSettings size={18} />
          </IconButton>

          {/* User Avatar */}
          <Box
            w={9}
            h={9}
            borderRadius="full"
            bgGradient="linear(to-br, #f093fb, #f5576c)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{
              transform: 'scale(1.08)',
              boxShadow: '0 4px 12px rgba(245, 87, 108, 0.3)',
            }}
            ml={2}
          >
            <Text color="white" fontSize="sm" fontWeight="bold">
              👤
            </Text>
          </Box>

          {/* Status */}
          <HStack gap={1.5} ml={1}>
            <Box
              w={2}
              h={2}
              borderRadius="full"
              bg="green.500"
              boxShadow="0 0 6px rgba(34, 197, 94, 0.5)"
            />
            <Text fontSize="xs" color="gray.600" fontWeight="500">
              Online
            </Text>
          </HStack>
        </HStack>
      </Flex>

      {/* Quick Access Bar */}
      <Box
        bg="white"
        borderTop="1px solid"
        borderColor="gray.100"
        px={6}
        py={2}
      >
        <HStack gap={4} justify="space-between" w="full">
          <HStack gap={4}>
            <Text fontSize="xs" color="gray.600" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px">
              Recent Templates
            </Text>
            <HStack gap={2}>
            {['Customer Onboarding', 'Data Processing', 'Email Campaign'].map((item) => (
              <Button
                key={item}
                size="xs"
                variant="ghost"
                borderRadius="md"
                fontSize="xs"
                color="gray.700"
                fontWeight="500"
                transition="all 0.2s"
                onClick={() => onRecentWorkflowClick?.(item)}
                _hover={{
                  bg: 'gray.100',
                  color: 'gray.900',
                }}
              >
                {item}
              </Button>
            ))}
            </HStack>
          </HStack>
          
          <Text fontSize="xs" color="gray.500" fontWeight="500">
            💡 Click "New" above to start fresh
          </Text>
        </HStack>
      </Box>
    </Box>
  );
};

export default WorkflowHeader;