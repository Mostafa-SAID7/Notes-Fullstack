import React, { useState } from 'react';
import type { Note as NoteType } from '../types/note';
import { NoteMenu } from './NoteMenu';
import { formatDate } from '../utils/dateFormatter';

interface NoteProps {
  note: NoteType;
  onEdit: (id: number, title: string, desc: string) => void;
  onDelete: (id: number) => void;
}

/**
 * Note component - Individual note card
 * Responsibilities: Display note content, menu, actions
 */
export const Note: React.FC<NoteProps> = ({ note, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleEdit = () => {
    setMenuOpen(false);
    onEdit(note.id, note.title, note.desc);
  };

  const handleDelete = () => {
    setMenuOpen(false);
    onDelete(note.id);
  };

  return (
    <div className="note-card relative">
      <h3 className="note-card-title">{note.title}</h3>
      <p className="note-card-desc line-clamp-4">{note.desc}</p>
      <p className="text-xs text-slate-500 mt-2">{formatDate(note.createdDate)}</p>

      <div className="flex justify-end mt-1 relative">
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors duration-150"
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
            onEdit={handleEdit}
            onDelete={handleDelete}
            onClose={() => setMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
};
