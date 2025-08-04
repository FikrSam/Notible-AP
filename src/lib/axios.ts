// @/lib/axios.ts

import axios from "axios";

export const api = axios.create({
  baseURL: "http://10.1.40.100:3000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
