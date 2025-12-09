import apiClient from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { Internship } from '@/types';

export const internshipsApi = {
  getAll: () => apiClient.get<Internship[]>(API_ENDPOINTS.INTERNSHIPS),
  
  getById: (id: string) => apiClient.get<Internship>(API_ENDPOINTS.INTERNSHIP_BY_ID(id)),
  
  // Filter by industry (client-side for now, can be optimized with backend endpoint)
  getByIndustry: async (industry: string): Promise<Internship[]> => {
    const internships = await apiClient.get<Internship[]>(API_ENDPOINTS.INTERNSHIPS);
    // Filter will be done after fetching companies
    return internships;
  },
};
