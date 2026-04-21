import { useState, useCallback, useMemo } from 'react';
import type { Note as NoteType } from '../types/note';

/**
 * Custom hook for search/filter functionality
 * Handles: search state, filtering logic
 */
export const useSearch = (notes: NoteType[]) => {
  const [search, setSearch] = useState('');

  const filteredNotes = useMemo(() => {
    if (!search.trim()) return notes;

    return notes.filter(note =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.desc.toLowerCase().includes(search.toLowerCase()),
    );
  }, [notes, search]);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearch('');
  }, []);

  return {
    search,
    filteredNotes,
    handleSearch,
    clearSearch,
  };
};
