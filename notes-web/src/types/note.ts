/**
 * Note Types - Domain model and API contracts
 * Single source of truth for all note-related types
 */

// ── Domain Model ──────────────────────────────────────────────────────────────

export interface Note {
  id: number;
  title: string;
  desc: string;
  createdDate: string;
}

// ── API Request/Response Types ────────────────────────────────────────────────

export interface CreateNoteRequest {
  title: string;
  desc: string;
}

export interface UpdateNoteRequest {
  id: number;
  title: string;
  desc: string;
}

// ── API Error Type ────────────────────────────────────────────────────────────

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}




