import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to log data source
api.interceptors.response.use((response) => {
  if (response.data.source) {
    window.DATA_SOURCE = response.data.source.toUpperCase();
  }
  return response;
});

export default api;
