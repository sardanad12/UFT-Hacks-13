// src/api/auth.ts

const API_BASE = "https://uofthacks-backend.onrender.com/api/v1";

export async function loginRequest(email: string, password_hash: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password_hash }),
  });

  if (!res.ok) {
    // Try to read backend error message
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Login failed");
  }

  return res.json(); // full User object from backend
}
