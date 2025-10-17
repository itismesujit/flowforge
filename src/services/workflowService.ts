import api from './api';
import type { Workflow } from '../features/workflow/workflowSlice';

export const workflowService = {
  getAll: () => api.get<Workflow[]>('/workflows'),
  getById: (id: string) => api.get<Workflow>(`/workflows/${id}`),
  create: (data: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => 
    api.post<Workflow>('/workflows', data),
  update: (id: string, data: Partial<Workflow>) => 
    api.put<Workflow>(`/workflows/${id}`, data),
  delete: (id: string) => api.delete(`/workflows/${id}`),
  duplicate: (id: string) => api.post<Workflow>(`/workflows/${id}/duplicate`),
  execute: (id: string, inputData?: any) => 
    api.post(`/workflows/${id}/execute`, { input: inputData }),
  publish: (id: string) => api.patch<Workflow>(`/workflows/${id}/publish`),
  archive: (id: string) => api.patch<Workflow>(`/workflows/${id}/archive`),
};