import React from 'react';
import {
  MdNotes, MdPushPin, MdLocalOffer, MdLogout, MdAdd,
  MdDarkMode, MdLightMode, MdClose, MdCheck, MdBarChart,
} from 'react-icons/md';
import { useTheme, ACCENT_PRESETS } from '../../context/ThemeContext';
import type { AccentColor } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import type { SortOption } from '../../types/note';
import { CustomSelect } from '../ui/CustomSelect';

export type SidebarView = 'all' | 'pinned' | 'tag' | 'stats';

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
  totalCount?: number;
  pinnedCount?: number;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'a-z',    label: 'A → Z' },
  { value: 'z-a',    label: 'Z → A' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen, onClose, view, activeTag, allTags, sort,
  onViewChange, onSortChange, onCreateClick, totalCount = 0, pinnedCount = 0,
}) => {
  const { theme, toggleTheme, accentColor, setAccentColor } = useTheme();
  const { user, logout } = useAuth();

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '??';

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-30 w-64
        bg-[var(--surface)] border-r border-[var(--border)]
        flex flex-col transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between px-4 pt-5 pb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgb(var(--primary-rgb))' }}
            >
              <MdNotes className="text-white" size={17} />
            </div>
            <span className="font-bold text-[var(--foreground)] text-sm tracking-tight">NoteFlow</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-xl hover:bg-[var(--surface-2)] text-[var(--muted-foreground)] transition-colors"
          >
            <MdClose size={17} />
          </button>
        </div>

        <div className="px-3 pb-3">
          <button
            onClick={() => { onCreateClick(); onClose(); }}
            className="app-btn-primary w-full justify-center text-sm py-2.5 rounded-xl"
          >
            <MdAdd size={17} />
            New Note
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-3 flex flex-col gap-0.5">
          <button
            onClick={() => { onViewChange('all'); onClose(); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              view === 'all'
                ? 'bg-[rgb(var(--primary-rgb))] text-white shadow-sm'
                : 'text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]'
            }`}
          >
            <MdNotes size={17} />
            <span className="flex-1 text-left">All Notes</span>
            {totalCount > 0 && (
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full tabular-nums ${
                view === 'all' ? 'bg-white/20 text-white' : 'bg-[var(--surface-2)] text-[var(--muted-foreground)]'
              }`}>{totalCount}</span>
            )}
          </button>

          <button
            onClick={() => { onViewChange('pinned'); onClose(); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              view === 'pinned'
                ? 'bg-[rgb(var(--primary-rgb))] text-white shadow-sm'
                : 'text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]'
            }`}
          >
            <MdPushPin size={17} />
            <span className="flex-1 text-left">Pinned</span>
            {pinnedCount > 0 && (
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full tabular-nums ${
                view === 'pinned' ? 'bg-white/20 text-white' : 'bg-amber-400/15 text-amber-400'
              }`}>{pinnedCount}</span>
            )}
          </button>

          <button
            onClick={() => { onViewChange('stats'); onClose(); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              view === 'stats'
                ? 'bg-[rgb(var(--primary-rgb))] text-white shadow-sm'
                : 'text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]'
            }`}
          >
            <MdBarChart size={17} />
            <span className="flex-1 text-left">Stats</span>
          </button>

          {allTags.length > 0 && (
            <div className="pt-4">
              <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5 select-none">
                Tags
              </p>
              <div className="flex flex-col gap-0.5">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => { onViewChange('tag', tag); onClose(); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-150 ${
                      view === 'tag' && activeTag === tag
                        ? 'font-semibold'
                        : 'text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]'
                    }`}
                    style={view === 'tag' && activeTag === tag ? {
                      color: 'rgb(var(--primary-rgb))',
                      background: 'rgba(var(--primary-rgb), 0.1)',
                    } : {}}
                  >
                    <MdLocalOffer size={13} />
                    <span className="truncate">#{tag}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4">
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5 select-none">
              Sort
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
            <div className="flex items-center gap-2.5 px-2 py-2 mb-1 rounded-xl">
              <div
                className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold text-white select-none"
                style={{ background: 'rgba(var(--primary-rgb), 0.8)' }}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[var(--foreground)] truncate">{user.username}</p>
                <p className="text-[10px] text-[var(--muted-foreground)] truncate">{user.email}</p>
              </div>
            </div>
          )}
          <div className="px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-2 select-none">
              Accent
            </p>
            <div className="flex items-center gap-2">
              {(Object.keys(ACCENT_PRESETS) as AccentColor[]).map(key => {
                const preset = ACCENT_PRESETS[key];
                const isActive = accentColor === key;
                return (
                  <button
                    key={key}
                    title={preset.label}
                    onClick={() => setAccentColor(key)}
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-110"
                    style={{
                      backgroundColor: preset.swatch,
                      outline: isActive ? `2px solid ${preset.swatch}` : '2px solid transparent',
                      outlineOffset: '2px',
                    }}
                  >
                    {isActive && <MdCheck size={12} className="text-white drop-shadow" />}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition-all duration-150"
          >
            {theme === 'dark' ? <MdLightMode size={17} /> : <MdDarkMode size={17} />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-150"
          >
            <MdLogout size={17} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
};
