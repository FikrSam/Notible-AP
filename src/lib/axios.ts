// @/lib/axios.ts

import axios from "axios";

export const api = axios.create({
  // Change the baseURL to point to your running Rails server
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
