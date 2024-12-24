
#!/bin/bash
set -e

echo "Starting backup process..."
pg_dump $VITE_DATABASE_URL > backup.sql
echo "Database backup completed"

# Store backup in Replit's persistent storage
mkdir -p ~/.backup
cp backup.sql ~/.backup/latest_backup.sql
echo "Backup stored in persistent storage"

# Cleanup
rm backup.sql
echo "Backup process completed successfully"
