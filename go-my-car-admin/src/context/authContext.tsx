import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import {
  setToken,
  getToken,
  setSessionStorageObject,
  clearSessionStorage,
  setSessionStorageItem,
} from '@/utils/sessionStorage';
import Toast from '@/components/toast/commonToast';
import { useNavigate } from 'react-router-dom';

// Define the shape of the user data
interface AdminDetails {
    _id: string;
    
}

interface UserData {
  adminDetails?: AdminDetails;
}

// Define the shape of the context
interface AuthContextProps {
  isAuthenticated: boolean;
  user: UserData | null;
  login: (token: string, userData: UserData) => void;
  logout: () => void;
  isLoading: boolean;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getToken());
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Load user details on app initialization
  useEffect(() => {
    const token = getToken();

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }

    setIsLoading(false);
  }, []);

  // Login function
  const login = (token: string, userData: UserData): void => {
    console.log("userData, token", userData, token)
    setToken(token);
    setSessionStorageItem('user_id', userData?.adminDetails?._id);
    // setSessionStorageItem('user_type', userData.user_type);

    setIsAuthenticated(true);
    // setUser(userData);
    // window.location.href = "/";
    navigate('/', { replace: true });
    Toast('success', 'Login Success.', '');
  };

  // Logout function
  const logout = (): void => {
    clearSessionStorage();
    setIsAuthenticated(false);
    setUser(null);
    // window.location.href = "/auth/login";

    navigate('/auth/login', { replace: true });
  };

  // Memoize the context value to prevent unnecessary re-renders
  const authContextValue = useMemo(
    () => ({ isAuthenticated, user, login, logout, isLoading }),
    [isAuthenticated, user, isLoading]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
