import { getFirestore } from 'firebase/firestore'
import { db } from '../config/firebase'

export async function checkBackupStatus(): Promise<{
  lastBackup: Date | null
  status: 'success' | 'failed' | 'pending'
  error?: string
}> {
  try {
    const backupRef = db.collection('system').doc('backup')
    const backupDoc = await backupRef.get()
    
    if (!backupDoc.exists) {
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
    return {
      lastBackup: null,
      status: 'failed',
      error: error.message
    }
  }
}

export async function updateBackupStatus(status: 'success' | 'failed', error?: string): Promise<void> {
  try {
    const backupRef = db.collection('system').doc('backup')
    await backupRef.set({
      lastBackup: new Date(),
      status,
      error,
      updatedAt: new Date()
    }, { merge: true })
  } catch (error) {
    console.error('Failed to update backup status:', error)
  }
} 