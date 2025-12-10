import React, { createContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/services/firebase/config';
import * as firebaseAuth from '@/services/firebase/auth';
import { Student } from '@/types';
import { studentsApi } from '@/services/api';

interface AuthContextType {
  user: User | null;
  student: Student | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, major: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshStudent: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety timeout - if auth doesn't initialize in 3 seconds, stop loading
    const timeout = setTimeout(() => {
      console.log('Auth initialization timeout - setting loading to false');
      setLoading(false);
    }, 3000);

    try {
      const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
        clearTimeout(timeout);
        setUser(firebaseUser);
        
        if (firebaseUser) {
          // Fetch student data from backend
          try {
            const studentId = firebaseUser.email?.replaceAll(/[@.]/g, '_') || '';
            const studentData = await studentsApi.getById(studentId);
            setStudent(studentData);
          } catch (error) {
            console.error('Error fetching student data:', error);
            setStudent(null);
          }
        } else {
          setStudent(null);
        }
        
        setLoading(false);
      });

      return () => {
        clearTimeout(timeout);
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      clearTimeout(timeout);
      setLoading(false);
      return undefined;
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await firebaseAuth.login(email, password);
      // Student data will be fetched in onAuthStateChanged
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (email: string, password: string, fullName: string, major: string) => {
    setLoading(true);
    try {
      await firebaseAuth.register(email, password, fullName);
      
      // Register student data in backend
      await studentsApi.register({
        fullName,
        major,
      });
      
      // Student data will be fetched in onAuthStateChanged
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    await firebaseAuth.logout();
    setUser(null);
    setStudent(null);
  };

  const refreshStudent = async () => {
    if (user) {
      try {
        const studentId = user.email?.replaceAll(/[@.]/g, '_') || '';
        const studentData = await studentsApi.getById(studentId);
        setStudent(studentData);
      } catch (error) {
        console.error('Error refreshing student data:', error);
      }
    }
  };

  const value = useMemo(
    () => ({ user, student, loading, login, register, logout, refreshStudent }),
    [user, student, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
