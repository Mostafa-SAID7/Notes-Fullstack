import { useState, useCallback } from 'react';
import type { NoteColor } from '../types/note';

export interface NoteFormState {
  id: number;
  title: string;
  desc: string;
  color: NoteColor;
  tags: string[];
}

export interface ValidationErrors {
  [key: string]: string[];
}

export const useNoteForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState<NoteFormState>({
    id: 0,
    title: '',
    desc: '',
    color: 'default',
    tags: [],
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const openForCreate = useCallback(() => {
    setFormState({ id: 0, title: '', desc: '', color: 'default', tags: [] });
    setValidationErrors({});
    setIsOpen(true);
  }, []);

  const openForEdit = useCallback((
    id: number,
    title: string,
    desc: string,
    color: NoteColor,
    tags: string[],
  ) => {
    setFormState({ id, title, desc, color, tags });
    setValidationErrors({});
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setFormState({ id: 0, title: '', desc: '', color: 'default', tags: [] });
    setValidationErrors({});
  }, []);

  const updateTitle = useCallback((title: string) => {
    setFormState(prev => ({ ...prev, title }));
  }, []);

  const updateDesc = useCallback((desc: string) => {
    setFormState(prev => ({ ...prev, desc }));
  }, []);

  const updateColor = useCallback((color: NoteColor) => {
    setFormState(prev => ({ ...prev, color }));
  }, []);

  const updateTags = useCallback((tags: string[]) => {
    setFormState(prev => ({ ...prev, tags }));
  }, []);

  const setErrors = useCallback((errors: ValidationErrors) => {
    setValidationErrors(errors);
  }, []);

  const clearErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    if (!formState.title.trim()) errors.Title = ['Title is required'];
    if (!formState.desc.trim()) errors.Desc = ['Description is required'];
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return false;
    }
    return true;
  };

  return {
    isOpen,
    formState,
    validationErrors,
    openForCreate,
    openForEdit,
    close,
    updateTitle,
    updateDesc,
    updateColor,
    updateTags,
    setErrors,
    clearErrors,
    validateForm,
  };
};
