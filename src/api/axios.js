import axios from 'axios';

// Central backend base URL
export const BACKEND_URL = 'https://assistant-shelli-skillspherebydanishali-c09e3b4e.koyeb.app';

const API = axios.create({
  baseURL: `${BACKEND_URL}/api/`,
});

export function getMediaUrl(path) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${BACKEND_URL}${path}`;
}


// Request Interceptor: Har request ke saath token bhejne ke liye
API.interceptors.request.use(
  (config) => {
    // LocalStorage se token nikalna
    const token = localStorage.getItem('access_token'); 
    
    if (token) {
      // Header mein 'Authorization' add karna
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;