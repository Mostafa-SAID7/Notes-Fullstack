import React from 'react';

/**
 * LoadingState component - Shows loading indicator
 * Responsibilities: Display loading animation
 */
export const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="animate-spin text-4xl">⏳</div>
      <p className="text-slate-400">Loading notes...</p>
    </div>
  );
};
