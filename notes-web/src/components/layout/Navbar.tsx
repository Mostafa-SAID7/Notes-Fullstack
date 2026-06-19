import React, { useRef } from 'react';
import { MdNotes, MdAdd, MdMenu, MdSearch, MdClose } from 'react-icons/md';

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
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <nav className="w-full bg-[var(--surface)] border-b border-[var(--border)] px-3 sm:px-5 py-2.5 flex items-center gap-3 flex-shrink-0 z-10">
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-xl text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors"
        aria-label="Toggle sidebar"
      >
        <MdMenu size={20} />
      </button>

      <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgb(var(--primary-rgb))' }}>
          <MdNotes className="text-white" size={17} />
        </div>
        <span className="font-bold text-[var(--foreground)] text-sm tracking-tight">NoteFlow</span>
      </div>

      <div
        className="flex-1 relative max-w-md cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <MdSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
        <input
          ref={inputRef}
          className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl pl-9 pr-8 py-2 text-[var(--foreground)] placeholder-[var(--muted-foreground)] text-sm focus:outline-none transition-all duration-200"
          style={{ '--tw-ring-color': 'none' } as React.CSSProperties}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(var(--primary-rgb), 0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(var(--primary-rgb), 0.12)'; }}
          onBlur={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = ''; }}
          placeholder="Search notes…"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          disabled={isLoading}
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <MdClose size={15} />
          </button>
        )}
      </div>

      <div className="ml-auto flex-shrink-0">
        <button
          className="app-btn-primary gap-1.5 text-sm px-3.5 py-2"
          onClick={onCreateClick}
          disabled={isLoading}
        >
          <MdAdd size={18} />
          <span className="hidden sm:inline font-semibold">New Note</span>
        </button>
      </div>
    </nav>
  );
};
