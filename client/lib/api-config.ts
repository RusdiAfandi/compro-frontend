// Base URL for API
// Untuk production: set VITE_API_URL di environment variables hosting
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  MENU: '/menu',
  INTERESTS: {
    GET: '/interests',
    UPDATE: '/interests',
    RECOMMEND: '/interests/recommend',
    RESET: '/interests/reset',
  },
  COURSES: '/courses',
  SIMULATION: {
    PLAN: '/simulation/plan',
    CALCULATE: '/simulation/calculate',
    END_SESSION: '/simulation/end-session',
  },
} as const;

// Get token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Set token to localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Remove token from localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Get auth headers
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};