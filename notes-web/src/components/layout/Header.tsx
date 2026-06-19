import React from 'react';
import { MdSearch, MdLocalOffer } from 'react-icons/md';

interface HeaderProps {
  totalCount: number;
  searchTerm: string;
  activeTag: string | null;
  viewLabel: string;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount, searchTerm, activeTag, viewLabel,
}) => {
  return (
    <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-3xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-heading)' }}>{viewLabel}</h1>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--muted-foreground)] border border-[var(--border)]">
            {totalCount} {totalCount === 1 ? 'note' : 'notes'}
          </span>
          {searchTerm && (
            <span className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
              <MdSearch size={12} />
              "{searchTerm}"
            </span>
          )}
          {activeTag && (
            <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border" style={{ color: 'rgb(var(--primary-rgb))', borderColor: 'rgba(var(--primary-rgb), 0.3)', background: 'rgba(var(--primary-rgb), 0.08)' }}>
              <MdLocalOffer size={10} />
              #{activeTag}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
