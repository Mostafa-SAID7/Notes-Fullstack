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
  | 'pink';

export const NOTE_COLORS: { value: NoteColor; label: string; bg: string; border: string }[] = [
  { value: 'default', label: 'Default', bg: 'bg-card',           border: 'border-border'    },
  { value: 'yellow',  label: 'Yellow',  bg: 'bg-yellow-400/20',  border: 'border-yellow-400/50'  },
  { value: 'green',   label: 'Green',   bg: 'bg-green-500/20',   border: 'border-green-500/50'   },
  { value: 'blue',    label: 'Blue',    bg: 'bg-blue-500/20',    border: 'border-blue-500/50'    },
  { value: 'red',     label: 'Red',     bg: 'bg-red-500/20',     border: 'border-red-500/50'     },
  { value: 'purple',  label: 'Purple',  bg: 'bg-purple-500/20',  border: 'border-purple-500/50'  },
  { value: 'orange',  label: 'Orange',  bg: 'bg-orange-500/20',  border: 'border-orange-500/50'  },
  { value: 'pink',    label: 'Pink',    bg: 'bg-pink-500/20',    border: 'border-pink-500/50'    },
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
