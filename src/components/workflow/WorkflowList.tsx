import { useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
  Box,
  Button,
  HStack,
  Badge,

} from '@chakra-ui/react';
import { FaPlay, FaPencil, FaCopy, FaTrash } from 'react-icons/fa6';
import { useWorkflows } from '../../hooks/useWorkflows';
import { formatDate, getStatusColor } from '../../utils/helpers';
import type { Workflow } from '../../features/workflow/workflowSlice';

interface ActionsRendererProps {
  data: Workflow;
  onEdit: (workflow: Workflow) => void;
  onExecute: (workflow: Workflow) => void;
  onDuplicate: (workflow: Workflow) => void;
  onDelete: (workflow: Workflow) => void;
}

const ActionsRenderer = ({ data, onEdit, onExecute, onDuplicate, onDelete }: ActionsRendererProps) => {
  return (
    <HStack gap={1}>
      <Button
        size="xs"
        colorPalette="blue"
        variant="ghost"
        onClick={() => onExecute(data)}
        disabled={data.status !== 'published'}
        title="Execute workflow"
      >
        <FaPlay size={10} />
      </Button>
      
      <Button
        size="xs"
        variant="ghost"
        onClick={() => onEdit(data)}
        title="Edit workflow"
      >
        <FaPencil size={10} />
      </Button>
      
      <Button
        size="xs"
        variant="ghost"
        onClick={() => onDuplicate(data)}
        title="Duplicate workflow"
      >
        <FaCopy size={10} />
      </Button>
      
      <Button
        size="xs"
        variant="ghost"
        colorPalette="red"
        onClick={() => onDelete(data)}
        title="Delete workflow"
      >
        <FaTrash size={10} />
      </Button>
    </HStack>
  );
};

interface StatusRendererProps {
  value: string;
}

const StatusRenderer = ({ value }: StatusRendererProps) => {
  const colorPalette = getStatusColor(value);
  
  return (
    <Badge colorPalette={colorPalette} variant="subtle">
      {value.charAt(0).toUpperCase() + value.slice(1)}
    </Badge>
  );
};

interface WorkflowListProps {
  onEdit?: (workflow: Workflow) => void;
  onExecute?: (workflow: Workflow) => void;
  onDuplicate?: (workflow: Workflow) => void;
  onDelete?: (workflow: Workflow) => void;
}

/**
 * WorkflowList - AG Grid table component for displaying workflows
 */
const WorkflowList = ({ 
  onEdit = () => {}, 
  onExecute = () => {}, 
  onDuplicate = () => {}, 
  onDelete = () => {} 
}: WorkflowListProps) => {
  const { workflows, isLoading, executeWorkflow, deleteWorkflow } = useWorkflows();

  const handleExecute = useCallback((workflow: Workflow) => {
    executeWorkflow({ id: workflow.id });
    onExecute(workflow);
  }, [executeWorkflow, onExecute]);

  const handleDelete = useCallback((workflow: Workflow) => {
    if (window.confirm(`Are you sure you want to delete "${workflow.name}"?`)) {
      deleteWorkflow(workflow.id);
      onDelete(workflow);
    }
  }, [deleteWorkflow, onDelete]);

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Name',
        sortable: true,
        filter: true,
        flex: 2,
        minWidth: 200,
        cellRenderer: (params: any) => (
          <Box>
            <Box fontWeight="medium">{params.value}</Box>
            {params.data.description && (
              <Box fontSize="sm" color="gray.500" mt={1}>
                {params.data.description}
              </Box>
            )}
          </Box>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        sortable: true,
        filter: true,
        width: 120,
        cellRenderer: StatusRenderer,
      },
      {
        field: 'updatedAt',
        headerName: 'Last Modified',
        sortable: true,
        width: 150,
        valueFormatter: (params: any) => formatDate(params.value),
      },
      {
        field: 'createdAt',
        headerName: 'Created',
        sortable: true,
        width: 150,
        valueFormatter: (params: any) => formatDate(params.value),
      },
      {
        headerName: 'Actions',
        width: 180,
        pinned: 'right',
        cellRenderer: (params: any) => (
          <ActionsRenderer
            data={params.data}
            onEdit={onEdit}
            onExecute={handleExecute}
            onDuplicate={onDuplicate}
            onDelete={handleDelete}
          />
        ),
        sortable: false,
        filter: false,
      },
    ],
    [onEdit, onDuplicate, handleExecute, handleDelete]
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
    }),
    []
  );

  return (
    <Box className="ag-theme-alpine" h="600px" w="100%">
      <AgGridReact
        rowData={workflows}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={20}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        loading={isLoading}
        rowSelection="multiple"
        suppressRowClickSelection={true}
        animateRows={true}
        rowHeight={60}
        headerHeight={40}
        getRowId={(params) => params.data.id}
        onGridReady={(params) => {
          params.api.sizeColumnsToFit();
        }}
      />
    </Box>
  );
};

export default WorkflowList;