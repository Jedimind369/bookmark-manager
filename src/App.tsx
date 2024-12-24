
import React, { useState, useEffect } from 'react';
import { bookmarkService } from './services/bookmarkService';
import type { Bookmark } from './types';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://auth.util.repl.co/script.js';
    script.onload = () => {
      checkAuth();
    };
    document.head.appendChild(script);
  }, []);

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

  const loadBookmarks = async () => {
    try {
      const data = await bookmarkService.getBookmarks();
      setBookmarks(data);
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    }
  };

  const handleAddBookmark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    try {
      await bookmarkService.addBookmark({
        url: newUrl,
        title: newUrl,
        tags: [],
        collections: [],
        dateAdded: new Date(),
        userId: ''
      });
      setNewUrl('');
      loadBookmarks();
    } catch (error) {
      console.error('Failed to add bookmark:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!isLoggedIn ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white p-8 rounded-lg shadow-md w-96">
            <h1 className="text-2xl font-bold mb-6 text-center">Bookmark Manager</h1>
            <button 
              onClick={() => window.location.href = '/__replauthlogin'}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              Login with Replit
            </button>
          </div>
        </div>
      ) : (
        <div className="container mx-auto p-6">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Bookmarks</h1>
          </header>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleAddBookmark} className="mb-6">
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="Enter bookmark URL"
                className="w-full p-2 border rounded mb-2"
                required
              />
              <button 
                type="submit"
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
              >
                Add Bookmark
              </button>
            </form>
            
            <div className="space-y-4">
              {bookmarks.length === 0 ? (
                <p className="text-gray-500 text-center">No bookmarks yet. Add your first one!</p>
              ) : (
                bookmarks.map((bookmark, index) => (
                  <div key={index} className="border-b pb-4">
                    <a 
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {bookmark.title || bookmark.url}
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
