
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Bookmark } from '../types';

export const addBookmark = async (bookmark: Bookmark) => {
  try {
    const bookmarksRef = collection(db, 'bookmarks');
    const docRef = await addDoc(bookmarksRef, {
      ...bookmark,
      dateAdded: new Date()
    });
    return { id: docRef.id, ...bookmark };
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw error;
  }
};

export const getBookmarks = async (userId: string) => {
  try {
    const bookmarksRef = collection(db, 'bookmarks');
    const q = query(bookmarksRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Bookmark));
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    throw error;
  }
};

export const deleteBookmark = async (bookmarkId: string) => {
  try {
    await deleteDoc(doc(db, 'bookmarks', bookmarkId));
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    throw error;
  }
};
