#!/bin/bash
# ORGA Underground Academia - Source Code Backup Script
# Banking-Level Security Standards | Generated: 2026-04-15

set -euo pipefail

# Configuration
BACKUP_DIR="$(pwd)"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_DIR=".config/logs"
LOG_FILE="${LOG_DIR}/backup-${TIMESTAMP}.log"

# Ensure log directory exists
mkdir -p "$LOG_DIR"

echo "[${TIMESTAMP}] Starting ORGA source backup" | tee -a "$LOG_FILE"

# Verify source integrity before backup
echo "[${TIMESTAMP}] Verifying source code integrity..." | tee -a "$LOG_FILE"
if npm run check >> "$LOG_FILE" 2>&1; then
    echo "[${TIMESTAMP}] ✅ Source integrity verified" | tee -a "$LOG_FILE"
else
    echo "[${TIMESTAMP}] ❌ Source integrity check failed" | tee -a "$LOG_FILE"
    exit 1
fi

# Check if there are changes to backup
if git diff --quiet && git diff --staged --quiet; then
    echo "[${TIMESTAMP}] No changes detected, skipping backup" | tee -a "$LOG_FILE"
    exit 0
fi

# Create backup commit
echo "[${TIMESTAMP}] Creating backup commit..." | tee -a "$LOG_FILE"
git add -A
git commit -m "backup: automated source backup ${TIMESTAMP}" || {
    echo "[${TIMESTAMP}] No changes to commit" | tee -a "$LOG_FILE"
    exit 0
}

# Push to primary backup remote
if git remote get-url origin-backup >/dev/null 2>&1; then
    echo "[${TIMESTAMP}] Pushing to primary backup..." | tee -a "$LOG_FILE"
    git push origin-backup main >> "$LOG_FILE" 2>&1 || {
        echo "[${TIMESTAMP}] ❌ Primary backup failed" | tee -a "$LOG_FILE"
    }
else
    echo "[${TIMESTAMP}] ⚠️ Primary backup remote not configured" | tee -a "$LOG_FILE"
fi

# Push to secondary backup remote
if git remote get-url backup-github >/dev/null 2>&1; then
    echo "[${TIMESTAMP}] Pushing to secondary backup..." | tee -a "$LOG_FILE"
    git push backup-github main >> "$LOG_FILE" 2>&1 || {
        echo "[${TIMESTAMP}] ❌ Secondary backup failed" | tee -a "$LOG_FILE"
    }
else
    echo "[${TIMESTAMP}] ⚠️ Secondary backup remote not configured" | tee -a "$LOG_FILE"
fi

# Generate integrity hash for current state
echo "[${TIMESTAMP}] Generating integrity hashes..." | tee -a "$LOG_FILE"
find src public -type f \( -name "*.ts" -o -name "*.js" -o -name "*.astro" -o -name "*.svelte" -o -name "*.md" -o -name "*.json" -o -name "*.css" -o -name "*.svg" -o -name "*.ico" \) -exec sha256sum {} \; > ".backup/file-hashes-${TIMESTAMP}.txt"

echo "[${TIMESTAMP}] ✅ ORGA source backup completed successfully" | tee -a "$LOG_FILE"

# Cleanup old log files (keep last 30 days)
find "$LOG_DIR" -name "backup-*.log" -mtime +30 -delete 2>/dev/null || true

exit 0