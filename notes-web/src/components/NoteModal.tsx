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
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-box">
        <h2 className="modal-title">{isNew ? 'New Note' : 'Edit Note'}</h2>

        <FormField error={validationErrors.Title?.[0]}>
          <input
            className={`modal-input ${validationErrors.Title ? 'border-red-500' : ''}`}
            placeholder="Title"
            value={title}
            onChange={e => onTitleChange(e.target.value)}
            disabled={isLoading}
          />
        </FormField>

        <FormField error={validationErrors.Desc?.[0]}>
          <textarea
            className={`modal-textarea ${validationErrors.Desc ? 'border-red-500' : ''}`}
            placeholder="Description"
            rows={5}
            value={desc}
            onChange={e => onDescChange(e.target.value)}
            disabled={isLoading}
          />
        </FormField>

        <div className="flex gap-3 justify-end pt-1">
          <button
            className="btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
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
