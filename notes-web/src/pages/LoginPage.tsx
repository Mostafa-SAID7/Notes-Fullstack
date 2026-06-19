import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdEmail, MdLock, MdArrowForward } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin } from '../services/authApi';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fillDemo = () => setForm({ email: 'demo@noteflow.app', password: 'demo123' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) {
      setError('Email and password are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await apiLogin({ email: form.email.trim(), password: form.password });
      login(res.token, { email: res.email, username: res.username });
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.message ?? 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8" style={{ animation: 'fadeSlideUp 0.4s ease both' }}>
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 text-3xl"
            style={{ background: 'rgba(var(--primary-rgb), 0.12)' }}
          >
            📝
          </div>
          <h1
            className="text-3xl font-bold text-[var(--foreground)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Welcome back
          </h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-1">Sign in to your NoteFlow account</p>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-xl auth-card-enter">
          {error && (
            <div className="mb-4 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base select-none pointer-events-none">✉️</span>
              <input
                className="auth-input pl-10"
                type="email"
                placeholder="Email address"
                autoComplete="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                disabled={loading}
                autoFocus
              />
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base select-none pointer-events-none">🔒</span>
              <input
                className="auth-input pl-10 pr-10"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                autoComplete="current-password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                disabled={loading}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm select-none"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="app-btn-primary w-full mt-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign in <MdArrowForward size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={fillDemo}
              className="w-full text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors flex items-center justify-center gap-1.5 py-1.5"
            >
              <span>🎭</span>
              <span>Use demo account — <code className="font-mono">demo@noteflow.app</code> / <code className="font-mono">demo123</code></span>
            </button>
          </div>

          <p className="text-center text-[var(--muted-foreground)] text-sm mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
