import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

const mockNotes = [
  { id: 1, title: 'First Note', desc: 'First description' },
  { id: 2, title: 'Second Note', desc: 'Second description' },
];

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    json: () => Promise.resolve(mockNotes),
  }));
});

describe('App', () => {
  it('renders the navbar title', async () => {
    render(<App />);
    expect(screen.getByText('📝 Notes App')).toBeInTheDocument();
  });

  it('loads and displays notes', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('First Note')).toBeInTheDocument();
      expect(screen.getByText('Second Note')).toBeInTheDocument();
    });
  });

  it('filters notes by search', async () => {
    render(<App />);
    await waitFor(() => screen.getByText('First Note'));
    fireEvent.change(screen.getByPlaceholderText('Search notes...'), {
      target: { value: 'First' },
    });
    expect(screen.getByText('First Note')).toBeInTheDocument();
    expect(screen.queryByText('Second Note')).not.toBeInTheDocument();
  });

  it('opens modal on New Note click', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('+ New Note'));
    expect(screen.getByText('New Note')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
  });

  it('closes modal on Cancel', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('+ New Note'));
    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Title')).not.toBeInTheDocument();
    });
  });
});
