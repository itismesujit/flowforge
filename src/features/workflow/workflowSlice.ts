import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: any[];
  edges: any[];
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface WorkflowState {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WorkflowState = {
  workflows: [],
  currentWorkflow: null,
  isLoading: false,
  error: null,
};

// Async thunks will be handled by React Query instead
// These are just for UI state management

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    setCurrentWorkflow: (state, action: PayloadAction<Workflow | null>) => {
      state.currentWorkflow = action.payload;
    },
    updateCurrentWorkflow: (state, action: PayloadAction<Partial<Workflow>>) => {
      if (state.currentWorkflow) {
        state.currentWorkflow = { ...state.currentWorkflow, ...action.payload };
      }
    },
    setWorkflows: (state, action: PayloadAction<Workflow[]>) => {
      state.workflows = action.payload;
    },
    addWorkflow: (state, action: PayloadAction<Workflow>) => {
      state.workflows.push(action.payload);
    },
    updateWorkflow: (state, action: PayloadAction<{ id: string; updates: Partial<Workflow> }>) => {
      const { id, updates } = action.payload;
      const index = state.workflows.findIndex(w => w.id === id);
      if (index !== -1) {
        state.workflows[index] = { ...state.workflows[index], ...updates };
      }
    },
    removeWorkflow: (state, action: PayloadAction<string>) => {
      state.workflows = state.workflows.filter(w => w.id !== action.payload);
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
  },
});

export const {
  setCurrentWorkflow,
  updateCurrentWorkflow,
  setWorkflows,
  addWorkflow,
  updateWorkflow,
  removeWorkflow,
  setLoading,
  setError,
  clearError,
} = workflowSlice.actions;

export default workflowSlice.reducer;