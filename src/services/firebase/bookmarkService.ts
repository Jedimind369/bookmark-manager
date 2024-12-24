
import { db } from '../../config/firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, onSnapshot, DocumentData } from 'firebase/firestore';
import { Bookmark } from '../../types/bookmark';

export const bookmarkService = {
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
        dateAdded: doc.data().dateAdded.toDate()
      } as Bookmark));
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      throw error;
    }
  },

  addBookmark: async (userId: string, bookmark: Omit<Bookmark, 'id'>) => {
    const docRef = await addDoc(collection(db, 'bookmarks'), {
      ...bookmark,
      userId,
      dateAdded: new Date()
    });
    return docRef.id;
  },

  deleteBookmark: async (userId: string, bookmarkId: string) => {
    const docRef = doc(db, 'bookmarks', bookmarkId);
    await deleteDoc(docRef);
  },

  subscribeToBookmarks: (userId: string, onChange: (bookmarks: Bookmark[]) => void) => {
    const q = query(
      collection(db, 'bookmarks'),
      where('userId', '==', userId)
    );
    
    return onSnapshot(q, (snapshot) => {
      const bookmarks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateAdded: doc.data().dateAdded.toDate()
      } as Bookmark));
      onChange(bookmarks);
    });
  }
};
