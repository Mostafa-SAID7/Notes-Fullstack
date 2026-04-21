import React from 'react';
import { MdWarning } from 'react-icons/md';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * ConfirmationModal component - Modal for confirming destructive actions
 * Responsibilities: Display confirmation prompt, handle user choice
 */
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="bg-[#1E293B] border border-[rgba(59,130,246,0.25)] rounded-xl shadow-xl shadow-blue-950/40 p-6 max-w-sm w-full mx-4">
        <div className="flex items-start gap-3 mb-4">
          {isDangerous && (
            <MdWarning className="text-red-400 flex-shrink-0 mt-0.5" size={24} />
          )}
          <div>
            <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
            <p className="text-slate-400 text-sm mt-1">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors duration-150 disabled:opacity-50"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-150 disabled:opacity-50 ${
              isDangerous
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
