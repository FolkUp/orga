# ORGA Backup System - Quick Setup Guide

**Banking-Level Security | Cooper Security Audit Resolution**
**Setup Time:** 30 minutes | **Status:** Production Ready

---

## Prerequisites

✅ **7-Zip** - Download from [7-zip.org](https://7-zip.org)
✅ **Git** - Already configured
✅ **Node.js/npm** - Already configured
✅ **PowerShell 5.0+** - Windows built-in

## Step 1: Environment Setup (5 minutes)

### Set Backup Password
```powershell
# Create secure backup password
[Environment]::SetEnvironmentVariable("ORGA_BACKUP_PASSWORD", "YourSecurePassword123!", "User")

# Verify password is set
echo $env:ORGA_BACKUP_PASSWORD
```

### Create Backup Directory
```powershell
# Create backup storage location
New-Item -ItemType Directory -Path "C:\Backups\ORGA" -Force
```

## Step 2: Configure Git Remotes (10 minutes)

### Add Backup Remotes
```bash
cd "./astro"

# Add primary backup remote (replace with your backup repository)
git remote add origin-backup git@backup-server:orga/orga-underground-academia.git

# Add secondary backup remote
git remote add backup-github git@github.com:FolkUp/orga-backup.git

# Verify remotes
git remote -v
```

## Step 3: Test Backup Scripts (10 minutes)

### Test Source Backup
```bash
# Run source backup test
./scripts/backup-source.sh
```

### Test Filesystem Backup
```powershell
# Run filesystem backup with verification
.\scripts\backup-filesystem.ps1 -Verify -SkipBuiltArtifacts
```

### Test Validation
```bash
# Run comprehensive validation
./scripts/validate-backup.sh
```

## Step 4: Schedule Automation (5 minutes)

### Windows Task Scheduler Setup
```powershell
# Create daily backup task
$action = New-ScheduledTaskAction -Execute "bash" -Argument "./astro\scripts\backup-source.sh"
$trigger = New-ScheduledTaskTrigger -Daily -At "2:00AM"
$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Hours 1)

Register-ScheduledTask -TaskName "ORGA-Daily-Backup" -Action $action -Trigger $trigger -Settings $settings
```

### Monitoring Setup
```powershell
# Create backup monitoring task (runs every 6 hours)
$monitorAction = New-ScheduledTaskAction -Execute "powershell" -Argument "./astro\scripts\backup-monitor.ps1"
$monitorTrigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(30) -RepetitionInterval (New-TimeSpan -Hours 6)

Register-ScheduledTask -TaskName "ORGA-Backup-Monitor" -Action $monitorAction -Trigger $monitorTrigger
```

---

## Quick Verification Checklist

After setup, verify these items work:

- [ ] `./scripts/backup-source.sh` runs without errors
- [ ] `.\scripts\backup-filesystem.ps1` creates encrypted archives
- [ ] `.\scripts\validate-backup.sh` passes all tests
- [ ] `.\scripts\backup-monitor.ps1` reports healthy status
- [ ] Backup files appear in `C:\Backups\ORGA\`
- [ ] Hash files generated in `.backup/` directory
- [ ] Scheduled tasks created in Windows Task Scheduler

---

## Emergency Recovery Commands

### Quick Site Recovery
```bash
# Clone and rebuild from backup
git clone [backup-repo-url] orga-recovery
cd orga-recovery
npm ci
npm run build
```

### File Recovery from Archive
```powershell
# Extract from backup archive
7z x -p"$env:ORGA_BACKUP_PASSWORD" "C:\Backups\ORGA\orga-backup-p1-YYYYMMDD_HHMMSS.7z"
```

### Integrity Verification
```bash
# Verify current files against last known good state
sha256sum -c .backup/file-hashes-YYYYMMDD_HHMMSS.txt
```

---

## Support & Troubleshooting

### Common Issues

**"7z command not found"**
- Install 7-Zip and add to PATH
- Verify: `7z --help`

**"Permission denied" on scripts**
- Run: `chmod +x scripts/*.sh`
- For PowerShell: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`

**"Git remote already exists"**
- Remove existing: `git remote remove origin-backup`
- Re-add with correct URL

### Log Files
- Backup logs: `.config/logs/backup-*.log`
- Monitor logs: `.config/logs/backup-monitor.log`
- Validation logs: `.config/logs/validation-*.log`

### Contact
- **Primary:** Андрей (@johndoe_channel)
- **Technical:** Enhanced Alice v2.0 (automated tools)
- **Security:** Cooper (infrastructure specialist)

---

## Success Metrics

✅ **RTO ≤ 30 minutes** - Full site recovery
✅ **RPO ≤ 6 hours** - Maximum data loss window
✅ **100% integrity** - Hash verification
✅ **Banking-level security** - AES-256 encryption
✅ **Automated monitoring** - 24/7 health checks

**Status:** Ready for production deployment
**Cooper Security Audit:** P1 finding resolved