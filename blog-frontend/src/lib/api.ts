import axios from 'axios';
import type { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token JWT 
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (data: { username: string; email: string; password: string }) =>
  api.post("/api/auth/register", data);

export const login = (data: { username: string; password: string }) =>
  api.post("/api/auth/login", data);

export const createPost = (data: { title: string; content: string }) =>
  api.post("/api/posts", data);

export const getPosts = () => api.get("/api/posts");

export default api;