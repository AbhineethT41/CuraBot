import { supabase } from './supabase';

// Base API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic API client for making authenticated requests to the backend
 */
export const api = {
  /**
   * Make a GET request to the API
   * @param endpoint - API endpoint
   * @param params - Query parameters
   * @returns Response data
   */
  async get<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    
    const url = new URL(`${API_URL}${endpoint}`);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    
    return response.json();
  },
  
  /**
   * Make a POST request to the API
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @returns Response data
   */
  async post<T>(endpoint: string, data: any = {}): Promise<T> {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    
    return response.json();
  },
  
  /**
   * Make a PUT request to the API
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @returns Response data
   */
  async put<T>(endpoint: string, data: any = {}): Promise<T> {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    
    return response.json();
  },
  
  /**
   * Make a DELETE request to the API
   * @param endpoint - API endpoint
   * @returns Response data
   */
  async delete<T>(endpoint: string): Promise<T> {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    
    return response.json();
  }
};
