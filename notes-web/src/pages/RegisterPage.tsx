import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdArrowForward } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { register as apiRegister } from '../services/authApi';

export const RegisterPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Too short', color: '#EF4444', pct: 20 };
    if (p.length < 8) return { label: 'Weak', color: '#F97316', pct: 40 };
    if (p.length < 12) return { label: 'Fair', color: '#EAB308', pct: 65 };
    return { label: 'Strong', color: '#10B981', pct: 100 };
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim() || !form.email.trim() || !form.password) {
      setError('All fields are required.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await apiRegister({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      login(res.token, { email: res.email, username: res.username });
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.message ?? 'Registration failed. Please try again.');
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
            ✨
          </div>
          <h1
            className="text-3xl font-bold text-[var(--foreground)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Create account
          </h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-1">Start taking notes today — it's free</p>
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
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base select-none pointer-events-none">👤</span>
              <input
                className="auth-input pl-10"
                placeholder="Username"
                autoComplete="username"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                disabled={loading}
                autoFocus
              />
            </div>

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
              />
            </div>

            <div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base select-none pointer-events-none">🔑</span>
                <input
                  className="auth-input pl-10 pr-10"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password (min 6 chars)"
                  autoComplete="new-password"
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
              {passwordStrength && (
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full bg-[var(--surface-2)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${passwordStrength.pct}%`, backgroundColor: passwordStrength.color }}
                    />
                  </div>
                  <span className="text-[10px] font-medium" style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base select-none pointer-events-none">🔒</span>
              <input
                className="auth-input pl-10"
                type="password"
                placeholder="Confirm password"
                autoComplete="new-password"
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                disabled={loading}
              />
              {form.confirm && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base select-none">
                  {form.password === form.confirm ? '✅' : '❌'}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="app-btn-primary w-full mt-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create account <MdArrowForward size={18} /></>
              )}
            </button>
          </form>

          <p className="text-center text-[var(--muted-foreground)] text-sm mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
