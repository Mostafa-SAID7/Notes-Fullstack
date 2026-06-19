import { useState, useCallback, useMemo } from 'react';
import type { Note as NoteType, SortOption } from '../types/note';

export const useSearch = (notes: NoteType[]) => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach(note => note.tags?.forEach(t => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [notes]);

  const filteredNotes = useMemo(() => {
    let result = [...notes];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.desc.toLowerCase().includes(q) ||
        n.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    if (activeTag) {
      result = result.filter(n => n.tags?.includes(activeTag));
    }

    switch (sort) {
      case 'newest':
        result.sort((a, b) => {
          if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
        break;
      case 'oldest':
        result.sort((a, b) => {
          if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        });
        break;
      case 'a-z':
        result.sort((a, b) => {
          if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
          return a.title.localeCompare(b.title);
        });
        break;
      case 'z-a':
        result.sort((a, b) => {
          if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
          return b.title.localeCompare(a.title);
        });
        break;
    }

    return result;
  }, [notes, search, sort, activeTag]);

  const handleSearch = useCallback((value: string) => setSearch(value), []);
  const handleSort = useCallback((value: SortOption) => setSort(value), []);
  const handleTagFilter = useCallback((tag: string | null) => setActiveTag(tag), []);
  const clearSearch = useCallback(() => setSearch(''), []);

  return {
    search,
    sort,
    activeTag,
    allTags,
    filteredNotes,
    handleSearch,
    handleSort,
    handleTagFilter,
    clearSearch,
  };
};
