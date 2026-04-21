import { useState, useCallback } from 'react';

export interface NoteFormState {
  id: number;
  title: string;
  desc: string;
}

export interface ValidationErrors {
  [key: string]: string[];
}

/**
 * Custom hook for managing note form state
 * Handles: form fields, validation errors, modal state
 */
export const useNoteForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState<NoteFormState>({
    id: 0,
    title: '',
    desc: '',
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const openForCreate = useCallback(() => {
    setFormState({ id: 0, title: '', desc: '' });
    setValidationErrors({});
    setIsOpen(true);
  }, []);

  const openForEdit = useCallback((id: number, title: string, desc: string) => {
    setFormState({ id, title, desc });
    setValidationErrors({});
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setFormState({ id: 0, title: '', desc: '' });
    setValidationErrors({});
  }, []);

  const updateTitle = useCallback((title: string) => {
    setFormState(prev => ({ ...prev, title }));
  }, []);

  const updateDesc = useCallback((desc: string) => {
    setFormState(prev => ({ ...prev, desc }));
  }, []);

  const setErrors = useCallback((errors: ValidationErrors) => {
    setValidationErrors(errors);
  }, []);

  const clearErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formState.title.trim()) {
      errors.Title = ['Title is required'];
    }

    if (!formState.desc.trim()) {
      errors.Desc = ['Description is required'];
    }

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
    setErrors,
    clearErrors,
    validateForm,
  };
};
