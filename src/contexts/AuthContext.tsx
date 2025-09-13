import React, { createContext, useContext, useEffect, useState } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getUser,
  forgotPassword as apiForgotPassword,
  resetPassword as apiResetPassword,
  type ResetPasswordPayload,
} from "../api/api";

interface User {
  id: number;
  email: string;
  fullname: string;
  role: "novice" | "trainer";
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (userData: {
    fullname: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: "novice" | "trainer";
  }) => Promise<any>;
  signOut: () => Promise<void>;
  // NEW
  requestPasswordReset: (email: string) => Promise<{ data: any; error: string | null }>;
  completePasswordReset: (p: ResetPasswordPayload) => Promise<{ data: any; error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (token) {
          const userData = await getUser();
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("auth_token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiLogin({ email, password });
      setUser(response.user);
      return { data: response, error: null };
    } catch (error: any) {
      return { data: null, error: error?.response?.data?.message || "Login failed" };
    }
  };

  const signUp = async (userData: {
    fullname: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: "novice" | "trainer";
  }) => {
    try {
      const response = await apiRegister(userData);
      setUser(response.user);
      return { data: response, error: null };
    } catch (error: any) {
      return { data: null, error: error?.response?.data?.message || "Registration failed" };
    }
  };

  const signOut = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("auth_token");
    }
  };

  // NEW: uses API helper; toasts handled by interceptors
  const requestPasswordReset = async (email: string) => {
    try {
      const data = await apiForgotPassword({ email });
      return { data, error: null };
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to send reset email";
      return { data: null, error: msg };
    }
  };

  // NEW: uses API helper; toasts handled by interceptors
  const completePasswordReset = async (p: ResetPasswordPayload) => {
    try {
      const data = await apiResetPassword(p);
      return { data, error: null };
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to reset password";
      return { data: null, error: msg };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    requestPasswordReset,
    completePasswordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
