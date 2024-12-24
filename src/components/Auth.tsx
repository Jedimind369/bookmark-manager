
import React, { useEffect } from 'react';
import { authService } from '../services/authService';

interface AuthProps {
  onAuth?: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuth }) => {
  useEffect(() => {
    // Add Replit auth script
    const script = document.createElement('script');
    script.src = 'https://auth.util.repl.co/script.js';
    script.setAttribute('data-replit-user-id', 'true');
    script.onload = () => {
      // Check if user is already authenticated
      fetch('/__replauthuser')
        .then(response => response.json())
        .then(user => {
          if (user.id) {
            onAuth?.();
          }
        })
        .catch(console.error);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [onAuth]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Welcome to Bookmark Manager</h1>
        <div id="replit-auth-button"></div>
      </div>
    </div>
  );
};

export default Auth;
