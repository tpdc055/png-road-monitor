"use client";

import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role:
    | "ADMIN"
    | "PROJECT_MANAGER"
    | "SITE_ENGINEER"
    | "FINANCIAL_OFFICER"
    | "VIEWER";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = () => {
    try {
      // BYPASS LOGIN - Auto-login as demo admin user
      const demoUser: User = {
        id: "demo-admin-001",
        name: "Demo Administrator",
        email: "admin@png.gov.pg",
        role: "ADMIN",
      };

      console.log("🚀 BYPASS MODE: Auto-logging in as demo admin");
      setUser(demoUser);

      // Also save to localStorage for consistency
      localStorage.setItem("png_road_monitor_user", JSON.stringify(demoUser));
    } catch (error) {
      console.error("Auto-login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // BYPASS - Just set demo user based on email
      const demoUsers: Record<string, User> = {
        "admin@png.gov.pg": {
          id: "demo-admin-001",
          name: "Demo Administrator",
          email: "admin@png.gov.pg",
          role: "ADMIN",
        },
        "manager@png.gov.pg": {
          id: "demo-manager-001",
          name: "Demo Project Manager",
          email: "manager@png.gov.pg",
          role: "PROJECT_MANAGER",
        },
        "engineer@png.gov.pg": {
          id: "demo-engineer-001",
          name: "Demo Site Engineer",
          email: "engineer@png.gov.pg",
          role: "SITE_ENGINEER",
        },
        "finance@png.gov.pg": {
          id: "demo-finance-001",
          name: "Demo Financial Officer",
          email: "finance@png.gov.pg",
          role: "FINANCIAL_OFFICER",
        },
      };

      const userData = demoUsers[email] || demoUsers["admin@png.gov.pg"];

      // Save user to localStorage for persistence
      localStorage.setItem("png_road_monitor_user", JSON.stringify(userData));

      // Update state
      setUser(userData);

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      // Clear user state immediately
      setUser(null);

      // Clear all stored session data
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("png_road_monitor_")) {
          keysToRemove.push(key);
        }
      }
      for (const key of keysToRemove) {
        localStorage.removeItem(key);
      }

      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
