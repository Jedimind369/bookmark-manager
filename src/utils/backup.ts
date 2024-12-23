import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../config/firebase'
import { Bookmark } from '../types'

export const backupBookmarks = async (userId: string) => {
  try {
    const bookmarksRef = collection(db, 'bookmarks')
    const q = query(bookmarksRef, where('userId', '==', userId))
    const querySnapshot = await getDocs(q)
    const bookmarks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Bookmark[]
    
    return bookmarks
  } catch (error) {
    console.error('Error backing up bookmarks:', error)
    throw error
  }
}

export const checkBackupStatus = async () => {
  return {
    lastBackup: new Date(),
    status: 'success' as const
  }
} 