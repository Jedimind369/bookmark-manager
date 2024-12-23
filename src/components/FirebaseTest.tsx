import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { addBookmark } from '../store/bookmarksSlice';
import { BookmarkFormData } from '../types';

export const FirebaseTest: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [testStatus, setTestStatus] = useState<string>('');

  const runTest = async () => {
    if (!user?.uid) {
      setTestStatus('Please log in first');
      return;
    }

    try {
      setTestStatus('Running test...');

      const testBookmark: BookmarkFormData = {
        url: 'https://example.com',
        title: 'Test Bookmark',
        description: 'This is a test bookmark',
        tags: ['test', 'example'],
        collections: ['testing'],
        insights: ['Test insight 1', 'Test insight 2'],
        personalGrowthNotes: 'Test personal growth notes'
      };

      const result = await dispatch(addBookmark({
        bookmark: testBookmark,
        userId: user.uid
      })).unwrap();

      setTestStatus(`Test completed successfully. Bookmark ID: ${result.id}`);
    } catch (error) {
      console.error('Test failed:', error);
      setTestStatus(`Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Firebase Test</h2>
      <button
        onClick={runTest}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Run Test
      </button>
      {testStatus && (
        <p className="mt-4 dark:text-gray-200">
          Status: <span className="font-mono">{testStatus}</span>
        </p>
      )}
    </div>
  );
};

export default FirebaseTest; 