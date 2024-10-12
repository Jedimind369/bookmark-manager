import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Bookmark } from '../types';

interface BookmarkDB extends DBSchema {
  bookmarks: {
    key: string;
    value: Bookmark;
    indexes: { 'by-date': Date };
  };
}

let db: IDBPDatabase<BookmarkDB>;

export const initDB = async () => {
  db = await openDB<BookmarkDB>('BookmarkManagerDB', 1, {
    upgrade(db) {
      const bookmarkStore = db.createObjectStore('bookmarks', { keyPath: 'id' });
      bookmarkStore.createIndex('by-date', 'dateAdded');
    },
  });
};

export const addBookmark = async (bookmark: Bookmark) => {
  return db.add('bookmarks', bookmark);
};

export const getBookmarks = async (limit = 50, offset = 0) => {
  return db.getAllFromIndex('bookmarks', 'by-date', null, limit, offset);
};

export const deleteBookmark = async (id: string) => {
  return db.delete('bookmarks', id);
};

export const searchBookmarks = async (query: string, limit = 50) => {
  const allBookmarks = await db.getAll('bookmarks');
  return allBookmarks.filter(
    (bookmark) =>
      bookmark.title.toLowerCase().includes(query.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(query.toLowerCase()) ||
      bookmark.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())) ||
      bookmark.categories.some((category) => category.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, limit);
};

export const addBookmarksBatch = async (bookmarks: Bookmark[]) => {
  const tx = db.transaction('bookmarks', 'readwrite');
  const store = tx.objectStore('bookmarks');
  
  const promises = bookmarks.map(async (bookmark) => {
    try {
      await store.add(bookmark);
    } catch (error) {
      if (error.name === 'ConstraintError') {
        // If the bookmark already exists, update it
        await store.put(bookmark);
      } else {
        console.error('Error adding bookmark:', error);
      }
    }
  });

  await Promise.all(promises);
  await tx.done;
};

export const clearAllBookmarks = async () => {
  const tx = db.transaction('bookmarks', 'readwrite');
  const store = tx.objectStore('bookmarks');
  await store.clear();
  await tx.done;
};