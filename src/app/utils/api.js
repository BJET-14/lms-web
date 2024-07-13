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
  try {
    const baseUrl = getBaseUrl();
    const configUrl = `${baseUrl}/config.json`;
    console.log('Fetching config from:', configUrl);
    const response = await fetch(configUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    API_CONFIG = await response.json();
    console.log('Config loaded:', API_CONFIG);
    initializeAxios();
  } catch (error) {
    console.error('Error loading config:', error);
    throw error;
  }
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
  
  // Add request interceptor
  axiosInstance.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('API Request:', config.method.toUpperCase(), config.url, config.params || config.data);
    return config;
  }, (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  });

  // Add response interceptor
  axiosInstance.interceptors.response.use((response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  }, (error) => {
    console.error('Response error:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  });
};

const apiCall = async (method, ...args) => {
  if (!axiosInstance) {
    await loadConfig();
  }
  try {
    return await axiosInstance[method](...args);
  } catch (error) {
    console.error(`API call failed: ${method} ${args[0]}`, error);
    throw error;
  }
};

export const api = {
  auth: {
    register: (userData) => apiCall('post', '/auth/registration', userData),
    login: (credentials) => apiCall('post', '/auth/login', credentials),
  },
  users: {
    getUsers: (params) => apiCall('get', '/commons/users', { params }),
    getUserById: (id) => apiCall('get', `/commons/users/${id}`),
    registerUser: (userData) => apiCall('post', '/commons/users', userData),
    getUserByEmail: (email) => apiCall('get', '/commons/users/email', { params: { email } }),
    checkUserExist: (email) => apiCall('get', '/commons/users/exist', { params: { email } }),
  },
};

export const setAuthToken = (token) => {
  Cookies.set("access_token", token, { expires: 7 });
};

export const setUserRole = (role) => {
  Cookies.set('userRole', role, { expires: 7 });
};

export const getUserRole = () => {
  return Cookies.get('userRole');
};

export const getAuthToken = () => {
  return Cookies.get('access_token');
};

export const authService = {
  register: async (userData) => {
    const response = await api.auth.register(userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.auth.login(credentials);
    if (response.data.access_token) {
      setAuthToken(response.data.access_token);
    }
    if (response.data.role) {
      setUserRole(response.data.role);
    }
    return response.data;
  },
  logout: () => {
    Cookies.remove('userRole');
    Cookies.remove('access_token');
  },
};

export const userService = {
  getUsers: async (params) => {
    const response = await api.users.getUsers(params);
    return response.data;
  },
  getUserById: async (id) => {
    const response = await api.users.getUserById(id);
    return response.data;
  },
  registerUser: async (userData) => {
    const response = await api.users.registerUser(userData);
    return response.data;
  },
  getUserByEmail: async (email) => {
    const response = await api.users.getUserByEmail(email);
    return response.data;
  },
  checkUserExist: async (email) => {
    const response = await api.users.checkUserExist(email);
    return response.data;
  },
};

export const reinitializeApi = loadConfig;