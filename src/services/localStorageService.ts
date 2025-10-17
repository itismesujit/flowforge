import type { Workflow } from '../features/workflow/workflowSlice';

const STORAGE_KEY = 'flowforge_workflows';
const CURRENT_WORKFLOW_KEY = 'flowforge_current_workflow';

/**
 * Local Storage Service - Mimics API service for development/demo
 */
export const localStorageService = {
  // Get all workflows from localStorage
  getAll: (): Promise<{ data: Workflow[] }> => {
    return new Promise((resolve) => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const workflows = stored ? JSON.parse(stored) : [];
        resolve({ data: workflows });
      } catch (error) {
        console.error('Error getting workflows from localStorage:', error);
        resolve({ data: [] });
      }
    });
  },

  // Get workflow by ID
  getById: (id: string): Promise<{ data: Workflow | null }> => {
    return new Promise((resolve) => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const workflows: Workflow[] = stored ? JSON.parse(stored) : [];
        const workflow = workflows.find(w => w.id === id) || null;
        resolve({ data: workflow });
      } catch (error) {
        console.error('Error getting workflow by ID from localStorage:', error);
        resolve({ data: null });
      }
    });
  },

  // Create new workflow
  create: (data: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<{ data: Workflow }> => {
    return new Promise((resolve, reject) => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const workflows: Workflow[] = stored ? JSON.parse(stored) : [];
        
        const newWorkflow: Workflow = {
          ...data,
          id: `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: 'local-user',
        };

        workflows.push(newWorkflow);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
        
        resolve({ data: newWorkflow });
      } catch (error) {
        console.error('Error creating workflow in localStorage:', error);
        reject(new Error('Failed to create workflow'));
      }
    });
  },

  // Update existing workflow
  update: (id: string, data: Partial<Workflow>): Promise<{ data: Workflow }> => {
    return new Promise((resolve, reject) => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const workflows: Workflow[] = stored ? JSON.parse(stored) : [];
        
        const index = workflows.findIndex(w => w.id === id);
        if (index === -1) {
          reject(new Error('Workflow not found'));
          return;
        }

        const updatedWorkflow = {
          ...workflows[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };

        workflows[index] = updatedWorkflow;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
        
        // Also update current workflow if it's the one being updated
        const currentWorkflow = localStorage.getItem(CURRENT_WORKFLOW_KEY);
        if (currentWorkflow) {
          const current = JSON.parse(currentWorkflow);
          if (current.id === id) {
            localStorage.setItem(CURRENT_WORKFLOW_KEY, JSON.stringify(updatedWorkflow));
          }
        }
        
        resolve({ data: updatedWorkflow });
      } catch (error) {
        console.error('Error updating workflow in localStorage:', error);
        reject(new Error('Failed to update workflow'));
      }
    });
  },

  // Delete workflow
  delete: (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const workflows: Workflow[] = stored ? JSON.parse(stored) : [];
        
        const filteredWorkflows = workflows.filter(w => w.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredWorkflows));
        
        // Remove from current workflow if it's the deleted one
        const currentWorkflow = localStorage.getItem(CURRENT_WORKFLOW_KEY);
        if (currentWorkflow) {
          const current = JSON.parse(currentWorkflow);
          if (current.id === id) {
            localStorage.removeItem(CURRENT_WORKFLOW_KEY);
          }
        }
        
        resolve();
      } catch (error) {
        console.error('Error deleting workflow from localStorage:', error);
        reject(new Error('Failed to delete workflow'));
      }
    });
  },

  // Duplicate workflow
  duplicate: async (id: string): Promise<{ data: Workflow }> => {
    try {
      const { data: original } = await localStorageService.getById(id);
      if (!original) {
        throw new Error('Workflow not found');
      }

      const duplicated = await localStorageService.create({
        name: `${original.name} (Copy)`,
        description: original.description,
        nodes: original.nodes,
        edges: original.edges,
        status: 'draft',
      });

      return duplicated;
    } catch (error) {
      console.error('Error duplicating workflow:', error);
      throw new Error('Failed to duplicate workflow');
    }
  },

  // Execute workflow (mock)
  execute: (id: string, inputData?: any): Promise<{ data: any }> => {
    return new Promise((resolve) => {
      // Mock execution result
      const result = {
        executionId: `exec-${Date.now()}`,
        workflowId: id,
        status: 'completed',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        input: inputData,
        output: { message: 'Workflow executed successfully (mock)' },
      };
      
      setTimeout(() => resolve({ data: result }), 1000); // Simulate API delay
    });
  },

  // Publish workflow
  publish: (id: string): Promise<{ data: Workflow }> => {
    return localStorageService.update(id, { status: 'published' });
  },

  // Archive workflow
  archive: (id: string): Promise<{ data: Workflow }> => {
    return localStorageService.update(id, { status: 'archived' });
  },

  // Utility methods for current workflow management
  getCurrentWorkflow: (): Workflow | null => {
    try {
      const stored = localStorage.getItem(CURRENT_WORKFLOW_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error getting current workflow:', error);
      return null;
    }
  },

  setCurrentWorkflow: (workflow: Workflow | null): void => {
    try {
      if (workflow) {
        localStorage.setItem(CURRENT_WORKFLOW_KEY, JSON.stringify(workflow));
      } else {
        localStorage.removeItem(CURRENT_WORKFLOW_KEY);
      }
    } catch (error) {
      console.error('Error setting current workflow:', error);
    }
  },

  // Clear all data (for development/testing)
  clearAll: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CURRENT_WORKFLOW_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  // Get storage info
  getStorageInfo: () => {
    try {
      const workflows = localStorage.getItem(STORAGE_KEY);
      const currentWorkflow = localStorage.getItem(CURRENT_WORKFLOW_KEY);
      
      return {
        totalWorkflows: workflows ? JSON.parse(workflows).length : 0,
        hasCurrentWorkflow: !!currentWorkflow,
        storageSize: new Blob([workflows || '[]']).size,
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return {
        totalWorkflows: 0,
        hasCurrentWorkflow: false,
        storageSize: 0,
      };
    }
  },
};

export default localStorageService;