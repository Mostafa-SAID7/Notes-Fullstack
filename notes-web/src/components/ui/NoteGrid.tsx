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
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance]">
      {notes.map(note => (
        <div key={note.id} className="break-inside-avoid mb-4">
          <Note
            note={note}
            onEdit={onEdit}
            onDelete={onDelete}
            onPin={onPin}
          />
        </div>
      ))}
    </div>
  );
};
