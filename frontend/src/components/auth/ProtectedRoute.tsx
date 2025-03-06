import React from 'react';
import { useAuth } from '../../context/AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string; // Optional role requirement
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  // Get auth context (which now provides mock data)
  const auth = useAuth();
  
  // Log access for debugging
  console.log('ProtectedRoute accessed, auth bypassed');
  console.log('Mock user role:', auth.user?.user_metadata?.user_type);
  
  // With authentication disabled, we always render the children
  return <>{children}</>;
};

export default ProtectedRoute;
