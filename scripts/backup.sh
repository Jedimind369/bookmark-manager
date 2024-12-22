#!/bin/bash

# Create backup directory with timestamp
BACKUP_DIR="backups/bookmark-manager-$(date +%Y%m%d-%H%M%S)"
mkdir -p $BACKUP_DIR

# Create .env.example if it doesn't exist
cat > .env.example << EOL
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
EOL

# Copy source files (excluding .DS_Store)
rsync -av --exclude '.DS_Store' src/ $BACKUP_DIR/src/
rsync -av --exclude '.DS_Store' public/ $BACKUP_DIR/public/

# Copy config files
cp package.json $BACKUP_DIR/
cp tsconfig.json $BACKUP_DIR/
cp vite.config.ts $BACKUP_DIR/
cp .env.example $BACKUP_DIR/
cp README.md $BACKUP_DIR/
cp index.html $BACKUP_DIR/
cp tailwind.config.js $BACKUP_DIR/
cp postcss.config.js $BACKUP_DIR/

# Create archive
tar -czf "${BACKUP_DIR}.tar.gz" $BACKUP_DIR

# Verify backup
echo "Verifying backup..."
tar -tzf "${BACKUP_DIR}.tar.gz" | sort

# Remove temporary directory
rm -rf $BACKUP_DIR

echo "Backup created at ${BACKUP_DIR}.tar.gz" 