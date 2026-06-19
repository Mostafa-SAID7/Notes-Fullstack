import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AuthUser } from '../types/auth';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY  = 'nf_token';
const USER_KEY   = 'nf_user';
const THEME_KEY  = 'theme';
const ACCENT_KEY = 'accentColor';

/** Decode JWT payload without verifying signature (client-side only) */
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp as number | undefined;
    if (!exp) return false;
    return Date.now() / 1000 > exp;
  } catch {
    return true;
  }
};

const loadSession = (): { token: string | null; user: AuthUser | null } => {
  const token = localStorage.getItem(TOKEN_KEY);
  const raw   = localStorage.getItem(USER_KEY);
  if (!token || !raw) return { token: null, user: null };
  if (isTokenExpired(token)) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return { token: null, user: null };
  }
  try {
    return { token, user: JSON.parse(raw) as AuthUser };
  } catch {
    return { token: null, user: null };
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [{ token, user }, setSession] = useState(loadSession);

  const login = useCallback((newToken: string, newUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setSession({ token: newToken, user: newUser });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    /* Preserve UI preferences (theme, accent) across logout */
    setSession({ token: null, user: null });
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
