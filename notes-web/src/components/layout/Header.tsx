import React from 'react';

interface HeaderProps {
  totalCount: number;
  searchTerm: string;
}

/**
 * Header component - Page title and stats
 * Responsibilities: Display title, note count, search info
 */
export const Header: React.FC<HeaderProps> = ({ totalCount, searchTerm }) => {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-white mb-1">My Notes</h1>
      <p className="text-slate-400 text-sm">
        {totalCount} {totalCount === 1 ? 'note' : 'notes'}
        {searchTerm && ` matching "${searchTerm}"`}
      </p>
    </div>
  );
};
