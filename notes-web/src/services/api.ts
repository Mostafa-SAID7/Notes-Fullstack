import type { Note, CreateNoteRequest, UpdateNoteRequest, PinNoteRequest, ApiError } from '../types/note';

const API_BASE = (import.meta.env.VITE_API_BASE ?? 'http://localhost:8000/api');
const NOTES_URL = `${API_BASE}/notes`;

const getToken = (): string | null => localStorage.getItem('nf_token');

const authHeaders = (): Record<string, string> => {
  const token = getToken();
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
};

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
  const response = await fetch(NOTES_URL, { headers: authHeaders() });
  if (!response.ok) throw await parseError(response);
  return response.json();
};

export const getNoteById = async (id: number): Promise<Note> => {
  const response = await fetch(`${NOTES_URL}/${id}`, { headers: authHeaders() });
  if (!response.ok) throw await parseError(response);
  return response.json();
};

export const createNote = async (request: CreateNoteRequest): Promise<Note> => {
  const response = await fetch(NOTES_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(request),
  });
  if (!response.ok) throw await parseError(response);
  return response.json();
};

export const updateNote = async (request: UpdateNoteRequest): Promise<Note> => {
  const response = await fetch(NOTES_URL, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(request),
  });
  if (!response.ok) throw await parseError(response);
  return response.json();
};

export const pinNote = async (id: number, request: PinNoteRequest): Promise<Note> => {
  const response = await fetch(`${NOTES_URL}/${id}/pin`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(request),
  });
  if (!response.ok) throw await parseError(response);
  return response.json();
};

export const deleteNote = async (id: number): Promise<void> => {
  const response = await fetch(`${NOTES_URL}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!response.ok) throw await parseError(response);
};

export type { Note, CreateNoteRequest, UpdateNoteRequest, ApiError } from '../types/note';
