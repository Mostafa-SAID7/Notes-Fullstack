import React from 'react';
import { MdNotes } from 'react-icons/md';

/**
 * LoadingState component - Shows loading indicator with animation
 * Responsibilities: Display animated loading spinner
 */
export const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="animate-spin">
        <MdNotes size={48} className="text-blue-400" />
      </div>
      <p className="text-slate-400">Loading notes...</p>
    </div>
  );
};
