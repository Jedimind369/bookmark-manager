
import { Bookmark } from '../types';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export const addBookmarkToDB = async (bookmark: Bookmark): Promise<string> => {
  const docRef = await addDoc(collection(db, 'bookmarks'), bookmark);
  return docRef.id;
};

export const getBookmarksFromDB = async (userId: string): Promise<Bookmark[]> => {
  const querySnapshot = await getDocs(collection(db, 'bookmarks'));
  return querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as Bookmark))
    .filter(bookmark => bookmark.userId === userId);
};

export const deleteBookmarkFromDB = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'bookmarks', id));
};

export const updateBookmarkInDB = async (id: string, data: Partial<Bookmark>): Promise<void> => {
  await updateDoc(doc(db, 'bookmarks', id), data);
};
