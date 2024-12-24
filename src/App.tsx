import React from 'react';
import { BookmarkList } from './components/BookmarkList';
import { useBookmarks } from './hooks/useBookmarks';

export const App: React.FC = () => {
  const { bookmarks } = useBookmarks();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Bookmark Manager</h1>
      <BookmarkList bookmarks={bookmarks} />
    </div>
  );
};