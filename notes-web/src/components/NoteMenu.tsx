import React, { useEffect, useRef } from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';

interface NoteMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

/**
 * NoteMenu component - Dropdown menu for note actions
 * Responsibilities: Display edit/delete options, handle clicks
 */
export const NoteMenu: React.FC<NoteMenuProps> = ({ onEdit, onDelete, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div
        ref={menuRef}
        className="absolute right-0 bottom-8 z-20 bg-[#1E293B] border border-[rgba(59,130,246,0.25)] rounded-xl shadow-xl shadow-blue-950/40 overflow-hidden min-w-[120px]"
      >
        <button
          className="w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-blue-600/20 hover:text-blue-300 transition-colors duration-150 flex items-center gap-2"
          onClick={onEdit}
        >
          <MdEdit size={16} />
          Edit
        </button>
        <button
          className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-150 flex items-center gap-2"
          onClick={onDelete}
        >
          <MdDelete size={16} />
          Delete
        </button>
      </div>
    </>
  );
};
