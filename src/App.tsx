
import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { BookmarkForm } from './components/BookmarkForm';
import BookmarkList from './components/BookmarkList';
import { bookmarkService } from './services/bookmarkService';
import type { Bookmark } from './types';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/__replauthuser');
        if (response.ok) {
          setIsLoggedIn(true);
          loadBookmarks();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };
    checkAuth();
  }, []);

  const loadBookmarks = async () => {
    try {
      const data = await bookmarkService.getBookmarks();
      setBookmarks(data);
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    }
  };

  const handleAddBookmark = async (bookmark: Omit<Bookmark, 'id'>) => {
    try {
      const id = await bookmarkService.addBookmark(bookmark);
      setBookmarks([...bookmarks, { ...bookmark, id }]);
    } catch (error) {
      console.error('Failed to add bookmark:', error);
    }
  };

  if (!isLoggedIn) {
    return <Auth onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Bookmark Manager</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Bookmark</h2>
          <BookmarkForm onSubmit={handleAddBookmark} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Bookmarks</h2>
          <BookmarkList bookmarks={bookmarks} />
        </div>
      </div>
    </div>
  );
};

export default App;
