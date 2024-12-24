
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

export const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">Bookmark Manager</h1>
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-gray-300">
                  {user.name}
                </span>
                <button
                  onClick={() => authService.logout()}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </nav>
    </header>
  );
};
