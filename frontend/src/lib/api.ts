// Base API URL
// In production, API calls will be made to the same origin (relative URL)
// In development, we'll use the environment variable or default to localhost
const API_URL = (() => {
  // Check if we're in production by looking at the hostname
  const isProduction = window.location.hostname !== 'localhost' && 
                      window.location.hostname !== '127.0.0.1';
  
  if (isProduction) {
    // In production, use relative URL since backend serves frontend
    return '/api';
  }
  
  // In development, use environment variable or default
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
})();

/**
 * Generic API client for making requests to the backend
 * Authentication has been removed for development
 */
export const api = {
  /**
   * Make a GET request to the API
   * @param endpoint - API endpoint
   * @param params - Query parameters
   * @returns Response data
   */
  async get<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const url = new URL(`${API_URL}${endpoint}`);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });
    
    console.log(`Making GET request to: ${url.toString()}`);
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || 'API request failed');
    }
    
    const data = await response.json();
    console.log(`GET response from ${endpoint}:`, data);
    return data;
  },
  
  /**
   * Make a POST request to the API
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @returns Response data
   */
  async post<T>(endpoint: string, data: any = {}): Promise<T> {
    console.log(`Making POST request to: ${API_URL}${endpoint}`, data);
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || 'API request failed');
    }
    
    try {
      const responseData = await response.json();
      console.log(`POST response from ${endpoint}:`, responseData);
      return responseData;
    } catch (error) {
      console.error(`Error parsing JSON from ${endpoint}:`, error);
      throw new Error('Invalid JSON response from server');
    }
  },
  
  /**
   * Make a PUT request to the API
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @returns Response data
   */
  async put<T>(endpoint: string, data: any = {}): Promise<T> {
    console.log(`Making PUT request to: ${API_URL}${endpoint}`, data);
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || 'API request failed');
    }
    
    const responseData = await response.json();
    console.log(`PUT response from ${endpoint}:`, responseData);
    return responseData;
  },
  
  /**
   * Make a DELETE request to the API
   * @param endpoint - API endpoint
   * @returns Response data
   */
  async delete<T>(endpoint: string): Promise<T> {
    console.log(`Making DELETE request to: ${API_URL}${endpoint}`);
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || 'API request failed');
    }
    
    const responseData = await response.json();
    console.log(`DELETE response from ${endpoint}:`, responseData);
    return responseData;
  }
};
