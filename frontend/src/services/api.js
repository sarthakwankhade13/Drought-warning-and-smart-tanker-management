import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getVillages: () => api.get('/villages'),
  getMe: () => api.get('/auth/me')
};

export const villageAPI = {
  getAll: () => api.get('/villages'),
  getById: (id) => api.get(`/villages/${id}`),
  getWithPriority: () => api.get('/villages/priority/all'),
  create: (data) => api.post('/villages', data),
  update: (id, data) => api.put(`/villages/${id}`, data),
  delete: (id) => api.delete(`/villages/${id}`)
};

export const dataAPI = {
  addRainfall: (data) => api.post('/data/rainfall', data),
  addRainfallBulk: (records) => api.post('/data/rainfall/bulk', { records }),
  getRainfall: (villageId) => api.get(`/data/rainfall/${villageId}`),
  addGroundwater: (data) => api.post('/data/groundwater', data),
  addGroundwaterBulk: (records) => api.post('/data/groundwater/bulk', { records }),
  getGroundwater: (villageId) => api.get(`/data/groundwater/${villageId}`)
};

export const analysisAPI = {
  getDrought: (villageId) => api.get(`/analysis/drought/${villageId}`),
  getWSI: (villageId) => api.get(`/analysis/wsi/${villageId}`),
  getAllWSI: () => api.get('/analysis/wsi'),
  getCritical: (threshold) => api.get(`/analysis/critical?threshold=${threshold}`),
  predictDemand: (villageId) => api.get(`/analysis/predict/${villageId}`),
  forecastDemand: (villageId, days) => api.get(`/analysis/forecast/${villageId}?days=${days}`)
};

export const tankerAPI = {
  getAll: () => api.get('/tankers'),
  create: (data) => api.post('/tankers', data),
  update: (id, data) => api.put(`/tankers/${id}`, data),
  delete: (id) => api.delete(`/tankers/${id}`),
  allocate: () => api.post('/tankers/allocate'),
  getAllocations: () => api.get('/tankers/allocations'),
  cancelAllocation: (id) => api.delete(`/tankers/allocations/${id}`),
  getStatistics: () => api.get('/tankers/statistics'),
  getMyVillage: () => api.get('/tankers/my-village'),
  optimizeRoute: (data) => api.post('/tankers/optimize-route', data)
};

export const alertAPI = {
  getAll: (params) => api.get('/alerts', { params }),
  getActive: () => api.get('/alerts/active'),
  getMyVillage: () => api.get('/alerts/my-village'),
  getDistricts: () => api.get('/alerts/districts'),
  create: (data) => api.post('/alerts', data),
  resolve: (id) => api.put(`/alerts/${id}/resolve`),
  delete: (id) => api.delete(`/alerts/${id}`),
  generateAutomatic: () => api.post('/alerts/generate'),
  submitUserAlert: (data) => api.post('/alerts/submit', data)
};

export const reportAPI = {
  submit: (data) => api.post('/reports/water-shortage', data),
  getMyReports: () => api.get('/reports/my-reports'),
  getAll: () => api.get('/reports/all'),
  updateStatus: (id, status) => api.put(`/reports/${id}/status`, { status })
};

export const weatherAPI = {
  getVillageWeather: (villageId) => api.get(`/weather/village/${villageId}`),
  getAllWeather: () => api.get('/weather/all'),
  syncWeather: () => api.post('/weather/sync'),
  getForecast: (villageId) => api.get(`/weather/forecast/${villageId}`),
  testAPI: () => api.get('/weather/test')
};

export default api;
