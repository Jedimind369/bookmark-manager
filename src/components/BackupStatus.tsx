import { useEffect, useState } from 'react'
import { checkBackupStatus } from '../utils/backup'

export function BackupStatus() {
  const [status, setStatus] = useState<{
    lastBackup: Date | null
    status: 'success' | 'failed' | 'pending'
    error?: string
  }>({
    lastBackup: null,
    status: 'pending'
  })

  useEffect(() => {
    const checkStatus = async () => {
      const result = await checkBackupStatus()
      setStatus(result)
    }
    
    checkStatus()
    const interval = setInterval(checkStatus, 5 * 60 * 1000) // Check every 5 minutes
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-sm text-gray-600">
      {status.status === 'success' && (
        <span className="text-green-600">
          ✓ Last backup: {status.lastBackup?.toLocaleString()}
        </span>
      )}
      {status.status === 'failed' && (
        <span className="text-red-600">
          ✗ Backup failed: {status.error}
        </span>
      )}
      {status.status === 'pending' && (
        <span className="text-yellow-600">
          ⟳ Backup pending...
        </span>
      )}
    </div>
  )
} 