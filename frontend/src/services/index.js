import api from './api';

export const assetService = {
  getAll: () => api.get('/assets'),
  getById: (id) => api.get(`/assets/${id}`),
  create: (data) => api.post('/assets', data),
  update: (id, data) => api.put(`/assets/${id}`, data),
  delete: (id) => api.delete(`/assets/${id}`),
};

export const userService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const locationService = {
  getAll: () => api.get('/locations'),
  getById: (id) => api.get(`/locations/${id}`),
  create: (data) => api.post('/locations', data),
  update: (id, data) => api.put(`/locations/${id}`, data),
  delete: (id) => api.delete(`/locations/${id}`),
};

export const categoryService = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const supplierService = {
  getAll: () => api.get('/suppliers'),
  getById: (id) => api.get(`/suppliers/${id}`),
  create: (data) => api.post('/suppliers', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`),
};

export const assignmentService = {
  getAll: () => api.get('/assignments'),
  create: (data) => api.post('/assignments', data),
  returnAsset: (id, notes) => api.put(`/assignments/${id}/return`, { notes }),
  delete: (id) => api.delete(`/assignments/${id}`),
};

export const maintenanceService = {
  getAll: () => api.get('/maintenance'),
  getById: (id) => api.get(`/maintenance/${id}`),
  create: (data) => api.post('/maintenance', data),
  update: (id, data) => api.put(`/maintenance/${id}`, data),
  delete: (id) => api.delete(`/maintenance/${id}`),
};

export const licenseService = {
  getAll: () => api.get('/licenses'),
  getById: (id) => api.get(`/licenses/${id}`),
  create: (data) => api.post('/licenses', data),
  update: (id, data) => api.put(`/licenses/${id}`, data),
  delete: (id) => api.delete(`/licenses/${id}`),
  assign: (data) => api.post('/licenses/assign', data),
};

export const consumableService = {
  getAll: () => api.get('/consumables'),
  getById: (id) => api.get(`/consumables/${id}`),
  create: (data) => api.post('/consumables', data),
  update: (id, data) => api.put(`/consumables/${id}`, data),
  delete: (id) => api.delete(`/consumables/${id}`),
  adjustStock: (id, data) => api.post(`/consumables/${id}/adjust-stock`, data),
};

export const documentService = {
  getAll: () => api.get('/documents'),
  getById: (id) => api.get(`/documents/${id}`),
  upload: (formData) => api.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/documents/${id}`),
};

export const moveService = {
  getAll: () => api.get('/moves'),
  getById: (id) => api.get(`/moves/${id}`),
  create: (data) => api.post('/moves', data),
  update: (id, data) => api.put(`/moves/${id}`, data),
  delete: (id) => api.delete(`/moves/${id}`),
};
