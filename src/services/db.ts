import { openDB, DBSchema, IDBPDatabase } from 'idb'
import type { Bookmark } from '../types'

interface PendingSyncData {
  id?: number
  type: 'add' | 'delete'
  data: Bookmark | { id: string }
  timestamp: number
}

interface BookmarkDB extends DBSchema {
  bookmarks: {
    key: string
    value: Bookmark
    indexes: {
      'by-date': Date
      'by-tag': string[]
    }
  }
  pendingSync: {
    key: number
    value: PendingSyncData
  }
}

const DB_NAME = 'bookmark-manager'
const DB_VERSION = 1

async function getDB(): Promise<IDBPDatabase<BookmarkDB>> {
  return openDB<BookmarkDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('bookmarks')) {
        const bookmarkStore = db.createObjectStore('bookmarks', { keyPath: 'id' })
        bookmarkStore.createIndex('by-date', 'dateAdded')
        bookmarkStore.createIndex('by-tag', 'tags', { multiEntry: true })
      }
      
      if (!db.objectStoreNames.contains('pendingSync')) {
        db.createObjectStore('pendingSync', { keyPath: 'id', autoIncrement: true })
      }
    }
  })
}

export async function saveBookmarkOffline(bookmark: Bookmark): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(['bookmarks', 'pendingSync'], 'readwrite')
  
  try {
    await tx.objectStore('bookmarks').put(bookmark)
    await tx.objectStore('pendingSync').add({
      type: 'add',
      data: bookmark,
      timestamp: Date.now()
    } as PendingSyncData)
    
    await tx.done
  } catch (error) {
    console.error('Failed to save bookmark offline:', error)
    throw error
  }
}

export async function deleteBookmarkOffline(id: string): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(['bookmarks', 'pendingSync'], 'readwrite')
  
  try {
    await tx.objectStore('bookmarks').delete(id)
    await tx.objectStore('pendingSync').add({
      type: 'delete',
      data: { id },
      timestamp: Date.now()
    } as PendingSyncData)
    
    await tx.done
  } catch (error) {
    console.error('Failed to delete bookmark offline:', error)
    throw error
  }
}

export async function getOfflineBookmarks(): Promise<Bookmark[]> {
  const db = await getDB()
  return db.getAll('bookmarks')
}

export async function syncPendingChanges(): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(['pendingSync'], 'readwrite')
  const store = tx.objectStore('pendingSync')
  const pendingChanges = await store.getAll()
  
  for (const change of pendingChanges) {
    try {
      if (navigator.onLine) {
        // TODO: Implement sync logic with Firebase
        // For now, just remove the pending change
        await store.delete(change.id!)
      }
    } catch (error) {
      console.error('Failed to sync change:', error)
    }
  }
  
  await tx.done
} 