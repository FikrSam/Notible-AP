/* eslint-disable @typescript-eslint/no-explicit-any */
// @/lib/api.ts

import { api } from "./axios";
import type { Note, ApiResponse } from "@/types/db"; // Use "@/types/db" to import the new types

// Auth
export const signup = (data: any) => api.post("/auth/signup", data);
export const login = (data: any) => api.post("/auth/login", data);

// Notes
// Use the new ApiResponse type here
export const fetchNotes = () => api.get<ApiResponse<Note[]>>("/notes");

export const getNoteById = (id: number) => api.get(`/notes/${id}`);
export const createNote = (data: any) => api.post("/notes", data);
export const updateNote = (id: number, data: any) => api.put(`/notes/${id}`, data);
export const deleteNote = (id: number) => api.delete(`/notes/${id}`);

// User
export const getUsername = () => api.get<any>("/users/username"); // You can create a proper type for this too
