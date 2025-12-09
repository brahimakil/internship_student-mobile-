import apiClient from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { Assignment } from '@/types';

export const assignmentsApi = {
  getAll: () => apiClient.get<Assignment[]>(API_ENDPOINTS.ASSIGNMENTS),
  
  getById: (id: string) => apiClient.get<Assignment>(API_ENDPOINTS.ASSIGNMENT_BY_ID(id)),
  
  getByStudent: (studentId: string) => 
    apiClient.get<Assignment[]>(API_ENDPOINTS.ASSIGNMENTS_BY_STUDENT(studentId)),
  
  submit: (id: string, data: { submissionUrl: string; submissionNotes?: string }) => 
    apiClient.patch<Assignment>(API_ENDPOINTS.ASSIGNMENT_SUBMIT(id), data),
};
