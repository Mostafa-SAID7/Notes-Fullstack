import React from 'react';
import { MdNotes, MdAdd, MdDarkMode, MdLightMode } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
  isLoading: boolean;
}

/**
 * Navbar component - Top navigation bar with theme toggle
 * Responsibilities: Display title, search input, theme toggle, create button
 * Responsive: Adapts layout for mobile and desktop
 */
export const Navbar: React.FC<NavbarProps> = ({
  search,
  onSearchChange,
  onCreateClick,
  isLoading,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="w-full bg-surface border-b border-border/50 px-4 sm:px-6 py-4 flex items-center gap-2 sm:gap-4 shadow-lg transition-colors duration-300">
      {/* Logo and Title */}
      <span className="text-lg sm:text-xl font-bold text-foreground tracking-tight flex items-center gap-2 flex-shrink-0">
        <MdNotes size={24} />
        <span className="hidden sm:inline">Notes App</span>
      </span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search Input - on the right */}
      <input
        className="w-48 sm:w-64 bg-input border border-border/50 rounded-lg px-3 sm:px-4 py-2 text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
        placeholder="Search..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        disabled={isLoading}
      />

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Theme Toggle */}
        <button
          className="inline-flex items-center justify-center text-foreground hover:text-primary p-2 rounded-lg hover:bg-surface-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <MdLightMode size={20} />
          ) : (
            <MdDarkMode size={20} />
          )}
        </button>

        {/* New Note Button */}
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
