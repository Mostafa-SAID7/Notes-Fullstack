import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';
import { ThemeProvider } from '../../context/ThemeContext';
import * as api from '../../services/api';

vi.mock('../../services/api');
vi.mock('sonner', () => ({
  Toaster: () => null,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockNotes = [
  { id: 1, title: 'Existing Note', desc: 'Existing description', createdDate: '2024-04-21T10:00:00Z' },
];

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(api.getAllNotes).mockResolvedValue(mockNotes);
});

describe('Notes Workflow Integration', () => {
  it('complete create note workflow', async () => {
    const newNote = {
      id: 2,
      title: 'New Note',
      desc: 'New description',
      createdDate: '2024-04-21T11:00:00Z',
    };

    vi.mocked(api.createNote).mockResolvedValue(newNote);
    vi.mocked(api.getAllNotes).mockResolvedValueOnce(mockNotes).mockResolvedValueOnce([...mockNotes, newNote]);

    renderWithTheme(<App />);

    // Wait for initial load
    await waitFor(() => expect(screen.getByText('Existing Note')).toBeInTheDocument());

    // Open modal
    fireEvent.click(screen.getByText('New Note'));
    await waitFor(() => expect(screen.getByPlaceholderText('Title')).toBeInTheDocument());

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'New Note' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'New description' } });

    // Submit
    fireEvent.click(screen.getByText('Save Note'));

    // Verify API call
    await waitFor(() => {
      expect(api.createNote).toHaveBeenCalledWith({
        title: 'New Note',
        desc: 'New description',
      });
    });
  });

  it('complete update note workflow', async () => {
    const updatedNote = {
      id: 1,
      title: 'Updated Note',
      desc: 'Updated description',
      createdDate: '2024-04-21T10:00:00Z',
    };

    vi.mocked(api.updateNote).mockResolvedValue(updatedNote);
    vi.mocked(api.getAllNotes).mockResolvedValueOnce(mockNotes).mockResolvedValueOnce([updatedNote]);

    renderWithTheme(<App />);

    // Wait for initial load
    await waitFor(() => expect(screen.getByText('Existing Note')).toBeInTheDocument());

    // Open menu and click edit
    const buttons = screen.getAllByLabelText('Note options');
    fireEvent.click(buttons[0]); // Click first note's menu button
    fireEvent.click(screen.getByText('Edit'));

    // Modal should open with existing data
    await waitFor(() => expect(screen.getByDisplayValue('Existing Note')).toBeInTheDocument());

    // Update fields
    fireEvent.change(screen.getByDisplayValue('Existing Note'), { target: { value: 'Updated Note' } });
    fireEvent.change(screen.getByDisplayValue('Existing description'), { target: { value: 'Updated description' } });

    // Submit
    fireEvent.click(screen.getByText('Save Note'));

    // Verify API call
    await waitFor(() => {
      expect(api.updateNote).toHaveBeenCalledWith({
        id: 1,
        title: 'Updated Note',
        desc: 'Updated description',
      });
    });
  });

  it('complete delete note workflow with confirmation', async () => {
    vi.mocked(api.deleteNote).mockResolvedValue(undefined);
    vi.mocked(api.getAllNotes).mockResolvedValueOnce(mockNotes).mockResolvedValueOnce([]);

    renderWithTheme(<App />);

    // Wait for initial load
    await waitFor(() => expect(screen.getByText('Existing Note')).toBeInTheDocument());

    // Open menu and click delete
    const buttons = screen.getAllByLabelText('Note options');
    fireEvent.click(buttons[0]); // Click first note's menu button
    fireEvent.click(screen.getByText('Delete'));

    // Confirmation modal should appear
    await waitFor(() => expect(screen.getByText('Delete Note')).toBeInTheDocument());

    // Confirm delete
    fireEvent.click(screen.getByText('Delete'));

    // Verify API call
    await waitFor(() => {
      expect(api.deleteNote).toHaveBeenCalledWith(1);
    });
  });
});

