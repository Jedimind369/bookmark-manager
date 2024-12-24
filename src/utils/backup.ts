
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
      ...doc.data(),
      backupDate: new Date().toISOString()
    })) as Bookmark[]
    
    // Store backup in localStorage for quick access
    localStorage.setItem('bookmarks_backup', JSON.stringify(bookmarks))
    localStorage.setItem('last_backup_date', new Date().toISOString())
    
    return bookmarks
  } catch (error) {
    console.error('Error backing up bookmarks:', error)
    throw error
  }
}

export const checkBackupStatus = async () => {
  const lastBackup = localStorage.getItem('last_backup_date')
  return {
    lastBackup: lastBackup ? new Date(lastBackup) : null,
    status: lastBackup ? 'success' as const : 'pending' as const
  }
}
