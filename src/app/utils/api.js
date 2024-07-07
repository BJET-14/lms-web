// api.js
import axios from 'axios';
import Cookies from 'js-cookie';

let API_CONFIG = null;
let axiosInstance = null;

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_BASE_URL || '';
};

const loadConfig = async () => {
  const baseUrl = getBaseUrl();
  const configUrl = `${baseUrl}/config.json`;
  const response = await fetch(configUrl);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  API_CONFIG = await response.json();
  initializeAxios();
};

const initializeAxios = () => {
  if (!API_CONFIG || !API_CONFIG.API_BASE_URL) {
    throw new Error('Invalid API configuration');
  }
  axiosInstance = axios.create({
    baseURL: API_CONFIG.API_BASE_URL,
    timeout: API_CONFIG.API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const apiCall = async (method, ...args) => {
  if (!axiosInstance) {
    await loadConfig();
  }
  return axiosInstance[method](...args);
};

export const api = {
  auth: {
    register: (userData) => apiCall('post', '/auth/registration', userData),
    login: (credentials) => apiCall('post', '/auth/login', credentials),
  },
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    if (axiosInstance) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  } else {
    localStorage.removeItem('token');
    if (axiosInstance) {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  }
};

export const setUserRole = (role) => {
  Cookies.set('userRole', role, { expires: 7 });
};

export const getUserRole = () => {
  return Cookies.get('userRole');
};

export const authService = {
  register: async (userData) => {
    const response = await api.auth.register(userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.auth.login(credentials);
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    if (response.data.role) {
      setUserRole(response.data.role);
    }
    return response.data;
  },
  logout: () => {
    setAuthToken(null);
    Cookies.remove('userRole');
  },
};

export const reinitializeApi = loadConfig;