import { create } from 'zustand';
import api from '../services/api';
import { ENDPOINTS } from '../constants/api';

interface User {
  id: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  profile?: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  isEmailVerified: boolean;
}

interface Address {
  id: string;
  type: 'HOME' | 'WORK' | 'DOCTOR' | 'PHARMACY' | 'OTHER';
  label: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

interface AuthState {
  user: User | null;
  addresses: Address[];
  selectedAddressId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  
  // Actions
  login: (email: string) => Promise<User>;
  register: (email: string, profile?: { firstName?: string; lastName?: string }) => Promise<User>;
  verifyOtp: (email: string, otp: string, isRegistration: boolean, profile?: any) => Promise<void>; // Deprecated
  googleSignIn: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  setSelectedAddress: (addressId: string) => void;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setOnboardingComplete: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  addresses: [],
  selectedAddressId: null,
  isAuthenticated: false,
  isLoading: false,
  hasCompletedOnboarding: false,

  login: async (email: string) => {
    set({ isLoading: true });
    try {
      const response: any = await api.post(ENDPOINTS.AUTH.LOGIN, { email });

      await api.setToken(response.data.token);
      await api.setRefreshToken(response.data.refreshToken);

      set({
        user: response.data.user,
        isAuthenticated: true,
      });

      // Fetch addresses
      await get().fetchUser();
      
      return response.data.user;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email: string, profile?: { firstName?: string; lastName?: string }) => {
    set({ isLoading: true });
    try {
      const response: any = await api.post(ENDPOINTS.AUTH.REGISTER, { email, profile });

      await api.setToken(response.data.token);
      await api.setRefreshToken(response.data.refreshToken);

      set({
        user: response.data.user,
        isAuthenticated: true,
      });

      return response.data.user;
    } finally {
      set({ isLoading: false });
    }
  },

  verifyOtp: async (email: string, otp: string, isRegistration: boolean, profile?: any) => {
    set({ isLoading: true });
    try {
      const response: any = await api.post(ENDPOINTS.AUTH.VERIFY_OTP, {
        email,
        otp,
        isRegistration,
        profile,
      });

      await api.setToken(response.data.token);
      await api.setRefreshToken(response.data.refreshToken);

      set({
        user: response.data.user,
        isAuthenticated: true,
      });

      // Fetch addresses
      await get().fetchUser();
    } finally {
      set({ isLoading: false });
    }
  },

  googleSignIn: async (data: any) => {
    set({ isLoading: true });
    try {
      const response: any = await api.post(ENDPOINTS.AUTH.GOOGLE_SIGNIN, data);

      await api.setToken(response.data.token);
      await api.setRefreshToken(response.data.refreshToken);

      set({
        user: response.data.user,
        isAuthenticated: true,
      });

      await get().fetchUser();
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await api.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (e) {
      // Ignore error
    }
    await api.clearTokens();
    set({
      user: null,
      addresses: [],
      selectedAddressId: null,
      isAuthenticated: false,
    });
  },

  fetchUser: async () => {
    try {
      const response: any = await api.get(ENDPOINTS.AUTH.ME);
      const addresses = response.data.addresses || [];
      const defaultAddress = addresses.find((a: Address) => a.isDefault);

      set({
        user: response.data,
        addresses,
        selectedAddressId: defaultAddress?.id || addresses[0]?.id || null,
        isAuthenticated: true,
      });
    } catch (e) {
      set({ isAuthenticated: false, user: null });
    }
  },

  updateProfile: async (data: any) => {
    set({ isLoading: true });
    try {
      const response: any = await api.put(ENDPOINTS.USERS.ME, data);
      set({ user: response.data });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedAddress: (addressId: string) => {
    set({ selectedAddressId: addressId });
  },

  addAddress: async (address: Omit<Address, 'id'>) => {
    set({ isLoading: true });
    try {
      const response: any = await api.post(ENDPOINTS.ADDRESSES, address);
      const newAddress = response.data;
      set((state) => ({
        addresses: [...state.addresses, newAddress],
        selectedAddressId: newAddress.isDefault ? newAddress.id : state.selectedAddressId || newAddress.id,
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  updateAddress: async (id: string, address: Partial<Address>) => {
    set({ isLoading: true });
    try {
      const response: any = await api.put(`${ENDPOINTS.ADDRESSES}/${id}`, address);
      set((state) => ({
        addresses: state.addresses.map((a) => (a.id === id ? response.data : a)),
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAddress: async (id: string) => {
    set({ isLoading: true });
    try {
      await api.delete(`${ENDPOINTS.ADDRESSES}/${id}`);
      set((state) => ({
        addresses: state.addresses.filter((a) => a.id !== id),
        selectedAddressId: state.selectedAddressId === id ? state.addresses[0]?.id || null : state.selectedAddressId,
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  setOnboardingComplete: () => {
    set({ hasCompletedOnboarding: true });
  },
}));

