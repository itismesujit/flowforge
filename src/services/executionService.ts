import api from './api';
import type { Execution } from '../features/execution/executionSlice';

export const executionService = {
  getAll: (params?: {
    workflowId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => api.get<{
    executions: Execution[];
    total: number;
    page: number;
    totalPages: number;
  }>('/executions', { params }),
  
  getById: (id: string) => api.get<Execution>(`/executions/${id}`),
  
  cancel: (id: string) => api.patch(`/executions/${id}/cancel`),
  
  retry: (id: string) => api.post<Execution>(`/executions/${id}/retry`),
  
  delete: (id: string) => api.delete(`/executions/${id}`),
  
  getLogs: (id: string) => api.get<{
    logs: Array<{
      timestamp: string;
      level: 'info' | 'warn' | 'error';
      message: string;
      nodeId?: string;
      stepId?: string;
    }>;
  }>(`/executions/${id}/logs`),
};