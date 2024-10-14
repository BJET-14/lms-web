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
  teachers: {
    updateTeacher: (teacherId, teacherData) => apiCall('put', `/commons/teachers/${teacherId}/update`, teacherData),
    getTeachers: (params) => apiCall('get', '/commons/teachers', { params }),
    getTeacherById: (teacherId) => apiCall('get', `/commons/teachers/${teacherId}`),
  },
  students: {
    getStudentById: (studentId) => apiCall('get', `/commons/students/${studentId}`),
  },
  courses: {
    getCourses: (params) => apiCall('get', '/operations/courses', { params }),
    addCourse: (courseData) => apiCall('post', '/operations/courses', courseData),
    updateCourse: (id, courseData) => apiCall('put', `/operations/courses/${id}`, courseData),
    getCourseById: (id) => apiCall('get', `/operations/courses/${id}`),
    deleteModule: (courseId, moduleId) => apiCall('delete', `/operations/courses/${courseId}/modules/${moduleId}`),
    assignTeacher: (courseId, teacherData) => apiCall('post', `/operations/courses/${courseId}/assign`, teacherData),
    scheduleCourse: (courseId, scheduleData) => apiCall('post', `/operations/courses/${courseId}/schedule`, scheduleData),
    getCourseSchedule: (courseId) => apiCall('get', `/operations/courses/${courseId}/class-schedule`),
    enrollStudent: (courseId, studentData) => apiCall('post', `/operations/courses/${courseId}/enrollement`, studentData),
    getEnrollments: (courseId) => apiCall('get', `/operations/courses/${courseId}/enrollment`),
    getCoursePost: (courseId) => apiCall('get', `/operations/courses/${courseId}/post`),
    createCoursePost: (courseId, postData) => apiCall('post', `/operations/courses/${courseId}/post`, postData),
  },
  exams: {
    getCourseExams: (courseId) => apiCall('get', `/operations/courses/${courseId}/exams`),
    addCourseExam: (courseId, examData) => apiCall('post', `/operations/courses/${courseId}/exams`, examData),
    uploadExamResults: (courseId, examId, fileData) => apiCall('post', `/operations/courses/${courseId}/exams/${examId}/upload-results`, fileData),
    getExamTemplate: (courseId, examId) => apiCall('get', `/operations/courses/${courseId}/exams/${examId}/template`),
    getExamResult: (courseId, examId) => apiCall('get', `/operations/courses/${courseId}/exams/${examId}/result`),
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

export const teacherService = {
  updateTeacher: async (teacherId, teacherData) => {
    const response = await api.teachers.updateTeacher(teacherId, teacherData);
    return response.data;
  },
  getTeachers: async (params = {}) => {
    const response = await api.teachers.getTeachers(params);
    return response.data;
  },
  getTeacherById: async (teacherId) => {
    const response = await api.teachers.getTeacherById(teacherId);
    return response.data;
  },
};

export const studentService = {
  getStudentById: async (studentId) => {
    const response = await api.students.getStudentById(studentId);
    return response.data;
  },
};

export const courseService = {
  getCourses: async (params = {}) => {
    const response = await api.courses.getCourses(params);
    return response.data;
  },
  addCourse: async (courseData) => {
    const response = await api.courses.addCourse(courseData);
    return response.data;
  },
  getCourseById: async (id) => {
    const response = await api.courses.getCourseById(id);
    return response.data;
  },
  deleteModule: async (courseId, moduleId) => {
    const response = await api.courses.deleteModule(courseId, moduleId);
    return response.data;
  },
  scheduleCourse: async (courseId, scheduleData) => {
    const response = await api.courses.scheduleCourse(courseId, scheduleData);
    return response.data;
  },
  getCourseSchedule: async (courseId) => {
    const response = await api.courses.getCourseSchedule(courseId);
    return response.data;
  },
  enrollStudent: async (courseId, studentData) => {
    const response = await api.courses.enrollStudent(courseId, studentData);
    return response.data;
  },
  getEnrollments: async (courseId) => {
    const response = await api.courses.getEnrollments(courseId);
    return response.data;
  },
  assignTeacher: async (courseId, teacherData) => {
    const response = await api.courses.assignTeacher(courseId, teacherData);
    return response.data;
  },

  updateCourse: async (id, courseData) => {
    const response = await api.courses.updateCourse(id, courseData);
    return response.data;
  },

  getCoursePost: async (courseId) => {
    const response = await api.courses.getCoursePost(courseId);
    return response.data;
  },
  createCoursePost: async (courseId, postData) => {
    const response = await api.courses.createCoursePost(courseId, postData);
    return response.data;
  },
};

export const examService = {
  getCourseExams: async (courseId) => {
    const response = await api.exams.getCourseExams(courseId);
    return response.data;
  },
  addCourseExam: async (courseId, examData) => {
    const response = await api.exams.addCourseExam(courseId, examData);
    return response.data;
  },
  uploadExamResults: async (courseId, examId, fileData) => {
    const response = await api.exams.uploadExamResults(courseId, examId, fileData);
    return response.data;
  },
  getExamTemplate: async (courseId, examId) => {
    const response = await api.exams.getExamTemplate(courseId, examId);
    return response.data;
  },
  getExamResult: async (courseId, examId) => {
    const response = await api.exams.getExamResult(courseId, examId);
    return response.data;
  },
};

export const reinitializeApi = loadConfig;