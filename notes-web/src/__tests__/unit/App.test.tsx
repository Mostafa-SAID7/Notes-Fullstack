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
  { id: 1, title: 'First Note', desc: 'First description', createdDate: '2024-04-21T10:00:00Z' },
  { id: 2, title: 'Second Note', desc: 'Second description', createdDate: '2024-04-20T10:00:00Z' },
];

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(api.getAllNotes).mockResolvedValue(mockNotes);
});

describe('App', () => {
  it('renders the navbar title', async () => {
    renderWithTheme(<App />);
    expect(screen.getByText('Notes App')).toBeInTheDocument();
  });

  it('loads and displays notes', async () => {
    renderWithTheme(<App />);
    await waitFor(() => {
      expect(screen.getByText('First Note')).toBeInTheDocument();
      expect(screen.getByText('Second Note')).toBeInTheDocument();
    });
  });

  it('filters notes by search', async () => {
    renderWithTheme(<App />);
    await waitFor(() => screen.getByText('First Note'));
    fireEvent.change(screen.getByPlaceholderText('Search...'), {
      target: { value: 'First' },
    });
    expect(screen.getByText('First Note')).toBeInTheDocument();
    expect(screen.queryByText('Second Note')).not.toBeInTheDocument();
  });

  it('opens modal on New Note click', async () => {
    renderWithTheme(<App />);
    await waitFor(() => screen.getByText('First Note'));
    const buttons = screen.getAllByText('New Note');
    fireEvent.click(buttons[0]); // Click the navbar button, not the modal title
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    });
  });

  it('closes modal on Cancel', async () => {
    renderWithTheme(<App />);
    await waitFor(() => screen.getByText('First Note'));
    fireEvent.click(screen.getByText('New Note'));
    await waitFor(() => screen.getByPlaceholderText('Title'));
    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Title')).not.toBeInTheDocument();
    });
  });

  it('shows validation error for empty title', async () => {
    renderWithTheme(<App />);
    await waitFor(() => screen.getByText('First Note'));
    fireEvent.click(screen.getByText('New Note'));
    await waitFor(() => screen.getByPlaceholderText('Description'));
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'Some description' },
    });
    fireEvent.click(screen.getByText('Save Note'));
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  it('calls createNote on save for new note', async () => {
    vi.mocked(api.createNote).mockResolvedValue({
      id: 3,
      title: 'New Note',
      desc: 'New description',
      createdDate: '2024-04-21T10:00:00Z',
    });

    renderWithTheme(<App />);
    await waitFor(() => screen.getByText('First Note'));
    fireEvent.click(screen.getByText('New Note'));
    await waitFor(() => screen.getByPlaceholderText('Title'));
    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'New Note' },
    });
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'New description' },
    });
    fireEvent.click(screen.getByText('Save Note'));

    await waitFor(() => {
      expect(api.createNote).toHaveBeenCalledWith({
        title: 'New Note',
        desc: 'New description',
      });
    });
  });

  it('displays error message on API failure', async () => {
    vi.mocked(api.getAllNotes).mockRejectedValue({
      statusCode: 500,
      message: 'Server error',
      timestamp: new Date().toISOString(),
    });

    renderWithTheme(<App />);
    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });
  });

  it('opens confirmation modal on delete click', async () => {
    renderWithTheme(<App />);
    await waitFor(() => screen.getByText('First Note'));
    const buttons = screen.getAllByLabelText('Note options');
    fireEvent.click(buttons[0]); // Click first note's menu button
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => {
      expect(screen.getByText('Delete Note')).toBeInTheDocument();
    });
  });

  it('closes confirmation modal on cancel', async () => {
    renderWithTheme(<App />);
    await waitFor(() => screen.getByText('First Note'));
    const buttons = screen.getAllByLabelText('Note options');
    fireEvent.click(buttons[0]); // Click first note's menu button
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => screen.getByText('Delete Note'));
    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByText('Delete Note')).not.toBeInTheDocument();
    });
  });
});

