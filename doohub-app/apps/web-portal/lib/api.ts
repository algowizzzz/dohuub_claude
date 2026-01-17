import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_BASE = `${API_URL}/api/v1`;

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("doohub_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("doohub_token");
        localStorage.removeItem("doohub_refresh_token");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export const ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    VERIFY_OTP: "/auth/verify-otp",
    RESEND_OTP: "/auth/resend-otp",
    GOOGLE_SIGNIN: "/auth/google-signin",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  USERS: {
    ME: "/users/me",
  },
  ADDRESSES: "/addresses",
  VENDORS: "/vendors",
  SERVICES: {
    CLEANING: "/services/cleaning",
    HANDYMAN: "/services/handyman",
    BEAUTY: "/services/beauty",
    GROCERIES: "/services/groceries",
    RENTALS: "/services/rentals",
    CAREGIVING: "/services/caregiving",
  },
  BOOKINGS: "/bookings",
  ORDERS: "/orders",
  CART: "/cart",
  REVIEWS: "/reviews",
  PAYMENTS: "/payments",
  CHAT: "/chat",
  NOTIFICATIONS: "/notifications",
};

export default api;

