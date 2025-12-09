// Core Types for Internship Student App

export interface Student {
  id: string;
  email: string;
  fullName: string;
  major: string;
  address?: string;
  profilePhotoUrl?: string;
  cvUrl?: string;
  geminiApiKey?: string;
  cvParsedData?: CVParsedData;
  cvLastUpdated?: string;
  status: 'active' | 'inactive';
  role: 'student';
  createdAt: Date | string;
}

export interface CVParsedData {
  skills: string[];
  experience: Experience[];
  education: Education[];
  interests: string[];
  achievements: string[];
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  industry?: string;
  location?: string;
  description?: string;
  logoUrl?: string;
  status: 'active' | 'inactive';
}

export interface Internship {
  id: string;
  companyId: string;
  companyName?: string;
  companyLogo?: string;
  title: string;
  description: string;
  status: 'open' | 'closed';
  location: string;
  locationType: 'remote' | 'onsite' | 'hybrid';
  duration: string;
  requiredSkills: string[];
  logoUrl?: string;
  applicationsCount?: number;
  currentStudentsCount?: number;
  createdAt: Date | string;
}

export interface Application {
  id: string;
  studentId: string;
  internshipId: string;
  companyId: string;
  status: 'pending' | 'accepted' | 'rejected';
  coverLetter?: string;
  resumeUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  projectDescription?: string;
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  // Populated fields
  internship?: {
    id: string;
    title: string;
  };
  company?: {
    id: string;
    name: string;
  };
  // Alternative populated fields
  internshipTitle?: string;
  companyName?: string;
  reviewNotes?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  internshipId: string;
  companyId: string;
  status: 'pending' | 'accepted' | 'rejected';
  internshipTitle?: string;
  companyName?: string;
  enrolledDate: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Assignment {
  id: string;
  internshipId: string;
  studentId: string;
  companyId: string;
  title: string;
  description: string;
  dueDate: Date | string;
  status: 'assigned' | 'submitted' | 'reviewed';
  submissionUrl?: string;
  submissionNotes?: string;
  reviewNotes?: string;
  score?: number;
  internshipTitle?: string;
  companyName?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface AIChat {
  studentId: string;
  message: string;
  context?: string;
}

export interface AIResponse {
  response: string;
  context?: string;
  internships?: any[];
}

export interface InternshipAssistant {
  studentId: string;
  internshipId: string;
  question: string;
}

export interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
}
