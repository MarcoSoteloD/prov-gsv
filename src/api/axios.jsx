import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://localhost:3000/api/',
  baseURL: 'https://api-prov-vd6y.onrender.com/api/', // URL base de la API
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  } 
});

// Interceptor para añadir token a las peticiones
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;