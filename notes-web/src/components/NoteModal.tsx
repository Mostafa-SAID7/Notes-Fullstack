import React, { useState, useCallback } from 'react';
import { FormField } from './ui/FormField';
import type { NoteColor } from '../types/note';
import { NOTE_COLORS } from '../types/note';

interface NoteModalProps {
  isOpen: boolean;
  isNew: boolean;
  title: string;
  desc: string;
  color: NoteColor;
  tags: string[];
  validationErrors: Record<string, string[]>;
  isLoading: boolean;
  onTitleChange: (value: string) => void;
  onDescChange: (value: string) => void;
  onColorChange: (value: NoteColor) => void;
  onTagsChange: (tags: string[]) => void;
  onSave: () => void;
  onClose: () => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen, isNew, title, desc, color, tags, validationErrors,
  isLoading, onTitleChange, onDescChange, onColorChange, onTagsChange, onSave, onClose,
}) => {
  const [tagInput, setTagInput] = useState('');

  const handleTagKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
      if (!tags.includes(newTag) && tags.length < 10) {
        onTagsChange([...tags, newTag]);
      }
      setTagInput('');
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      onTagsChange(tags.slice(0, -1));
    }
  }, [tagInput, tags, onTagsChange]);

  const removeTag = useCallback((tag: string) => {
    onTagsChange(tags.filter(t => t !== tag));
  }, [tags, onTagsChange]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-4 animate-scale-in max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-[var(--foreground)]">{isNew ? 'New Note' : 'Edit Note'}</h2>

        <FormField error={validationErrors.Title?.[0]}>
          <input
            className={`app-input ${validationErrors.Title ? 'border-red-500 focus:ring-red-500/40' : ''}`}
            placeholder="Title"
            value={title}
            onChange={e => onTitleChange(e.target.value)}
            disabled={isLoading}
            autoFocus
          />
        </FormField>

        <FormField error={validationErrors.Desc?.[0]}>
          <textarea
            className={`app-input resize-none ${validationErrors.Desc ? 'border-red-500 focus:ring-red-500/40' : ''}`}
            placeholder="Description"
            rows={5}
            value={desc}
            onChange={e => onDescChange(e.target.value)}
            disabled={isLoading}
          />
        </FormField>

        <div>
          <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-2.5">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {NOTE_COLORS.map(c => (
              <button
                key={c.value}
                type="button"
                title={c.label}
                onClick={() => onColorChange(c.value)}
                className={`relative w-7 h-7 rounded-full transition-all duration-150 ${c.swatch} ${
                  color === c.value
                    ? 'ring-2 ring-offset-2 ring-offset-[var(--card)] ring-primary scale-110'
                    : 'opacity-70 hover:opacity-100 hover:scale-105'
                }`}
                aria-label={c.label}
              />
            ))}
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-1.5">
            Selected: <span className="font-medium text-[var(--foreground)]">{NOTE_COLORS.find(c => c.value === color)?.label}</span>
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-2.5">
            Tags <span className="normal-case font-normal opacity-60">(Enter or comma to add)</span>
          </label>
          <div className="flex flex-wrap gap-1.5 bg-[var(--input)] border border-[var(--border)] rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/40 transition-all duration-200 min-h-[42px]">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-primary/60 hover:text-primary ml-0.5 leading-none"
                  disabled={isLoading}
                >×</button>
              </span>
            ))}
            <input
              className="flex-1 min-w-[100px] bg-transparent text-[var(--foreground)] placeholder-[var(--muted-foreground)] text-sm focus:outline-none"
              placeholder={tags.length === 0 ? 'Add tags...' : ''}
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              disabled={isLoading || tags.length >= 10}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-1">
          <button className="app-btn-secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button className="app-btn-primary" onClick={onSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>
    </div>
  );
};
