import axios from "axios";

const instance = axios.create({
  // baseURL: 'http://localhost:4444'
  baseURL: 'https://fullstack-articles-back.onrender.com'
});

instance.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
