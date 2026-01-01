import axios from 'axios';

/**
 * Axios Instance
 * 
 * Pre-configured axios instance for making API requests.
 * Base URL determines where to send requests (Localhost 5000 for now).
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request Interceptor: Attach Token to every request if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
