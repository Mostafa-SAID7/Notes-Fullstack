import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

const App          = lazy(() => import('./App'));
const LoginPage    = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));

const PageFallback = () => (
  <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
        style={{ background: 'rgba(var(--primary-rgb), 0.12)' }}
      >
        📝
      </div>
      <div
        className="w-5 h-5 rounded-full border-2 border-t-transparent"
        style={{
          borderColor: 'rgba(var(--primary-rgb), 0.3)',
          borderTopColor: 'rgb(var(--primary-rgb))',
          animation: 'spin 0.7s linear infinite',
        }}
      />
    </div>
  </div>
);

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/login"    element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/"         element={<App />} />
              <Route path="*"         element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
