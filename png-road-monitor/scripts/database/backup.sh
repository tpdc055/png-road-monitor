#!/bin/bash

# PNG Road Construction Monitor - Database Backup Script
# This script creates automated backups of the PostgreSQL database

set -e  # Exit on any error

# Configuration
DB_NAME="${DB_NAME:-png_road_monitor_prod}"
DB_USER="${DB_USER:-png_road_backup}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/png-road-monitor}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
S3_BUCKET="${S3_BUCKET:-png-road-monitor-backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/png_road_monitor_${TIMESTAMP}.sql"
COMPRESSED_FILE="${BACKUP_FILE}.gz"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "${BACKUP_DIR}/backup.log"
}

log "Starting database backup..."

# Check if required tools are available
command -v pg_dump >/dev/null 2>&1 || {
    log "ERROR: pg_dump is required but not installed. Aborting."
    exit 1
}

command -v gzip >/dev/null 2>&1 || {
    log "ERROR: gzip is required but not installed. Aborting."
    exit 1
}

# Create database dump
log "Creating database dump for $DB_NAME..."
PGPASSWORD="${DB_PASSWORD}" pg_dump \
    --host="$DB_HOST" \
    --port="$DB_PORT" \
    --username="$DB_USER" \
    --dbname="$DB_NAME" \
    --verbose \
    --format=plain \
    --no-owner \
    --no-privileges \
    --file="$BACKUP_FILE"

if [ $? -eq 0 ]; then
    log "Database dump created successfully: $BACKUP_FILE"
else
    log "ERROR: Database dump failed"
    exit 1
fi

# Compress the backup
log "Compressing backup file..."
gzip "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    log "Backup compressed successfully: $COMPRESSED_FILE"
else
    log "ERROR: Backup compression failed"
    exit 1
fi

# Get file size for logging
BACKUP_SIZE=$(du -h "$COMPRESSED_FILE" | cut -f1)
log "Backup size: $BACKUP_SIZE"

# Upload to S3 if configured
if [ -n "$S3_BUCKET" ] && command -v aws >/dev/null 2>&1; then
    log "Uploading backup to S3..."
    aws s3 cp "$COMPRESSED_FILE" "s3://$S3_BUCKET/$(basename "$COMPRESSED_FILE")" \
        --storage-class STANDARD_IA

    if [ $? -eq 0 ]; then
        log "Backup uploaded to S3 successfully"
    else
        log "WARNING: S3 upload failed, backup kept locally only"
    fi
else
    log "S3 upload skipped (not configured or AWS CLI not available)"
fi

# Clean up old backups (local)
log "Cleaning up old local backups (older than $RETENTION_DAYS days)..."
find "$BACKUP_DIR" -name "png_road_monitor_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
OLD_LOGS=$(find "$BACKUP_DIR" -name "backup.log.*" -type f -mtime +$RETENTION_DAYS)
if [ -n "$OLD_LOGS" ]; then
    echo "$OLD_LOGS" | xargs rm -f
fi

# Clean up old backups (S3) if configured
if [ -n "$S3_BUCKET" ] && command -v aws >/dev/null 2>&1; then
    log "Cleaning up old S3 backups..."
    CUTOFF_DATE=$(date -d "$RETENTION_DAYS days ago" +%Y-%m-%d)
    aws s3 ls "s3://$S3_BUCKET/" | while read -r line; do
        CREATE_DATE=$(echo "$line" | awk '{print $1}')
        FILE_NAME=$(echo "$line" | awk '{print $4}')
        if [[ "$CREATE_DATE" < "$CUTOFF_DATE" && "$FILE_NAME" == png_road_monitor_* ]]; then
            aws s3 rm "s3://$S3_BUCKET/$FILE_NAME"
            log "Deleted old S3 backup: $FILE_NAME"
        fi
    done
fi

# Verify backup integrity
log "Verifying backup integrity..."
if gzip -t "$COMPRESSED_FILE"; then
    log "Backup integrity verified successfully"
else
    log "ERROR: Backup integrity check failed"
    exit 1
fi

# Generate backup report
TOTAL_BACKUPS=$(find "$BACKUP_DIR" -name "png_road_monitor_*.sql.gz" -type f | wc -l)
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)

log "Backup completed successfully!"
log "Total local backups: $TOTAL_BACKUPS"
log "Total backup directory size: $TOTAL_SIZE"

# Send notification if webhook URL is configured
if [ -n "$WEBHOOK_URL" ]; then
    curl -X POST "$WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -d "{
            \"text\": \"PNG Road Monitor: Database backup completed successfully\",
            \"details\": {
                \"timestamp\": \"$TIMESTAMP\",
                \"size\": \"$BACKUP_SIZE\",
                \"total_backups\": $TOTAL_BACKUPS
            }
        }" || log "WARNING: Notification webhook failed"
fi

log "Backup script finished"
