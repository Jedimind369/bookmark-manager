
import React from 'react';
import { auth, db } from '../config/firebase';

const Test: React.FC = () => {
  return (
    <div className="p-4">
      <h2>Firebase Configuration Test</h2>
      <p>Auth initialized: {auth ? 'Yes' : 'No'}</p>
      <p>Firestore initialized: {db ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default Test;
