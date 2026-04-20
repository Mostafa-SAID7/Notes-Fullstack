import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Note from './Note';
import type { Note as NoteType } from '../types/note';

const mockNote: NoteType = { id: 1, title: 'Test Note', desc: 'Test description' };

describe('Note component', () => {
  it('renders title and description', () => {
    render(<Note note={mockNote} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('opens menu on button click', () => {
    render(<Note note={mockNote} onEdit={vi.fn()} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByLabelText('Note options'));
    expect(screen.getByText('✏️ Edit')).toBeInTheDocument();
    expect(screen.getByText('🗑️ Delete')).toBeInTheDocument();
  });

  it('calls onEdit with correct args', () => {
    const onEdit = vi.fn();
    render(<Note note={mockNote} onEdit={onEdit} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByLabelText('Note options'));
    fireEvent.click(screen.getByText('✏️ Edit'));
    expect(onEdit).toHaveBeenCalledWith(1, 'Test Note', 'Test description');
  });

  it('calls onDelete with correct id', () => {
    const onDelete = vi.fn();
    render(<Note note={mockNote} onEdit={vi.fn()} onDelete={onDelete} />);
    fireEvent.click(screen.getByLabelText('Note options'));
    fireEvent.click(screen.getByText('🗑️ Delete'));
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
