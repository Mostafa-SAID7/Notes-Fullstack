import { useState, useCallback } from 'react';
import type { Note as NoteType, NoteColor } from '../types/note';
import * as api from '../services/api';

export const useNotes = () => {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAllNotes();
      setNotes(data);
    } catch (err) {
      const apiError = err as api.ApiError;
      setError(apiError.message || 'Failed to load notes');
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNoteAsync = useCallback(async (
    title: string,
    desc: string,
    color: NoteColor,
    tags: string[],
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await api.createNote({ title, desc, color, tags });
      await loadNotes();
    } catch (err) {
      const apiError = err as api.ApiError;
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [loadNotes]);

  const updateNoteAsync = useCallback(async (
    id: number,
    title: string,
    desc: string,
    color: NoteColor,
    tags: string[],
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await api.updateNote({ id, title, desc, color, tags });
      await loadNotes();
    } catch (err) {
      const apiError = err as api.ApiError;
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [loadNotes]);

  const pinNoteAsync = useCallback(async (id: number, isPinned: boolean): Promise<void> => {
    setError(null);
    try {
      const updated = await api.pinNote(id, { isPinned });
      setNotes(prev =>
        prev
          .map(n => n.id === id ? updated : n)
          .sort((a, b) => {
            if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          })
      );
    } catch (err) {
      const apiError = err as api.ApiError;
      setError(apiError.message || 'Failed to update pin');
    }
  }, []);

  const deleteNoteAsync = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await api.deleteNote(id);
      await loadNotes();
    } catch (err) {
      const apiError = err as api.ApiError;
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [loadNotes]);

  const clearError = useCallback(() => setError(null), []);

  return {
    notes,
    loading,
    error,
    loadNotes,
    createNoteAsync,
    updateNoteAsync,
    pinNoteAsync,
    deleteNoteAsync,
    clearError,
  };
};
