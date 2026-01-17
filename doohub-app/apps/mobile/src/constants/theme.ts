// Wireframe-accurate gray scale theme
export const colors = {
  // Primary gray scale (matching wireframes)
  gray: {
    900: '#111827',  // Darkest
    800: '#1f2937',  // Primary text, buttons
    700: '#374151',  // Secondary text
    600: '#4b5563',  // Muted text
    500: '#6b7280',  // Placeholder
    400: '#9ca3af',  // Disabled
    300: '#d1d5db',  // Borders
    200: '#e5e7eb',  // Light borders
    100: '#f3f4f6',  // Surface
    50: '#f9fafb',   // Background alt
  },
  
  primary: '#1f2937',      // gray-800
  secondary: '#4b5563',    // gray-600
  background: '#ffffff',
  surface: '#f3f4f6',      // gray-100
  
  text: {
    primary: '#1f2937',    // gray-800
    secondary: '#4b5563',  // gray-600
    muted: '#9ca3af',      // gray-400
    inverse: '#ffffff',
  },
  
  border: {
    light: '#e5e7eb',      // gray-200
    default: '#d1d5db',    // gray-300
    dark: '#9ca3af',       // gray-400
  },
  
  status: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  rating: '#fbbf24',
  
  // Category colors (for icons)
  category: {
    cleaning: '#6b7280',   // gray-500 (default)
    handyman: '#6b7280',
    groceries: '#6b7280',
    beauty: '#6b7280',
    rentals: '#6b7280',
    caregiving: '#6b7280',
  },
};

// Standard border width for wireframe consistency
export const borderWidth = {
  default: 2,
  thin: 1,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

