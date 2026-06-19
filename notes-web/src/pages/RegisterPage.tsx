import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdNotes, MdEmail, MdLock, MdPerson, MdArrowForward } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { register as apiRegister } from '../services/authApi';

export const RegisterPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <MdNotes className="text-primary" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Create account</h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-1">Start taking notes today</p>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-xl">
          {error && (
            <div className="mb-4 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
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
              <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
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

            <div className="relative">
              <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
              <input
                className="auth-input pl-10"
                type="password"
                placeholder="Password (min 6 chars)"
                autoComplete="new-password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                disabled={loading}
              />
            </div>

            <div className="relative">
              <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
              <input
                className="auth-input pl-10"
                type="password"
                placeholder="Confirm password"
                autoComplete="new-password"
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                disabled={loading}
              />
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
