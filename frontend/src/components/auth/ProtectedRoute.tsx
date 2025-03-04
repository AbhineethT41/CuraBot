import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string; // Optional role requirement
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const auth = useAuth();
  const location = useLocation();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check for any errors in auth
    if (auth.error) {
      console.error('Authentication error in ProtectedRoute:', auth.error);
      setHasError(true);
    }
  }, [auth.error]);

  // Show loading state while checking authentication
  if (auth.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-blue-500">Verifying authentication...</p>
      </div>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Authentication Error!</strong>
          <span className="block sm:inline"> {auth.error || 'Unknown error occurred'}</span>
          <button 
            className="mt-3 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => window.location.href = '/signin'}
          >
            Return to Sign In
          </button>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!auth.user) {
    console.log('User not authenticated, redirecting to signin');
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If role is required, check if user has that role
  if (requiredRole && auth.user.user_metadata?.user_type !== requiredRole) {
    console.log(`User doesn't have required role: ${requiredRole}, current role: ${auth.user.user_metadata?.user_type}`);
    
    // Redirect to appropriate dashboard based on user type
    if (auth.user.user_metadata?.user_type === 'doctor') {
      return <Navigate to="/doctor-dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // User is authenticated and has required role (if specified)
  return <>{children}</>;
};

export default ProtectedRoute;
