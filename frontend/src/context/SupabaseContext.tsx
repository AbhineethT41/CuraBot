import React, { createContext, useContext, ReactNode } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';

// Create a context for the Supabase client
interface SupabaseContextType {
  supabase: SupabaseClient;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

// Provider component that wraps the app and makes Supabase client available to any child component
interface SupabaseProviderProps {
  children: ReactNode;
  supabase: SupabaseClient;
}

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children, supabase }) => {
  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
};

// Hook to use the Supabase client
export const useSupabase = (): SupabaseContextType => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
