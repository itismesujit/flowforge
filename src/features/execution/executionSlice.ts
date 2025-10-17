import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ExecutionStep {
  id: string;
  nodeId: string;
  nodeName: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  input?: any;
  output?: any;
  error?: string;
}

export interface Execution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  duration?: number;
  steps: ExecutionStep[];
  input?: any;
  output?: any;
  error?: string;
  userId: string;
}

interface ExecutionState {
  executions: Execution[];
  currentExecution: Execution | null;
  isLoading: boolean;
  error: string | null;
  liveExecutions: Record<string, Execution>;
}

const initialState: ExecutionState = {
  executions: [],
  currentExecution: null,
  isLoading: false,
  error: null,
  liveExecutions: {},
};

const executionSlice = createSlice({
  name: 'execution',
  initialState,
  reducers: {
    setExecutions: (state, action: PayloadAction<Execution[]>) => {
      state.executions = action.payload;
    },
    addExecution: (state, action: PayloadAction<Execution>) => {
      state.executions.unshift(action.payload);
    },
    setCurrentExecution: (state, action: PayloadAction<Execution | null>) => {
      state.currentExecution = action.payload;
    },
    updateExecution: (state, action: PayloadAction<{ id: string; updates: Partial<Execution> }>) => {
      const { id, updates } = action.payload;
      
      // Update in executions list
      const executionIndex = state.executions.findIndex(exec => exec.id === id);
      if (executionIndex !== -1) {
        state.executions[executionIndex] = { ...state.executions[executionIndex], ...updates };
      }
      
      // Update current execution if it matches
      if (state.currentExecution?.id === id) {
        state.currentExecution = { ...state.currentExecution, ...updates };
      }
      
      // Update live executions
      if (state.liveExecutions[id]) {
        state.liveExecutions[id] = { ...state.liveExecutions[id], ...updates };
      }
    },
    updateExecutionStep: (state, action: PayloadAction<{ 
      executionId: string; 
      stepId: string; 
      updates: Partial<ExecutionStep> 
    }>) => {
      const { executionId, stepId, updates } = action.payload;
      
      // Helper function to update steps in an execution
      const updateStepsInExecution = (execution: Execution) => {
        const stepIndex = execution.steps.findIndex(step => step.id === stepId);
        if (stepIndex !== -1) {
          execution.steps[stepIndex] = { ...execution.steps[stepIndex], ...updates };
        }
      };
      
      // Update in executions list
      const executionIndex = state.executions.findIndex(exec => exec.id === executionId);
      if (executionIndex !== -1) {
        updateStepsInExecution(state.executions[executionIndex]);
      }
      
      // Update current execution
      if (state.currentExecution?.id === executionId) {
        updateStepsInExecution(state.currentExecution);
      }
      
      // Update live executions
      if (state.liveExecutions[executionId]) {
        updateStepsInExecution(state.liveExecutions[executionId]);
      }
    },
    startLiveExecution: (state, action: PayloadAction<Execution>) => {
      const execution = action.payload;
      state.liveExecutions[execution.id] = execution;
    },
    stopLiveExecution: (state, action: PayloadAction<string>) => {
      delete state.liveExecutions[action.payload];
    },
    cancelExecution: (state, action: PayloadAction<string>) => {
      const executionId = action.payload;
      const updates = { status: 'cancelled' as const, completedAt: new Date().toISOString() };
      
      // Update in executions list
      const executionIndex = state.executions.findIndex(exec => exec.id === executionId);
      if (executionIndex !== -1) {
        state.executions[executionIndex] = { ...state.executions[executionIndex], ...updates };
      }
      
      // Update current execution
      if (state.currentExecution?.id === executionId) {
        state.currentExecution = { ...state.currentExecution, ...updates };
      }
      
      // Update live executions
      if (state.liveExecutions[executionId]) {
        state.liveExecutions[executionId] = { ...state.liveExecutions[executionId], ...updates };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearExecutions: (state) => {
      state.executions = [];
    },
    clearLiveExecutions: (state) => {
      state.liveExecutions = {};
    },
  },
});

export const {
  setExecutions,
  addExecution,
  setCurrentExecution,
  updateExecution,
  updateExecutionStep,
  startLiveExecution,
  stopLiveExecution,
  cancelExecution,
  setLoading,
  setError,
  clearError,
  clearExecutions,
  clearLiveExecutions,
} = executionSlice.actions;

export default executionSlice.reducer;