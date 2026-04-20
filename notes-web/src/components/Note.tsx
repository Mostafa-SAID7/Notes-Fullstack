import { useState } from 'react';
import type { Note as NoteType } from '../types/note';

interface NoteProps {
  note: NoteType;
  onEdit: (id: number, title: string, desc: string) => void;
  onDelete: (id: number) => void;
}

function Note({ note, onEdit, onDelete }: NoteProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="note-card relative">
      <h3 className="note-card-title">{note.title}</h3>
      <p className="note-card-desc line-clamp-4">{note.desc}</p>

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
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 bottom-8 z-20 bg-[#1E293B] border border-[rgba(59,130,246,0.25)] rounded-xl shadow-xl shadow-blue-950/40 overflow-hidden min-w-[120px]">
              <button
                className="w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-blue-600/20 hover:text-blue-300 transition-colors duration-150"
                onClick={() => { setMenuOpen(false); onEdit(note.id, note.title, note.desc); }}
              >
                ✏️ Edit
              </button>
              <button
                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-150"
                onClick={() => { setMenuOpen(false); onDelete(note.id); }}
              >
                🗑️ Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Note;
