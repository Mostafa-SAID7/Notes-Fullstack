import React from 'react';

interface HeaderProps {
  totalCount: number;
  searchTerm: string;
  activeTag: string | null;
  allTags: string[];
  onTagFilter: (tag: string | null) => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  searchTerm,
  activeTag,
  allTags,
  onTagFilter,
}) => {
  return (
    <div className="mb-8">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-foreground mb-1">My Notes</h1>
        <p className="text-muted-foreground text-sm">
          {totalCount} {totalCount === 1 ? 'note' : 'notes'}
          {searchTerm && ` matching "${searchTerm}"`}
          {activeTag && ` tagged #${activeTag}`}
        </p>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => onTagFilter(null)}
            className={`text-xs px-3 py-1 rounded-full border transition-all duration-150 font-medium ${
              activeTag === null
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-primary'
            }`}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => onTagFilter(activeTag === tag ? null : tag)}
              className={`text-xs px-3 py-1 rounded-full border transition-all duration-150 font-medium ${
                activeTag === tag
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-primary'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
