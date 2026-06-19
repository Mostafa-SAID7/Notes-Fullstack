import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Navbar } from './components/layout/Navbar';
import { ErrorBanner } from './components/layout/ErrorBanner';
import { Header } from './components/layout/Header';
import { LoadingState } from './components/ui/LoadingState';
import { EmptyState } from './components/ui/EmptyState';
import { NoteGrid } from './components/ui/NoteGrid';
import { ConfirmationModal } from './components/ui/ConfirmationModal';
import { NoteModal } from './components/NoteModal';
import { useNotes } from './hooks/useNotes';
import { useSearch } from './hooks/useSearch';
import { useNoteForm } from './hooks/useNoteForm';
import { useTheme } from './context/ThemeContext';
import { isValidationError, extractValidationErrors } from './utils/validation';
import type { Note } from './types/note';
import './App.css';

function App() {
  const { theme } = useTheme();
  const notes = useNotes();
  const search = useSearch(notes.notes);
  const form = useNoteForm();
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: number }>({
    isOpen: false,
    id: 0,
  });

  useEffect(() => {
    notes.loadNotes();
  }, []);

  const handleCreateClick = () => form.openForCreate();

  const handleEditClick = (note: Note) => {
    form.openForEdit(note.id, note.title, note.desc, note.color, note.tags);
  };

  const handleDeleteClick = (id: number) => {
    setConfirmDelete({ isOpen: true, id });
  };

  const handlePinClick = async (id: number, isPinned: boolean) => {
    await notes.pinNoteAsync(id, isPinned);
    toast.success(isPinned ? 'Note pinned' : 'Note unpinned');
  };

  const handleConfirmDelete = async () => {
    try {
      await notes.deleteNoteAsync(confirmDelete.id);
      toast.success('Note deleted');
      setConfirmDelete({ isOpen: false, id: 0 });
    } catch (err) {
      const apiError = err as any;
      if (isValidationError(apiError)) {
        form.setErrors(extractValidationErrors(apiError) || {});
      } else {
        toast.error(notes.error || 'Failed to delete note');
      }
    }
  };

  const handleSaveNote = async () => {
    if (!form.validateForm()) return;

    try {
      if (form.formState.id === 0) {
        await notes.createNoteAsync(
          form.formState.title,
          form.formState.desc,
          form.formState.color,
          form.formState.tags,
        );
        toast.success('Note created');
      } else {
        await notes.updateNoteAsync(
          form.formState.id,
          form.formState.title,
          form.formState.desc,
          form.formState.color,
          form.formState.tags,
        );
        toast.success('Note updated');
      }
      form.close();
    } catch (err) {
      const apiError = err as any;
      if (isValidationError(apiError)) {
        form.setErrors(extractValidationErrors(apiError) || {});
        toast.error('Validation failed');
      } else {
        toast.error('Failed to save note');
      }
    }
  };

  const isLoading = notes.loading;
  const hasNotes = search.filteredNotes.length > 0;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Toaster position="top-right" theme={theme} richColors closeButton />

      <Navbar
        search={search.search}
        sort={search.sort}
        onSearchChange={search.handleSearch}
        onSortChange={search.handleSort}
        onCreateClick={handleCreateClick}
        isLoading={isLoading}
      />

      <ErrorBanner message={notes.error} onClose={notes.clearError} />

      <main className="container mx-auto px-4 sm:px-6 py-10">
        <Header
          totalCount={search.filteredNotes.length}
          searchTerm={search.search}
          activeTag={search.activeTag}
          allTags={search.allTags}
          onTagFilter={search.handleTagFilter}
        />

        {isLoading && !hasNotes ? (
          <LoadingState />
        ) : hasNotes ? (
          <NoteGrid
            notes={search.filteredNotes}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onPin={handlePinClick}
          />
        ) : (
          <EmptyState onCreateClick={handleCreateClick} isLoading={isLoading} />
        )}
      </main>

      <NoteModal
        isOpen={form.isOpen}
        isNew={form.formState.id === 0}
        title={form.formState.title}
        desc={form.formState.desc}
        color={form.formState.color}
        tags={form.formState.tags}
        validationErrors={form.validationErrors}
        isLoading={isLoading}
        onTitleChange={form.updateTitle}
        onDescChange={form.updateDesc}
        onColorChange={form.updateColor}
        onTagsChange={form.updateTags}
        onSave={handleSaveNote}
        onClose={form.close}
      />

      <ConfirmationModal
        isOpen={confirmDelete.isOpen}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        isLoading={isLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete({ isOpen: false, id: 0 })}
      />
    </div>
  );
}

export default App;
