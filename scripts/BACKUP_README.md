# ORGA Backup System Documentation

**Version:** 1.0
**Date:** April 2026
**Banking-Level Security Implementation**

## Overview

The ORGA backup system implements a three-tier backup strategy with banking-level security standards:

1. **Source Code & Content Backup** (Linux/macOS) - Git bundles + content archives
2. **Filesystem & Environment Backup** (Windows) - System configuration + metadata
3. **Validation & Monitoring** - Integrity verification + health monitoring

### Security Features

- **AES-256-CBC encryption** for all backup archives
- **SHA-256 integrity verification** with checksums
- **Banking-level compliance** with audit trails
- **Zero-trust validation** with restore testing
- **Automated monitoring** with SLA compliance

### Architecture

```
backup/
├── archives/          # Encrypted backup files (.enc + .sha256)
├── temp/             # Temporary processing (auto-cleanup)
├── metadata/         # Backup metadata (JSON)
├── logs/             # Operation logs + alerts
├── reports/          # Health reports + analytics
└── validation/       # Validation tests + results
```

## Requirements

### System Requirements

- **Linux/macOS:** bash, git, tar, gzip, openssl, sha256sum
- **Windows:** PowerShell 5.1+, 7-Zip (optional), .NET 4.7+
- **Storage:** 500MB+ free space for backup operations
- **Network:** Optional (for cloud backup integration)

### Security Requirements

- **Encryption key:** `~/.backup/orga-backup.key` (auto-generated)
- **File permissions:** 600 for keys, 700 for backup directories
- **Integrity verification:** All backups validated before storage

## Quick Start

### 1. Initial Setup

```bash
# Create backup directories
mkdir -p ~/.backup
mkdir -p /backup/orga/{archives,temp,metadata,logs,validation}

# Set proper permissions
chmod 700 ~/.backup
chmod 700 /backup/orga
```

### 2. Run Full Backup

```bash
# Source code + content backup (Linux/macOS)
cd /path/to/orga
./scripts/backup-source.sh

# System configuration backup (Windows)
powershell -File "./scripts/backup-filesystem.ps1"
```

### 3. Validate Backups

```bash
# Validate all backups
./scripts/validate-backup.sh

# Validate specific backup
./scripts/validate-backup.sh backup-file.tar.gz.enc
```

### 4. Monitor System Health

```bash
# Check current status
powershell -File "./scripts/backup-monitor.ps1" -Mode status

# Generate health report
powershell -File "./scripts/backup-monitor.ps1" -Mode report
```

## Detailed Usage

### Source Code Backup (`backup-source.sh`)

Creates comprehensive backup of project source code and content.

**Features:**
- Git repository bundle (complete history)
- Content archive (source files, configs, documentation)
- AES-256 encryption with integrity verification
- Automated cleanup of old backups (30-day retention)
- Comprehensive metadata generation

**Usage:**
```bash
# Standard backup
./scripts/backup-source.sh

# View backup status
ls -la /backup/orga/archives/

# Check logs
tail -f /backup/orga/logs/backup-$(date +%Y%m).log
```

**Output Files:**
- `orga-source-YYYYMMDD_HHMMSS.tar.gz.enc` - Encrypted backup
- `orga-source-YYYYMMDD_HHMMSS.tar.gz.enc.sha256` - Integrity checksum
- `orga-source-YYYYMMDD_HHMMSS.json` - Backup metadata

### Filesystem Backup (`backup-filesystem.ps1`)

Windows-specific backup for system configuration and environment.

**Features:**
- Project configuration files (.vscode, package.json, etc.)
- System information and environment variables
- Windows-specific metadata and file statistics
- 7-Zip compression (if available) or PowerShell Compress-Archive
- AES-256 encryption with .NET crypto libraries

**Usage:**
```powershell
# Standard backup
.\scripts\backup-filesystem.ps1

# Dry run (test without creating files)
.\scripts\backup-filesystem.ps1 -DryRun

# Verbose output
.\scripts\backup-filesystem.ps1 -Verbose

# Custom configuration
.\scripts\backup-filesystem.ps1 -ConfigPath "C:\custom\config.json"
```

**Configuration File:** `~/.backup/orga-backup-config.json`
```json
{
    "BackupBasePath": "C:\\backup\\orga",
    "ProjectPath": "C:\\JOHNDOE_CLAUDE\\orga",
    "EncryptionKeyFile": "%USERPROFILE%\\.backup\\orga-backup.key",
    "RetentionDays": 30,
    "CompressionLevel": "Optimal",
    "IncludeSystemInfo": true,
    "ExcludePatterns": ["*.tmp", "*.log", "node_modules", "dist"]
}
```

### Backup Validation (`validate-backup.sh`)

Comprehensive integrity verification and restore testing.

**Validation Tests:**
1. **Checksum Verification** - SHA-256 integrity check
2. **Decryption Test** - Verify encryption key and decryption
3. **Archive Extraction** - Test tar/compression extraction
4. **Restore Simulation** - Full restore test to temporary directory
5. **Git Bundle Verification** - Validate git bundle integrity

**Usage:**
```bash
# Validate all backups
./scripts/validate-backup.sh

# Validate specific backup
./scripts/validate-backup.sh /backup/orga/archives/backup.tar.gz.enc

# List available backups
./scripts/validate-backup.sh --list

# View latest validation report
./scripts/validate-backup.sh --report

# Cleanup old validation files
./scripts/validate-backup.sh --cleanup
```

**Validation Report:**
```
BACKUP: orga-source-20260414_153022.tar.gz.enc
TIMESTAMP: 2026-04-14 15:30:45
SIZE: 15728640 bytes
CHECKSUM: PASS - SHA-256 verified
DECRYPTION: PASS - Archive format verified
EXTRACTION: PASS - 1247 files extracted
RESTORE: PASS - Critical files recovered
GIT_BUNDLE: PASS - 15 refs verified
OVERALL: 5/5 tests passed
```

### Backup Monitoring (`backup-monitor.ps1`)

Continuous monitoring with alerting and reporting.

**Monitoring Modes:**

1. **Status** - Current system health check
2. **Alert** - Send alerts for issues (console + optional email)
3. **Report** - Generate detailed analytics report
4. **Health** - JSON health data for integration
5. **Schedule** - Continuous monitoring with alerting

**Usage:**
```powershell
# Check current status
.\scripts\backup-monitor.ps1 -Mode status

# Send alert if issues detected
.\scripts\backup-monitor.ps1 -Mode alert -SendEmail -EmailTo "admin@folkup.app"

# Generate 30-day report
.\scripts\backup-monitor.ps1 -Mode report

# Get health data as JSON
.\scripts\backup-monitor.ps1 -Mode health | ConvertFrom-Json

# Start continuous monitoring
.\scripts\backup-monitor.ps1 -Mode schedule
```

**Health Status Levels:**
- **HEALTHY** - All systems operational, no issues
- **WARNING** - Minor issues detected (old backups, disk space)
- **CRITICAL** - Major issues (missing backups, corruption)
- **ERROR** - System failures (cannot assess health)

**Alert Thresholds (configurable):**
- **MaxBackupAge:** 24 hours (alert if no backup in 24h)
- **MinBackupSize:** 1MB (alert if backup suspiciously small)
- **MaxFailureRate:** 20% (alert if >20% of operations fail)
- **DiskSpaceWarning:** 80% (warn at 80% disk usage)
- **DiskSpaceCritical:** 95% (critical at 95% disk usage)

## Automation & Scheduling

### Linux/macOS Cron Setup

```bash
# Add to crontab (daily backup at 2 AM)
crontab -e

# Add this line:
0 2 * * * /path/to/orga/scripts/backup-source.sh

# Validation every Sunday at 3 AM
0 3 * * 0 /path/to/orga/scripts/validate-backup.sh
```

### Windows Task Scheduler

```powershell
# Create scheduled task for daily backup
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-File 'C:\path\to\orga\scripts\backup-filesystem.ps1'"
$trigger = New-ScheduledTaskTrigger -Daily -At "02:00"
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
Register-ScheduledTask -TaskName "ORGA Backup" -Action $action -Trigger $trigger -Settings $settings

# Create monitoring task (every 6 hours)
$monitorAction = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-File 'C:\path\to\orga\scripts\backup-monitor.ps1' -Mode alert"
$monitorTrigger = New-ScheduledTaskTrigger -Once -At "00:00" -RepetitionInterval (New-TimeSpan -Hours 6) -RepetitionDuration (New-TimeSpan -Days 365)
Register-ScheduledTask -TaskName "ORGA Backup Monitor" -Action $monitorAction -Trigger $monitorTrigger -Settings $settings
```

## Recovery Procedures

### Full Restore from Backup

1. **Identify Target Backup:**
```bash
./scripts/validate-backup.sh --list
```

2. **Create Recovery Directory:**
```bash
mkdir -p /recovery/orga
cd /recovery/orga
```

3. **Decrypt and Extract:**
```bash
# Decrypt backup
openssl enc -aes-256-cbc -d -in /backup/orga/archives/backup.tar.gz.enc -out backup.tar.gz -pass file:~/.backup/orga-backup.key

# Extract archive
tar xzf backup.tar.gz

# Extract git bundle
git clone orga-source-YYYYMMDD_HHMMSS.bundle orga-git
```

4. **Verify Recovery:**
```bash
# Check git repository
cd orga-git
git log --oneline -10

# Check content
ls -la
```

### Partial Recovery (Specific Files)

```bash
# List contents without extracting
openssl enc -aes-256-cbc -d -in backup.tar.gz.enc -pass file:~/.backup/orga-backup.key | tar tzf -

# Extract specific files
openssl enc -aes-256-cbc -d -in backup.tar.gz.enc -pass file:~/.backup/orga-backup.key | tar xzf - "path/to/specific/file"
```

### Emergency Recovery Kit

**Required Files for Recovery:**
- Encrypted backup file (`.enc`)
- Checksum file (`.sha256`)
- Encryption key (`~/.backup/orga-backup.key`)
- Backup metadata (`.json`)

**Recovery Commands:**
```bash
# Emergency decryption (if scripts unavailable)
openssl enc -aes-256-cbc -d -in backup.enc -out backup.tar.gz -pass file:key.txt

# Verify integrity
sha256sum backup.tar.gz.enc
cat backup.tar.gz.enc.sha256

# Extract
tar xzf backup.tar.gz
```

## Security Considerations

### Encryption Details

- **Algorithm:** AES-256-CBC with random salt
- **Key Management:** 256-bit random keys, Base64 encoded
- **Initialization Vector:** Random IV per file, prepended to encrypted data
- **Integrity:** SHA-256 checksums for tamper detection

### Key Management

**Key Storage:**
- Location: `~/.backup/orga-backup.key`
- Permissions: 600 (owner read/write only)
- Format: Base64-encoded 256-bit key

**Key Rotation (recommended quarterly):**
```bash
# Backup current key
cp ~/.backup/orga-backup.key ~/.backup/orga-backup.key.$(date +%Y%m%d)

# Generate new key
openssl rand -base64 32 > ~/.backup/orga-backup.key
chmod 600 ~/.backup/orga-backup.key

# Re-encrypt old backups with new key (optional)
```

**Key Backup Strategy:**
- Store copy in secure password manager
- Print physical copy for secure storage
- Consider key escrow for organizational use

### Compliance Features

**Audit Trail:**
- All operations logged with timestamps
- Integrity verification at every step
- Validation reports with forensic detail
- Alert history with resolution tracking

**Banking-Level Standards:**
- Zero-trust verification (validate before trust)
- Immutable backup files (encrypted, checksummed)
- Comprehensive monitoring (SLA compliance)
- Automated remediation (self-healing where possible)

## Troubleshooting

### Common Issues

**1. Permission Denied**
```bash
# Fix backup directory permissions
chmod 700 ~/.backup /backup/orga
chmod 600 ~/.backup/orga-backup.key
```

**2. Encryption Key Not Found**
```bash
# Generate new encryption key
mkdir -p ~/.backup
openssl rand -base64 32 > ~/.backup/orga-backup.key
chmod 600 ~/.backup/orga-backup.key
```

**3. Validation Failures**
```bash
# Check backup integrity
sha256sum backup.tar.gz.enc
cat backup.tar.gz.enc.sha256

# Test decryption manually
openssl enc -aes-256-cbc -d -in backup.enc -pass file:~/.backup/orga-backup.key | file -
```

**4. Disk Space Issues**
```bash
# Clean up old backups
find /backup/orga/archives -name "orga-*.enc" -mtime +30 -delete
find /backup/orga/logs -name "*.log" -mtime +90 -delete
```

**5. Windows PowerShell Execution Policy**
```powershell
# Allow script execution (as Administrator)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Log Analysis

**Important Log Patterns:**
```bash
# Successful operations
grep "SUCCESS" /backup/orga/logs/*.log

# Errors requiring attention
grep "ERROR\|CRITICAL" /backup/orga/logs/*.log

# Monitoring alerts
cat /backup/orga/logs/alerts.log

# Recent validation results
ls -lt /backup/orga/validation/validation-report-*.txt | head -1
```

### Performance Optimization

**Large Repository Optimization:**
- Use `git bundle --all --branches` for complete history
- Consider `--shallow` for recent-only backups
- Enable 7-Zip compression for better ratios

**Storage Optimization:**
- Implement backup deduplication
- Use compression level "Optimal" vs "Fastest"
- Regular cleanup of temporary files

## Monitoring & Alerting

### Health Metrics

The monitoring system tracks these key metrics:

**Backup Health:**
- Last backup timestamp
- Backup file size trends
- Success/failure rates
- Validation test results

**System Health:**
- Disk space utilization
- Backup directory integrity
- Encryption key accessibility
- Log file growth

**Performance Metrics:**
- Backup operation duration
- Compression ratios
- Validation test times
- Recovery simulation results

### Alert Configuration

**Email Alerts (optional):**
```json
{
    "EmailSettings": {
        "SmtpServer": "smtp.gmail.com",
        "Port": 587,
        "UseSsl": true,
        "From": "backup-monitor@yourdomain.com"
    }
}
```

**Integration Options:**
- Console output for manual monitoring
- JSON output for system integration
- Log files for centralized logging
- Email alerts for critical issues

## Operational Procedures

### Daily Operations

1. **Monitor Status** - Check backup system health
2. **Review Alerts** - Address any issues identified
3. **Verify Space** - Ensure adequate disk space
4. **Check Logs** - Review operation logs for issues

### Weekly Operations

1. **Validation Test** - Run comprehensive backup validation
2. **Report Review** - Analyze weekly performance report
3. **Cleanup Tasks** - Remove old temporary files
4. **Health Assessment** - Full system health check

### Monthly Operations

1. **Key Rotation** - Rotate encryption keys (quarterly)
2. **Full Recovery Test** - Test complete restore procedure
3. **Performance Review** - Analyze monthly trends
4. **Documentation Update** - Update procedures if changed

### Emergency Procedures

**Critical Backup Failure:**
1. Immediate alert to administrator
2. Investigate root cause (disk space, permissions, corruption)
3. Manual backup if automated system fails
4. Document incident for future prevention

**Data Recovery Emergency:**
1. Identify most recent valid backup
2. Validate backup integrity before restore
3. Create recovery environment
4. Execute restore procedure with verification
5. Document recovery process and lessons learned

## Support & Maintenance

### Version History

- **v1.0** (April 2026) - Initial implementation with banking-level security

### Future Enhancements

- Cloud storage integration (AWS S3, Azure Blob)
- Backup deduplication for storage efficiency
- Metrics dashboard for operational visibility
- Integration with organizational monitoring systems

### Contact Information

For technical support or questions about the backup system:

- **Documentation:** This README file
- **Log Files:** `/backup/orga/logs/` directory
- **Issue Tracking:** Project issue tracker
- **Emergency Procedures:** Follow organizational incident response

---

**ORGA Backup System v1.0**
**Implementation Date:** April 2026
**Banking-Level Security Compliance**
**Disaster Recovery Ready**