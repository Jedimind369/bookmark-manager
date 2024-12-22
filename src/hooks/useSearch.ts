import { useState, useMemo } from 'react';
import { Bookmark } from '../types/bookmark';

export const useSearch = (bookmarks: Bookmark[]) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookmarks = useMemo(() => {
    if (!searchQuery.trim()) return bookmarks;

    const query = searchQuery.toLowerCase();
    return bookmarks.filter(bookmark => 
      bookmark.title.toLowerCase().includes(query) ||
      bookmark.url.toLowerCase().includes(query) ||
      bookmark.description?.toLowerCase().includes(query) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [bookmarks, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredBookmarks
  };
}; 