// @/lib/api.ts

const API_BASE = "http://localhost:3000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// -------- AUTH --------
export async function login(identifier: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });
  return res.json();
}

export async function signup(data: {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export function logout() {
  localStorage.removeItem("token");
}

// -------- NOTES --------
export async function fetchNotes() {
  const res = await fetch(`${API_BASE}/notes`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function createNote(note: {
  title: string;
  content: string;
  tags: string;
}) {
  const res = await fetch(`${API_BASE}/notes`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(note),
  });
  return res.json();
}

export async function updateNote(id: number, note: {
  title: string;
  content: string;
  tags: string;
}) {
  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(note),
  });
  return res.json();
}

export async function deleteNote(id: number) {
  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return res.json();
}
