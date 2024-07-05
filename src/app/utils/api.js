// api.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8055';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  auth: {
    register: (userData) => axiosInstance.post('/auth/registration', userData),
    login: (credentials) => axiosInstance.post('/auth/login', credentials),
  },
  // Add more API endpoints here as needed
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

export const setUserRole = (role) => {
  Cookies.set('userRole', role, { expires: 7 }); // expires in 7 days
};

export const getUserRole = () => {
  return Cookies.get('userRole');
};

export const authService = {
  register: async (userData) => {
    try {
      const response = await api.auth.register(userData);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },
  login: async (credentials) => {
    try {
      const response = await api.auth.login(credentials);
      if (response.data.token) {
        setAuthToken(response.data.token);
      }
      if (response.data.role) {
        setUserRole(response.data.role);
      }
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  logout: () => {
    setAuthToken(null);
    Cookies.remove('userRole');
  },
};