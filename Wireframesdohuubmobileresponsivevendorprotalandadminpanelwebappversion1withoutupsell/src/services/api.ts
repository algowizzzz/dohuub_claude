import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private client: AxiosInstance;
  private tokenKey = 'dohuub_auth_token';
  private refreshTokenKey = 'dohuub_refresh_token';

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearTokens();
          // Optionally redirect to login
          // window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Token management
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  clearTokens(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Generic request methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data.data ?? response.data as T;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data.data ?? response.data as T;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data.data ?? response.data as T;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data.data ?? response.data as T;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data.data ?? response.data as T;
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post<{
      success: boolean;
      data: {
        user: any;
        token: string;
        refreshToken?: string;
      };
    }>('/auth/login', { email, password });

    if (response.data.success && response.data.data.token) {
      this.setToken(response.data.data.token);
      if (response.data.data.refreshToken) {
        this.setRefreshToken(response.data.data.refreshToken);
      }
    }

    return response.data;
  }

  async register(data: { email: string; password: string; name: string; role?: string }) {
    const response = await this.client.post('/auth/register', data);
    return response.data;
  }

  async logout() {
    this.clearTokens();
  }

  async getCurrentUser() {
    return this.get('/auth/me');
  }

  // Admin - Vendor endpoints
  async getVendors(params?: { status?: string; page?: number; limit?: number }) {
    return this.get('/admin/vendors', { params });
  }

  async getVendorById(id: string) {
    return this.get(`/admin/vendors/${id}`);
  }

  async updateVendorStatus(id: string, status: 'ACTIVE' | 'SUSPENDED' | 'APPROVED' | 'REJECTED') {
    return this.patch(`/admin/vendors/${id}/status`, { status });
  }

  // Admin - Listing endpoints
  async getListings(params?: { type?: string; status?: string; vendorId?: string }) {
    return this.get('/admin/listings', { params });
  }

  async updateListingStatus(type: string, id: string, status: 'ACTIVE' | 'INACTIVE' | 'FLAGGED') {
    return this.patch(`/admin/listings/${type}/${id}/status`, { status });
  }

  // Admin - Order endpoints
  async getOrders(params?: { status?: string; page?: number }) {
    return this.get('/admin/orders', { params });
  }

  async updateOrderStatus(id: string, status: string) {
    return this.patch(`/admin/orders/${id}/status`, { status });
  }

  // Vendor - Store endpoints
  async getMyStores() {
    return this.get('/stores/my');
  }

  async createStore(data: FormData | object) {
    const isFormData = data instanceof FormData;
    return this.post('/stores', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
  }

  async getStoreById(id: string) {
    return this.get(`/stores/${id}`);
  }

  async updateStore(id: string, data: FormData | object) {
    const isFormData = data instanceof FormData;
    return this.put(`/stores/${id}`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
  }

  async deleteStore(id: string) {
    return this.delete(`/stores/${id}`);
  }

  async activateStore(id: string) {
    return this.patch(`/stores/${id}/activate`, {});
  }

  async deactivateStore(id: string) {
    return this.patch(`/stores/${id}/deactivate`, {});
  }

  async assignStoreRegions(storeId: string, regionIds: string[]) {
    return this.post(`/stores/${storeId}/regions`, { regionIds });
  }

  // File upload endpoints
  async uploadImage(file: File, type: string = 'general') {
    const formData = new FormData();
    formData.append('image', file);

    return this.post(`/upload/image?type=${type}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async uploadImages(files: File[], type: string = 'general') {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    return this.post(`/upload/images?type=${type}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async deleteFile(fileId: string, bucket: string = 'uploads') {
    return this.delete(`/upload/${fileId}?bucket=${bucket}`);
  }

  // Settings endpoints
  async getVendorSettings() {
    return this.get('/settings/vendor');
  }

  async updateVendorSettings(data: object) {
    return this.put('/settings/vendor', data);
  }

  async getAdminSettings() {
    return this.get('/settings/admin');
  }

  async updateAdminSettings(data: object) {
    return this.put('/settings/admin', data);
  }

  // Regions
  async getRegions() {
    return this.get('/regions');
  }
}

// Export singleton instance
export const api = new ApiService();

// Export class for testing
export { ApiService };
