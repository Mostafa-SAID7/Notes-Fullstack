import React from 'react';

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
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">{viewLabel}</h1>
      <p className="text-[var(--muted-foreground)] text-sm mt-0.5">
        {totalCount} {totalCount === 1 ? 'note' : 'notes'}
        {searchTerm && ` matching "${searchTerm}"`}
        {activeTag && ` tagged #${activeTag}`}
      </p>
    </div>
  );
};
