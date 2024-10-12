import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import BookmarkForm from './components/BookmarkForm';
import VirtualBookmarkList from './components/VirtualBookmarkList';
import FileUpload from './components/FileUpload';
import BookmarkAnalytics from './components/BookmarkAnalytics';
import PremiumFeaturePrompt from './components/PremiumFeaturePrompt';
import Upgrade from './components/Upgrade';
import { fetchBookmarks, addBookmark, deleteBookmark, checkApiHealth } from './utils/api';
import { Bookmark } from './types';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(true);

  useEffect(() => {
    const checkApi = async () => {
      try {
        const isHealthy = await checkApiHealth();
        setApiAvailable(isHealthy);
      } catch (error) {
        console.error('Error checking API health:', error instanceof Error ? error.message : 'Unknown error');
        setApiAvailable(false);
      }
    };
    checkApi();
  }, []);

  useEffect(() => {
    if (isAuthenticated && apiAvailable) {
      loadBookmarks();
    }
  }, [isAuthenticated, apiAvailable]);

  const loadBookmarks = async () => {
    try {
      const fetchedBookmarks = await fetchBookmarks();
      setBookmarks(fetchedBookmarks);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const handleAuth = (token: string, userData: any) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleAddBookmark = async (data: Bookmark) => {
    try {
      const newBookmark = await addBookmark(data);
      setBookmarks([...bookmarks, newBookmark]);
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    try {
      await deleteBookmark(id);
      setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  const handleUpgradeClick = () => {
    setShowUpgrade(true);
  };

  const handleUpgradeComplete = () => {
    setShowUpgrade(false);
    setUser({ ...user, tier: 'premium' });
  };

  if (!apiAvailable) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Advanced Bookmark Manager</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> Unable to connect to the server. Please try again later.</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth onAuth={handleAuth} />;
  }

  if (showUpgrade) {
    return <Upgrade onUpgradeComplete={handleUpgradeComplete} />;
  }

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default App;