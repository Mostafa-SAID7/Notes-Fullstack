import React, { useRef } from 'react';
import { MdAdd, MdMenu, MdSearch, MdClose, MdDarkMode, MdLightMode, MdMenuOpen } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
  onMenuToggle: () => void;
  sidebarOpen: boolean;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  search, onSearchChange, onCreateClick, onMenuToggle, sidebarOpen, isLoading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '??';

  return (
    <nav
      className="w-full bg-[var(--surface)] border-b border-[var(--border)] px-3 sm:px-4 py-2.5 flex items-center gap-2 sm:gap-3 flex-shrink-0 z-10"
      style={{ position: 'sticky', top: 0 }}
    >
      {/* Sidebar toggle — visible on all screen sizes */}
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-xl text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors flex-shrink-0"
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {sidebarOpen ? <MdMenuOpen size={20} /> : <MdMenu size={20} />}
      </button>

      {/* App wordmark — hidden on very small screens */}
      <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
        <span className="font-bold text-[var(--foreground)] text-sm tracking-tight">NoteFlow</span>
      </div>

      {/* Search bar — grows to fill available space */}
      <div
        className="flex-1 relative max-w-lg cursor-text min-w-0"
        onClick={() => inputRef.current?.focus()}
      >
        <MdSearch
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none"
        />
        <input
          ref={inputRef}
          className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl pl-8 pr-7 py-2 text-[var(--foreground)] placeholder-[var(--muted-foreground)] text-sm focus:outline-none transition-all duration-200"
          onFocus={e => {
            e.currentTarget.style.borderColor = 'rgba(var(--primary-rgb), 0.5)';
            e.currentTarget.style.boxShadow  = '0 0 0 3px rgba(var(--primary-rgb), 0.12)';
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = '';
            e.currentTarget.style.boxShadow  = '';
          }}
          placeholder="Search notes…"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          disabled={isLoading}
          aria-label="Search notes"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            aria-label="Clear search"
          >
            <MdClose size={14} />
          </button>
        )}
      </div>

      {/* Right-side actions */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-auto">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
        </button>

        {/* New Note */}
        <button
          className="app-btn-primary gap-1.5 text-sm px-3 py-2"
          onClick={onCreateClick}
          disabled={isLoading}
          aria-label="Create new note"
        >
          <MdAdd size={18} />
          <span className="hidden sm:inline font-semibold">New</span>
        </button>

        {/* User avatar */}
        {user && (
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white select-none flex-shrink-0 cursor-default"
            style={{ background: 'rgba(var(--primary-rgb), 0.8)' }}
            title={user.username}
            aria-label={`Signed in as ${user.username}`}
          >
            {initials}
          </div>
        )}
      </div>
    </nav>
  );
};
