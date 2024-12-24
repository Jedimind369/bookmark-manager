
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Add Replit auth script
    const script = document.createElement('script');
    script.src = 'https://auth.util.repl.co/script.js';
    script.setAttribute('data-replit-user-id', 'true');
    
    script.onload = () => {
      window.addEventListener('message', (e) => {
        if (e.data.type === 'authed') {
          navigate('/dashboard');
        }
      });
    };
    
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-4 text-2xl font-bold">Welcome to Bookmark Manager</h1>
        <div id="replit-auth-button"></div>
      </div>
    </div>
  );
};

export default Auth;
