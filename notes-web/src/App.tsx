import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
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
import { useAuth } from './context/AuthContext';
import { isValidationError, extractValidationErrors } from './utils/validation';
import type { Note } from './types/note';
import type { SidebarView } from './components/layout/Sidebar';
import './App.css';

function App() {
  const { theme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const notes = useNotes();
  const search = useSearch(notes.notes);
  const form = useNoteForm();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState<SidebarView>('all');
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: number }>({
    isOpen: false, id: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    notes.loadNotes();
  }, [isAuthenticated]);

  const handleViewChange = useCallback((view: SidebarView, tag?: string) => {
    setSidebarView(view);
    if (view === 'pinned') search.handleTagFilter(null);
    if (view === 'tag' && tag) search.handleTagFilter(tag);
    if (view === 'all') search.handleTagFilter(null);
  }, [search]);

  const handleCreateClick = () => form.openForCreate();
  const handleEditClick = (note: Note) =>
    form.openForEdit(note.id, note.title, note.desc, note.color, note.tags);
  const handleDeleteClick = (id: number) => setConfirmDelete({ isOpen: true, id });

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
      if (apiError?.statusCode === 401) { logout(); navigate('/login'); return; }
      toast.error(notes.error || 'Failed to delete note');
    }
  };

  const handleSaveNote = async () => {
    if (!form.validateForm()) return;
    try {
      if (form.formState.id === 0) {
        await notes.createNoteAsync(
          form.formState.title, form.formState.desc,
          form.formState.color, form.formState.tags,
        );
        toast.success('Note created');
      } else {
        await notes.updateNoteAsync(
          form.formState.id, form.formState.title, form.formState.desc,
          form.formState.color, form.formState.tags,
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

  const displayNotes = sidebarView === 'pinned'
    ? search.filteredNotes.filter(n => n.isPinned)
    : search.filteredNotes;

  const isLoading = notes.loading;
  const hasNotes = displayNotes.length > 0;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col">
      <Toaster position="top-right" theme={theme} richColors closeButton />

      <Navbar
        search={search.search}
        onSearchChange={search.handleSearch}
        onCreateClick={handleCreateClick}
        onMenuToggle={() => setSidebarOpen(o => !o)}
        isLoading={isLoading}
      />

      <div className="flex flex-1 min-h-0">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          view={sidebarView}
          activeTag={search.activeTag}
          allTags={search.allTags}
          sort={search.sort}
          onViewChange={handleViewChange}
          onSortChange={search.handleSort}
          onCreateClick={handleCreateClick}
          totalCount={notes.notes.length}
          pinnedCount={notes.notes.filter(n => n.isPinned).length}
        />

        <main className="flex-1 overflow-y-auto">
          <ErrorBanner message={notes.error} onClose={notes.clearError} />

          <div className="container mx-auto px-4 sm:px-6 py-8 max-w-6xl">
            <Header
              totalCount={displayNotes.length}
              searchTerm={search.search}
              activeTag={sidebarView === 'tag' ? search.activeTag : null}
              viewLabel={sidebarView === 'pinned' ? 'Pinned Notes' : 'My Notes'}
            />

            {isLoading && !hasNotes ? (
              <LoadingState />
            ) : hasNotes ? (
              <NoteGrid
                notes={displayNotes}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onPin={handlePinClick}
              />
            ) : (
              <EmptyState onCreateClick={handleCreateClick} isLoading={isLoading} />
            )}
          </div>
        </main>
      </div>

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
