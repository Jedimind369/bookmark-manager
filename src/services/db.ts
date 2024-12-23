import { openDB, DBSchema, IDBPDatabase } from 'idb'
import type { Bookmark } from '../types'

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
    key: string
    value: {
      type: 'add' | 'delete'
      data: any
      timestamp: number
    }
  }
}

const DB_NAME = 'bookmark-manager'
const DB_VERSION = 1

async function getDB(): Promise<IDBPDatabase<BookmarkDB>> {
  return openDB<BookmarkDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const bookmarkStore = db.createObjectStore('bookmarks', { keyPath: 'id' })
      bookmarkStore.createIndex('by-date', 'dateAdded')
      bookmarkStore.createIndex('by-tag', 'tags', { multiEntry: true })
      
      db.createObjectStore('pendingSync', { keyPath: 'id', autoIncrement: true })
    }
  })
}

export async function saveBookmarkOffline(bookmark: Bookmark): Promise<void> {
  const db = await getDB()
  await db.put('bookmarks', bookmark)
  await db.put('pendingSync', {
    type: 'add',
    data: bookmark,
    timestamp: Date.now()
  })
}

export async function deleteBookmarkOffline(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('bookmarks', id)
  await db.put('pendingSync', {
    type: 'delete',
    data: { id },
    timestamp: Date.now()
  })
}

export async function getOfflineBookmarks(): Promise<Bookmark[]> {
  const db = await getDB()
  return db.getAll('bookmarks')
}

export async function syncPendingChanges(): Promise<void> {
  const db = await getDB()
  const pendingChanges = await db.getAll('pendingSync')
  
  for (const change of pendingChanges) {
    try {
      if (navigator.onLine) {
        // Implement sync logic here
        await db.delete('pendingSync', change.id)
      }
    } catch (error) {
      console.error('Failed to sync change:', error)
    }
  }
} 