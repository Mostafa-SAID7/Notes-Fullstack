import React from 'react';

interface EmptyStateProps {
  onCreateClick: () => void;
  isLoading: boolean;
}

/**
 * EmptyState component - Shows when no notes exist
 * Responsibilities: Display empty state message and CTA
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateClick, isLoading }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="text-5xl">📭</div>
      <p className="text-muted-foreground text-base">No notes yet.</p>
      <button
        className="inline-flex items-center justify-center gap-2 bg-primary hover:opacity-90 active:opacity-75 text-primary-foreground font-semibold text-sm px-4 sm:px-5 py-2.5 rounded-lg shadow-md shadow-blue-900/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onCreateClick}
        disabled={isLoading}
      >
        Take your first note
      </button>
    </div>
  );
};
