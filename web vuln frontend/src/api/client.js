import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createScan = (payload) => apiClient.post('/api/scan', payload);

export const getScanStatus = (scanId) => apiClient.get(`/api/scan/${encodeURIComponent(scanId)}/status`);

export const getScanResults = (scanId) => apiClient.get(`/api/scan/${encodeURIComponent(scanId)}/results`);

export const emailScanReport = (scanId, email) =>
  apiClient.post(`/api/scan/${encodeURIComponent(scanId)}/email`, { email });

export default apiClient;
