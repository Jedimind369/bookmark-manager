
import React, { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

const Test: React.FC = () => {
  const [status, setStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    const testFirebase = async () => {
      try {
        // Test Firestore
        const querySnapshot = await getDocs(collection(db, 'bookmarks'));
        setStatus(prev => ({
          ...prev,
          firestore: `Connected (${querySnapshot.size} documents found)`
        }));
      } catch (error) {
        setStatus(prev => ({
          ...prev,
          firestore: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        }));
      }
    };

    // Test Firebase Auth
    setStatus(prev => ({
      ...prev,
      auth: auth ? 'Initialized' : 'Not initialized'
    }));

    // Test Firebase Config
    const envVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID'
    ];

    const configStatus = envVars.every(key => import.meta.env[key]) 
      ? 'All Firebase environment variables are set'
      : 'Missing some Firebase environment variables';

    setStatus(prev => ({
      ...prev,
      config: configStatus
    }));

    testFirebase();
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Firebase Configuration Test</h2>
      {Object.entries(status).map(([key, value]) => (
        <div key={key} className="mb-2">
          <span className="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}: </span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
};

export default Test;
