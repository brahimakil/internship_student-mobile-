import apiClient from './client';
import { API_ENDPOINTS } from '@/constants/api';

export interface Company {
  id: string;
  name: string;
  email: string;
  industry: string;
  location: string;
  description: string;
  logoUrl?: string;
  status: string;
  internshipsCount?: number;
}

export const companiesApi = {
  getAll: () => apiClient.get<Company[]>(API_ENDPOINTS.COMPANIES),
  
  getById: (id: string) => apiClient.get<Company>(API_ENDPOINTS.COMPANY_BY_ID(id)),
  
  getUniqueIndustries: () => apiClient.get<string[]>(API_ENDPOINTS.COMPANIES_INDUSTRIES),
  
  getByIndustry: async (industry: string): Promise<Company[]> => {
    const companies = await apiClient.get<Company[]>(API_ENDPOINTS.COMPANIES);
    return companies.filter(company => company.industry === industry);
  },
};
