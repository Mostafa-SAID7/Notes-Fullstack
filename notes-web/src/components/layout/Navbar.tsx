import React from 'react';
import { MdNotes, MdAdd } from 'react-icons/md';

interface NavbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
  isLoading: boolean;
}

/**
 * Navbar component - Top navigation bar
 * Responsibilities: Display title, search input, create button
 */
export const Navbar: React.FC<NavbarProps> = ({
  search,
  onSearchChange,
  onCreateClick,
  isLoading,
}) => {
  return (
    <nav className="app-navbar">
      <span className="app-navbar-title flex items-center gap-2">
        <MdNotes size={24} />
        Notes App
      </span>
      <input
        className="app-search"
        placeholder="Search notes..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        disabled={isLoading}
      />
      <button
        className="btn-primary flex items-center gap-2"
        onClick={onCreateClick}
        disabled={isLoading}
      >
        <MdAdd size={20} />
        New Note
      </button>
    </nav>
  );
};
