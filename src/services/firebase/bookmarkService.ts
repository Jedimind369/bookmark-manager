import { db } from '../../config/firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { Bookmark } from '../../types/bookmark';

export const bookmarkService = {
  // Get user's bookmarks
  getBookmarks: async (userId: string): Promise<Bookmark[]> => {
    try {
      const q = query(
        collection(db, 'bookmarks'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        dateAdded: new Date((doc.data() as DocumentData).dateAdded)
      } as Bookmark));
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      throw error;
    }
  },

  // Add new bookmark
  addBookmark: async (userId: string, bookmark: Omit<Bookmark, 'id'>) => {
    const docRef = await addDoc(collection(db, 'bookmarks'), {
      ...bookmark,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  },

  // Delete bookmark
  deleteBookmark: async (userId: string, bookmarkId: string) => {
    const docRef = doc(db, 'bookmarks', bookmarkId);
    await deleteDoc(docRef);
  },

  // Real-time sync
  subscribeToBookmarks: (userId: string, onChange: (bookmarks: Bookmark[]) => void) => {
    const q = query(
      collection(db, 'bookmarks'),
      where('userId', '==', userId)
    );

    return onSnapshot(q, (snapshot) => {
      const bookmarks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Bookmark));
      onChange(bookmarks);
    });
  }
}; 