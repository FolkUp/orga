# ORGA Backup Directory

This directory contains backup-related files and integrity verification data for the Underground Academia platform.

## Structure

- `*hash*.txt` - SHA-256 hash files for integrity verification
- `*.7z` - Encrypted backup archives (excluded from git)
- `*.zip` - Compressed backup archives (excluded from git)

## Security Notice

⚠️ **Backup archives are encrypted and excluded from version control for security.**

- Archive files contain sensitive project data
- Encryption key stored in `ORGA_BACKUP_PASSWORD` environment variable
- Only hash files are tracked in git for integrity verification

## Usage

### Generate integrity hashes:
```bash
cd /path/to/orga/astro
find src public -type f -exec sha256sum {} \; > .backup/file-hashes-$(date +%Y%m%d_%H%M%S).txt
```

### Verify file integrity:
```bash
sha256sum -c .backup/file-hashes-YYYYMMDD_HHMMSS.txt
```

### Create encrypted backup:
```bash
# Ensure ORGA_BACKUP_PASSWORD environment variable is set
# Run backup script
./scripts/backup-filesystem.ps1 -Verify
```

## Retention Policy

- Hash files: Permanent retention
- Backup archives: 30 days for Priority 1, 14 days for Priority 2-3
- Log files: 30 days

Last updated: 2026-04-15