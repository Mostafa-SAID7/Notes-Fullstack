export interface Note {
  id: number;
  title: string;
  desc: string;
  createdDate: string;
  updatedAt: string;
  isPinned: boolean;
  color: NoteColor;
  tags: string[];
}

export type NoteColor =
  | 'default'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'red'
  | 'purple'
  | 'orange'
  | 'pink'
  | 'brown';

export const NOTE_COLORS: { value: NoteColor; label: string; bg: string; border: string; swatch: string }[] = [
  { value: 'default', label: 'Default', bg: 'bg-card',            border: 'border-border',           swatch: 'bg-surface-2'       },
  { value: 'yellow',  label: 'Yellow',  bg: 'bg-yellow-400/15',   border: 'border-yellow-400/40',    swatch: 'bg-yellow-400'      },
  { value: 'green',   label: 'Green',   bg: 'bg-green-500/15',    border: 'border-green-500/40',     swatch: 'bg-green-500'       },
  { value: 'blue',    label: 'Blue',    bg: 'bg-blue-500/15',     border: 'border-blue-500/40',      swatch: 'bg-blue-500'        },
  { value: 'red',     label: 'Red',     bg: 'bg-red-500/15',      border: 'border-red-500/40',       swatch: 'bg-red-500'         },
  { value: 'purple',  label: 'Purple',  bg: 'bg-purple-500/15',   border: 'border-purple-500/40',    swatch: 'bg-purple-500'      },
  { value: 'orange',  label: 'Orange',  bg: 'bg-orange-400/15',   border: 'border-orange-400/40',    swatch: 'bg-orange-400'      },
  { value: 'pink',    label: 'Pink',    bg: 'bg-pink-400/15',     border: 'border-pink-400/40',      swatch: 'bg-pink-400'        },
  { value: 'brown',   label: 'Brown',   bg: 'bg-amber-700/15',    border: 'border-amber-700/40',     swatch: 'bg-amber-700'       },
];

export interface CreateNoteRequest {
  title: string;
  desc: string;
  color: NoteColor;
  tags: string[];
}

export interface UpdateNoteRequest {
  id: number;
  title: string;
  desc: string;
  color: NoteColor;
  tags: string[];
}

export interface PinNoteRequest {
  isPinned: boolean;
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}

export type SortOption = 'newest' | 'oldest' | 'a-z' | 'z-a';
