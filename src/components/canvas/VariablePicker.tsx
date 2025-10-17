import { useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Flex,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { FaCode, FaMagnifyingGlass } from 'react-icons/fa6';

interface Variable {
  nodeId: string;
  nodeName: string;
  variable: string;
  type: string;
}

interface VariablePickerProps {
  onSelect: (variable: string) => void;
  availableVariables?: Variable[];
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * VariablePicker - Component for selecting and inserting variables from other nodes
 */
const VariablePicker = ({ 
  onSelect, 
  availableVariables = [], 
  isOpen = false, 
  onClose 
}: VariablePickerProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  const mockVariables: Variable[] = [
    { nodeId: 'node1', nodeName: 'HTTP Request', variable: 'status', type: 'number' },
    { nodeId: 'node1', nodeName: 'HTTP Request', variable: 'data', type: 'object' },
    { nodeId: 'node1', nodeName: 'HTTP Request', variable: 'headers', type: 'object' },
    { nodeId: 'node2', nodeName: 'Manual Trigger', variable: 'timestamp', type: 'string' },
    { nodeId: 'node2', nodeName: 'Manual Trigger', variable: 'userId', type: 'string' },
    { nodeId: 'node3', nodeName: 'Transform Data', variable: 'transformedData', type: 'any' },
  ];

  const variables = availableVariables.length > 0 ? availableVariables : mockVariables;

  // Filter variables based on search term
  const filteredVariables = variables.filter(
    (variable) =>
      variable.nodeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variable.variable.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group variables by node
  const groupedVariables = filteredVariables.reduce((acc, variable) => {
    if (!acc[variable.nodeId]) {
      acc[variable.nodeId] = {
        nodeName: variable.nodeName,
        variables: [],
      };
    }
    acc[variable.nodeId].variables.push(variable);
    return acc;
  }, {} as Record<string, { nodeName: string; variables: Variable[] }>);

  const handleVariableSelect = (variable: Variable) => {
    const variableString = `{{${variable.nodeId}.${variable.variable}}}`;
    onSelect(variableString);
    onClose?.();
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      string: 'green',
      number: 'blue',
      boolean: 'purple',
      object: 'orange',
      array: 'red',
      any: 'gray',
    };
    return colors[type] || 'gray';
  };

  if (!isOpen) return null;

  return (
    <Box
      position="absolute"
      top="100%"
      left={0}
      right={0}
      bg="white"
      border="1px"
      borderColor="gray.200"
      borderRadius="md"
      shadow="lg"
      zIndex={1000}
      maxH="300px"
      overflowY="auto"
      mt={1}
    >
      <Box p={3}>
        <HStack mb={3}>
          <FaMagnifyingGlass size={14} />
          <Input
            placeholder="Search variables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="sm"
            variant="outline"
          />
        </HStack>

        {Object.keys(groupedVariables).length === 0 ? (
          <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
            No variables available
          </Text>
        ) : (
          <VStack gap={3} align="stretch">
            {Object.entries(groupedVariables).map(([nodeId, { nodeName, variables }]) => (
              <Box key={nodeId}>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color="gray.600"
                  mb={2}
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  {nodeName}
                </Text>
                <VStack gap={1} align="stretch">
                  {variables.map((variable, index) => (
                    <Button
                      key={`${variable.nodeId}-${variable.variable}-${index}`}
                      onClick={() => handleVariableSelect(variable)}
                      variant="ghost"
                      size="sm"
                      justifyContent="flex-start"
                      p={2}
                      h="auto"
                      _hover={{
                        bg: 'gray.50',
                      }}
                    >
                      <Flex align="center" justify="space-between" w="full">
                        <HStack>
                          <FaCode size={12} />
                          <Text fontSize="sm">{variable.variable}</Text>
                        </HStack>
                        <Badge
                          size="sm"
                          colorPalette={getTypeColor(variable.type)}
                          variant="subtle"
                        >
                          {variable.type}
                        </Badge>
                      </Flex>
                    </Button>
                  ))}
                </VStack>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default VariablePicker;