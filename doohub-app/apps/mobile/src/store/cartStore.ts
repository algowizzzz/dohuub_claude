import { create } from 'zustand';
import api from '../services/api';
import { ENDPOINTS } from '../constants/api';

interface CartItem {
  id: string;
  listingId: string;
  listing: any;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  vendorId: string | null;
  vendor: any | null;
  subtotal: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchCart: () => Promise<void>;
  addItem: (listingId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  clearError: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  vendorId: null,
  vendor: null,
  subtotal: 0,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await api.get(ENDPOINTS.CART);
      set({
        items: response.data?.items || [],
        vendorId: response.data?.vendorId || null,
        vendor: response.data?.vendor || null,
        subtotal: response.data?.subtotal || 0,
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Failed to fetch cart:', error);
      set({
        items: [],
        vendorId: null,
        vendor: null,
        subtotal: 0,
        isLoading: false,
        error: error.message || 'Failed to load cart',
      });
    }
  },

  addItem: async (listingId: string, quantity = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await api.post(`${ENDPOINTS.CART}/items`, {
        listingId,
        quantity,
      });
      set({
        items: response.data?.items || [],
        vendorId: response.data?.vendorId || null,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Failed to add item' });
      throw error;
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`${ENDPOINTS.CART}/items/${itemId}`, { quantity });
      // Refetch cart to get updated totals
      const response: any = await api.get(ENDPOINTS.CART);
      set({
        items: response.data?.items || [],
        subtotal: response.data?.subtotal || 0,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Failed to update quantity' });
      throw error;
    }
  },

  removeItem: async (itemId: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`${ENDPOINTS.CART}/items/${itemId}`);
      // Refetch cart
      const response: any = await api.get(ENDPOINTS.CART);
      set({
        items: response.data?.items || [],
        vendorId: response.data?.vendorId || null,
        subtotal: response.data?.subtotal || 0,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Failed to remove item' });
      throw error;
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(ENDPOINTS.CART);
      set({
        items: [],
        vendorId: null,
        vendor: null,
        subtotal: 0,
        isLoading: false,
      });
    } catch (error: any) {
      // Even if API fails, clear local cart state
      set({
        items: [],
        vendorId: null,
        vendor: null,
        subtotal: 0,
        isLoading: false,
        error: error.message || 'Failed to clear cart',
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

