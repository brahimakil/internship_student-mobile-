import apiClient from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { Application } from '@/types';

export const applicationsApi = {
  getAll: () => apiClient.get<Application[]>(API_ENDPOINTS.APPLICATIONS),
  
  getById: (id: string) => apiClient.get<Application>(API_ENDPOINTS.APPLICATION_BY_ID(id)),
  
  getByStudent: (studentId: string) => 
    apiClient.get<Application[]>(API_ENDPOINTS.APPLICATIONS_BY_STUDENT(studentId)),
  
  create: (data: Partial<Application>) => 
    apiClient.post<Application>(API_ENDPOINTS.APPLICATIONS, data),
  
  update: (id: string, data: Partial<Application>) => 
    apiClient.put<Application>(API_ENDPOINTS.APPLICATION_BY_ID(id), data),
  
  updateStatus: (id: string, status: 'pending' | 'accepted' | 'rejected') => 
    apiClient.patch<Application>(API_ENDPOINTS.APPLICATION_STATUS(id), { status }),
  
  delete: (id: string) => 
    apiClient.delete(API_ENDPOINTS.APPLICATION_BY_ID(id)),
};
