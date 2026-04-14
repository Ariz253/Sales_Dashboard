import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://sales-dashboard-sbjf.onrender.com',
});

export const getHealth = () => api.get('/health');

export const runAnalytics = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.startDate) params.append('start_date', filters.startDate);
  if (filters.endDate) params.append('end_date', filters.endDate);
  if (filters.gender && filters.gender !== 'all') params.append('gender', filters.gender);
  if (filters.categories && filters.categories.length > 0) {
      filters.categories.forEach(c => params.append('category', c));
  }
  if (filters.ageMin) params.append('age_min', filters.ageMin);
  if (filters.ageMax) params.append('age_max', filters.ageMax);
  
  return api.get(`/analytics/run?${params.toString()}`);
};

export const getSales = (skip = 0, limit = 100, filters = {}) => {
   const params = new URLSearchParams({ skip, limit });
   if (filters.startDate) params.append('start_date', filters.startDate);
   if (filters.endDate) params.append('end_date', filters.endDate);
   if (filters.gender && filters.gender !== 'all') params.append('gender', filters.gender);
   
   return api.get(`/sales?${params.toString()}`);
}

export const getReports = () => api.get('/analytics/reports');

export default api;