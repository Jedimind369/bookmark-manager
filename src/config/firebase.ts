
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Using Replit Auth instead of Firebase Auth
export const auth = {
  getCurrentUser: async () => {
    const response = await fetch('/__replauthuser');
    return response.json();
  }
};

const app = initializeApp({
  // Your Firebase config here
  projectId: "bookmarks-app"
});

export const db = getFirestore(app);
