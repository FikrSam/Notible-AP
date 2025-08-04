// @/lib/api.ts

const API_BASE = "http://10.1.40.100:3000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// -------- AUTH --------
export async function signup(data: {
  username: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function login(data: {
  identifier: string;
  password: string;
}) {
  const res = await fetch(`${API_BASE}/auth/login`, {
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
    method: "GET",
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function fetchNote(id: number) {
  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function createNote(data: {
  title: string;
  content: string;
  tags?: string;
}) {
  const res = await fetch(`${API_BASE}/notes`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateNote(
  id: number,
  data: { title: string; content: string; tags?: string }
) {
  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
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
