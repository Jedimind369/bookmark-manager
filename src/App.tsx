
import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  return (
    <div className="min-h-screen bg-gray-100">
      {!isLoggedIn ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white p-8 rounded-lg shadow-md w-96">
            <h1 className="text-2xl font-bold mb-6 text-center">Bookmark Manager</h1>
            <button 
              onClick={() => setIsLoggedIn(true)}
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
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          </header>
          <div className="bg-white rounded-lg shadow-md p-6">
            <form className="mb-6">
              <input
                type="text"
                placeholder="Enter bookmark URL"
                className="w-full p-2 border rounded mb-2"
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
                    {/* Bookmark items will go here */}
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
