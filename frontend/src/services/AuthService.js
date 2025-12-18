// src/services/AuthService.js
const API_BASE =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://manubharadwaj.pythonanywhere.com/api/"
    : "http://localhost:8000/api/");

// Login user
export async function login(credentials) {
  const res = await fetch(`${API_BASE}token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Login failed");
  }

  const data = await res.json();
  const access = data.access || data.token;
  const refresh = data.refresh;

  if (access) localStorage.setItem("token", access);
  if (refresh) localStorage.setItem("refresh", refresh);

  return data;
}

// Register new user
export async function register(userData) {
  const res = await fetch(`${API_BASE}users/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Registration failed");
  }

  return res.json();
}

// Refresh token
export async function refreshAccessToken() {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return false;

  const res = await fetch(`${API_BASE}token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    logout();
    return false;
  }

  const data = await res.json();
  if (data.access) {
    localStorage.setItem("token", data.access);
    return true;
  }

  return false;
}

// Get logged-in user's profile
export async function getProfile() {
  let token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  let res = await fetch(`${API_BASE}profile/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) throw new Error("Session expired");
    token = localStorage.getItem("token");
    res = await fetch(`${API_BASE}profile/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

// Logout
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
}
