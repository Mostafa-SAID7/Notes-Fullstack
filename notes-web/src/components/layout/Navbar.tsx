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
    <nav className="app-navbar">
      {/* Logo and Title */}
      <span className="app-navbar-title">
        <MdNotes size={24} />
        <span className="hidden sm:inline">Notes App</span>
      </span>

      {/* Search Input */}
      <input
        className="app-search"
        placeholder="Search..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        disabled={isLoading}
      />

      {/* Actions */}
      <div className="app-navbar-actions">
        {/* Theme Toggle */}
        <button
          className="btn-icon"
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
          className="btn-primary"
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
