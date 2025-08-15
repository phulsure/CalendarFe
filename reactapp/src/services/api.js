import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/calendar';


const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const calendarApi = {
  getCalendarData: (viewType, startDate, country, timeZone = 'UTC') => {
    return api.get('/data', {
      params: {
        viewType,
        startDate: startDate.toISOString().split('T')[0],
        country,
        timeZone
      }
    });
  },
  
  getAvailableCountries: () => {
    return api.get('/countries');
  }
};

export default api;