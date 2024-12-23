import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const FirebaseTest: React.FC = () => {
  const [testData, setTestData] = useState<string>('Testing Firebase connection...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'test'));
        setTestData(`Firebase connected! Found ${querySnapshot.size} test documents.`);
      } catch (error) {
        setTestData(`Firebase error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4 bg-blue-50 rounded-lg">
      <p>{testData}</p>
    </div>
  );
};

export default FirebaseTest; 