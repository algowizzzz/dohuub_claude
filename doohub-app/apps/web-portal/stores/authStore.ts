import { create } from "zustand";
import { persist } from "zustand/middleware";
import api, { ENDPOINTS } from "@/lib/api";

export type UserRole = "CUSTOMER" | "VENDOR" | "ADMIN";

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  profile?: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  isEmailVerified: boolean;
}

export interface Vendor {
  id: string;
  userId: string;
  businessName: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  contactEmail?: string;
  contactPhone?: string;
  isMichelle: boolean;
  subscriptionStatus: "TRIAL" | "ACTIVE" | "PAUSED" | "EXPIRED" | "CANCELLED";
  trialStartedAt?: string;
  trialEndsAt?: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  vendor: Vendor | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string) => Promise<User>;
  register: (email: string, profile?: { firstName?: string; lastName?: string }) => Promise<User>;
  verifyOtp: (email: string, otp: string, isRegistration: boolean) => Promise<void>; // Deprecated but kept
  logout: () => void;
  fetchUser: () => Promise<void>;
  fetchVendor: () => Promise<void>;
  updateProfile: (data: Partial<User["profile"]>) => Promise<void>;
  clearError: () => void;
  setToken: (token: string, refreshToken?: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      vendor: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post(ENDPOINTS.AUTH.LOGIN, { email });
          const { token, refreshToken, user } = response.data.data;

          if (typeof window !== "undefined") {
            localStorage.setItem("doohub_token", token);
            if (refreshToken) {
              localStorage.setItem("doohub_refresh_token", refreshToken);
            }
          }

          set({
            user,
            isAuthenticated: true,
          });

          // Fetch vendor info if user is vendor/admin
          if (user.role === "VENDOR" || user.role === "ADMIN") {
            await get().fetchVendor();
          }

          return user;
        } catch (err: any) {
          set({ error: err.response?.data?.error || "Failed to login" });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (email: string, profile?: { firstName?: string; lastName?: string }) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post(ENDPOINTS.AUTH.REGISTER, { email, profile });
          const { token, refreshToken, user } = response.data.data;

          if (typeof window !== "undefined") {
            localStorage.setItem("doohub_token", token);
            if (refreshToken) {
              localStorage.setItem("doohub_refresh_token", refreshToken);
            }
          }

          set({
            user,
            isAuthenticated: true,
          });

          return user;
        } catch (err: any) {
          set({ error: err.response?.data?.error || "Failed to register" });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      verifyOtp: async (email: string, otp: string, isRegistration: boolean) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post(ENDPOINTS.AUTH.VERIFY_OTP, {
            email,
            otp,
            isRegistration,
          });

          const { token, refreshToken, user } = response.data.data;

          if (typeof window !== "undefined") {
            localStorage.setItem("doohub_token", token);
            if (refreshToken) {
              localStorage.setItem("doohub_refresh_token", refreshToken);
            }
          }

          set({
            user,
            isAuthenticated: true,
          });

          // Fetch vendor info if user is vendor/admin
          if (user.role === "VENDOR" || user.role === "ADMIN") {
            await get().fetchVendor();
          }
        } catch (err: any) {
          set({ error: err.response?.data?.error || "Invalid OTP" });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("doohub_token");
          localStorage.removeItem("doohub_refresh_token");
        }
        set({
          user: null,
          vendor: null,
          isAuthenticated: false,
        });
      },

      fetchUser: async () => {
        try {
          const response = await api.get(ENDPOINTS.AUTH.ME);
          const user = response.data.data;
          set({ user, isAuthenticated: true });

          if (user.role === "VENDOR" || user.role === "ADMIN") {
            await get().fetchVendor();
          }
        } catch (err) {
          set({ isAuthenticated: false, user: null, vendor: null });
        }
      },

      fetchVendor: async () => {
        try {
          const response = await api.get(`${ENDPOINTS.VENDORS}/me`);
          set({ vendor: response.data.data });
        } catch (err) {
          // User might not have vendor profile yet
          set({ vendor: null });
        }
      },

      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.put(ENDPOINTS.USERS.ME, data);
          set({ user: response.data.data });
        } catch (err: any) {
          set({ error: err.response?.data?.error || "Failed to update profile" });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      clearError: () => set({ error: null }),

      setToken: (token: string, refreshToken?: string) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("doohub_token", token);
          if (refreshToken) {
            localStorage.setItem("doohub_refresh_token", refreshToken);
          }
        }
      },
    }),
    {
      name: "doohub-auth",
      partialize: (state) => ({
        user: state.user,
        vendor: state.vendor,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

