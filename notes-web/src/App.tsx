import { useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { ErrorBanner } from './components/layout/ErrorBanner';
import { Header } from './components/layout/Header';
import { LoadingState } from './components/ui/LoadingState';
import { EmptyState } from './components/ui/EmptyState';
import { NoteGrid } from './components/ui/NoteGrid';
import { NoteModal } from './components/NoteModal';
import { useNotes } from './hooks/useNotes';
import { useSearch } from './hooks/useSearch';
import { useNoteForm } from './hooks/useNoteForm';
import { isValidationError, extractValidationErrors } from './utils/validation';
import './App.css';

/**
 * App component - Main application container
 * Responsibilities: Orchestrate hooks, manage data flow, render layout
 */
function App() {
  const notes = useNotes();
  const search = useSearch(notes.notes);
  const form = useNoteForm();

  // Load notes on mount
  useEffect(() => {
    notes.loadNotes();
  }, []);

  const handleCreateClick = () => {
    form.openForCreate();
  };

  const handleEditClick = (id: number, title: string, desc: string) => {
    form.openForEdit(id, title, desc);
  };

  const handleDeleteClick = async (id: number) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await notes.deleteNoteAsync(id);
    } catch (err) {
      const apiError = err as any;
      if (isValidationError(apiError)) {
        form.setErrors(extractValidationErrors(apiError) || {});
      } else {
        notes.error || 'Failed to delete note';
      }
    }
  };

  const handleSaveNote = async () => {
    if (!form.validateForm()) return;

    try {
      if (form.formState.id === 0) {
        await notes.createNoteAsync(form.formState.title, form.formState.desc);
      } else {
        await notes.updateNoteAsync(
          form.formState.id,
          form.formState.title,
          form.formState.desc,
        );
      }
      form.close();
    } catch (err) {
      const apiError = err as any;
      if (isValidationError(apiError)) {
        form.setErrors(extractValidationErrors(apiError) || {});
      }
    }
  };

  const isLoading = notes.loading;
  const hasNotes = search.filteredNotes.length > 0;

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Navbar
        search={search.search}
        onSearchChange={search.handleSearch}
        onCreateClick={handleCreateClick}
        isLoading={isLoading}
      />

      <ErrorBanner
        message={notes.error}
        onClose={notes.clearError}
      />

      <main className="container mx-auto px-6 py-10">
        <Header
          totalCount={search.filteredNotes.length}
          searchTerm={search.search}
        />

        {isLoading && !hasNotes ? (
          <LoadingState />
        ) : hasNotes ? (
          <NoteGrid
            notes={search.filteredNotes}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        ) : (
          <EmptyState
            onCreateClick={handleCreateClick}
            isLoading={isLoading}
          />
        )}
      </main>

      <NoteModal
        isOpen={form.isOpen}
        isNew={form.formState.id === 0}
        title={form.formState.title}
        desc={form.formState.desc}
        validationErrors={form.validationErrors}
        isLoading={isLoading}
        onTitleChange={form.updateTitle}
        onDescChange={form.updateDesc}
        onSave={handleSaveNote}
        onClose={form.close}
      />
    </div>
  );
}

export default App;
