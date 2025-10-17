import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateCurrentWorkflow } from '../features/workflow/workflowSlice';
import { localStorageService } from '../services/localStorageService';
import type { Node, Edge } from 'reactflow';

/**
 * Hook to manage workflow canvas state syncing with Redux and localStorage
 */
export const useWorkflowSync = () => {
  const dispatch = useAppDispatch();
  const currentWorkflow = useAppSelector(state => state.workflow.currentWorkflow);

  const syncWorkflowState = useCallback(async (nodes: Node[], edges: Edge[]) => {
    if (!currentWorkflow) return;

    try {
      // Update Redux store immediately for UI responsiveness
      const updatedWorkflow = {
        ...currentWorkflow,
        nodes,
        edges,
        updatedAt: new Date().toISOString(),
      };

      dispatch(updateCurrentWorkflow(updatedWorkflow));
      
      // Update localStorage in background
      await localStorageService.update(currentWorkflow.id, {
        nodes,
        edges,
        updatedAt: updatedWorkflow.updatedAt,
      });
      
      // Update current workflow in localStorage
      localStorageService.setCurrentWorkflow(updatedWorkflow);
      
    } catch (error) {
      console.error('Failed to sync workflow state:', error);
    }
  }, [currentWorkflow, dispatch]);

  return {
    currentWorkflow,
    syncWorkflowState,
  };
};