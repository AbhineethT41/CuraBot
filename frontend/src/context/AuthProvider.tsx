import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  error: null,
  signUp: async () => ({}),
  signIn: async () => ({}),
  signOut: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const authStore = useAuthStore();
  
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    
    const initializeAuth = async () => {
      try {
        // Initialize auth state from Supabase
        cleanup = await authStore.initialize();
        setInitialized(true);
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setInitialized(true); // Still mark as initialized even on error
      }
    };
    
    initializeAuth();
    
    // Clean up auth listener on unmount
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, []);
  
  const value = {
    user: authStore.user,
    session: authStore.session,
    loading: authStore.loading || !initialized,
    error: authStore.error,
    signUp: authStore.signUp,
    signIn: authStore.signIn,
    signOut: authStore.signOut,
    resetPassword: authStore.resetPassword,
    updateProfile: authStore.updateProfile,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
