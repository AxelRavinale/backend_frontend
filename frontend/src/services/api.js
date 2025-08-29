import axios from 'axios';

// Crear instancia de Axios
const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Cambia al puerto y URL de tu backend
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token automáticamente si existe
api.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;

