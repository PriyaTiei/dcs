import axios from 'axios';

// Get base URL from environment or fall back to production/staging default
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://10.82.126.73:5080';

const apiClient = axios.create({
  baseURL: BACKEND_URL,
  timeout: 30000, // 30 second timeout for complex aggregation queries
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      'Network communication error';
    console.error(`[API Error] ${error.config?.url}:`, message);
    return Promise.reject(error);
  }
);

export { BACKEND_URL };
export default apiClient;
