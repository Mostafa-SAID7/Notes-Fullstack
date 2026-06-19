import React, { useState } from 'react';
import type { Note as NoteType } from '../types/note';
import { NOTE_COLORS } from '../types/note';
import { formatDate } from '../utils/dateFormatter';
import { MdEdit, MdDelete, MdPushPin, MdOutlinePushPin } from 'react-icons/md';

interface NoteProps {
  note: NoteType;
  onEdit: (note: NoteType) => void;
  onDelete: (id: number) => void;
  onPin: (id: number, isPinned: boolean) => void;
}

const ACCENT_COLORS: Record<string, string> = {
  default: 'bg-slate-500',
  yellow:  'bg-yellow-400',
  green:   'bg-emerald-500',
  blue:    'bg-blue-500',
  red:     'bg-red-500',
  purple:  'bg-purple-500',
  orange:  'bg-orange-400',
  pink:    'bg-pink-400',
  brown:   'bg-amber-700',
};

const wordCount = (t: string) => t.trim() ? t.trim().split(/\s+/).length : 0;

export const Note: React.FC<NoteProps> = ({ note, onEdit, onDelete, onPin }) => {
  const colorConfig = NOTE_COLORS.find(c => c.value === note.color) ?? NOTE_COLORS[0];
  const accent = ACCENT_COLORS[note.color] ?? 'bg-slate-500';

  return (
    <div
      onClick={() => onEdit(note)}
      className={`
        group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer
        border border-[var(--border)] shadow-sm
        hover:shadow-lg hover:-translate-y-0.5 hover:border-[rgba(var(--primary-rgb),0.25)]
        transition-all duration-200 ease-out
        ${colorConfig.bg}
      `}
    >
      <div className={`h-1 w-full flex-shrink-0 ${accent} opacity-90`} />

      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <div className="flex items-start justify-between gap-1.5">
          <h3 className="text-sm font-semibold text-[var(--foreground)] leading-snug line-clamp-2 flex-1 min-w-0">
            {note.title}
          </h3>
          <button
            onClick={e => { e.stopPropagation(); onPin(note.id, !note.isPinned); }}
            title={note.isPinned ? 'Unpin' : 'Pin'}
            className={`
              flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-lg
              transition-all duration-150
              ${note.isPinned
                ? 'text-amber-400 bg-amber-400/10'
                : 'text-transparent group-hover:text-[var(--muted-foreground)] hover:!text-amber-400 hover:bg-amber-400/10'
              }
            `}
          >
            {note.isPinned ? <MdPushPin size={14} /> : <MdOutlinePushPin size={14} />}
          </button>
        </div>

        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed line-clamp-5 whitespace-pre-line flex-1">
          {note.desc}
        </p>

        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {note.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                style={{
                  background: 'rgba(var(--primary-rgb), 0.1)',
                  color: 'rgb(var(--primary-rgb))',
                }}
              >
                #{tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--muted-foreground)]">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="px-4 pb-3 flex items-center justify-between gap-2">
        <span className="text-[10px] text-[var(--muted-foreground)] opacity-50 truncate select-none">
          {formatDate(note.updatedAt)} · {wordCount(note.desc)}w
        </span>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={e => { e.stopPropagation(); onEdit(note); }}
            title="Edit"
            className="w-6 h-6 flex items-center justify-center rounded-lg text-[var(--muted-foreground)] hover:text-[rgb(var(--primary-rgb))] hover:bg-[var(--surface-2)] transition-colors"
          >
            <MdEdit size={13} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDelete(note.id); }}
            title="Delete"
            className="w-6 h-6 flex items-center justify-center rounded-lg text-[var(--muted-foreground)] hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <MdDelete size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
