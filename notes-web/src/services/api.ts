/**
 * API Service - Centralized HTTP communication layer
 * Responsibility: Handle all HTTP requests to the backend
 * Concerns: Fetch, error parsing, response handling
 * 
 * Type definitions are in types/note.ts
 */

import type { Note, CreateNoteRequest, UpdateNoteRequest, ApiError } from '../types/note';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5272/api/notes';

// Log API configuration in development
if (import.meta.env.DEV) {
  console.log('[API] Base URL:', API_BASE);
}

/**
 * Parse error response from backend
 * Converts HTTP error responses to standardized ApiError format
 */
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

/**
 * Get all notes
 */
export const getAllNotes = async (): Promise<Note[]> => {
  try {
    const response = await fetch(API_BASE);

    if (!response.ok) {
      const error = await parseError(response);
      throw error;
    }

    return response.json();
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
      console.error('[API] Connection Error: Cannot reach API at', API_BASE);
      console.error('   Make sure:');
      console.error('   1. Backend is running: dotnet run --launch-profile http');
      console.error('   2. Backend is on port 5272');
      console.error('   3. No firewall is blocking port 5272');
    }
    throw err;
  }
};

/**
 * Get note by ID
 */
export const getNoteById = async (id: number): Promise<Note> => {
  const response = await fetch(`${API_BASE}/${id}`);

  if (!response.ok) {
    const error = await parseError(response);
    throw error;
  }

  return response.json();
};

/**
 * Create a new note
 */
export const createNote = async (request: CreateNoteRequest): Promise<Note> => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await parseError(response);
    throw error;
  }

  return response.json();
};

/**
 * Update an existing note
 */
export const updateNote = async (request: UpdateNoteRequest): Promise<Note> => {
  const response = await fetch(API_BASE, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await parseError(response);
    throw error;
  }

  return response.json();
};

/**
 * Delete a note
 */
export const deleteNote = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await parseError(response);
    throw error;
  }
};

/**
 * Re-export types for convenience
 * Allows: import { ApiError, Note } from './services/api'
 */
export type { Note, CreateNoteRequest, UpdateNoteRequest, ApiError } from '../types/note';
