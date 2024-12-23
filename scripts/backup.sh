#!/bin/bash

# Exit on any error
set -e

# Function to log messages with timestamp
log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Function to handle errors
handle_error() {
  local line_number=$1
  local error_code=$2
  log "Error occurred in line ${line_number} with exit code ${error_code}"
  exit ${error_code}
}

# Set up error handling
trap 'handle_error ${LINENO} $?' ERR

# Create backup directory
BACKUP_DIR="backups/$(date +%Y%m%d-%H%M%S)"
log "Creating backup directory: ${BACKUP_DIR}"
mkdir -p "${BACKUP_DIR}"

# Export Firestore data
if [ -n "${FIREBASE_PROJECT_ID}" ]; then
  log "Exporting Firestore data..."
  firebase firestore:export "${BACKUP_DIR}/firestore.json" --project "${FIREBASE_PROJECT_ID}"
else
  log "Warning: FIREBASE_PROJECT_ID not set, skipping Firestore export"
fi

# Create source code archive
log "Creating source code archive..."
git archive --format=tar.gz -o "${BACKUP_DIR}/source.tar.gz" HEAD

# Create backup info file
log "Creating backup info file..."
{
  echo "Backup created at: $(date)"
  echo "Git commit: $(git rev-parse HEAD)"
  echo "Git branch: $(git rev-parse --abbrev-ref HEAD)"
  echo "Firebase project: ${FIREBASE_PROJECT_ID:-Not specified}"
} > "${BACKUP_DIR}/backup-info.txt"

# Create checksum file
log "Creating checksums..."
(cd "${BACKUP_DIR}" && find . -type f ! -name "checksums.sha256" -exec sha256sum {} \; > checksums.sha256)

# Verify checksums
log "Verifying checksums..."
(cd "${BACKUP_DIR}" && sha256sum -c checksums.sha256)

# Update backup status
log "Updating backup status..."
echo "$(date +'%Y-%m-%d %H:%M:%S')" > "last_successful_backup.txt"

log "Backup completed successfully" 