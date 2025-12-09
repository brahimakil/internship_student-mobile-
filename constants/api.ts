// API Configuration
// Production URL for deployed backend
export const API_BASE_URL = 'https://intern-backend-psi.vercel.app';

// Alternative configurations (commented out):
// For local testing: 'http://192.168.0.103:3000'
// For Android Emulator: 'http://10.0.2.2:3000'
// For iOS Simulator: 'http://localhost:3000'

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  
  // Students
  STUDENTS: '/students',
  STUDENT_BY_ID: (id: string) => `/students/${id}`,
  STUDENT_GEMINI_KEY: (id: string) => `/students/${id}/gemini-key`,
  STUDENT_CV: (id: string) => `/students/${id}/cv`,
  STUDENT_PHOTO: (id: string) => `/students/${id}/profile-photo`,
  
  // Internships
  INTERNSHIPS: '/internships',
  INTERNSHIP_BY_ID: (id: string) => `/internships/${id}`,
  
  // Applications
  APPLICATIONS: '/applications',
  APPLICATION_BY_ID: (id: string) => `/applications/${id}`,
  APPLICATIONS_BY_STUDENT: (studentId: string) => `/applications/student/${studentId}`,
  APPLICATION_STATUS: (id: string) => `/applications/${id}/status`,
  
  // Enrollments
  ENROLLMENTS: '/enrollments',
  ENROLLMENTS_BY_STUDENT: (studentId: string) => `/enrollments/student/${studentId}`,
  ENROLLMENTS_BY_INTERNSHIP: (internshipId: string) => `/enrollments/internship/${internshipId}`,
  
  // Assignments
  ASSIGNMENTS: '/assignments',
  ASSIGNMENT_BY_ID: (id: string) => `/assignments/${id}`,
  ASSIGNMENTS_BY_STUDENT: (studentId: string) => `/assignments/student/${studentId}`,
  ASSIGNMENT_SUBMIT: (id: string) => `/assignments/${id}/submit`,
  
  // AI
  AI: {
    CHAT: '/ai/chat',
    ANALYZE_CV: '/ai/analyze-cv',
    INTERNSHIP_ASSISTANT: '/ai/internship-assistant',
  },
  
  // Companies
  COMPANIES: '/companies',
  COMPANY_BY_ID: (id: string) => `/companies/${id}`,
  COMPANIES_INDUSTRIES: '/companies/industries/unique',
};

export const API_TIMEOUT = 30000; // 30 seconds
