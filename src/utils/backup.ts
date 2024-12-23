import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

export async function checkBackupStatus(): Promise<{
  lastBackup: Date | null
  status: 'success' | 'failed' | 'pending'
  error?: string
}> {
  try {
    const backupRef = doc(db, 'system', 'backup')
    const backupDoc = await getDoc(backupRef)
    
    if (!backupDoc.exists()) {
      return {
        lastBackup: null,
        status: 'pending'
      }
    }

    const data = backupDoc.data()
    return {
      lastBackup: data?.lastBackup?.toDate() || null,
      status: data?.status || 'pending',
      error: data?.error
    }
  } catch (error) {
    console.error('Failed to check backup status:', error)
    if (error instanceof Error) {
      return {
        lastBackup: null,
        status: 'failed',
        error: error.message
      }
    }
    return {
      lastBackup: null,
      status: 'failed',
      error: 'Unknown error occurred'
    }
  }
}

export async function updateBackupStatus(status: 'success' | 'failed', error?: string): Promise<void> {
  try {
    const backupRef = doc(db, 'system', 'backup')
    await setDoc(backupRef, {
      lastBackup: new Date(),
      status,
      error,
      updatedAt: new Date()
    }, { merge: true })
  } catch (error) {
    console.error('Failed to update backup status:', error)
  }
} 