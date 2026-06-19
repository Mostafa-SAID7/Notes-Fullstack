import React from 'react';
import { MdClose } from 'react-icons/md';

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
    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-3 mx-6 mt-5 rounded-xl flex justify-between items-center gap-3 text-sm">
      <span>{message}</span>
      <button
        onClick={onClose}
        className="text-red-400 hover:text-red-300"
        aria-label="Close error"
      >
        <MdClose size={20} />
      </button>
    </div>
  );
};
