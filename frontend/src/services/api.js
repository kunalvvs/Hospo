import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to all requests automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH APIs ====================
export const authAPI = {
  // Register new doctor
  register: async (data) => {
    const response = await API.post('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Login doctor
  login: async (data) => {
    const response = await API.post('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Get current logged in doctor
  getMe: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  },

  // Send OTP
  sendOTP: async (data) => {
    const response = await API.post('/auth/send-otp', data);
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (data) => {
    const response = await API.post('/auth/verify-otp', data);
    return response.data;
  },

  // Resend OTP
  resendOTP: async (data) => {
    const response = await API.post('/auth/resend-otp', data);
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('doctorData');
  }
};

// ==================== DOCTOR APIs ====================
export const doctorAPI = {
  // Get doctor profile
  getProfile: async () => {
    const response = await API.get('/doctors/profile');
    return response.data;
  },

  // Update complete profile
  updateProfile: async (data) => {
    const response = await API.put('/doctors/profile', data);
    return response.data;
  },

  // Update specific section
  updateSection: async (section, data) => {
    const response = await API.put(`/doctors/profile/${section}`, data);
    return response.data;
  },

  // Upload file
  uploadFile: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await API.post('/doctors/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    });
    return response.data;
  },

  // Get profile completion percentage
  getProfileCompletion: async () => {
    const response = await API.get('/doctors/profile-completion');
    return response.data;
  },

  // Get all doctors (public)
  getAllDoctors: async () => {
    const response = await API.get('/doctors');
    return response.data;
  },

  // Get doctor by ID (public)
  getDoctorById: async (id) => {
    const response = await API.get(`/doctors/${id}`);
    return response.data;
  },

  // Delete profile
  deleteProfile: async () => {
    const response = await API.delete('/doctors/profile');
    return response.data;
  }
};

// ==================== HOSPITAL APIs ====================
export const hospitalAPI = {
  // Get hospital profile
  getProfile: async () => {
    const response = await API.get('/hospitals/profile');
    return response.data;
  },

  // Update complete profile
  updateProfile: async (data) => {
    const response = await API.put('/hospitals/profile', data);
    return response.data;
  },

  // Update specific section
  updateSection: async (section, data) => {
    const response = await API.put(`/hospitals/profile/${section}`, data);
    return response.data;
  },

  // Upload file
  uploadFile: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await API.post('/hospitals/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    });
    return response.data;
  },

  // Add doctor to hospital
  addDoctor: async (doctorId) => {
    const response = await API.post(`/hospitals/doctors/${doctorId}`);
    return response.data;
  },

  // Remove doctor from hospital
  removeDoctor: async (doctorId) => {
    const response = await API.delete(`/hospitals/doctors/${doctorId}`);
    return response.data;
  },

  // Get all hospitals (public)
  getAllHospitals: async () => {
    const response = await API.get('/hospitals');
    return response.data;
  },

  // Room management
  addRoom: async (data) => {
    const response = await API.post('/hospitals/rooms', data);
    return response.data;
  },

  updateRoom: async (roomId, data) => {
    const response = await API.put(`/hospitals/rooms/${roomId}`, data);
    return response.data;
  },

  deleteRoom: async (roomId) => {
    const response = await API.delete(`/hospitals/rooms/${roomId}`);
    return response.data;
  },

  // Procedure management
  addProcedure: async (data) => {
    const response = await API.post('/hospitals/procedures', data);
    return response.data;
  },

  updateProcedure: async (procedureId, data) => {
    const response = await API.put(`/hospitals/procedures/${procedureId}`, data);
    return response.data;
  },

  deleteProcedure: async (procedureId) => {
    const response = await API.delete(`/hospitals/procedures/${procedureId}`);
    return response.data;
  }
};

export default API;
