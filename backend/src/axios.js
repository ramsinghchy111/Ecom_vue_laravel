// import axios from "axios";
// import store from "./store";
// import router from "./router";

// const axiosClient = axios.create({
//     baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
// })

// axiosClient.interceptors.request.use(config =>{
//     config.headers.Authorization = `Bearer ${store.state.user.token}`
//     return config;
// })

// axiosClient.interceptors.response.use(response => {
//     return response;
// },error =>{
//     if(error.response.status == 401){
//         sessionStorage.removeItem('Token')
//         router.push({name:'login'})
//     }
//      console.error(error);
// })

// export default axiosClient;



// src/api.js (or src/axios.js)


import axios from 'axios';
import router from './router';

// fallback if env not set
const BACKEND = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const axiosClient = axios.create({
  baseURL: `${BACKEND}/api`,
  // withCredentials: true, // uncomment if you use Laravel Sanctum (cookie-based auth)
});

// Request interceptor — read token from sessionStorage to avoid circular imports
axiosClient.interceptors.request.use((config) => {
  // ensure headers object exists
  config.headers = config.headers || {};

  // read token from sessionStorage (or localStorage) as fallback
  const TOKEN = sessionStorage.getItem('TOKEN') || localStorage.getItem('TOKEN');
  //  const token = store.state.token;

  if (TOKEN) {
    config.headers.Authorization = `Bearer ${TOKEN}`;
  } else {
    // optional: delete header if no token
    delete config.headers.Authorization;
  }

  return config;
}, (err) => Promise.reject(err));

// Response interceptor — safe checks and consistent key removal
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Clear the same key we read from in the request interceptor
      sessionStorage.removeItem('token');
      localStorage.removeItem('token');

      // optionally notify store about logout — avoid importing store here to prevent circular deps
      // If you need store logout, call it from where you handle the rejection (e.g. in actions)
      router.push({ name: 'login' });
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
