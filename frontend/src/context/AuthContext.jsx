"use client";

import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if we have a token in localStorage (fallback)
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("userEmail");

      if (token && userEmail) {
        // Verify token with backend using profile route
        const response = await axios.get("/me");
        if (response.data.success) {
          setUser(response.data.data);
          setIsAuthenticated(true);
        } else {
          // Token is invalid, clear everything
          // clearAuth();
        }
      } else {
        // clearAuth();
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, code = null) => {
    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
        code,
      });

      if (response.data.message === "2FA required") {
        return { requires2FA: true };
      }

      const { token, user: userData } = response.data.data;

      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", userData.email);
      localStorage.setItem("isLoggedIn", "true");

      setUser(userData);
      setIsAuthenticated(true);

      // Trigger login status change for navbar
      window.dispatchEvent(new CustomEvent("loginStatusChanged"));

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      // Call backend logout route
      await axios.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with client-side logout even if server call fails
    } finally {
      clearAuth();
      toast.success("Logged out successfully");
      router.push("/");
    }
  };

  const clearAuth = () => {
    // Clear all auth data
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isLoggedIn");

    setUser(null);
    setIsAuthenticated(false);

    // Trigger login status change for navbar
    window.dispatchEvent(new CustomEvent("loginStatusChanged"));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
