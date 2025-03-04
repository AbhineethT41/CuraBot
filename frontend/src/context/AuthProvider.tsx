import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';

// Create auth context
const AuthContext = createContext<ReturnType<typeof useAuthStore.getState> | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authStore = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    // Initialize auth state when component mounts
    let unsubscribe: (() => void) | undefined;
    
    const initializeAuth = async () => {
      try {
        const unsub = await authStore.initialize();
        unsubscribe = unsub;
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setIsInitialized(true); // Still set to true so we don't block rendering
      }
    };
    
    initializeAuth();
    
    // Clean up subscription when component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []); // Remove authStore from dependencies to prevent infinite loops
  
  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
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
