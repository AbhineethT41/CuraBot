import React, { createContext, useContext } from 'react';

// Create a simplified auth context with mock user data
interface AuthContextType {
  user: {
    id: string;
    user_metadata: {
      first_name: string;
      last_name: string;
      user_type: string;
    }
  } | null;
  session: any;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  initialize: () => Promise<() => void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for development without authentication
const mockUser = {
  id: 'mock-user-id',
  user_metadata: {
    first_name: 'Test',
    last_name: 'User',
    user_type: 'patient', // Default to patient role
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Create a simplified auth store with mock data
  const authStore: AuthContextType = {
    user: mockUser,
    session: { user: mockUser },
    loading: false,
    error: null,
    
    // Mock auth methods
    signIn: async () => ({ user: mockUser }),
    signUp: async () => ({ user: mockUser }),
    signOut: async () => {},
    resetPassword: async () => {},
    updateProfile: async () => {},
    initialize: async () => {
      console.log('Auth initialization bypassed - using mock user');
      return () => {};
    }
  };
  
  return (
    <AuthContext.Provider value={authStore}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
