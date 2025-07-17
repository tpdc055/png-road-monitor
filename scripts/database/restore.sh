#!/bin/bash

# PNG Road Construction Monitor - Database Restore Script
# This script restores the PostgreSQL database from a backup

set -e  # Exit on any error

# Configuration
DB_NAME="${DB_NAME:-png_road_monitor_prod}"
DB_USER="${DB_USER:-png_road_app}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/png-road-monitor}"
RESTORE_FROM_S3="${RESTORE_FROM_S3:-false}"
S3_BUCKET="${S3_BUCKET:-png-road-monitor-backups}"

# Help function
show_help() {
    echo "PNG Road Monitor Database Restore Script"
    echo ""
    echo "Usage: $0 [OPTIONS] BACKUP_FILE"
    echo ""
    echo "Options:"
    echo "  -h, --help          Show this help message"
    echo "  -s, --from-s3       Download backup from S3 instead of using local file"
    echo "  -l, --list          List available backups"
    echo "  -f, --force         Force restore without confirmation"
    echo "  --latest            Restore from the latest available backup"
    echo ""
    echo "Examples:"
    echo "  $0 png_road_monitor_20231214_143000.sql.gz"
    echo "  $0 --from-s3 png_road_monitor_20231214_143000.sql.gz"
    echo "  $0 --latest"
    echo "  $0 --list"
}

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "${BACKUP_DIR}/restore.log"
}

# List available backups
list_backups() {
    echo "Local backups:"
    if ls "${BACKUP_DIR}"/png_road_monitor_*.sql.gz 1> /dev/null 2>&1; then
        ls -lh "${BACKUP_DIR}"/png_road_monitor_*.sql.gz | awk '{print $9, $5, $6, $7, $8}'
    else
        echo "No local backups found"
    fi

    if [ "$RESTORE_FROM_S3" = "true" ] && command -v aws >/dev/null 2>&1; then
        echo ""
        echo "S3 backups:"
        aws s3 ls "s3://$S3_BUCKET/" --human-readable | grep png_road_monitor_
    fi
}

# Get latest backup
get_latest_backup() {
    if [ "$RESTORE_FROM_S3" = "true" ]; then
        aws s3 ls "s3://$S3_BUCKET/" | grep png_road_monitor_ | sort | tail -1 | awk '{print $4}'
    else
        ls -t "${BACKUP_DIR}"/png_road_monitor_*.sql.gz 2>/dev/null | head -1 | xargs basename
    fi
}

# Parse command line arguments
FORCE_RESTORE=false
LIST_ONLY=false
USE_LATEST=false
BACKUP_FILE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -s|--from-s3)
            RESTORE_FROM_S3=true
            shift
            ;;
        -l|--list)
            LIST_ONLY=true
            shift
            ;;
        -f|--force)
            FORCE_RESTORE=true
            shift
            ;;
        --latest)
            USE_LATEST=true
            shift
            ;;
        -*)
            echo "Unknown option $1"
            show_help
            exit 1
            ;;
        *)
            BACKUP_FILE="$1"
            shift
            ;;
    esac
done

# Handle list-only request
if [ "$LIST_ONLY" = "true" ]; then
    list_backups
    exit 0
fi

# Handle latest backup request
if [ "$USE_LATEST" = "true" ]; then
    BACKUP_FILE=$(get_latest_backup)
    if [ -z "$BACKUP_FILE" ]; then
        log "ERROR: No backups found"
        exit 1
    fi
    log "Using latest backup: $BACKUP_FILE"
fi

# Validate backup file parameter
if [ -z "$BACKUP_FILE" ]; then
    echo "ERROR: Backup file not specified"
    show_help
    exit 1
fi

# Check if required tools are available
command -v psql >/dev/null 2>&1 || {
    log "ERROR: psql is required but not installed. Aborting."
    exit 1
}

command -v gunzip >/dev/null 2>&1 || {
    log "ERROR: gunzip is required but not installed. Aborting."
    exit 1
}

# Prepare backup file
if [ "$RESTORE_FROM_S3" = "true" ]; then
    if ! command -v aws >/dev/null 2>&1; then
        log "ERROR: AWS CLI is required for S3 restore but not installed"
        exit 1
    fi

    log "Downloading backup from S3..."
    LOCAL_BACKUP_FILE="${BACKUP_DIR}/$(basename "$BACKUP_FILE")"
    aws s3 cp "s3://$S3_BUCKET/$BACKUP_FILE" "$LOCAL_BACKUP_FILE"
    BACKUP_FILE="$LOCAL_BACKUP_FILE"
else
    # Use full path if not provided
    if [[ "$BACKUP_FILE" != /* ]]; then
        BACKUP_FILE="${BACKUP_DIR}/$BACKUP_FILE"
    fi
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    log "ERROR: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Verify backup file integrity
log "Verifying backup file integrity..."
if ! gzip -t "$BACKUP_FILE"; then
    log "ERROR: Backup file is corrupted: $BACKUP_FILE"
    exit 1
fi

# Confirmation prompt
if [ "$FORCE_RESTORE" != "true" ]; then
    echo ""
    echo "WARNING: This will completely replace the current database!"
    echo "Database: $DB_NAME"
    echo "Host: $DB_HOST:$DB_PORT"
    echo "Backup file: $BACKUP_FILE"
    echo ""
    read -p "Are you sure you want to continue? (type 'yes' to confirm): " CONFIRM

    if [ "$CONFIRM" != "yes" ]; then
        log "Restore cancelled by user"
        exit 0
    fi
fi

log "Starting database restore from: $BACKUP_FILE"

# Create a backup of current database before restore
CURRENT_TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
PRE_RESTORE_BACKUP="${BACKUP_DIR}/pre_restore_${CURRENT_TIMESTAMP}.sql.gz"

log "Creating backup of current database before restore..."
PGPASSWORD="${DB_PASSWORD}" pg_dump \
    --host="$DB_HOST" \
    --port="$DB_PORT" \
    --username="$DB_USER" \
    --dbname="$DB_NAME" \
    --verbose \
    --format=plain \
    --no-owner \
    --no-privileges | gzip > "$PRE_RESTORE_BACKUP"

log "Pre-restore backup saved: $PRE_RESTORE_BACKUP"

# Drop existing connections to the database
log "Terminating existing connections to database..."
PGPASSWORD="${DB_PASSWORD}" psql \
    --host="$DB_HOST" \
    --port="$DB_PORT" \
    --username="$DB_USER" \
    --dbname="postgres" \
    --command="SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid();" \
    > /dev/null 2>&1 || true

# Drop and recreate database
log "Dropping and recreating database..."
PGPASSWORD="${DB_PASSWORD}" psql \
    --host="$DB_HOST" \
    --port="$DB_PORT" \
    --username="$DB_USER" \
    --dbname="postgres" \
    --command="DROP DATABASE IF EXISTS $DB_NAME;"

PGPASSWORD="${DB_PASSWORD}" psql \
    --host="$DB_HOST" \
    --port="$DB_PORT" \
    --username="$DB_USER" \
    --dbname="postgres" \
    --command="CREATE DATABASE $DB_NAME;"

# Restore database from backup
log "Restoring database from backup..."
gunzip -c "$BACKUP_FILE" | PGPASSWORD="${DB_PASSWORD}" psql \
    --host="$DB_HOST" \
    --port="$DB_PORT" \
    --username="$DB_USER" \
    --dbname="$DB_NAME" \
    --quiet

if [ $? -eq 0 ]; then
    log "Database restore completed successfully!"
else
    log "ERROR: Database restore failed"
    log "Pre-restore backup available at: $PRE_RESTORE_BACKUP"
    exit 1
fi

# Verify restore
log "Verifying restore..."
TABLE_COUNT=$(PGPASSWORD="${DB_PASSWORD}" psql \
    --host="$DB_HOST" \
    --port="$DB_PORT" \
    --username="$DB_USER" \
    --dbname="$DB_NAME" \
    --tuples-only \
    --command="SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')

log "Restored database contains $TABLE_COUNT tables"

# Run Prisma migrate to ensure schema is up to date
if command -v bunx >/dev/null 2>&1; then
    log "Running Prisma migrations to ensure schema compatibility..."
    bunx prisma migrate deploy || log "WARNING: Prisma migration failed, manual intervention may be required"
fi

# Clean up downloaded S3 file if applicable
if [ "$RESTORE_FROM_S3" = "true" ] && [ -f "$LOCAL_BACKUP_FILE" ]; then
    rm -f "$LOCAL_BACKUP_FILE"
    log "Cleaned up downloaded backup file"
fi

log "Database restore process completed!"
log "Pre-restore backup saved at: $PRE_RESTORE_BACKUP"
