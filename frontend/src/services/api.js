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

// ==================== CHEMIST APIs ====================
export const chemistAPI = {
  // Get chemist profile
  getProfile: async () => {
    const response = await API.get('/chemists/profile');
    return response.data;
  },

  // Update complete profile
  updateProfile: async (data) => {
    const response = await API.put('/chemists/profile', data);
    return response.data;
  },

  // Update specific section
  updateSection: async (section, data) => {
    const response = await API.put(`/chemists/profile/${section}`, data);
    return response.data;
  },

  // Upload file
  uploadFile: async (file, fieldName) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fieldName', fieldName);

    const response = await API.post('/chemists/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Get profile completion percentage
  getProfileCompletion: async () => {
    const response = await API.get('/chemists/profile-completion');
    return response.data;
  },

  // Get all chemists (public)
  getAllChemists: async () => {
    const response = await API.get('/chemists');
    return response.data;
  },

  // Get chemist by ID (public)
  getChemistById: async (id) => {
    const response = await API.get(`/chemists/${id}`);
    return response.data;
  },

  // Delete profile
  deleteProfile: async () => {
    const response = await API.delete('/chemists/profile');
    return response.data;
  },

  // Get chemist's orders (for chemist dashboard)
  getChemistOrders: async () => {
    const response = await API.get('/chemists/orders/chemist-orders');
    return response.data;
  },
  
  // Update order status
  updateOrderStatus: async (orderId, status) => {
    const response = await API.put(`/chemists/orders/${orderId}/status`, { status });
    return response.data;
  }
};

// ==================== PATHLAB APIs ====================
export const pathlabAPI = {
  // Get pathlab profile
  getProfile: async () => {
    const response = await API.get('/pathlabs/profile');
    return response.data;
  },

  // Update complete profile
  updateProfile: async (data) => {
    const response = await API.put('/pathlabs/profile', data);
    return response.data;
  },

  // Update specific section
  updateSection: async (section, data) => {
    const response = await API.put(`/pathlabs/profile/${section}`, data);
    return response.data;
  },

  // Upload file
  uploadFile: async (file, fieldName, docType = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (fieldName) {
      formData.append('fieldName', fieldName);
    }
    if (docType) {
      formData.append('docType', docType);
    }

    const response = await API.post('/pathlabs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Get profile completion percentage
  getProfileCompletion: async () => {
    const response = await API.get('/pathlabs/profile-completion');
    return response.data;
  },

  // Get all pathlabs (public)
  getAllPathlabs: async () => {
    const response = await API.get('/pathlabs');
    return response.data;
  },

  // Get pathlab by ID (public)
  getPathlabById: async (id) => {
    const response = await API.get(`/pathlabs/${id}`);
    return response.data;
  },

  // Delete profile
  deleteProfile: async () => {
    const response = await API.delete('/pathlabs/profile');
    return response.data;
  },

  // Test CRUD operations
  addTest: async (testData) => {
    const response = await API.post('/pathlabs/tests', testData);
    return response.data;
  },

  updateTest: async (testId, testData) => {
    const response = await API.put(`/pathlabs/tests/${testId}`, testData);
    return response.data;
  },

  deleteTest: async (testId) => {
    const response = await API.delete(`/pathlabs/tests/${testId}`);
    return response.data;
  },

  // Document management
  getDocuments: async () => {
    const response = await API.get('/pathlabs/documents');
    return response.data;
  },

  deleteDocument: async (docId) => {
    const response = await API.delete(`/pathlabs/documents/${docId}`);
    return response.data;
  }
};

// ==================== AMBULANCE APIs ====================
export const ambulanceAPI = {
  // Get ambulance profile
  getProfile: async () => {
    const response = await API.get('/ambulances/profile');
    return response.data;
  },

  // Update complete profile
  updateProfile: async (data) => {
    const response = await API.put('/ambulances/profile', data);
    return response.data;
  },

  // Update specific section
  updateSection: async (section, data) => {
    const response = await API.put(`/ambulances/profile/${section}`, data);
    return response.data;
  },

  // Upload file
  uploadFile: async (file, fieldName, docType = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (fieldName) {
      formData.append('fieldName', fieldName);
    }
    if (docType) {
      formData.append('docType', docType);
    }

    const response = await API.post('/ambulances/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Get profile completion percentage
  getProfileCompletion: async () => {
    const response = await API.get('/ambulances/profile-completion');
    return response.data;
  },

  // Equipment management
  addEquipment: async (equipmentData) => {
    const response = await API.post('/ambulances/equipment', equipmentData);
    return response.data;
  },

  updateEquipment: async (equipmentId, equipmentData) => {
    const response = await API.put(`/ambulances/equipment/${equipmentId}`, equipmentData);
    return response.data;
  },

  deleteEquipment: async (equipmentId) => {
    const response = await API.delete(`/ambulances/equipment/${equipmentId}`);
    return response.data;
  },

  // Document management
  getDocuments: async () => {
    const response = await API.get('/ambulances/documents');
    return response.data;
  },

  // ==================== DRIVER PROFILES CRUD ====================
  getDrivers: async () => {
    const response = await API.get('/ambulances/drivers');
    return response.data;
  },

  addDriver: async (driverData) => {
    const response = await API.post('/ambulances/drivers', driverData);
    return response.data;
  },

  updateDriver: async (driverId, driverData) => {
    const response = await API.put(`/ambulances/drivers/${driverId}`, driverData);
    return response.data;
  },

  deleteDriver: async (driverId) => {
    const response = await API.delete(`/ambulances/drivers/${driverId}`);
    return response.data;
  },

  // ==================== VEHICLE PROFILES CRUD ====================
  getVehicles: async () => {
    const response = await API.get('/ambulances/vehicles');
    return response.data;
  },

  addVehicle: async (vehicleData) => {
    const response = await API.post('/ambulances/vehicles', vehicleData);
    return response.data;
  },

  updateVehicle: async (vehicleId, vehicleData) => {
    const response = await API.put(`/ambulances/vehicles/${vehicleId}`, vehicleData);
    return response.data;
  },

  deleteVehicle: async (vehicleId) => {
    const response = await API.delete(`/ambulances/vehicles/${vehicleId}`);
    return response.data;
  },

  // ==================== MIGRATION ====================
  migrateLegacyDriver: async () => {
    const response = await API.post('/ambulances/migrate-driver');
    return response.data;
  },

  migrateLegacyVehicle: async () => {
    const response = await API.post('/ambulances/migrate-vehicle');
    return response.data;
  },

  deleteDocument: async (docId) => {
    const response = await API.delete(`/ambulances/documents/${docId}`);
    return response.data;
  },

  // Location updates
  updateLocation: async (locationData) => {
    const response = await API.put('/ambulances/location', locationData);
    return response.data;
  },

  // Status updates
  updateStatus: async (status) => {
    const response = await API.put('/ambulances/status', { status });
    return response.data;
  },

  // Get all ambulances (public)
  getAllAmbulances: async (filters = {}) => {
    const response = await API.get('/ambulances', { params: filters });
    return response.data;
  },

  // Get ambulance by ID (public)
  getAmbulanceById: async (id) => {
    const response = await API.get(`/ambulances/${id}`);
    return response.data;
  },

  // Delete profile
  deleteProfile: async () => {
    const response = await API.delete('/ambulances/profile');
    return response.data;
  }
};

// ==================== APPOINTMENT APIs ====================
export const appointmentAPI = {
  // Get doctor's appointments
  getDoctorAppointments: async (status = '', date = '') => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (date) params.append('date', date);
    const response = await API.get(`/appointments/doctor?${params.toString()}`);
    return response.data;
  },

  // Get appointment by ID
  getAppointmentById: async (id) => {
    const response = await API.get(`/appointments/${id}`);
    return response.data;
  },

  // Update appointment status
  updateAppointmentStatus: async (id, status) => {
    const response = await API.put(`/appointments/${id}/status`, { status });
    return response.data;
  },

  // Cancel appointment
  cancelAppointment: async (id) => {
    const response = await API.delete(`/appointments/${id}`);
    return response.data;
  }
};

export default API;
