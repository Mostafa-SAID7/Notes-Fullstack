import React, { useState } from 'react';
import type { Note as NoteType } from '../types/note';
import { NOTE_COLORS } from '../types/note';
import { NoteMenu } from './NoteMenu';
import { formatDate } from '../utils/dateFormatter';
import { BsPinFill } from 'react-icons/bs';

interface NoteProps {
  note: NoteType;
  onEdit: (note: NoteType) => void;
  onDelete: (id: number) => void;
  onPin: (id: number, isPinned: boolean) => void;
}

export const Note: React.FC<NoteProps> = ({ note, onEdit, onDelete, onPin }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const colorConfig = NOTE_COLORS.find(c => c.value === note.color) ?? NOTE_COLORS[0];

  const handleEdit = () => {
    setMenuOpen(false);
    onEdit(note);
  };

  const handleDelete = () => {
    setMenuOpen(false);
    onDelete(note.id);
  };

  const handlePin = () => {
    setMenuOpen(false);
    onPin(note.id, !note.isPinned);
  };

  return (
    <div className={`${colorConfig.bg} border ${colorConfig.border} rounded-xl p-5 flex flex-col gap-3 shadow-md hover:shadow-lg transition-all duration-300 relative`}>
      {note.isPinned && (
        <div className="absolute top-3 right-10 text-yellow-400" title="Pinned">
          <BsPinFill size={13} />
        </div>
      )}

      <div className="flex items-start justify-between gap-2 min-w-0">
        <h3 className="text-base font-semibold text-foreground leading-snug truncate flex-1 pr-1">
          {note.title}
        </h3>
        <div className="flex-shrink-0 relative">
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-150"
            aria-label="Note options"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>

          {menuOpen && (
            <NoteMenu
              isPinned={note.isPinned}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPin={handlePin}
              onClose={() => setMenuOpen(false)}
            />
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-4 whitespace-pre-line">
        {note.desc}
      </p>

      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {note.tags.map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground/60 mt-1">
        {formatDate(note.updatedAt)}
      </p>
    </div>
  );
};
