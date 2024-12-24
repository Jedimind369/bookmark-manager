
import React from 'react';

export const Auth: React.FC<{ onLogin?: () => void }> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Welcome to Bookmark Manager</h1>
        <div>
          <script
            src="https://auth.util.repl.co/script.js"
            data-replit-user-id="true"
            data-replit-user-name="true"
            onload={() => onLogin?.()}
          ></script>
        </div>
      </div>
    </div>
  );
};
