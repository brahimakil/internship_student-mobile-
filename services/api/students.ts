import apiClient from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { Student } from '@/types';

export const studentsApi = {
  register: (data: { fullName: string; major: string }) => 
    apiClient.post<Student>(`${API_ENDPOINTS.STUDENTS}/register`, data),

  getById: (id: string) => apiClient.get<Student>(API_ENDPOINTS.STUDENT_BY_ID(id)),
  
  update: (id: string, data: Partial<Student>) => 
    apiClient.put<Student>(API_ENDPOINTS.STUDENT_BY_ID(id), data),
  
  updateGeminiKey: (id: string, apiKey: string) => 
    apiClient.patch(API_ENDPOINTS.STUDENT_GEMINI_KEY(id), { apiKey }),
  
  uploadCV: async (id: string, fileUri: string) => {
    const formData = new FormData();
    const filename = fileUri.split('/').pop() || 'cv.pdf';
    
    formData.append('file', {
      uri: fileUri,
      type: 'application/pdf',
      name: filename,
    } as any);
    
    return apiClient.postFormData(API_ENDPOINTS.STUDENT_CV(id), formData);
  },
  
  uploadProfilePhoto: async (id: string, fileUri: string) => {
    const formData = new FormData();
    const filename = fileUri.split('/').pop() || 'photo.jpg';
    const fileType = fileUri.endsWith('.png') ? 'image/png' : 'image/jpeg';
    
    formData.append('file', {
      uri: fileUri,
      type: fileType,
      name: filename,
    } as any);
    
    return apiClient.postFormData(API_ENDPOINTS.STUDENT_PHOTO(id), formData);
  },
};
