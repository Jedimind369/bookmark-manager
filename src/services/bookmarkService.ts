
import { Bookmark } from '../types/bookmark';

export const bookmarkService = {
  getBookmarks: async (): Promise<Bookmark[]> => {
    const response = await fetch('/api/bookmarks');
    if (!response.ok) throw new Error('Failed to fetch bookmarks');
    return response.json();
  },

  addBookmark: async (bookmark: Omit<Bookmark, 'id'>): Promise<string> => {
    const response = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookmark)
    });
    if (!response.ok) throw new Error('Failed to add bookmark');
    const data = await response.json();
    return data.id;
  },

  deleteBookmark: async (bookmarkId: string): Promise<void> => {
    const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete bookmark');
  },

  searchBookmarks: async (query: string): Promise<Bookmark[]> => {
    const response = await fetch(`/api/bookmarks/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search bookmarks');
    return response.json();
  }
};
