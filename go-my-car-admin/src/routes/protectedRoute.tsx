import { useAuth } from "@/context/authContext";
import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactElement; // The component to render if authenticated
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Check if the user is authenticated (e.g., token stored in localStorage)
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <div>Loading...</div>; // Show a loading state while checking auth
  }
  if (!isAuthenticated) {
    // Redirect to the login page if the user is not authenticated
    return <Navigate to="/auth/login" replace />;
  }

  // If authenticated, render the children (protected content)
  return children;
};

export default ProtectedRoute;
