import { useEffect, useState, useCallback } from 'react';
import { useSocket } from './useSocket';
import { useAppDispatch } from '../store/hooks';
import {
  updateExecution,
  updateExecutionStep,
  startLiveExecution,
  stopLiveExecution,
} from '../features/execution/executionSlice';
import type { Execution } from '../features/execution/executionSlice';

interface ExecutionUpdateData {
  executionId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress?: number;
  currentStep?: string;
  completedAt?: string;
  error?: string;
  output?: any;
}

interface StepUpdateData {
  executionId: string;
  stepId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  output?: any;
  error?: string;
}

/**
 * useExecutionUpdates - Hook for managing real-time execution updates via Socket.io
 */
export const useExecutionUpdates = (executionId?: string) => {
  const { socket, connected } = useSocket();
  const dispatch = useAppDispatch();
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Subscribe to execution updates
  const subscribeToExecution = useCallback((id: string) => {
    if (!socket || !connected) {
      console.warn('Cannot subscribe to execution: socket not connected');
      return false;
    }

    console.log('Subscribing to execution updates:', id);
    socket.emit('subscribe:execution', id);
    setIsSubscribed(true);
    return true;
  }, [socket, connected]);

  // Unsubscribe from execution updates
  const unsubscribeFromExecution = useCallback((id: string) => {
    if (!socket) {
      return;
    }

    console.log('Unsubscribing from execution updates:', id);
    socket.emit('unsubscribe:execution', id);
    setIsSubscribed(false);
  }, [socket]);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Execution status updates
    const handleExecutionUpdate = (data: ExecutionUpdateData) => {
      console.log('Execution update received:', data);
      
      dispatch(updateExecution({
        id: data.executionId,
        updates: {
          status: data.status,
          completedAt: data.completedAt,
          error: data.error,
          output: data.output,
        },
      }));

      // If execution is completed or failed, stop live tracking
      if (['completed', 'failed', 'cancelled'].includes(data.status)) {
        dispatch(stopLiveExecution(data.executionId));
      }
    };

    // Step status updates
    const handleStepUpdate = (data: StepUpdateData) => {
      console.log('Step update received:', data);
      
      dispatch(updateExecutionStep({
        executionId: data.executionId,
        stepId: data.stepId,
        updates: {
          status: data.status,
          startedAt: data.startedAt,
          completedAt: data.completedAt,
          duration: data.duration,
          output: data.output,
          error: data.error,
        },
      }));
    };

    // Execution started
    const handleExecutionStart = (execution: Execution) => {
      console.log('Execution started:', execution);
      dispatch(startLiveExecution(execution));
    };

    // Execution completed
    const handleExecutionComplete = (data: ExecutionUpdateData) => {
      console.log('Execution completed:', data);
      
      dispatch(updateExecution({
        id: data.executionId,
        updates: {
          status: data.status,
          completedAt: data.completedAt,
          output: data.output,
        },
      }));

      dispatch(stopLiveExecution(data.executionId));
    };

    // Execution error
    const handleExecutionError = (data: ExecutionUpdateData) => {
      console.log('Execution error:', data);
      
      dispatch(updateExecution({
        id: data.executionId,
        updates: {
          status: 'failed',
          completedAt: data.completedAt || new Date().toISOString(),
          error: data.error,
        },
      }));

      dispatch(stopLiveExecution(data.executionId));
    };

    // Register event listeners
    socket.on('execution:update', handleExecutionUpdate);
    socket.on('execution:step', handleStepUpdate);
    socket.on('execution:started', handleExecutionStart);
    socket.on('execution:completed', handleExecutionComplete);
    socket.on('execution:error', handleExecutionError);

    // Cleanup event listeners
    return () => {
      socket.off('execution:update', handleExecutionUpdate);
      socket.off('execution:step', handleStepUpdate);
      socket.off('execution:started', handleExecutionStart);
      socket.off('execution:completed', handleExecutionComplete);
      socket.off('execution:error', handleExecutionError);
    };
  }, [socket, dispatch]);

  // Auto-subscribe to execution if ID is provided
  useEffect(() => {
    if (executionId && connected) {
      subscribeToExecution(executionId);
      
      return () => {
        unsubscribeFromExecution(executionId);
      };
    }
  }, [executionId, connected, subscribeToExecution, unsubscribeFromExecution]);

  return {
    subscribeToExecution,
    unsubscribeFromExecution,
    isSubscribed,
    connected,
  };
};

/**
 * useWorkflowExecutionStatus - Hook for tracking the status of a specific execution
 */
export const useWorkflowExecutionStatus = (executionId: string) => {
  const [status, setStatus] = useState<{
    status: string;
    progress: number;
    currentStep: string | null;
    error: string | null;
  }>({
    status: 'pending',
    progress: 0,
    currentStep: null,
    error: null,
  });

  const { socket, connected } = useSocket();

  useEffect(() => {
    if (!socket || !connected || !executionId) return;

    // Subscribe to this specific execution
    socket.emit('subscribe:execution', executionId);

    const handleUpdate = (data: ExecutionUpdateData) => {
      if (data.executionId === executionId) {
        setStatus(prev => ({
          ...prev,
          status: data.status,
          progress: data.progress || prev.progress,
          currentStep: data.currentStep || prev.currentStep,
          error: data.error || prev.error,
        }));
      }
    };

    socket.on('execution:update', handleUpdate);

    return () => {
      socket.emit('unsubscribe:execution', executionId);
      socket.off('execution:update', handleUpdate);
    };
  }, [socket, connected, executionId]);

  return status;
};