import type { Note, CreateNoteRequest, UpdateNoteRequest, PinNoteRequest, ApiError } from '../types/note';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/notes';

if (import.meta.env.DEV) {
  console.log('[API] Base URL:', API_BASE);
}

const parseError = async (response: Response): Promise<ApiError> => {
  try {
    return await response.json();
  } catch {
    return {
      statusCode: response.status,
      message: response.statusText || 'An error occurred',
      timestamp: new Date().toISOString(),
    };
  }
};

export const getAllNotes = async (): Promise<Note[]> => {
  try {
    const response = await fetch(API_BASE);
    if (!response.ok) throw await parseError(response);
    return response.json();
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
      console.error('[API] Connection Error: Cannot reach API at', API_BASE);
    }
    throw err;
  }
};

export const getNoteById = async (id: number): Promise<Note> => {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) throw await parseError(response);
  return response.json();
};

export const createNote = async (request: CreateNoteRequest): Promise<Note> => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw await parseError(response);
  return response.json();
};

export const updateNote = async (request: UpdateNoteRequest): Promise<Note> => {
  const response = await fetch(API_BASE, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw await parseError(response);
  return response.json();
};

export const pinNote = async (id: number, request: PinNoteRequest): Promise<Note> => {
  const response = await fetch(`${API_BASE}/${id}/pin`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw await parseError(response);
  return response.json();
};

export const deleteNote = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw await parseError(response);
};

export type { Note, CreateNoteRequest, UpdateNoteRequest, ApiError } from '../types/note';
