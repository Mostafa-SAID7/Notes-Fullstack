import React from 'react';
import { MdNotes, MdAdd, MdMenu, MdSearch } from 'react-icons/md';

interface NavbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
  onMenuToggle: () => void;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  search, onSearchChange, onCreateClick, onMenuToggle, isLoading,
}) => {
  return (
    <nav className="w-full bg-[var(--surface)] border-b border-[var(--border)] px-3 sm:px-4 py-3 flex items-center gap-3 shadow-sm flex-shrink-0 z-10">
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors"
        aria-label="Toggle sidebar"
      >
        <MdMenu size={22} />
      </button>

      <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
          <MdNotes className="text-white" size={16} />
        </div>
        <span className="font-bold text-[var(--foreground)] text-sm tracking-tight">Notes</span>
      </div>

      <div className="flex-1 relative max-w-sm">
        <MdSearch
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none"
        />
        <input
          className="w-full bg-[var(--input)] border border-[var(--border)] rounded-lg pl-9 pr-3 py-2 text-[var(--foreground)] placeholder-[var(--muted-foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all duration-200"
          placeholder="Search notes..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="ml-auto flex-shrink-0">
        <button
          className="app-btn-primary flex items-center gap-1.5 text-sm"
          onClick={onCreateClick}
          disabled={isLoading}
        >
          <MdAdd size={18} />
          <span className="hidden sm:inline">New Note</span>
        </button>
      </div>
    </nav>
  );
};
