import React, { useState, useCallback, useMemo } from 'react';
import { FormField } from './ui/FormField';
import { MdClose, MdCheck } from 'react-icons/md';
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

  const charCount = useMemo(() => desc.length, [desc]);
  const wordCount = useMemo(() => desc.trim() ? desc.trim().split(/\s+/).length : 0, [desc]);
  const TITLE_MAX = 100;
  const DESC_MAX = 2000;

  if (!isOpen) return null;

  const selectedColor = NOTE_COLORS.find(c => c.value === color);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-xl shadow-2xl flex flex-col animate-scale-in max-h-[92vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-heading)' }}>
              {isNew ? 'New Note' : 'Edit Note'}
            </h2>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              {wordCount} {wordCount === 1 ? 'word' : 'words'} · {charCount} chars
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors"
          >
            <MdClose size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex flex-col gap-5 px-6 py-5">
          <FormField label="Title" error={validationErrors.Title?.[0]}>
            <div className="relative">
              <input
                className={`app-input pr-16 ${validationErrors.Title ? 'border-red-500' : ''}`}
                placeholder="Give your note a title…"
                value={title}
                onChange={e => onTitleChange(e.target.value)}
                disabled={isLoading}
                maxLength={TITLE_MAX}
                autoFocus
              />
              <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] tabular-nums ${title.length > TITLE_MAX * 0.9 ? 'text-amber-400' : 'text-[var(--muted-foreground)] opacity-50'}`}>
                {title.length}/{TITLE_MAX}
              </span>
            </div>
          </FormField>

          <FormField label="Content" error={validationErrors.Desc?.[0]}>
            <div className="relative">
              <textarea
                className={`app-input resize-none pb-6 ${validationErrors.Desc ? 'border-red-500' : ''}`}
                placeholder="Write your note here…"
                rows={7}
                value={desc}
                onChange={e => onDescChange(e.target.value)}
                disabled={isLoading}
                maxLength={DESC_MAX}
              />
              <span className={`absolute right-3 bottom-2.5 text-[10px] tabular-nums ${charCount > DESC_MAX * 0.9 ? 'text-amber-400' : 'text-[var(--muted-foreground)] opacity-40'}`}>
                {charCount}/{DESC_MAX}
              </span>
            </div>
          </FormField>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)] mb-2.5">Color</p>
            <div className="flex flex-wrap gap-2.5">
              {NOTE_COLORS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  title={c.label}
                  onClick={() => onColorChange(c.value)}
                  className={`
                    relative w-8 h-8 rounded-xl transition-all duration-150 ${c.swatch}
                    ${color === c.value
                      ? 'ring-2 ring-offset-2 ring-offset-[var(--card)] scale-110 shadow-lg'
                      : 'opacity-60 hover:opacity-100 hover:scale-105'
                    }
                  `}
                  style={color === c.value ? { ringColor: 'rgb(var(--primary-rgb))' } : {}}
                  aria-label={c.label}
                >
                  {color === c.value && (
                    <MdCheck size={14} className="absolute inset-0 m-auto text-white drop-shadow" />
                  )}
                </button>
              ))}
            </div>
            {selectedColor && (
              <p className="text-xs text-[var(--muted-foreground)] mt-2">
                {selectedColor.label}
              </p>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)] mb-2.5">
              Tags
              <span className="normal-case font-normal ml-1.5 opacity-50">— Enter or , to add · {tags.length}/10</span>
            </p>
            <div
              className="flex flex-wrap gap-1.5 bg-[var(--input)] border border-[var(--border)] rounded-xl px-3 py-2.5 min-h-[44px] cursor-text transition-all duration-200"
              style={{ '--focus-within-ring': '0 0 0 3px rgba(var(--primary-rgb), 0.12)' } as React.CSSProperties}
            >
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: 'rgba(var(--primary-rgb), 0.12)', color: 'rgb(var(--primary-rgb))' }}
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="opacity-60 hover:opacity-100 transition-opacity ml-0.5"
                    disabled={isLoading}
                  >
                    <MdClose size={11} />
                  </button>
                </span>
              ))}
              <input
                className="flex-1 min-w-[80px] bg-transparent text-[var(--foreground)] placeholder-[var(--muted-foreground)] text-sm focus:outline-none py-0.5"
                placeholder={tags.length === 0 ? 'productivity, work, ideas…' : ''}
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                disabled={isLoading || tags.length >= 10}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-[var(--border)] bg-[var(--surface)] rounded-b-2xl">
          <button className="app-btn-secondary flex-1" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button className="app-btn-primary flex-1 justify-center" onClick={onSave} disabled={isLoading}>
            {isLoading
              ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : isNew ? 'Create Note' : 'Save Changes'
            }
          </button>
        </div>
      </div>
    </div>
  );
};
