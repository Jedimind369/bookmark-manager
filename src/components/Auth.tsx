
import React from 'react';
import { authService } from '../services/authService';

export const Auth: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Welcome to Bookmark Manager</h1>
        <button
          onClick={() => authService.login()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Login with Replit
        </button>
      </div>
    </div>
  );
};
