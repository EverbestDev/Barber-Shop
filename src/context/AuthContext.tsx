/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  cookie_consent: boolean;
  created_at: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Synchronous initialization to prevent premature redirection on refresh
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem('token') && !!localStorage.getItem('user');
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Perform any background validation here if needed
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
