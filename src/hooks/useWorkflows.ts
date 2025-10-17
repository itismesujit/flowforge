import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowService } from '../services/workflowService';
import { toaster } from '../components/ui/toaster';
import type { Workflow } from '../features/workflow/workflowSlice';

const showSuccessToast = (title: string, description: string) => {
  toaster.create({
    title,
    description,
    type: 'success',
    duration: 3000,
  });
};

const showErrorToast = (title: string, description: string) => {
  toaster.create({
    title,
    description,
    type: 'error',
    duration: 5000,
  });
};

const showInfoToast = (title: string, description: string) => {
  toaster.create({
    title,
    description,
    type: 'info',
    duration: 3000,
  });
};

export const useWorkflows = () => {
  const queryClient = useQueryClient();

  // Fetch all workflows
  const { 
    data: workflows = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['workflows'],
    queryFn: () => workflowService.getAll().then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create workflow mutation
  const createMutation = useMutation({
    mutationFn: workflowService.create,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      showSuccessToast('Workflow created', `"${response.data.name}" has been created successfully.`);
    },
    onError: (error: any) => {
      showErrorToast('Error creating workflow', error.response?.data?.message || 'An unexpected error occurred');
    },
  });

  // Update workflow mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Workflow> }) =>
      workflowService.update(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.invalidateQueries({ queryKey: ['workflow', response.data.id] });
      showSuccessToast('Workflow updated', `"${response.data.name}" has been updated successfully.`);
    },
    onError: (error: any) => {
      showErrorToast('Error updating workflow', error.response?.data?.message || 'An unexpected error occurred');
    },
  });

  // Delete workflow mutation
  const deleteMutation = useMutation({
    mutationFn: workflowService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      showSuccessToast('Workflow deleted', 'The workflow has been deleted successfully.');
    },
    onError: (error: any) => {
      showErrorToast('Error deleting workflow', error.response?.data?.message || 'An unexpected error occurred');
    },
  });

  // Execute workflow mutation
  const executeMutation = useMutation({
    mutationFn: ({ id, inputData }: { id: string; inputData?: any }) =>
      workflowService.execute(id, inputData),
    onSuccess: () => {
      showInfoToast('Workflow execution started', 'The workflow has been queued for execution.');
    },
    onError: (error: any) => {
      showErrorToast('Error executing workflow', error.response?.data?.message || 'An unexpected error occurred');
    },
  });

  return {
    // Data
    workflows,
    isLoading,
    error,
    
    // Actions
    refetch,
    createWorkflow: createMutation.mutate,
    updateWorkflow: updateMutation.mutate,
    deleteWorkflow: deleteMutation.mutate,
    executeWorkflow: executeMutation.mutate,
    
    // Loading states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isExecuting: executeMutation.isPending,
  };
};

export const useWorkflow = (id: string) => {
  const queryClient = useQueryClient();

  const { 
    data: workflow, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['workflow', id],
    queryFn: () => workflowService.getById(id).then(res => res.data),
    enabled: Boolean(id),
    staleTime: 30 * 1000, // 30 seconds
  });

  // Publish workflow mutation
  const publishMutation = useMutation({
    mutationFn: () => workflowService.publish(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.setQueryData(['workflow', id], response.data);
      showSuccessToast('Workflow published', `"${response.data.name}" is now live and ready to execute.`);
    },
    onError: (error: any) => {
      showErrorToast('Error publishing workflow', error.response?.data?.message || 'An unexpected error occurred');
    },
  });

  return {
    workflow,
    isLoading,
    error,
    publishWorkflow: publishMutation.mutate,
    isPublishing: publishMutation.isPending,
  };
};