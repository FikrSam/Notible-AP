/* eslint-disable @typescript-eslint/no-explicit-any */
// @/lib/api.ts

import { api } from "./axios";
import type { Note, User } from "@/types";

// Auth
export const signup = (data: any) => api.post("/auth/signup", data);
export const login = (data: any) => api.post("/auth/login", data);

// Notes
export const getNotes = () => api.get<Note[]>("/notes");

export const getNoteById = (id: number) => api.get(`/notes/${id}`);
export const createNote = (data: any) => api.post("/notes", data);
export const updateNote = (id: number, data: any) => api.put(`/notes/${id}`, data);
export const deleteNote = (id: number) => api.delete(`/notes/${id}`);

// Username
export const getUsername = () => api.get<User>("/users/username");