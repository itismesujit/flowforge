import { Provider } from './components/ui/provider';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import WorkflowCanvas from './components/canvas/WorkflowCanvas';
import WorkflowHeader from './components/layout/WorkflowHeader';
import { Toaster, toaster } from './components/ui/toaster';
import { Box } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { updateCurrentWorkflow, setCurrentWorkflow } from './features/workflow/workflowSlice';
import { localStorageService } from './services/localStorageService';
import { useState, useEffect } from 'react';
import './App.css';

/**
 * Main App Component with error boundaries and providers
 */
function App() {
  const dispatch = useAppDispatch();
  const currentWorkflow = useAppSelector(state => state.workflow.currentWorkflow);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize with workflow from localStorage or create a default one
  useEffect(() => {
    const initializeWorkflow = async () => {
      if (!currentWorkflow) {
        // First, try to get the last current workflow from localStorage
        const savedCurrent = localStorageService.getCurrentWorkflow();
        
        if (savedCurrent) {
          dispatch(setCurrentWorkflow(savedCurrent));
          return;
        }

        // If no saved workflow, create a default one
        const mockWorkflow = {
          id: 'demo-workflow-1',
          name: 'Customer Onboarding Flow',
          description: 'Demo workflow for customer onboarding process',
          nodes: [
            {
              id: '1',
              type: 'default',
              position: { x: 100, y: 100 },
              data: { label: 'New Customer' },
            },
            {
              id: '2',
              type: 'default',
              position: { x: 300, y: 100 },
              data: { label: 'Send Welcome Email' },
            },
          ],
          edges: [
            { id: 'e1-2', source: '1', target: '2' },
          ],
          status: 'draft' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: 'demo-user',
        };

        // Save the default workflow to localStorage
        try {
          await localStorageService.create(mockWorkflow);
          localStorageService.setCurrentWorkflow(mockWorkflow);
          dispatch(setCurrentWorkflow(mockWorkflow));
        } catch {
          // If creation fails, just set it in Redux
          dispatch(setCurrentWorkflow(mockWorkflow));
        }
      }
    };

    initializeWorkflow();
  }, [currentWorkflow, dispatch]);

  const handleSave = async () => {
    if (!currentWorkflow) {
      toaster.create({
        title: "No workflow to save",
        description: "Please create or load a workflow first",
        type: "warning",
      });
      return;
    }

    setIsSaving(true);
    try {
      const updatedWorkflow = await localStorageService.update(currentWorkflow.id, {
        name: currentWorkflow.name,
        nodes: currentWorkflow.nodes,
        edges: currentWorkflow.edges,
        updatedAt: new Date().toISOString(),
      });
      
      // Update both Redux and localStorage current workflow
      dispatch(updateCurrentWorkflow(updatedWorkflow.data));
      localStorageService.setCurrentWorkflow(updatedWorkflow.data);
      
      toaster.create({
        title: "Workflow saved",
        description: "Your workflow has been saved successfully",
        type: "success",
      });
    } catch {
      toaster.create({
        title: "Save failed",
        description: "Failed to save workflow. Please try again.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    if (!currentWorkflow) {
      toaster.create({
        title: "No workflow to export",
        description: "Please create or load a workflow first",
        type: "warning",
      });
      return;
    }

    try {
      // Create export data
      const exportData = {
        name: currentWorkflow.name,
        description: currentWorkflow.description,
        nodes: currentWorkflow.nodes,
        edges: currentWorkflow.edges,
        version: '1.0',
        exportedAt: new Date().toISOString(),
      };

      // Create and download JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentWorkflow.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toaster.create({
        title: "Workflow exported",
        description: "Your workflow has been downloaded as JSON",
        type: "success",
      });
    } catch {
      toaster.create({
        title: "Export failed",
        description: "Failed to export workflow. Please try again.",
        type: "error",
      });
    }
  };

  const handleSettings = () => {
    // For now, show a toast - this could open a settings modal later
    toaster.create({
      title: "Settings",
      description: "Settings panel coming soon!",
      type: "info",
    });
  };

  const handleShare = async () => {
    if (!currentWorkflow) {
      toaster.create({
        title: "No workflow to share",
        description: "Please create or load a workflow first",
        type: "warning",
      });
      return;
    }

    try {
      // Generate a shareable URL (this would typically involve your backend)
      const shareUrl = `${window.location.origin}/workflow/${currentWorkflow.id}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      
      toaster.create({
        title: "Link copied",
        description: "Shareable link has been copied to clipboard",
        type: "success",
      });
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = `${window.location.origin}/workflow/${currentWorkflow.id}`;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        toaster.create({
          title: "Link copied",
          description: "Shareable link has been copied to clipboard",
          type: "success",
        });
      } catch {
        toaster.create({
          title: "Share failed",
          description: "Could not copy link to clipboard",
          type: "error",
        });
      }
      
      document.body.removeChild(textArea);
    }
  };

  const handleProjectNameChange = async (newName: string) => {
    if (!currentWorkflow) return;

    try {
      const updatedWorkflow = await localStorageService.update(currentWorkflow.id, {
        name: newName,
      });
      
      // Update both Redux and localStorage current workflow  
      dispatch(updateCurrentWorkflow(updatedWorkflow.data));
      localStorageService.setCurrentWorkflow(updatedWorkflow.data);
      
      toaster.create({
        title: "Name updated",
        description: "Workflow name has been updated",
        type: "success",
      });
    } catch {
      toaster.create({
        title: "Update failed",
        description: "Failed to update workflow name",
        type: "error",
      });
    }
  };

  const handleRecentWorkflowClick = async (workflowName: string) => {
    // Create different sample workflows with nodes for each type
    const getSampleWorkflow = (name: string) => {
      const baseWorkflow = {
        id: `demo-${name.toLowerCase().replace(/\s+/g, '-')}`,
        name,
        description: `Demo workflow for ${name}`,
        status: 'draft' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'demo-user',
      };

      switch (name) {
        case 'Customer Onboarding':
          return {
            ...baseWorkflow,
            nodes: [
              {
                id: '1',
                type: 'default',
                position: { x: 100, y: 100 },
                data: { label: 'New Customer' },
              },
              {
                id: '2',
                type: 'default',
                position: { x: 300, y: 100 },
                data: { label: 'Send Welcome Email' },
              },
              {
                id: '3',
                type: 'default',
                position: { x: 500, y: 100 },
                data: { label: 'Create Account' },
              },
            ],
            edges: [
              { id: 'e1-2', source: '1', target: '2' },
              { id: 'e2-3', source: '2', target: '3' },
            ],
          };
          
        case 'Data Processing':
          return {
            ...baseWorkflow,
            nodes: [
              {
                id: '1',
                type: 'default',
                position: { x: 100, y: 100 },
                data: { label: 'Raw Data Input' },
              },
              {
                id: '2',
                type: 'default',
                position: { x: 300, y: 100 },
                data: { label: 'Data Validation' },
              },
              {
                id: '3',
                type: 'default',
                position: { x: 500, y: 100 },
                data: { label: 'Transform Data' },
              },
              {
                id: '4',
                type: 'default',
                position: { x: 700, y: 100 },
                data: { label: 'Store Results' },
              },
            ],
            edges: [
              { id: 'e1-2', source: '1', target: '2' },
              { id: 'e2-3', source: '2', target: '3' },
              { id: 'e3-4', source: '3', target: '4' },
            ],
          };
          
        case 'Email Campaign':
          return {
            ...baseWorkflow,
            nodes: [
              {
                id: '1',
                type: 'default',
                position: { x: 100, y: 100 },
                data: { label: 'Target Audience' },
              },
              {
                id: '2',
                type: 'default',
                position: { x: 300, y: 100 },
                data: { label: 'Create Email' },
              },
              {
                id: '3',
                type: 'default',
                position: { x: 500, y: 100 },
                data: { label: 'Send Campaign' },
              },
              {
                id: '4',
                type: 'default',
                position: { x: 300, y: 250 },
                data: { label: 'Track Analytics' },
              },
            ],
            edges: [
              { id: 'e1-2', source: '1', target: '2' },
              { id: 'e2-3', source: '2', target: '3' },
              { id: 'e3-4', source: '3', target: '4' },
            ],
          };
          
        default:
          return {
            ...baseWorkflow,
            nodes: [],
            edges: [],
          };
      }
    };

    const mockWorkflow = getSampleWorkflow(workflowName);
    
    // Save to localStorage and set as current
    try {
      const { data: savedWorkflow } = await localStorageService.create(mockWorkflow);
      localStorageService.setCurrentWorkflow(savedWorkflow);
      dispatch(setCurrentWorkflow(savedWorkflow));
      
      toaster.create({
        title: "Workflow loaded",
        description: `Switched to "${workflowName}" workflow`,
        type: "info",
      });
    } catch {
      // If localStorage fails, just set in Redux
      dispatch(setCurrentWorkflow(mockWorkflow));
      toaster.create({
        title: "Workflow loaded",
        description: `Switched to "${workflowName}" workflow (localStorage unavailable)`,
        type: "info",
      });
    }
  };

  const handleNewWorkflow = async () => {
    try {
      // Create a new blank workflow
      const newWorkflow = {
        id: `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: 'Untitled Workflow',
        description: 'A new workflow',
        nodes: [
          {
            id: 'start-node',
            type: 'default',
            position: { x: 250, y: 150 },
            data: { label: 'Start' },
          },
        ],
        edges: [],
        status: 'draft' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'demo-user',
      };

      // Save to localStorage and set as current
      const { data: savedWorkflow } = await localStorageService.create(newWorkflow);
      localStorageService.setCurrentWorkflow(savedWorkflow);
      dispatch(setCurrentWorkflow(savedWorkflow));
      
      toaster.create({
        title: "New workflow created",
        description: "Started with a blank workflow",
        type: "success",
      });
    } catch {
      // If localStorage fails, just set in Redux
      const newWorkflow = {
        id: `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: 'Untitled Workflow',
        description: 'A new workflow',
        nodes: [
          {
            id: 'start-node',
            type: 'default',
            position: { x: 250, y: 150 },
            data: { label: 'Start' },
          },
        ],
        edges: [],
        status: 'draft' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'demo-user',
      };
      
      dispatch(setCurrentWorkflow(newWorkflow));
      toaster.create({
        title: "New workflow created",
        description: "Started with a blank workflow (localStorage unavailable)",
        type: "success",
      });
    }
  };

  return (
    <ErrorBoundary>
      <Provider>
        <Box height="100vh" display="flex" flexDirection="column" bg="gray.50">
          {/* Modern Professional Header */}
          <WorkflowHeader
            projectName={currentWorkflow?.name || "Untitled Workflow"}
            isAutoSaving={isSaving}
            onSave={handleSave}
            onExport={handleExport}
            onSettings={handleSettings}
            onShare={handleShare}
            onProjectNameChange={handleProjectNameChange}
            onRecentWorkflowClick={handleRecentWorkflowClick}
            onNewWorkflow={handleNewWorkflow}
          />
          
          {/* Main Canvas Area */}
          <Box flex="1" overflow="hidden" minH="0">
            <WorkflowCanvas />
          </Box>
        </Box>
        <Toaster />
      </Provider>
    </ErrorBoundary>
  );
}

export default App;