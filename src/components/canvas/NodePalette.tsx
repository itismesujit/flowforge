import { Box, VStack, Text, Flex } from '@chakra-ui/react';
import { NODE_DEFINITIONS, NODE_CATEGORIES } from '../../utils/constants';
import { FaPlay, FaGlobe, FaCodeBranch, FaClock, FaPaperPlane, FaWandMagicSparkles } from 'react-icons/fa6';

// Icon mapping for node types
const iconMap: Record<string, any> = {
  play: FaPlay,
  globe: FaGlobe,
  branch: FaCodeBranch,
  transform: FaWandMagicSparkles,
  clock: FaClock,
  send: FaPaperPlane,
};

// Color mapping for node categories
const categoryColors: Record<string, string> = {
  triggers: 'green.500',
  actions: 'blue.500',
  logic: 'orange.500',
  outputs: 'red.500',
};

interface NodeItemProps {
  nodeType: {
    id: string;
    label: string;
    category: string;
    icon: string;
    description: string;
    color: string;
  };
}

const NodeItem = ({ nodeType }: NodeItemProps) => {
  const IconComponent = iconMap[nodeType.icon] || FaPlay;
  
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', nodeType.id);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Box
      draggable
      onDragStart={onDragStart}
      p={3}
      bg="white"
      border="1px"
      borderColor="gray.200"
      borderRadius="md"
      cursor="grab"
      _hover={{
        borderColor: categoryColors[nodeType.category],
        shadow: 'md',
        transform: 'translateY(-1px)',
      }}
      _active={{
        cursor: 'grabbing',
        transform: 'translateY(0)',
      }}
      transition="all 0.2s"
      minH="60px"
    >
      <Flex align="center" gap={2}>
        <Box
          p={2}
          bg={`${nodeType.color}.50`}
          color={`${nodeType.color}.600`}
          borderRadius="md"
        >
          <IconComponent size={16} />
        </Box>
        <Box flex={1}>
          <Text fontSize="sm" fontWeight="medium" lineHeight="tight">
            {nodeType.label}
          </Text>
          <Text fontSize="xs" color="gray.600" mt={1}>
            {nodeType.description}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

interface CategorySectionProps {
  categoryName: string;
  categoryKey: string;
  nodeTypes: typeof NODE_DEFINITIONS;
}

const CategorySection = ({ categoryName, categoryKey, nodeTypes }: CategorySectionProps) => {
  const categoryNodes = nodeTypes.filter(node => node.category === categoryKey);

  if (categoryNodes.length === 0) return null;

  return (
    <Box>
      <Text
        fontSize="xs"
        fontWeight="bold"
        color="gray.500"
        textTransform="uppercase"
        letterSpacing="wider"
        mb={2}
      >
        {categoryName}
      </Text>
      <VStack gap={2} align="stretch">
        {categoryNodes.map((nodeType) => (
          <NodeItem key={nodeType.id} nodeType={nodeType} />
        ))}
      </VStack>
    </Box>
  );
};

/**
 * NodePalette - Draggable palette of available node types
 */
const NodePalette = () => {
  return (
    <Box
      w="280px"
      h="100%"
      bg="gray.50"
      borderRight="1px"
      borderColor="gray.200"
      overflowY="auto"
    >
      <Box p={4}>
        <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.700">
          Node Palette
        </Text>
        
        <VStack gap={4} align="stretch">
          <CategorySection
            categoryName="Triggers"
            categoryKey={NODE_CATEGORIES.TRIGGERS}
            nodeTypes={NODE_DEFINITIONS}
          />
          
          <CategorySection
            categoryName="Actions"
            categoryKey={NODE_CATEGORIES.ACTIONS}
            nodeTypes={NODE_DEFINITIONS}
          />
          
          <CategorySection
            categoryName="Logic"
            categoryKey={NODE_CATEGORIES.LOGIC}
            nodeTypes={NODE_DEFINITIONS}
          />
          
          <CategorySection
            categoryName="Outputs"
            categoryKey={NODE_CATEGORIES.OUTPUTS}
            nodeTypes={NODE_DEFINITIONS}
          />
        </VStack>
      </Box>
    </Box>
  );
};

export default NodePalette;