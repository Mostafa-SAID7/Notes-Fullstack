import React from 'react';
import { MdDeleteForever } from 'react-icons/md';

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 animate-scale-in">
        {isDangerous && (
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto mb-4">
            <MdDeleteForever size={28} className="text-red-400" />
          </div>
        )}
        <h3 className="text-xl font-bold text-[var(--foreground)] text-center mb-1.5" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h3>
        <p className="text-sm text-[var(--muted-foreground)] text-center leading-relaxed mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            className="app-btn-secondary flex-1"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            className={`flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 disabled:opacity-50 ${
              isDangerous
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'app-btn-primary'
            }`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading
              ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : confirmText
            }
          </button>
        </div>
      </div>
    </div>
  );
};
