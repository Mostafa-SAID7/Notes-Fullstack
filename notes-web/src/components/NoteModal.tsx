import React from 'react';
import { FormField } from './ui/FormField';

interface NoteModalProps {
  isOpen: boolean;
  isNew: boolean;
  title: string;
  desc: string;
  validationErrors: Record<string, string[]>;
  isLoading: boolean;
  onTitleChange: (value: string) => void;
  onDescChange: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
}

/**
 * NoteModal component - Modal for creating/editing notes
 * Responsibilities: Form UI, input handling, validation display
 */
export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  isNew,
  title,
  desc,
  validationErrors,
  isLoading,
  onTitleChange,
  onDescChange,
  onSave,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl flex flex-col gap-4">
        <h2 className="text-lg font-bold text-foreground">{isNew ? 'New Note' : 'Edit Note'}</h2>

        <FormField error={validationErrors.Title?.[0]}>
          <input
            className={`w-full bg-input border rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${validationErrors.Title ? 'border-red-500' : 'border-border'}`}
            placeholder="Title"
            value={title}
            onChange={e => onTitleChange(e.target.value)}
            disabled={isLoading}
          />
        </FormField>

        <FormField error={validationErrors.Desc?.[0]}>
          <textarea
            className={`w-full bg-input border rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${validationErrors.Desc ? 'border-red-500' : 'border-border'}`}
            placeholder="Description"
            rows={5}
            value={desc}
            onChange={e => onDescChange(e.target.value)}
            disabled={isLoading}
          />
        </FormField>

        <div className="flex gap-3 justify-end pt-1">
          <button
            className="inline-flex items-center justify-center gap-2 bg-surface-2 hover:bg-surface active:bg-surface-2 text-foreground font-medium text-sm px-4 sm:px-5 py-2.5 rounded-lg border border-border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 bg-primary hover:opacity-90 active:opacity-75 text-primary-foreground font-semibold text-sm px-4 sm:px-5 py-2.5 rounded-lg shadow-md shadow-blue-900/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onSave}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>
    </div>
  );
};
