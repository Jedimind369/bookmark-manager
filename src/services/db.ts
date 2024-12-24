import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { collection, addDoc, deleteDoc, doc, writeBatch, DocumentData } from 'firebase/firestore'
import { db as firestore } from '../config/firebase'
import type { Bookmark } from '../types'
import { handleApiError, ApiError } from '../utils/errorHandling'

interface PendingSyncData {
  id?: number
  type: 'add' | 'delete' | 'update'
  data: Bookmark | { id: string }
  timestamp: number
  retryCount?: number
  error?: string
}

interface BookmarkDB extends DBSchema {
  bookmarks: {
    key: string
    value: Bookmark
    indexes: {
      'by-date': Date
      'by-tag': string[]
      'by-status': 'pending' | 'synced' | 'error'
    }
  }
  pendingSync: {
    key: number
    value: PendingSyncData
    indexes: {
      'by-timestamp': number
      'by-type': 'add' | 'delete' | 'update'
    }
  }
}

const DB_NAME = 'bookmark-manager'
const DB_VERSION = 2
const MAX_RETRY_COUNT = 3
const BATCH_SIZE = 500

let dbInstance: IDBPDatabase<BookmarkDB> | null = null

async function getDB(): Promise<IDBPDatabase<BookmarkDB>> {
  if (dbInstance) return dbInstance

  try {
    dbInstance = await openDB<BookmarkDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          const bookmarkStore = db.createObjectStore('bookmarks', { keyPath: 'id' })
          bookmarkStore.createIndex('by-date', 'dateAdded')
          bookmarkStore.createIndex('by-tag', 'tags', { multiEntry: true })
          bookmarkStore.createIndex('by-status', 'syncStatus')
          
          const syncStore = db.createObjectStore('pendingSync', { keyPath: 'id', autoIncrement: true })
          syncStore.createIndex('by-timestamp', 'timestamp')
          syncStore.createIndex('by-type', 'type')
        }
        
        if (oldVersion < 2) {
          const tx = db.transaction('bookmarks', 'readwrite')
          const store = tx.objectStore('bookmarks')
          store.openCursor().then(function addStatus(cursor) {
            if (!cursor) return
            const bookmark = cursor.value
            if (!bookmark.syncStatus) {
              bookmark.syncStatus = 'synced'
              cursor.update(bookmark)
            }
            return cursor.continue().then(addStatus)
          })
        }
      },
      blocked() {
        console.warn('Database upgrade blocked. Please close other tabs.')
      },
      blocking() {
        dbInstance?.close()
        dbInstance = null
      },
      terminated() {
        dbInstance = null
      }
    })
  } catch (error) {
    console.error("Error opening database:", error);
    throw new ApiError("Failed to open database", "DATABASE_OPEN_ERROR");
  }

  return dbInstance
}

export async function saveBookmarkOffline(bookmark: Bookmark): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(['bookmarks', 'pendingSync'], 'readwrite')
  
  try {
    await tx.objectStore('bookmarks').put({
      ...bookmark,
      syncStatus: 'pending'
    })
    await tx.objectStore('pendingSync').add({
      type: 'add',
      data: bookmark,
      timestamp: Date.now(),
      retryCount: 0
    } as PendingSyncData)
    
    await tx.done
  } catch (error) {
    await tx.abort()
    console.error('Failed to save bookmark offline:', error)
    throw new ApiError(
      'Failed to save bookmark offline. Please try again.',
      'OFFLINE_SAVE_ERROR'
    )
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
      timestamp: Date.now(),
      retryCount: 0
    } as PendingSyncData)
    
    await tx.done
  } catch (error) {
    await tx.abort()
    console.error('Failed to delete bookmark offline:', error)
    throw new ApiError(
      'Failed to delete bookmark offline. Please try again.',
      'OFFLINE_DELETE_ERROR'
    )
  }
}

export async function getOfflineBookmarks(): Promise<Bookmark[]> {
  const db = await getDB()
  return db.getAllFromIndex('bookmarks', 'by-date')
}

async function processBatch(changes: PendingSyncData[]): Promise<void> {
  const batch = writeBatch(firestore)
  const bookmarksCollection = collection(firestore, 'bookmarks')

  changes.forEach(change => {
    try {
      switch (change.type) {
        case 'add': {
          const bookmark = change.data as Bookmark
          const docRef = doc(bookmarksCollection)
          batch.set(docRef, {
            ...bookmark,
            dateAdded: bookmark.dateAdded.toISOString(),
            syncStatus: 'synced'
          })
          break
        }
        case 'delete': {
          const { id } = change.data as { id: string }
          if (!id.startsWith('offline-')) {
            batch.delete(doc(bookmarksCollection, id))
          }
          break
        }
        case 'update': {
          const bookmark = change.data as Bookmark
          if (!bookmark.id.startsWith('offline-')) {
            batch.update(doc(bookmarksCollection, bookmark.id), {
              ...bookmark,
              dateAdded: bookmark.dateAdded.toISOString(),
              syncStatus: 'synced'
            })
          }
          break
        }
      }
    } catch (error) {
      console.error('Failed to process change:', change, error)
      throw error
    }
  })

  await batch.commit()
}

export async function syncPendingChanges(): Promise<void> {
  if (!navigator.onLine) {
    console.log('Device is offline, skipping sync')
    return
  }

  const db = await getDB()
  const tx = db.transaction(['pendingSync', 'bookmarks'], 'readwrite')
  const store = tx.objectStore('pendingSync')
  const bookmarkStore = tx.objectStore('bookmarks')
  
  try {
    const pendingChanges = await store.getAll()
    pendingChanges.sort((a, b) => a.timestamp - b.timestamp)

    for (let i = 0; i < pendingChanges.length; i += BATCH_SIZE) {
      const batch = pendingChanges.slice(i, i + BATCH_SIZE)
      
      try {
        await processBatch(batch)
        await Promise.all(batch.map(async change => {
          await store.delete(change.id!)
          if (change.type === 'add' || change.type === 'update') {
            const bookmark = change.data as Bookmark
            await bookmarkStore.put({
              ...bookmark,
              syncStatus: 'synced'
            })
          }
        }))
      } catch (error) {
        console.error('Failed to sync batch:', error)
        
        for (const change of batch) {
          const retryCount = (change.retryCount || 0) + 1
          if (retryCount < MAX_RETRY_COUNT) {
            await store.put({
              ...change,
              retryCount,
              timestamp: Date.now(),
              error: error instanceof Error ? error.message : 'Unknown error'
            })
            if (change.type === 'add' || change.type === 'update') {
              const bookmark = change.data as Bookmark
              await bookmarkStore.put({
                ...bookmark,
                syncStatus: 'error'
              })
            }
          } else {
            console.error(`Change failed after ${MAX_RETRY_COUNT} retries:`, change)
            // Remove from pending sync after max retries
            await store.delete(change.id!)
          }
        }
      }
    }
    
    await tx.done
  } catch (error) {
    await tx.abort()
    throw new ApiError(
      'Failed to sync changes. Please try again later.',
      'SYNC_ERROR'
    )
  }
}

let syncInProgress = false
const syncListeners = new Set<() => void>()

export function addSyncListener(listener: () => void): () => void {
  syncListeners.add(listener)
  return () => syncListeners.delete(listener)
}

async function startSync(): Promise<void> {
  if (syncInProgress) return
  
  syncInProgress = true
  try {
    await syncPendingChanges()
    syncListeners.forEach(listener => listener())
  } catch (error) {
    console.error('Sync failed:', error)
  } finally {
    syncInProgress = false
  }
}

if (typeof window !== 'undefined') {
  let onlineHandler: (() => void) | null = null
  let offlineHandler: (() => void) | null = null

  window.addEventListener('load', () => {
    onlineHandler = () => {
      console.log('Device is online, starting sync')
      void startSync()
    }
    offlineHandler = () => {
      console.log('Device is offline')
      syncInProgress = false
    }

    window.addEventListener('online', onlineHandler)
    window.addEventListener('offline', offlineHandler)
  })

  window.addEventListener('unload', () => {
    if (onlineHandler) window.removeEventListener('online', onlineHandler)
    if (offlineHandler) window.removeEventListener('offline', offlineHandler)
    syncListeners.clear()
    if (dbInstance) {
      dbInstance.close()
      dbInstance = null
    }
  })
}