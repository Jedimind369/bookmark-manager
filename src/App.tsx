
import React, { useState, useEffect } from 'react';
import { LoginButton } from './components/atoms/LoginButton';
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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Welcome to Bookmark Manager</h1>
          <LoginButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Bookmark Manager</h1>
        <BookmarkForm />
        <BookmarkList bookmarks={bookmarks} />
      </div>
    </div>
  );
};

export default App;
