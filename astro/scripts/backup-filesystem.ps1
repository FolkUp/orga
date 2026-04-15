# ORGA Underground Academia - Filesystem Backup Script
# Banking-Level Security Standards | Generated: 2026-04-15

param(
    [string]$BackupPath = "C:\Backups\ORGA",
    [string]$SourcePath = ".\astro",
    [switch]$Verify = $false,
    [switch]$SkipBuiltArtifacts = $false
)

# Configuration
$ErrorActionPreference = "Stop"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "$SourcePath\.config\logs\filesystem-backup-$timestamp.log"

# Ensure backup directory exists
if (-not (Test-Path $BackupPath)) {
    New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null
    Write-Host "Created backup directory: $BackupPath"
}

# Ensure log directory exists
$logDir = "$SourcePath\.config\logs"
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

function Write-Log {
    param($Message)
    $timestampLog = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestampLog] $Message"
    Write-Host $logMessage
    Add-Content -Path $logFile -Value $logMessage
}

Write-Log "Starting ORGA filesystem backup"

# Check if 7-Zip is available
try {
    $null = Get-Command 7z -ErrorAction Stop
    Write-Log "✅ 7-Zip found"
} catch {
    Write-Log "❌ 7-Zip not found. Please install 7-Zip for secure backup functionality"
    throw "7-Zip is required for encrypted backups"
}

# Verify backup password is set
if (-not $env:ORGA_BACKUP_PASSWORD) {
    Write-Log "❌ ORGA_BACKUP_PASSWORD environment variable not set"
    throw "Backup password environment variable required for security"
}

# Define backup components
$backupComponents = @{
    "source" = @{
        "path" = "src"
        "description" = "Source code and content"
        "priority" = 1
    }
    "public" = @{
        "path" = "public"
        "description" = "Static assets"
        "priority" = 1
    }
    "config" = @{
        "path" = ""
        "include" = @("package.json", "astro.config.mjs", "tsconfig.json")
        "description" = "Configuration files"
        "priority" = 1
    }
    "dist" = @{
        "path" = "dist"
        "description" = "Built artifacts"
        "priority" = 2
        "skip" = $SkipBuiltArtifacts
    }
    "context" = @{
        "path" = ".config"
        "description" = "Development context"
        "priority" = 3
    }
}

# Create priority-based backups
foreach ($priority in 1..3) {
    $priorityComponents = $backupComponents.GetEnumerator() | Where-Object { $_.Value.priority -eq $priority -and -not $_.Value.skip }

    if ($priorityComponents) {
        $backupFile = "$BackupPath\orga-backup-p$priority-$timestamp.7z"
        Write-Log "Creating Priority $priority backup: $backupFile"

        # Build 7z command arguments
        $sourceItems = @()
        foreach ($component in $priorityComponents) {
            $name = $component.Name
            $info = $component.Value

            if ($info.path) {
                $fullPath = Join-Path $SourcePath $info.path
                if (Test-Path $fullPath) {
                    $sourceItems += $fullPath
                    Write-Log "  Including: $($info.description) ($($info.path))"
                }
            } elseif ($info.include) {
                foreach ($file in $info.include) {
                    $fullPath = Join-Path $SourcePath $file
                    if (Test-Path $fullPath) {
                        $sourceItems += $fullPath
                        Write-Log "  Including: $file"
                    }
                }
            }
        }

        if ($sourceItems) {
            # Create encrypted archive with maximum compression
            try {
                & 7z a -t7z -m0=lzma2 -mx=9 -mfb=64 -md=32m -ms=on -mhe=on "-p$env:ORGA_BACKUP_PASSWORD" $backupFile $sourceItems *>&1 | Out-String | Add-Content -Path $logFile

                if ($LASTEXITCODE -eq 0) {
                    Write-Log "✅ Priority $priority backup created successfully"
                } else {
                    Write-Log "❌ Priority $priority backup failed with exit code $LASTEXITCODE"
                    continue
                }
            } catch {
                Write-Log "❌ Failed to create Priority $priority backup: $($_.Exception.Message)"
                continue
            }

            # Generate SHA-256 hash for integrity verification
            try {
                $hash = Get-FileHash $backupFile -Algorithm SHA256
                $hashFile = "$backupFile.sha256"
                $hash.Hash | Out-File $hashFile -Encoding UTF8
                Write-Log "✅ SHA-256 hash generated: $($hash.Hash)"
            } catch {
                Write-Log "❌ Failed to generate hash: $($_.Exception.Message)"
            }

            # Verify backup if requested
            if ($Verify) {
                Write-Log "Verifying backup integrity..."
                try {
                    & 7z t "-p$env:ORGA_BACKUP_PASSWORD" $backupFile *>&1 | Out-String | Add-Content -Path $logFile
                    if ($LASTEXITCODE -eq 0) {
                        Write-Log "✅ Backup verification passed"
                    } else {
                        Write-Log "❌ Backup verification failed"
                    }
                } catch {
                    Write-Log "❌ Backup verification error: $($_.Exception.Message)"
                }
            }
        } else {
            Write-Log "⚠️ No valid source items found for Priority $priority backup"
        }
    }
}

# Cleanup old backups (keep last 30 days for P1, 14 days for P2/P3)
$retentionDays = @{ 1 = 30; 2 = 14; 3 = 14 }
foreach ($priority in $retentionDays.Keys) {
    $days = $retentionDays[$priority]
    $pattern = "orga-backup-p$priority-*.7z"
    $oldFiles = Get-ChildItem -Path $BackupPath -Filter $pattern | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$days) }

    foreach ($file in $oldFiles) {
        try {
            Remove-Item $file.FullName -Force
            $hashFile = "$($file.FullName).sha256"
            if (Test-Path $hashFile) {
                Remove-Item $hashFile -Force
            }
            Write-Log "Cleaned up old backup: $($file.Name)"
        } catch {
            Write-Log "⚠️ Failed to clean up $($file.Name): $($_.Exception.Message)"
        }
    }
}

Write-Log "✅ ORGA filesystem backup completed successfully"

# Display backup summary
Write-Host "`n=== Backup Summary ===" -ForegroundColor Green
$backupFiles = Get-ChildItem -Path $BackupPath -Filter "orga-backup-*-$timestamp.7z"
foreach ($file in $backupFiles) {
    $size = [math]::Round($file.Length / 1KB, 2)
    Write-Host "  $($file.Name): ${size} KB" -ForegroundColor Cyan
}
Write-Host "  Total backups created: $($backupFiles.Count)" -ForegroundColor Green
Write-Host "  Log file: $logFile" -ForegroundColor Yellow