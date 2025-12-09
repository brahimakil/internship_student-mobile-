import apiClient from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { Enrollment } from '@/types';

export const enrollmentsApi = {
  getAll: () => apiClient.get<Enrollment[]>(API_ENDPOINTS.ENROLLMENTS),
  
  getByStudent: (studentId: string) => 
    apiClient.get<Enrollment[]>(API_ENDPOINTS.ENROLLMENTS_BY_STUDENT(studentId)),
  
  getByInternship: (internshipId: string) => 
    apiClient.get<Enrollment[]>(API_ENDPOINTS.ENROLLMENTS_BY_INTERNSHIP(internshipId)),
  
  create: (data: Partial<Enrollment>) => 
    apiClient.post<Enrollment>(API_ENDPOINTS.ENROLLMENTS, data),
};
