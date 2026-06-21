import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import toast from 'react-hot-toast';

interface User {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  cookie_consent: boolean;
  tuesday_promo_subscribed?: boolean;
  avatar_url?: string;
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
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem('token') && !!localStorage.getItem('user');
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      setIsLoggedIn(!!token && !!savedUser);
      setUser(savedUser ? JSON.parse(savedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    setIsLoading(false);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (userData: User) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('lastActivity', Date.now().toString()); // Set fresh activity on login
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('lastActivity'); // Clear activity on logout
  };

  // Inactivity Session Expiry (30 Minutes)
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.removeItem('lastActivity');
      return;
    }

    const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes in milliseconds

    // Initial check on mount
    const lastActivity = localStorage.getItem('lastActivity');
    if (lastActivity) {
      const elapsed = Date.now() - parseInt(lastActivity, 10);
      if (elapsed >= INACTIVITY_LIMIT) {
        logout();
        toast.error("Session expired due to inactivity.");
        return;
      }
    } else {
      localStorage.setItem('lastActivity', Date.now().toString());
    }

    let timeoutId: any;
    let lastSaved = Date.now();

    const resetTimer = () => {
      const now = Date.now();
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        logout();
        toast.error("Session expired due to inactivity. Please log in again.");
      }, INACTIVITY_LIMIT);

      // Throttle localStorage updates to prevent performance lag and browser quota limits
      if (now - lastSaved > 10000) {
        try {
          localStorage.setItem('lastActivity', now.toString());
          lastSaved = now;
        } catch (e) {
          console.error("Inactivity storage sync failed:", e);
        }
      }
    };

    // Sync inactivity timers across multiple tabs
    const handleCrossTabSync = (e: StorageEvent) => {
      if (e.key === 'lastActivity' && e.newValue) {
        const timestamp = parseInt(e.newValue, 10);
        const elapsed = Date.now() - timestamp;
        window.clearTimeout(timeoutId);

        if (elapsed >= INACTIVITY_LIMIT) {
          logout();
          toast.error("Session expired due to inactivity.");
        } else {
          timeoutId = window.setTimeout(() => {
            logout();
            toast.error("Session expired due to inactivity. Please log in again.");
          }, INACTIVITY_LIMIT - elapsed);
        }
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });
    window.addEventListener('storage', handleCrossTabSync);

    // Start initial timer
    const initialElapsed = lastActivity ? Date.now() - parseInt(lastActivity, 10) : 0;
    timeoutId = window.setTimeout(() => {
      logout();
      toast.error("Session expired due to inactivity. Please log in again.");
    }, INACTIVITY_LIMIT - initialElapsed);

    return () => {
      window.clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      window.removeEventListener('storage', handleCrossTabSync);
    };
  }, [isLoggedIn]);

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
