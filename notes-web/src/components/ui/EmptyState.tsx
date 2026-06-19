import React from 'react';
import { MdAdd, MdNotes } from 'react-icons/md';

interface EmptyStateProps {
  onCreateClick: () => void;
  isLoading: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateClick, isLoading }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6 select-none">
      <div className="relative">
        <div className="w-24 h-24 rounded-3xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center shadow-lg">
          <MdNotes size={44} style={{ color: 'rgba(var(--primary-rgb), 0.4)' }} />
        </div>
        <div
          className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
          style={{ background: 'rgb(var(--primary-rgb))' }}
        >
          <MdAdd size={20} className="text-white" />
        </div>
      </div>
      <div className="text-center max-w-xs">
        <h3 className="text-base font-semibold text-[var(--foreground)] mb-1">No notes yet</h3>
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
          Start capturing your thoughts, ideas, and tasks. Your notes will appear here.
        </p>
      </div>
      <button
        className="app-btn-primary px-6 py-2.5 gap-2"
        onClick={onCreateClick}
        disabled={isLoading}
      >
        <MdAdd size={18} />
        Create your first note
      </button>
    </div>
  );
};
