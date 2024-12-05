// src/api/axios.ts
// import axios, { AxiosInstance } from 'axios';

// const api: AxiosInstance = axios.create({
//     baseURL: 'http://localhost:8000/api/',
//     headers: {
//         'Content-Type': 'application/json',
//     }
// });

// // Interceptores de peticiones
// api.interceptors.request.use(
//     (config) => {
//         // Aquí puedes agregar tokens, headers, etc.
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// // Interceptores de respuestas
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             // Manejar error de autenticación
//             localStorage.removeItem('token');
//         }
//         return Promise.reject(error);
//     }
// );

// export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000'
});

export default api;