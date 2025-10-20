import axios from "axios";
import { toast } from "sonner";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to add JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    // Check if running in browser
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("isLoggedIn");

      // Trigger login status change
      window.dispatchEvent(new CustomEvent("loginStatusChanged"));

      // Show toast only if not on login page
      if (window.location.pathname !== "/login") {
        toast.error("Session expired. Please login again.");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
