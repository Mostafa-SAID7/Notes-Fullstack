import React from 'react';
import { Note } from '../Note';
import type { Note as NoteType } from '../../types/note';

interface NoteGridProps {
  notes: NoteType[];
  onEdit: (note: NoteType) => void;
  onDelete: (id: number) => void;
  onPin: (id: number, isPinned: boolean) => void;
}

export const NoteGrid: React.FC<NoteGridProps> = ({ notes, onEdit, onDelete, onPin }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {notes.map(note => (
        <Note
          key={note.id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
          onPin={onPin}
        />
      ))}
    </div>
  );
};
