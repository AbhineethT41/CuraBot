import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { api } from '../lib/api';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  
  // Auth methods
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  
  // Initialize auth state
  initialize: () => Promise<() => void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  initialize: async () => {
    try {
      set({ loading: true, error: null });
      
      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      if (session) {
        set({ 
          user: session.user,
          session: session,
        });
        
        // Try to create/update user profile in database
        // Add a small delay to ensure the session is properly set in the store
        setTimeout(async () => {
          try {
            // Check if user metadata exists before trying to access it
            const userData = {
              first_name: session.user.user_metadata?.first_name || '',
              last_name: session.user.user_metadata?.last_name || '',
              phone: session.user.user_metadata?.phone || '',
              role: session.user.user_metadata?.user_type || 'patient'
            };
            
            await api.post('/auth/profile', userData);
            console.log('User profile synced with database');
          } catch (profileError) {
            console.error('Error syncing user profile:', profileError);
            // Don't throw error here, just log it
          }
        }, 500);
      }
      
      // Set up auth state change listener
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.id);
          
          // Update the auth state in our store
          set({ 
            user: session?.user || null,
            session: session,
            loading: false,
          });
          
          // If user just signed up or signed in, create/update their profile in database
          if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
            setTimeout(async () => {
              try {
                // Check if user metadata exists before trying to access it
                if (session.user) {
                  const userData = {
                    first_name: session.user.user_metadata?.first_name || '',
                    last_name: session.user.user_metadata?.last_name || '',
                    phone: session.user.user_metadata?.phone || '',
                    role: session.user.user_metadata?.user_type || 'patient'
                  };
                  
                  await api.post('/auth/profile', userData);
                  console.log(`User profile updated in database after ${event}`);
                }
              } catch (profileError) {
                console.error(`Error updating user profile after ${event}:`, profileError);
                // Don't throw error here, just log it
              }
            }, 500);
          }
        }
      );
      
      // Set loading to false after initialization
      set({ loading: false });
      
      // Return unsubscribe function for cleanup
      return () => {
        subscription.unsubscribe();
      };
    } catch (error: any) {
      console.error('Auth initialization error:', error);
      set({ error: error.message, loading: false });
      return () => {}; // Return empty cleanup function
    }
  },

  signUp: async (email, password, userData) => {
    try {
      set({ loading: true, error: null });
      
      // Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            phone: userData.phone || '',
            user_type: userData.role || 'patient'
          }
        }
      });
      
      if (error) throw error;
      
      // Update local state with the new user
      set({ 
        user: data.user,
        session: data.session,
      });
      
      // Create user profile in database
      if (data.user) {
        try {
          await api.post('/auth/profile', {
            first_name: userData.first_name,
            last_name: userData.last_name,
            phone: userData.phone || '',
            role: userData.role || 'patient'
          });
        } catch (profileError) {
          console.error('Error creating user profile:', profileError);
          // Don't throw error here, just log it
        }
      }
      
      return data;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  
  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Update local state with the user
      set({ 
        user: data.user,
        session: data.session,
      });
      
      return data;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  
  signOut: async () => {
    try {
      set({ loading: true, error: null });
      
      // Sign out with Supabase Auth
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Clear user state
      set({ 
        user: null,
        session: null,
      });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  
  resetPassword: async (email) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  
  updateProfile: async (data) => {
    try {
      set({ loading: true, error: null });
      
      // Update user metadata in Supabase Auth
      const { data: userData, error } = await supabase.auth.updateUser({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          user_type: data.role || data.user_type
        },
      });
      
      if (error) throw error;
      
      // Update the local user state with the new data
      if (userData.user) {
        set({ user: userData.user });
      }
      
      // Update user profile in database
      try {
        await api.post('/auth/profile', {
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
          role: data.role || data.user_type || 'patient'
        });
        console.log('User profile updated in database');
      } catch (profileError) {
        console.error('Error updating user profile in database:', profileError);
        // Don't throw error here, just log it
      }
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
