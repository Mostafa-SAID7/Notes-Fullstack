import React from 'react';
import { MdNotes, MdAdd, MdDarkMode, MdLightMode } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';
import type { SortOption } from '../../types/note';

interface NavbarProps {
  search: string;
  sort: SortOption;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onCreateClick: () => void;
  isLoading: boolean;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'a-z',    label: 'A → Z' },
  { value: 'z-a',    label: 'Z → A' },
];

export const Navbar: React.FC<NavbarProps> = ({
  search,
  sort,
  onSearchChange,
  onSortChange,
  onCreateClick,
  isLoading,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="w-full bg-surface border-b border-border/50 px-4 sm:px-6 py-4 flex items-center gap-2 sm:gap-3 shadow-lg animate-theme-transition flex-wrap">
      <span className="text-lg sm:text-xl font-bold text-foreground tracking-tight flex items-center gap-2 flex-shrink-0">
        <MdNotes size={24} />
        <span className="hidden sm:inline">Notes App</span>
      </span>

      <div className="flex-1" />

      <input
        className="w-40 sm:w-56 bg-input border border-border/50 rounded-lg px-3 sm:px-4 py-2 text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
        placeholder="Search..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        disabled={isLoading}
      />

      <select
        className="bg-input border border-border/50 rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 cursor-pointer"
        value={sort}
        onChange={e => onSortChange(e.target.value as SortOption)}
        disabled={isLoading}
      >
        {SORT_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          className="inline-flex items-center justify-center text-foreground hover:text-primary p-2 rounded-lg hover:bg-surface-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
        </button>

        <button
          className="inline-flex items-center justify-center gap-2 bg-primary hover:opacity-90 active:opacity-75 text-primary-foreground font-semibold text-sm px-4 sm:px-5 py-2.5 rounded-lg shadow-md shadow-blue-900/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onCreateClick}
          disabled={isLoading}
        >
          <MdAdd size={20} />
          <span className="hidden sm:inline">New Note</span>
        </button>
      </div>
    </nav>
  );
};
