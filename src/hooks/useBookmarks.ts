import { useState, useEffect } from 'react';
import { Bookmark } from '../types';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'bookmarks'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const bookmarkData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Bookmark[];
        
        setBookmarks(bookmarkData);
        setLoading(false);
      },
      (err) => {
        setError('Failed to fetch bookmarks');
        setLoading(false);
        console.error('Firestore error:', err);
      }
    );

    return () => unsubscribe();
  }, []);

  return { bookmarks, loading, error };
}; 