import axios from 'axios';

// Create an Axios instance
const axiosAsistance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL, // Replace with your API base URL
  timeout: 10000, // Request timeout in ms
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request Interceptor
axiosAsistance.interceptors.request.use(
  (config) => {
    // Add Authorization token if exists
    const token = localStorage.getItem('authToken'); // Replace with your token storage logic
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor
axiosAsistance.interceptors.response.use(
  (response) => {
    // Modify response data if needed
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with a status code outside the range of 2xx
      if (error.response.status === 401) {
        console.error('Unauthorized! Redirecting to login...');
        // Example: Redirect to login page or clear auth state
        window.location.href = '/login'; 
      } else if (error.response.status === 403) {
        console.error('Forbidden access!');
      } else if (error.response.status === 500) {
        console.error('Server error! Try again later.');
      }
    } else if (error.request) {
      // No response received from server
      console.error('No response from server! Check network.');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosAsistance;
