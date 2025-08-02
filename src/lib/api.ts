/* eslint-disable @typescript-eslint/no-explicit-any */
// @/lib/api.ts

import { api } from "./axios";

// Auth
// Signup
export const signup = (data: any) => api.post("/auth/signup", data);

// Login
export const login = (data: any) => api.post("/auth/login", data);

// Note
export const getNotes = (params?: { search?: string; tag?: string }) =>
  api.get("/notes", { params });

// Note - create
export const createNote = (data: any) => api.post("/notes", data);

// Note - list
export const getNoteById = (id: number) => api.get(/notes/${id});

// Note - update
export const updateNote = (id: number, data: any) =>
  api.put(/notes/${id}, data);

// Note - delete
export const deleteNote = (id: number) => api.delete(/notes/${id});

// Username
export const getUsername = () => api.get("/notes/username");