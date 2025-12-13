const API_URL = 'http://localhost:5000/api/hospital';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Rooms API
export const roomsAPI = {
  getAll: () => apiCall('/rooms'),
  getById: (id) => apiCall(`/rooms/${id}`),
  create: (data) => apiCall('/rooms', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/rooms/${id}`, { method: 'DELETE' }),
};

// Procedures API
export const proceduresAPI = {
  getAll: () => apiCall('/procedures'),
  getById: (id) => apiCall(`/procedures/${id}`),
  create: (data) => apiCall('/procedures', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/procedures/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/procedures/${id}`, { method: 'DELETE' }),
};

// Doctors API
export const doctorsAPI = {
  getAll: () => apiCall('/doctors'),
  getById: (id) => apiCall(`/doctors/${id}`),
  create: (data) => apiCall('/doctors', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/doctors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/doctors/${id}`, { method: 'DELETE' }),
};

// Nursing Services API
export const nursingServicesAPI = {
  getAll: () => apiCall('/nursing-services'),
  getById: (id) => apiCall(`/nursing-services/${id}`),
  create: (data) => apiCall('/nursing-services', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/nursing-services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/nursing-services/${id}`, { method: 'DELETE' }),
};

// Miscellaneous Services API
export const miscServicesAPI = {
  getAll: () => apiCall('/misc-services'),
  getById: (id) => apiCall(`/misc-services/${id}`),
  create: (data) => apiCall('/misc-services', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/misc-services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/misc-services/${id}`, { method: 'DELETE' }),
};

// Hospital Bookings API
export const bookingsAPI = {
  getAll: () => apiCall('/bookings'),
  getById: (id) => apiCall(`/bookings/${id}`),
  create: (data) => apiCall('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  cancel: (id) => apiCall(`/bookings/${id}/cancel`, { method: 'PATCH' }),
  delete: (id) => apiCall(`/bookings/${id}`, { method: 'DELETE' }),
};
