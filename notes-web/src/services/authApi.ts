import type { RegisterRequest, LoginRequest, AuthResponse } from '../types/auth';

const API_BASE = (import.meta.env.VITE_API_BASE ?? 'http://localhost:8000/api');

export const register = async (request: RegisterRequest): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Registration failed' }));
    throw new Error(err.message ?? 'Registration failed');
  }
  return res.json();
};

export const login = async (request: LoginRequest): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(err.message ?? 'Invalid email or password');
  }
  return res.json();
};
