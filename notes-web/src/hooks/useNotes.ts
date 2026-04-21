import { useState, useCallback } from 'react';
import type { Note as NoteType } from '../types/note';
import * as api from '../services/api';

/**
 * Custom hook for managing notes state and operations
 * Handles: loading, errors, CRUD operations
 */
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

  const createNoteAsync = useCallback(async (title: string, desc: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await api.createNote({ title, desc });
      await loadNotes();
    } catch (err) {
      const apiError = err as api.ApiError;
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [loadNotes]);

  const updateNoteAsync = useCallback(async (id: number, title: string, desc: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await api.updateNote({ id, title, desc });
      await loadNotes();
    } catch (err) {
      const apiError = err as api.ApiError;
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [loadNotes]);

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
    deleteNoteAsync,
    clearError,
  };
};
