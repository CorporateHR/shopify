"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (storeName: string) => void;
  logout: () => void;
}

interface User {
  storeName: string;
  lastLogin: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    // Ensure this only runs on the client
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          
          // Redirect to dashboard if on store connection page
          if (window.location.pathname === '/app/store-connection') {
            router.push('/app/store-dashboard');
          }
        } catch (error) {
          console.error("Error parsing user data", error);
          // Clear invalid localStorage data
          localStorage.removeItem("user");
        }
      }
      setIsLoaded(true);
    }
  }, [router]);

  const login = (storeName: string) => {
    const user = { 
      storeName,
      lastLogin: new Date().toISOString()
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem("user", JSON.stringify(user));
    }
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("user");
    }
    setUser(null);
    setIsAuthenticated(false);
    router.push('/app/store-connection');
  };

  // Prevent rendering until client-side load is complete
  if (!isLoaded) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}