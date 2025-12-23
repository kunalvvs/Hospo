import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data, // Return only data
  (error) => {
    console.error('API Error:', error);
    
    // Handle unauthorized errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signup';
    }
    
    return Promise.reject(error);
  }
);

// ==================== AUTH APIs ====================

export const authAPI = {
  // Register new user
  register: async (userData) => {
    return api.post('/auth/register', {
      ...userData,
      role: 'patient' // User frontend is for patients only
    });
  },

  // Login user
  login: async (credentials) => {
    return api.post('/auth/login', {
      ...credentials,
      role: 'patient'
    });
  },

  // Send OTP (Fixed OTP: 123456 for now)
  sendOTP: async (phone) => {
    return api.post('/auth/send-otp', { phone, type: 'phone' });
  },

  // Verify OTP
  verifyOTP: async (phone, otp) => {
    return api.post('/auth/verify-otp', { phone, otp });
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/signup';
  }
};

// ==================== DOCTOR APIs ====================

export const doctorAPI = {
  // Get all doctors (public)
  getAllDoctors: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/doctors${queryString ? `?${queryString}` : ''}`);
  },

  // Get doctor by ID (public)
  getDoctorById: async (doctorId) => {
    return api.get(`/doctors/${doctorId}`);
  },

  // Search doctors
  searchDoctors: async (searchQuery) => {
    return api.get(`/doctors?search=${searchQuery}`);
  },

  // Get doctors by specialization
  getDoctorsBySpecialization: async (specialization) => {
    return api.get(`/doctors?specialization=${specialization}`);
  }
};

// ==================== APPOINTMENT APIs ====================

export const appointmentAPI = {
  // Book appointment
  bookAppointment: async (appointmentData) => {
    return api.post('/appointments', appointmentData);
  },

  // Get patient's appointments
  getMyAppointments: async (status = '') => {
    return api.get(`/appointments/patient${status ? `?status=${status}` : ''}`);
  },

  // Get appointment by ID
  getAppointmentById: async (appointmentId) => {
    return api.get(`/appointments/${appointmentId}`);
  },

  // Cancel appointment
  cancelAppointment: async (appointmentId) => {
    return api.delete(`/appointments/${appointmentId}`);
  }
};

// ==================== CHEMIST APIs ====================

export const chemistAPI = {
  // Get all chemists (public)
  getAllChemists: async () => {
    return api.get('/chemists');
  },

  // Get nearby chemists based on location
  getNearbyChemists: async (latitude, longitude, radius = 10) => {
    const params = { latitude, longitude, radius };
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/chemists/nearby?${queryString}`);
  },

  // Search medicines across all chemists
  searchMedicines: async (query, filters = {}) => {
    const params = { query, ...filters };
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/chemists/medicines/search?${queryString}`);
  },

  // Get chemist by ID
  getChemistById: async (chemistId) => {
    return api.get(`/chemists/${chemistId}`);
  },

  // Check chemist availability (working hours)
  checkAvailability: async (chemistId) => {
    return api.get(`/chemists/${chemistId}/availability`);
  },

  // Place medicine order
  placeOrder: async (orderData) => {
    return api.post('/chemists/orders', orderData);
  },

  // Get user's medicine orders
  getMyOrders: async () => {
    return api.get('/chemists/orders/my-orders');
  },

  // Add rating and review to chemist
  addRating: async (chemistId, rating, review = '') => {
    return api.post(`/chemists/${chemistId}/rating`, { rating, review });
  },

  // Get chemist ratings
  getRatings: async (chemistId) => {
    return api.get(`/chemists/${chemistId}/ratings`);
  }
};

// ==================== ADDRESS APIs ====================
export const addressAPI = {
  // Get all addresses
  getAddresses: async () => {
    return api.get('/addresses');
  },

  // Add new address
  addAddress: async (addressData) => {
    return api.post('/addresses', addressData);
  },

  // Update address
  updateAddress: async (addressId, addressData) => {
    return api.put(`/addresses/${addressId}`, addressData);
  },

  // Delete address
  deleteAddress: async (addressId) => {
    return api.delete(`/addresses/${addressId}`);
  },

  // Set default address
  setDefaultAddress: async (addressId) => {
    return api.put(`/addresses/${addressId}/default`);
  }
};

// ==================== HELPER FUNCTIONS ====================

// Store auth token
export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

// Get auth token
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Store user data
export const setUserData = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Get user data
export const getUserData = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

export default api;

