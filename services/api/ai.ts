import apiClient from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { AIChat, AIResponse, InternshipAssistant } from '@/types';

export const aiApi = {
  chat: (data: AIChat) => 
    apiClient.post<AIResponse>(API_ENDPOINTS.AI.CHAT, data),
  
  clearChat: (studentId: string) => 
    apiClient.delete(`${API_ENDPOINTS.AI.CHAT}/${studentId}`),
  
  analyzeCV: (studentId: string) => 
    apiClient.post(API_ENDPOINTS.AI.ANALYZE_CV, { studentId }),
  
  internshipAssistant: (data: InternshipAssistant) => 
    apiClient.post<AIResponse>(API_ENDPOINTS.AI.INTERNSHIP_ASSISTANT, data),
};
