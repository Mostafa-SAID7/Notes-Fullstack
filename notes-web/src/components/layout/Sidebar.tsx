import React from 'react';
import {
  MdNotes, MdPushPin, MdLocalOffer, MdLogout, MdAdd,
  MdDarkMode, MdLightMode, MdClose,
} from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import type { SortOption } from '../../types/note';
import { CustomSelect } from '../ui/CustomSelect';

export type SidebarView = 'all' | 'pinned' | 'tag';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  view: SidebarView;
  activeTag: string | null;
  allTags: string[];
  sort: SortOption;
  onViewChange: (view: SidebarView, tag?: string) => void;
  onSortChange: (v: SortOption) => void;
  onCreateClick: () => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'a-z',    label: 'A → Z' },
  { value: 'z-a',    label: 'Z → A' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen, onClose, view, activeTag, allTags, sort,
  onViewChange, onSortChange, onCreateClick,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const navItem = (
    label: string,
    icon: React.ReactNode,
    active: boolean,
    onClick: () => void,
  ) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
        active
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-30 w-64
        bg-[var(--surface)] border-r border-[var(--border)]
        flex flex-col transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <MdNotes className="text-white" size={18} />
            </div>
            <span className="font-bold text-[var(--foreground)] text-base">Notes</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--muted-foreground)]"
          >
            <MdClose size={18} />
          </button>
        </div>

        <div className="p-3">
          <button
            onClick={() => { onCreateClick(); onClose(); }}
            className="app-btn-primary w-full flex items-center justify-center gap-2 text-sm py-2.5"
          >
            <MdAdd size={18} />
            New Note
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-1 flex flex-col gap-1">
          {navItem(
            'All Notes', <MdNotes size={18} />,
            view === 'all',
            () => { onViewChange('all'); onClose(); },
          )}
          {navItem(
            'Pinned', <MdPushPin size={18} />,
            view === 'pinned',
            () => { onViewChange('pinned'); onClose(); },
          )}

          {allTags.length > 0 && (
            <div className="pt-3">
              <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">
                Tags
              </p>
              <div className="flex flex-col gap-0.5">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => { onViewChange('tag', tag); onClose(); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-150 ${
                      view === 'tag' && activeTag === tag
                        ? 'bg-primary/15 text-primary font-semibold'
                        : 'text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    <MdLocalOffer size={14} />
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-3">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">
              Sort by
            </p>
            <div className="px-1">
              <CustomSelect
                value={sort}
                options={SORT_OPTIONS}
                onChange={v => onSortChange(v as SortOption)}
              />
            </div>
          </div>
        </nav>

        <div className="border-t border-[var(--border)] p-3 flex flex-col gap-1">
          {user && (
            <div className="px-3 py-2 mb-1">
              <p className="text-xs font-semibold text-[var(--foreground)] truncate">{user.username}</p>
              <p className="text-[11px] text-[var(--muted-foreground)] truncate">{user.email}</p>
            </div>
          )}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition-all duration-150"
          >
            {theme === 'dark' ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-150"
          >
            <MdLogout size={18} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
};
