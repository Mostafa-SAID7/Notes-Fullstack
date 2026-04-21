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
      <p className="text-slate-400 text-base">No notes yet.</p>
      <button
        className="btn-primary"
        onClick={onCreateClick}
        disabled={isLoading}
      >
        Take your first note
      </button>
    </div>
  );
};
