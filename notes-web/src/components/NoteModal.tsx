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
  isOpen,
  isNew,
  title,
  desc,
  color,
  tags,
  validationErrors,
  isLoading,
  onTitleChange,
  onDescChange,
  onColorChange,
  onTagsChange,
  onSave,
  onClose,
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
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-4 animate-scale-in max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-foreground">{isNew ? 'New Note' : 'Edit Note'}</h2>

        <FormField error={validationErrors.Title?.[0]}>
          <input
            className={`w-full bg-input border rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${validationErrors.Title ? 'border-red-500' : 'border-border'}`}
            placeholder="Title"
            value={title}
            onChange={e => onTitleChange(e.target.value)}
            disabled={isLoading}
            autoFocus
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

        {/* Color Picker */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">Color</label>
          <div className="flex flex-wrap gap-2">
            {NOTE_COLORS.map(c => (
              <button
                key={c.value}
                type="button"
                title={c.label}
                onClick={() => onColorChange(c.value)}
                className={`w-7 h-7 rounded-full border-2 transition-all duration-150 ${
                  color === c.value
                    ? 'border-primary scale-110 shadow-md'
                    : 'border-border hover:border-primary/50'
                } ${c.bg}`}
                aria-label={c.label}
              />
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            Tags <span className="opacity-50">(press Enter or comma to add)</span>
          </label>
          <div className={`flex flex-wrap gap-1.5 bg-input border border-border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all duration-200 min-h-[42px]`}>
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
                >
                  ×
                </button>
              </span>
            ))}
            <input
              className="flex-1 min-w-[100px] bg-transparent text-foreground placeholder-muted-foreground text-sm focus:outline-none"
              placeholder={tags.length === 0 ? 'Add tags...' : ''}
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              disabled={isLoading || tags.length >= 10}
            />
          </div>
        </div>

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
