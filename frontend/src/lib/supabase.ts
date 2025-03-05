import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging for environment variables
console.log('Supabase URL:', supabaseUrl ? 'Defined' : 'Undefined');
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Defined' : 'Undefined');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
  throw new Error('Missing Supabase environment variables');
}

// Create the Supabase client with options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Change to false to prevent issues with route changes
    storageKey: 'curabot-auth-storage' // Add a unique storage key
  }
});

// Log successful initialization
console.log('Supabase client initialized successfully');
