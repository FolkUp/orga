# ORGA Underground Academia - Backup Health Monitor Script
# Banking-Level Security Standards | Generated: 2026-04-15

param(
    [string]$ProjectPath = ".\astro",
    [string]$AlertEmail = "admin@folkup.app",
    [int]$MaxBackupAge = 25,  # hours
    [switch]$Silent = $false,
    [switch]$TestMode = $false
)

# Configuration
$ErrorActionPreference = "Continue"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$logPath = "$ProjectPath\.config\logs"
$monitorLogFile = "$logPath\backup-monitor.log"

# Ensure log directory exists
if (-not (Test-Path $logPath)) {
    New-Item -ItemType Directory -Path $logPath -Force | Out-Null
}

function Write-MonitorLog {
    param($Message, $Level = "INFO")
    $logMessage = "[$timestamp] [$Level] $Message"

    if (-not $Silent) {
        switch ($Level) {
            "ERROR" { Write-Host $logMessage -ForegroundColor Red }
            "WARN" { Write-Host $logMessage -ForegroundColor Yellow }
            "SUCCESS" { Write-Host $logMessage -ForegroundColor Green }
            default { Write-Host $logMessage }
        }
    }

    Add-Content -Path $monitorLogFile -Value $logMessage
}

function Send-Alert {
    param($Subject, $Body, $Priority = "Normal")

    if ($TestMode) {
        Write-MonitorLog "TEST MODE: Would send alert - $Subject" "WARN"
        Write-MonitorLog "Alert body: $Body" "INFO"
        return
    }

    try {
        # For production, this would integrate with your email system
        # Example using Send-MailMessage (requires SMTP configuration)
        # Send-MailMessage -To $AlertEmail -Subject $Subject -Body $Body -SmtpServer "smtp.folkup.app"

        # For now, log the alert
        Write-MonitorLog "ALERT TRIGGERED: $Subject" "ERROR"
        Write-MonitorLog "Alert details: $Body" "ERROR"

        # You could also integrate with:
        # - Microsoft Teams webhook
        # - Slack webhook
        # - Windows Event Log
        # - Azure Monitor
        # - PagerDuty

    } catch {
        Write-MonitorLog "Failed to send alert: $($_.Exception.Message)" "ERROR"
    }
}

Write-MonitorLog "Starting ORGA backup health monitoring"

# Initialize health status
$healthStatus = @{
    BackupAge = $null
    BackupExists = $false
    GitStatus = $null
    BuildStatus = $null
    FileIntegrity = $null
    Alerts = @()
}

# Check 1: Last backup age
Write-MonitorLog "Checking backup file age..."

$backupLogs = Get-ChildItem -Path $logPath -Filter "backup-*.log" -ErrorAction SilentlyContinue |
              Sort-Object LastWriteTime -Descending

if ($backupLogs) {
    $lastBackup = $backupLogs[0]
    $backupAge = (Get-Date) - $lastBackup.LastWriteTime
    $healthStatus.BackupAge = [math]::Round($backupAge.TotalHours, 1)
    $healthStatus.BackupExists = $true

    Write-MonitorLog "Last backup: $($lastBackup.Name) ($(${healthStatus.BackupAge}) hours ago)"

    if ($backupAge.TotalHours -gt $MaxBackupAge) {
        $alert = "Backup is overdue! Last backup was $(${healthStatus.BackupAge}) hours ago."
        $healthStatus.Alerts += $alert
        Write-MonitorLog $alert "ERROR"

        Send-Alert -Subject "ORGA Backup Alert - Overdue Backup" -Body $alert -Priority "High"
    } else {
        Write-MonitorLog "Backup age is within acceptable limits" "SUCCESS"
    }
} else {
    $alert = "No backup log files found!"
    $healthStatus.Alerts += $alert
    Write-MonitorLog $alert "ERROR"

    Send-Alert -Subject "ORGA Backup Alert - No Backups Found" -Body $alert -Priority "Critical"
}

# Check 2: Git repository status
Write-MonitorLog "Checking git repository status..."

try {
    Push-Location $ProjectPath

    # Check if git repository exists
    if (Test-Path ".git") {
        # Check for uncommitted changes
        $gitStatus = & git status --porcelain 2>$null
        $hasChanges = $gitStatus.Count -gt 0

        if ($hasChanges) {
            $healthStatus.GitStatus = "Has uncommitted changes"
            Write-MonitorLog "Git repository has $($gitStatus.Count) uncommitted changes" "WARN"

            # If changes are old, alert
            $gitModified = & git diff --name-only HEAD 2>$null
            if ($gitModified) {
                $oldestChange = $null
                foreach ($file in $gitModified) {
                    if (Test-Path $file) {
                        $fileAge = (Get-Date) - (Get-Item $file).LastWriteTime
                        if (-not $oldestChange -or $fileAge -gt $oldestChange) {
                            $oldestChange = $fileAge
                        }
                    }
                }

                if ($oldestChange -and $oldestChange.TotalHours -gt 24) {
                    $alert = "Git repository has uncommitted changes older than 24 hours"
                    $healthStatus.Alerts += $alert
                    Write-MonitorLog $alert "WARN"
                }
            }
        } else {
            $healthStatus.GitStatus = "Clean"
            Write-MonitorLog "Git repository is clean" "SUCCESS"
        }

        # Check remote connectivity
        try {
            & git fetch --dry-run 2>$null
            Write-MonitorLog "Git remote connectivity verified" "SUCCESS"
        } catch {
            Write-MonitorLog "Git remote connectivity issues detected" "WARN"
        }
    } else {
        $healthStatus.GitStatus = "No git repository"
        Write-MonitorLog "No git repository found" "WARN"
    }
} catch {
    $healthStatus.GitStatus = "Error checking git status"
    Write-MonitorLog "Error checking git status: $($_.Exception.Message)" "ERROR"
} finally {
    Pop-Location
}

# Check 3: Build system health
Write-MonitorLog "Checking build system health..."

try {
    Push-Location $ProjectPath

    if (Test-Path "package.json") {
        # Quick package.json validation
        try {
            $packageJson = Get-Content "package.json" | ConvertFrom-Json
            $healthStatus.BuildStatus = "Package.json valid"
            Write-MonitorLog "Package.json validation passed" "SUCCESS"
        } catch {
            $healthStatus.BuildStatus = "Package.json invalid"
            $alert = "Package.json is corrupted or invalid"
            $healthStatus.Alerts += $alert
            Write-MonitorLog $alert "ERROR"
        }

        # Check if node_modules exists
        if (Test-Path "node_modules") {
            Write-MonitorLog "Node modules directory exists" "SUCCESS"
        } else {
            Write-MonitorLog "Node modules not installed" "WARN"
        }

        # Check build artifacts
        if (Test-Path "dist") {
            $distFiles = (Get-ChildItem "dist" -Recurse).Count
            Write-MonitorLog "Build artifacts present ($distFiles files)" "SUCCESS"
        } else {
            Write-MonitorLog "No build artifacts found" "INFO"
        }
    } else {
        $healthStatus.BuildStatus = "No package.json"
        Write-MonitorLog "No package.json found" "WARN"
    }
} catch {
    $healthStatus.BuildStatus = "Error checking build system"
    Write-MonitorLog "Error checking build system: $($_.Exception.Message)" "ERROR"
} finally {
    Pop-Location
}

# Check 4: File integrity
Write-MonitorLog "Checking file integrity..."

try {
    Push-Location $ProjectPath

    $backupHashFiles = Get-ChildItem -Path ".backup" -Filter "*hash*.txt" -ErrorAction SilentlyContinue |
                       Sort-Object LastWriteTime -Descending

    if ($backupHashFiles) {
        $latestHashFile = $backupHashFiles[0]
        Write-MonitorLog "Found integrity hash file: $($latestHashFile.Name)"

        # Simple hash file validation (check if it exists and is readable)
        try {
            $hashContent = Get-Content $latestHashFile.FullName -TotalCount 5
            if ($hashContent) {
                $healthStatus.FileIntegrity = "Hash file readable"
                Write-MonitorLog "File integrity hashes are accessible" "SUCCESS"
            }
        } catch {
            $healthStatus.FileIntegrity = "Hash file corrupted"
            Write-MonitorLog "File integrity hash file appears corrupted" "ERROR"
        }
    } else {
        $healthStatus.FileIntegrity = "No hash files found"
        Write-MonitorLog "No integrity hash files found" "INFO"
    }
} catch {
    $healthStatus.FileIntegrity = "Error checking file integrity"
    Write-MonitorLog "Error checking file integrity: $($_.Exception.Message)" "ERROR"
} finally {
    Pop-Location
}

# Check 5: Storage space
Write-MonitorLog "Checking storage space..."

try {
    $driveInfo = Get-PSDrive -Name (Split-Path $ProjectPath -Qualifier).TrimEnd(':')
    $freeSpaceGB = [math]::Round($driveInfo.Free / 1GB, 2)
    $totalSpaceGB = [math]::Round(($driveInfo.Free + $driveInfo.Used) / 1GB, 2)
    $freePercentage = [math]::Round(($driveInfo.Free / ($driveInfo.Free + $driveInfo.Used)) * 100, 1)

    Write-MonitorLog "Storage: $freeSpaceGB GB free of $totalSpaceGB GB (${freePercentage}%)"

    if ($freePercentage -lt 10) {
        $alert = "Low disk space warning: Only ${freePercentage}% free space remaining"
        $healthStatus.Alerts += $alert
        Write-MonitorLog $alert "ERROR"

        Send-Alert -Subject "ORGA Storage Alert - Low Disk Space" -Body $alert -Priority "High"
    } elseif ($freePercentage -lt 20) {
        Write-MonitorLog "Disk space is getting low (${freePercentage}% free)" "WARN"
    } else {
        Write-MonitorLog "Storage space is adequate" "SUCCESS"
    }
} catch {
    Write-MonitorLog "Error checking storage space: $($_.Exception.Message)" "ERROR"
}

# Generate health report
Write-MonitorLog "=== Health Status Summary ==="
Write-MonitorLog "Backup Age: $(if ($healthStatus.BackupAge) { "${($healthStatus.BackupAge)} hours" } else { "Unknown" })"
Write-MonitorLog "Git Status: $($healthStatus.GitStatus)"
Write-MonitorLog "Build Status: $($healthStatus.BuildStatus)"
Write-MonitorLog "File Integrity: $($healthStatus.FileIntegrity)"
Write-MonitorLog "Total Alerts: $($healthStatus.Alerts.Count)"

if ($healthStatus.Alerts.Count -eq 0) {
    Write-MonitorLog "✅ ORGA backup system health check passed" "SUCCESS"
} else {
    Write-MonitorLog "⚠️ ORGA backup system health check completed with $($healthStatus.Alerts.Count) alerts" "WARN"
    foreach ($alert in $healthStatus.Alerts) {
        Write-MonitorLog "  • $alert" "WARN"
    }
}

Write-MonitorLog "ORGA backup monitoring completed"

# Cleanup old monitor logs (keep last 30 days)
try {
    Get-ChildItem -Path $logPath -Filter "backup-monitor.log.*" |
    Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } |
    Remove-Item -Force
} catch {
    Write-MonitorLog "Warning: Could not clean up old monitor logs" "WARN"
}

# Exit with appropriate code
if ($healthStatus.Alerts.Count -gt 0) {
    exit 1
} else {
    exit 0
}