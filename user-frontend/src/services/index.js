import api from './api';

export const adminService = {
  create: async (email, password) => {
    const response = await api.post('/admin', {
      email,
      password,
      actions: 'create',
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/admin', {
      email,
      password,
      actions: 'login',
    });
    return response.data;
  },

  get: async () => {
    const response = await api.get('/admin');
    return response.data;
  },
};

export const userService = {
  create: async (userData) => {
    const response = await api.post('/users', {
      ...userData,
      action: 'create',
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/users', {
      email,
      password,
      action: 'login',
    });
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getByEmail: async (email) => {
    const response = await api.get(`/users?email=${email}`);
    return response.data;
  },
};

export const formService = {
  create: async (formData) => {
    const response = await api.post('/forms', formData);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/forms');
    return response.data;
  },

  delete: async (useremail, local) => {
    const response = await api.post('/formsEditDelete', {
      useremail,
      local,
    });
    return response.data;
  },

  update: async (formData) => {
    const response = await api.put('/formsEditDelete', formData);
    return response.data;
  },
};
