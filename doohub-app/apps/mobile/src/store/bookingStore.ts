import { create } from 'zustand';
import api from '../services/api';
import { ENDPOINTS } from '../constants/api';

interface Booking {
  id: string;
  userId: string;
  vendorId: string;
  vendor: any;
  addressId: string;
  address: any;
  category: string;
  listing: any;
  scheduledDate: string;
  scheduledTime: string;
  duration?: number;
  specialInstructions?: string;
  subtotal: number;
  serviceFee: number;
  total: number;
  status: string;
  createdAt: string;
}

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchBookings: (status?: string) => Promise<void>;
  fetchBooking: (id: string) => Promise<void>;
  createBooking: (data: any) => Promise<Booking>;
  cancelBooking: (id: string, reason?: string) => Promise<void>;
  clearCurrentBooking: () => void;
  clearError: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,

  fetchBookings: async (status?: string) => {
    set({ isLoading: true, error: null });
    try {
      const params = status ? { status } : {};
      const response: any = await api.get(ENDPOINTS.BOOKINGS, params);
      set({ bookings: response.data || [], isLoading: false });
    } catch (error: any) {
      console.error('Failed to fetch bookings:', error);
      set({ 
        bookings: [], 
        isLoading: false, 
        error: error.message || 'Failed to load bookings' 
      });
    }
  },

  fetchBooking: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await api.get(`${ENDPOINTS.BOOKINGS}/${id}`);
      set({ currentBooking: response.data, isLoading: false });
    } catch (error: any) {
      console.error('Failed to fetch booking:', error);
      set({ 
        currentBooking: null, 
        isLoading: false, 
        error: error.message || 'Failed to load booking' 
      });
    }
  },

  createBooking: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await api.post(ENDPOINTS.BOOKINGS, data);
      const booking = response.data;
      set((state) => ({
        bookings: [booking, ...state.bookings],
        currentBooking: booking,
        isLoading: false,
      }));
      return booking;
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Failed to create booking' });
      throw error;
    }
  },

  cancelBooking: async (id: string, reason?: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.post(`${ENDPOINTS.BOOKINGS}/${id}/cancel`, { reason });
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === id ? { ...b, status: 'CANCELLED' } : b
        ),
        currentBooking: state.currentBooking?.id === id
          ? { ...state.currentBooking, status: 'CANCELLED' }
          : state.currentBooking,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Failed to cancel booking' });
      throw error;
    }
  },

  clearCurrentBooking: () => {
    set({ currentBooking: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));

