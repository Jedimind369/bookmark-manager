import { useState, useMemo } from 'react';
import { Bookmark } from '../types/bookmark';

type SortOption = 'date' | 'title' | 'visits';

export const useBookmarks = (bookmarks: Bookmark[]) => {
  const [sortBy, setSortBy] = useState<SortOption>('date');

  const sortedBookmarks = useMemo(() => {
    return [...bookmarks].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.dateAdded.getTime() - a.dateAdded.getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'visits':
          return (b.metadata?.visitCount || 0) - (a.metadata?.visitCount || 0);
        default:
          return 0;
      }
    });
  }, [bookmarks, sortBy]);

  return {
    sortBy,
    setSortBy,
    sortedBookmarks
  };
}; 