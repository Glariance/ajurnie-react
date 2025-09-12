import React, { createContext, useContext, useEffect, useState } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getUser,
  forgotPassword as apiForgotPassword, // ✅ add this
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
  /** NEW: request a password reset email */
  requestPasswordReset: (
    email: string
  ) => Promise<{ data: any; error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
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
      return {
        data: null,
        error: error?.response?.data?.message || "Login failed",
      };
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
      return {
        data: null,
        error: error?.response?.data?.message || "Registration failed",
      };
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

  // ✅ NEW: request password reset via your API helper
const requestPasswordReset = async (email: string) => {
  try {
    // Let interceptors handle both success + error toasts
    const data = await apiForgotPassword(
      { email },
      {
        // Provide a success message for the interceptor toast.
        // (You can change this text to taste.)
        meta: { successMessage: "Password reset link sent. Check your email." },
      }
    );
    return { data, error: null };
  } catch (err: any) {
    // Interceptor already showed an error toast; just return an error object
    const msg =
      err?.response?.data?.message || err?.message || "Failed to send reset email";
    return { data: null, error: msg };
  }
};


  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    requestPasswordReset, // ✅ expose it
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
