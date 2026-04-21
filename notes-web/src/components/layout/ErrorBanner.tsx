import React from 'react';

interface ErrorBannerProps {
  message: string | null;
  onClose: () => void;
}

/**
 * ErrorBanner component - Displays error messages
 * Responsibilities: Show error, allow dismissal
 */
export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-3 mx-6 mt-4 rounded-lg flex justify-between items-center">
      <span>{message}</span>
      <button
        onClick={onClose}
        className="text-red-400 hover:text-red-300"
        aria-label="Close error"
      >
        ✕
      </button>
    </div>
  );
};
