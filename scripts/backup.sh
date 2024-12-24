
#!/bin/bash

# Set backup directory with timestamp
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Copy important directories and files
cp -r src/ "$BACKUP_DIR/"
cp -r public/ "$BACKUP_DIR/"
cp package.json "$BACKUP_DIR/"
cp tsconfig.json "$BACKUP_DIR/"

echo "Backup completed in $BACKUP_DIR"
