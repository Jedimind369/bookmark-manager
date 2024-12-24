
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

const Test: React.FC = () => {
  const [status, setStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    const testConnections = async () => {
      // Test Firebase Auth
      setStatus(prev => ({
        ...prev,
        auth: auth ? 'Firebase Auth Initialized' : 'Firebase Auth Not Initialized'
      }));

      // Test Firestore
      try {
        const querySnapshot = await getDocs(collection(db, 'bookmarks'));
        setStatus(prev => ({
          ...prev,
          firestore: `Firestore Connected (${querySnapshot.size} bookmarks found)`
        }));
      } catch (error) {
        setStatus(prev => ({
          ...prev,
          firestore: `Firestore Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        }));
      }
    };

    testConnections();
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">System Status</h2>
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
