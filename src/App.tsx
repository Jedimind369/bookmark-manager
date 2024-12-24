
import React, { useState, useEffect } from 'react';

const App = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    const steps = [
      { progress: 20, message: 'Loading components...' },
      { progress: 40, message: 'Checking authentication...' },
      { progress: 60, message: 'Setting up database...' },
      { progress: 80, message: 'Preparing interface...' },
      { progress: 100, message: 'Ready!' }
    ];

    steps.forEach(({ progress, message }, index) => {
      setTimeout(() => {
        setProgress(progress);
        setStatus(message);
      }, index * 800);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center w-full max-w-md px-4">
        <h1 className="text-4xl font-bold mb-4">Bookmark Manager</h1>
        <p className="text-lg mb-8">Welcome to your bookmark management system</p>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600">{status}</p>
      </div>
    </div>
  );
};

export default App;
