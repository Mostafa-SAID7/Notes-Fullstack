import React from 'react';
import {
  MdNotes, MdPushPin, MdLocalOffer, MdLogout, MdAdd,
  MdCheck, MdBarChart, MdClose,
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

const NavBtn: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: React.ReactNode;
}> = ({ active, onClick, icon, label, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
      active
        ? 'text-white shadow-sm'
        : 'text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]'
    }`}
    style={active ? { background: 'rgb(var(--primary-rgb))' } : {}}
  >
    <span className="flex-shrink-0">{icon}</span>
    <span className="flex-1 text-left truncate">{label}</span>
    {badge}
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen, onClose, view, activeTag, allTags, sort,
  onViewChange, onSortChange, onCreateClick, totalCount = 0, pinnedCount = 0,
}) => {
  const { accentColor, setAccentColor } = useTheme();
  const { user, logout } = useAuth();

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '??';

  const handleNav = (v: SidebarView, tag?: string) => {
    onViewChange(v, tag);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel — always fixed, slides in/out */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-30 w-64
          bg-[var(--surface)] border-r border-[var(--border)]
          flex flex-col
          transition-transform duration-300 ease-in-out
          will-change-transform
          ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}
        aria-label="Sidebar navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3 flex-shrink-0">
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
            className="p-1.5 rounded-xl hover:bg-[var(--surface-2)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            aria-label="Close sidebar"
          >
            <MdClose size={18} />
          </button>
        </div>

        {/* New Note button */}
        <div className="px-3 pb-3 flex-shrink-0">
          <button
            onClick={() => { onCreateClick(); onClose(); }}
            className="app-btn-primary w-full justify-center text-sm py-2.5 rounded-xl"
          >
            <MdAdd size={17} />
            New Note
          </button>
        </div>

        {/* Scrollable nav area */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-2 flex flex-col gap-0.5 scrollbar-hide hover:scrollbar-default">
          <NavBtn
            active={view === 'all'}
            onClick={() => handleNav('all')}
            icon={<MdNotes size={17} />}
            label="All Notes"
            badge={totalCount > 0 ? (
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full tabular-nums flex-shrink-0 ${
                view === 'all' ? 'bg-white/20 text-white' : 'bg-[var(--surface-2)] text-[var(--muted-foreground)]'
              }`}>{totalCount}</span>
            ) : undefined}
          />

          <NavBtn
            active={view === 'pinned'}
            onClick={() => handleNav('pinned')}
            icon={<MdPushPin size={17} />}
            label="Pinned"
            badge={pinnedCount > 0 ? (
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full tabular-nums flex-shrink-0 ${
                view === 'pinned' ? 'bg-white/20 text-white' : 'bg-amber-400/15 text-amber-400'
              }`}>{pinnedCount}</span>
            ) : undefined}
          />

          <NavBtn
            active={view === 'stats'}
            onClick={() => handleNav('stats')}
            icon={<MdBarChart size={17} />}
            label="Stats"
          />

          {allTags.length > 0 && (
            <div className="pt-4">
              <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5 select-none">
                Tags
              </p>
              <div className="flex flex-col gap-0.5">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleNav('tag', tag)}
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
                    <MdLocalOffer size={13} className="flex-shrink-0" />
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

        {/* Footer: accent colours + user + logout */}
        <div className="flex-shrink-0 border-t border-[var(--border)] p-3 flex flex-col gap-1">
          {/* Accent colour picker */}
          <div className="px-3 py-1.5">
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
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-110 focus:outline-none"
                    style={{
                      backgroundColor: preset.swatch,
                      outline: isActive ? `2px solid ${preset.swatch}` : '2px solid transparent',
                      outlineOffset: '2px',
                    }}
                    aria-label={`${preset.label} accent`}
                  >
                    {isActive && <MdCheck size={12} className="text-white drop-shadow" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* User info */}
          {user && (
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[var(--surface-2)] transition-colors min-w-0">
              <div
                className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold text-white select-none"
                style={{ background: 'rgba(var(--primary-rgb), 0.8)' }}
              >
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[var(--foreground)] truncate">{user.username}</p>
                <p className="text-[10px] text-[var(--muted-foreground)] truncate">{user.email}</p>
              </div>
            </div>
          )}

          {/* Sign out */}
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
