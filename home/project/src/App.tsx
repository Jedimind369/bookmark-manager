import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import BookmarkForm from './components/BookmarkForm';
import VirtualBookmarkList from './components/VirtualBookmarkList';
import FileUpload from './components/FileUpload';
import BookmarkAnalytics from './components/BookmarkAnalytics';
import PremiumFeaturePrompt from './components/PremiumFeaturePrompt';
import Upgrade from './components/Upgrade';
import { fetchBookmarks, addBookmark, deleteBookmark } from './utils/api';
import { Bookmark } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadBookmarks();
    }
  }, [isAuthenticated]);

  const loadBookmarks = async () => {
    const fetchedBookmarks = await fetchBookmarks();
    setBookmarks(fetchedBookmarks);
  };

  const handleAuth = (token: string, userData: any) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleAddBookmark = async (data: Bookmark) => {
    const newBookmark = await addBookmark(data);
    setBookmarks([...bookmarks, newBookmark]);
  };

  const handleDeleteBookmark = async (id: string) => {
    await deleteBookmark(id);
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
  };

  const handleUpgradeClick = () => {
    setShowUpgrade(true);
  };

  const handleUpgradeComplete = () => {
    setShowUpgrade(false);
    setUser({ ...user, tier: 'premium' });
  };

  if (!isAuthenticated) {
    return <Auth onAuth={handleAuth} />;
  }

  if (showUpgrade) {
    return <Upgrade onUpgradeComplete={handleUpgradeComplete} />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Advanced Bookmark Manager</h1>
      <div className="mb-4">
        <p>Welcome, {user.email}! Your current tier: {user.tier}</p>
        {user.tier === 'free' && (
          <button onClick={handleUpgradeClick} className="text-blue-500 hover:underline">
            Upgrade to Premium
          </button>
        )}
      </div>
      <BookmarkForm onSubmit={handleAddBookmark} />
      <FileUpload onFileUpload={() => {}} onUploadComplete={loadBookmarks} />
      <VirtualBookmarkList bookmarks={bookmarks} onDelete={handleDeleteBookmark} />
      {user.tier === 'premium' ? (
        <BookmarkAnalytics bookmarks={bookmarks} />
      ) : (
        <PremiumFeaturePrompt onUpgrade={handleUpgradeClick} />
      )}
    </div>
  );
};

export default App;