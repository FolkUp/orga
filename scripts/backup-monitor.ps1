# =============================================================================
# ORGA Backup Monitoring & Alerting Script
# =============================================================================
# Monitors backup health, sends alerts, generates status reports
# Banking-level monitoring: SLA compliance, integrity verification, alerts
# =============================================================================

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("status", "alert", "report", "health", "schedule")]
    [string]$Mode = "status",

    [switch]$Verbose,
    [switch]$SendEmail,
    [string]$EmailTo,
    [string]$ConfigPath = "$env:USERPROFILE\.backup\orga-monitor-config.json"
)

# ── Configuration & Settings ─────────────────────────────────────────────────

$ErrorActionPreference = "Continue"
$VerbosePreference = if ($Verbose) { "Continue" } else { "SilentlyContinue" }

# Default monitoring configuration
$DefaultConfig = @{
    BackupBasePath = "C:\backup\orga"
    ProjectPath = "C:\JOHNDOE_CLAUDE\orga"
    MonitoringInterval = 3600  # 1 hour in seconds
    AlertThresholds = @{
        MaxBackupAge = 24        # Hours - alert if no backup in 24h
        MinBackupSize = 1048576  # Bytes - alert if backup < 1MB
        MaxFailureRate = 0.2     # 20% - alert if >20% failures
        DiskSpaceWarning = 0.8   # 80% - warn at 80% disk usage
        DiskSpaceCritical = 0.95 # 95% - critical at 95% disk usage
    }
    EmailSettings = @{
        SmtpServer = "localhost"
        Port = 587
        UseSsl = $true
        From = "backup-monitor@folkup.app"
        Subject = "ORGA Backup Alert"
    }
    HealthCheckInterval = 21600  # 6 hours
    ReportingInterval = 86400    # 24 hours
    RetentionDays = 90
}

# ── Logging Functions ────────────────────────────────────────────────────────

function Write-MonitorLog {
    param(
        [Parameter(Mandatory)]
        [ValidateSet("INFO", "WARN", "ERROR", "CRITICAL", "SUCCESS")]
        [string]$Level,

        [Parameter(Mandatory)]
        [string]$Message,

        [string]$LogFile,
        [switch]$NoConsole
    )

    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] [$Level] $Message"

    # Console output with colors (unless suppressed)
    if (-not $NoConsole) {
        switch ($Level) {
            "INFO"     { Write-Host $LogEntry -ForegroundColor Cyan }
            "WARN"     { Write-Host $LogEntry -ForegroundColor Yellow }
            "ERROR"    { Write-Host $LogEntry -ForegroundColor Red }
            "CRITICAL" { Write-Host $LogEntry -ForegroundColor Magenta }
            "SUCCESS"  { Write-Host $LogEntry -ForegroundColor Green }
        }
    }

    # File logging
    if ($LogFile) {
        Add-Content -Path $LogFile -Value $LogEntry -Encoding UTF8
    }

    # Return structured log entry for further processing
    return @{
        Timestamp = Get-Date
        Level = $Level
        Message = $Message
    }
}

# ── Configuration Management ─────────────────────────────────────────────────

function Get-MonitorConfiguration {
    param([string]$ConfigPath)

    if (Test-Path $ConfigPath) {
        try {
            $config = Get-Content $ConfigPath -Raw | ConvertFrom-Json -AsHashtable
            Write-MonitorLog -Level "INFO" -Message "Loaded monitor configuration from: $ConfigPath"
            return $config
        }
        catch {
            Write-MonitorLog -Level "WARN" -Message "Failed to load config file, using defaults: $($_.Exception.Message)"
        }
    }

    # Create default config file
    $configDir = Split-Path $ConfigPath
    if (-not (Test-Path $configDir)) {
        New-Item -Path $configDir -ItemType Directory -Force | Out-Null
    }

    $DefaultConfig | ConvertTo-Json -Depth 4 | Set-Content $ConfigPath -Encoding UTF8
    Write-MonitorLog -Level "INFO" -Message "Created default monitor configuration: $ConfigPath"

    return $DefaultConfig
}

# ── Backup System Health Assessment ──────────────────────────────────────────

function Get-BackupHealth {
    param(
        [hashtable]$Config,
        [string]$LogFile
    )

    $health = @{
        Status = "UNKNOWN"
        LastBackupTime = $null
        LastBackupSize = 0
        TotalBackups = 0
        FailedBackups = 0
        DiskUsage = @{
            Used = 0
            Total = 0
            PercentUsed = 0
        }
        Issues = @()
        Recommendations = @()
        Timestamp = Get-Date
    }

    Write-MonitorLog -Level "INFO" -Message "Assessing backup system health..." -LogFile $LogFile

    try {
        # Check backup directory existence
        if (-not (Test-Path $Config.BackupBasePath)) {
            $health.Issues += "Backup directory not found: $($Config.BackupBasePath)"
            $health.Status = "CRITICAL"
            return $health
        }

        # Analyze existing backups
        $backupFiles = Get-ChildItem (Join-Path $Config.BackupBasePath "archives") -Filter "orga-*.enc" -ErrorAction SilentlyContinue
        $health.TotalBackups = $backupFiles.Count

        if ($backupFiles.Count -eq 0) {
            $health.Issues += "No backup files found"
            $health.Status = "CRITICAL"
            return $health
        }

        # Get latest backup information
        $latestBackup = $backupFiles | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        $health.LastBackupTime = $latestBackup.LastWriteTime
        $health.LastBackupSize = $latestBackup.Length

        # Check backup age
        $backupAge = (Get-Date) - $health.LastBackupTime
        if ($backupAge.TotalHours -gt $Config.AlertThresholds.MaxBackupAge) {
            $health.Issues += "Latest backup is $([math]::Round($backupAge.TotalHours, 1)) hours old (threshold: $($Config.AlertThresholds.MaxBackupAge)h)"
        }

        # Check backup size
        if ($health.LastBackupSize -lt $Config.AlertThresholds.MinBackupSize) {
            $health.Issues += "Latest backup size is unusually small: $([math]::Round($health.LastBackupSize / 1MB, 2)) MB"
        }

        # Check disk usage
        $drive = Split-Path $Config.BackupBasePath -Qualifier
        $diskInfo = Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='$drive'"
        if ($diskInfo) {
            $health.DiskUsage.Used = $diskInfo.Size - $diskInfo.FreeSpace
            $health.DiskUsage.Total = $diskInfo.Size
            $health.DiskUsage.PercentUsed = ($health.DiskUsage.Used / $health.DiskUsage.Total)

            if ($health.DiskUsage.PercentUsed -gt $Config.AlertThresholds.DiskSpaceCritical) {
                $health.Issues += "Critical disk space: $([math]::Round($health.DiskUsage.PercentUsed * 100, 1))% used"
            }
            elseif ($health.DiskUsage.PercentUsed -gt $Config.AlertThresholds.DiskSpaceWarning) {
                $health.Issues += "Low disk space warning: $([math]::Round($health.DiskUsage.PercentUsed * 100, 1))% used"
            }
        }

        # Check for failed backups (based on log analysis)
        $logPath = Join-Path $Config.BackupBasePath "logs"
        if (Test-Path $logPath) {
            $recentLogs = Get-ChildItem $logPath -Filter "*.log" |
                Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-7) }

            $errorCount = 0
            $totalOperations = 0

            foreach ($logFile in $recentLogs) {
                $content = Get-Content $logFile.FullName -ErrorAction SilentlyContinue
                $errorCount += ($content | Select-String "ERROR" | Measure-Object).Count
                $totalOperations += ($content | Select-String "INFO.*backup" | Measure-Object).Count
            }

            if ($totalOperations -gt 0) {
                $failureRate = $errorCount / $totalOperations
                $health.FailedBackups = $errorCount

                if ($failureRate -gt $Config.AlertThresholds.MaxFailureRate) {
                    $health.Issues += "High failure rate: $([math]::Round($failureRate * 100, 1))% ($errorCount/$totalOperations)"
                }
            }
        }

        # Determine overall status
        if ($health.Issues.Count -eq 0) {
            $health.Status = "HEALTHY"
        }
        elseif ($health.Issues | Where-Object { $_ -like "*Critical*" -or $_ -like "*No backup*" }) {
            $health.Status = "CRITICAL"
        }
        else {
            $health.Status = "WARNING"
        }

        # Generate recommendations
        if ($health.DiskUsage.PercentUsed -gt 0.7) {
            $health.Recommendations += "Consider cleaning up old backups or expanding storage"
        }

        if ($backupAge.TotalHours -gt 12) {
            $health.Recommendations += "Schedule more frequent backups or check backup automation"
        }

        if ($health.TotalBackups -lt 7) {
            $health.Recommendations += "Maintain at least 7 backup copies for better recovery options"
        }

        Write-MonitorLog -Level "SUCCESS" -Message "Health assessment completed: $($health.Status)" -LogFile $LogFile

    }
    catch {
        Write-MonitorLog -Level "ERROR" -Message "Health assessment failed: $($_.Exception.Message)" -LogFile $LogFile
        $health.Status = "ERROR"
        $health.Issues += "Health check failed: $($_.Exception.Message)"
    }

    return $health
}

# ── Alert System ─────────────────────────────────────────────────────────────

function Send-BackupAlert {
    param(
        [hashtable]$Health,
        [hashtable]$Config,
        [string]$EmailTo,
        [string]$LogFile
    )

    if ($Health.Status -eq "HEALTHY" -and $Health.Issues.Count -eq 0) {
        Write-MonitorLog -Level "INFO" -Message "No alerts needed - system healthy" -LogFile $LogFile
        return
    }

    $alertLevel = switch ($Health.Status) {
        "CRITICAL" { "🔴 CRITICAL" }
        "WARNING"  { "🟡 WARNING" }
        "ERROR"    { "🔴 ERROR" }
        default    { "ℹ️ INFO" }
    }

    $alertMessage = @"
ORGA Backup System Alert - $alertLevel

Status: $($Health.Status)
Timestamp: $($Health.Timestamp)
Last Backup: $($Health.LastBackupTime)
Total Backups: $($Health.TotalBackups)

Issues Detected:
$($Health.Issues | ForEach-Object { "• $_" } | Out-String)

Disk Usage: $([math]::Round($Health.DiskUsage.PercentUsed * 100, 1))%
($([math]::Round($Health.DiskUsage.Used / 1GB, 2)) GB / $([math]::Round($Health.DiskUsage.Total / 1GB, 2)) GB)

Recommendations:
$($Health.Recommendations | ForEach-Object { "• $_" } | Out-String)

---
ORGA Backup Monitor v1.0
Generated: $(Get-Date)
"@

    Write-MonitorLog -Level "WARN" -Message "Sending alert: $($Health.Status)" -LogFile $LogFile

    # Console alert
    Write-Host "`n=== BACKUP ALERT ===" -ForegroundColor Red
    Write-Host $alertMessage

    # Email alert (if configured)
    if ($SendEmail -and $EmailTo -and $Config.EmailSettings) {
        try {
            $emailParams = @{
                To = $EmailTo
                From = $Config.EmailSettings.From
                Subject = "$($Config.EmailSettings.Subject) - $alertLevel"
                Body = $alertMessage
                SmtpServer = $Config.EmailSettings.SmtpServer
                Port = $Config.EmailSettings.Port
                UseSsl = $Config.EmailSettings.UseSsl
            }

            Send-MailMessage @emailParams
            Write-MonitorLog -Level "SUCCESS" -Message "Alert email sent to $EmailTo" -LogFile $LogFile
        }
        catch {
            Write-MonitorLog -Level "ERROR" -Message "Failed to send alert email: $($_.Exception.Message)" -LogFile $LogFile
        }
    }

    # Log alert to dedicated alert log
    $alertLogPath = Join-Path $Config.BackupBasePath "logs\alerts.log"
    $alertEntry = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') [$($Health.Status)] $($Health.Issues -join '; ')"
    Add-Content -Path $alertLogPath -Value $alertEntry -Encoding UTF8
}

# ── Reporting Functions ──────────────────────────────────────────────────────

function New-BackupReport {
    param(
        [hashtable]$Config,
        [string]$LogFile,
        [int]$Days = 30
    )

    Write-MonitorLog -Level "INFO" -Message "Generating backup report for last $Days days..." -LogFile $LogFile

    $reportData = @{
        GeneratedDate = Get-Date
        PeriodDays = $Days
        BackupStats = @{
            TotalBackups = 0
            SuccessfulBackups = 0
            FailedBackups = 0
            AverageSize = 0
            TotalSize = 0
        }
        DiskTrends = @()
        AlertHistory = @()
        Recommendations = @()
    }

    try {
        # Analyze backup files
        $cutoffDate = (Get-Date).AddDays(-$Days)
        $backupFiles = Get-ChildItem (Join-Path $Config.BackupBasePath "archives") -Filter "orga-*.enc" |
            Where-Object { $_.LastWriteTime -gt $cutoffDate }

        $reportData.BackupStats.TotalBackups = $backupFiles.Count
        if ($backupFiles.Count -gt 0) {
            $reportData.BackupStats.TotalSize = ($backupFiles | Measure-Object Length -Sum).Sum
            $reportData.BackupStats.AverageSize = $reportData.BackupStats.TotalSize / $backupFiles.Count
        }

        # Analyze logs for success/failure rates
        $logFiles = Get-ChildItem (Join-Path $Config.BackupBasePath "logs") -Filter "*.log" |
            Where-Object { $_.LastWriteTime -gt $cutoffDate }

        foreach ($logFile in $logFiles) {
            $content = Get-Content $logFile.FullName -ErrorAction SilentlyContinue
            $reportData.BackupStats.SuccessfulBackups += ($content | Select-String "SUCCESS.*backup.*completed" | Measure-Object).Count
            $reportData.BackupStats.FailedBackups += ($content | Select-String "ERROR.*backup.*failed" | Measure-Object).Count
        }

        # Analyze alert history
        $alertLogPath = Join-Path $Config.BackupBasePath "logs\alerts.log"
        if (Test-Path $alertLogPath) {
            $alerts = Get-Content $alertLogPath -ErrorAction SilentlyContinue |
                Where-Object { $_ -match "\d{4}-\d{2}-\d{2}" } |
                ForEach-Object {
                    $parts = $_ -split '\] '
                    if ($parts.Length -ge 3) {
                        $timestamp = [DateTime]::Parse($parts[0].Substring(1))
                        if ($timestamp -gt $cutoffDate) {
                            @{
                                Timestamp = $timestamp
                                Level = $parts[1].Trim('[]')
                                Message = $parts[2]
                            }
                        }
                    }
                } | Where-Object { $_ -ne $null }

            $reportData.AlertHistory = $alerts | Sort-Object Timestamp -Descending
        }

        # Generate recommendations based on analysis
        $successRate = if ($reportData.BackupStats.TotalBackups -gt 0) {
            $reportData.BackupStats.SuccessfulBackups / $reportData.BackupStats.TotalBackups
        } else { 0 }

        if ($successRate -lt 0.95) {
            $reportData.Recommendations += "Backup success rate is $([math]::Round($successRate * 100, 1))%. Investigate failure causes."
        }

        if ($reportData.BackupStats.TotalBackups -lt $Days) {
            $reportData.Recommendations += "Backup frequency is below daily. Consider automating backup schedule."
        }

        if ($reportData.AlertHistory.Count -gt ($Days * 0.1)) {
            $reportData.Recommendations += "High alert frequency. Review alert thresholds and backup stability."
        }

        # Save report
        $reportPath = Join-Path $Config.BackupBasePath "reports\backup-report-$(Get-Date -Format 'yyyyMMdd').json"
        $reportsDir = Split-Path $reportPath
        if (-not (Test-Path $reportsDir)) {
            New-Item -Path $reportsDir -ItemType Directory -Force | Out-Null
        }

        $reportData | ConvertTo-Json -Depth 5 | Set-Content $reportPath -Encoding UTF8

        Write-MonitorLog -Level "SUCCESS" -Message "Backup report generated: $reportPath" -LogFile $LogFile

        return $reportData
    }
    catch {
        Write-MonitorLog -Level "ERROR" -Message "Report generation failed: $($_.Exception.Message)" -LogFile $LogFile
        return $null
    }
}

function Show-BackupStatus {
    param(
        [hashtable]$Health,
        [hashtable]$Config
    )

    $statusColor = switch ($Health.Status) {
        "HEALTHY"  { "Green" }
        "WARNING"  { "Yellow" }
        "CRITICAL" { "Red" }
        "ERROR"    { "Magenta" }
        default    { "White" }
    }

    Write-Host "`n=== ORGA BACKUP STATUS ===" -ForegroundColor Cyan
    Write-Host "Status: $($Health.Status)" -ForegroundColor $statusColor
    Write-Host "Last Backup: $($Health.LastBackupTime)"
    Write-Host "Backup Size: $([math]::Round($Health.LastBackupSize / 1MB, 2)) MB"
    Write-Host "Total Backups: $($Health.TotalBackups)"
    Write-Host "Disk Usage: $([math]::Round($Health.DiskUsage.PercentUsed * 100, 1))%"

    if ($Health.Issues.Count -gt 0) {
        Write-Host "`nIssues:" -ForegroundColor Yellow
        $Health.Issues | ForEach-Object { Write-Host "  • $_" -ForegroundColor Yellow }
    }

    if ($Health.Recommendations.Count -gt 0) {
        Write-Host "`nRecommendations:" -ForegroundColor Cyan
        $Health.Recommendations | ForEach-Object { Write-Host "  • $_" -ForegroundColor Cyan }
    }

    Write-Host "`nNext Check: $(Get-Date).AddSeconds($($Config.MonitoringInterval))" -ForegroundColor Gray
}

# ── Scheduled Monitoring ─────────────────────────────────────────────────────

function Start-ScheduledMonitoring {
    param(
        [hashtable]$Config,
        [string]$LogFile
    )

    Write-MonitorLog -Level "INFO" -Message "Starting scheduled monitoring (interval: $($Config.MonitoringInterval)s)..." -LogFile $LogFile

    while ($true) {
        try {
            $health = Get-BackupHealth -Config $Config -LogFile $LogFile

            # Check if alerts should be sent
            if ($health.Status -ne "HEALTHY" -or $health.Issues.Count -gt 0) {
                Send-BackupAlert -Health $health -Config $Config -LogFile $LogFile
            }

            # Generate periodic reports
            $lastReportTime = Get-Date "00:00:00"
            if ((Get-Date) - $lastReportTime -gt [TimeSpan]::FromSeconds($Config.ReportingInterval)) {
                New-BackupReport -Config $Config -LogFile $LogFile | Out-Null
            }

            Write-MonitorLog -Level "INFO" -Message "Monitoring cycle completed. Status: $($health.Status)" -LogFile $LogFile

        }
        catch {
            Write-MonitorLog -Level "ERROR" -Message "Monitoring cycle failed: $($_.Exception.Message)" -LogFile $LogFile
        }

        Start-Sleep -Seconds $Config.MonitoringInterval
    }
}

# ── Main Execution Function ──────────────────────────────────────────────────

function Start-BackupMonitor {
    param(
        [string]$Mode,
        [string]$ConfigPath,
        [string]$EmailTo
    )

    # Load configuration
    $config = Get-MonitorConfiguration -ConfigPath $ConfigPath

    # Setup logging
    $logDir = Join-Path $config.BackupBasePath "logs"
    New-Item -Path $logDir -ItemType Directory -Force | Out-Null
    $logFile = Join-Path $logDir "monitor-$(Get-Date -Format 'yyyy-MM').log"

    Write-MonitorLog -Level "INFO" -Message "=== ORGA Backup Monitor v1.0 Started ===" -LogFile $logFile
    Write-MonitorLog -Level "INFO" -Message "Mode: $Mode" -LogFile $logFile

    switch ($Mode) {
        "status" {
            $health = Get-BackupHealth -Config $config -LogFile $logFile
            Show-BackupStatus -Health $health -Config $config
        }

        "alert" {
            $health = Get-BackupHealth -Config $config -LogFile $logFile
            Send-BackupAlert -Health $health -Config $config -EmailTo $EmailTo -LogFile $logFile
        }

        "report" {
            $report = New-BackupReport -Config $config -LogFile $logFile
            if ($report) {
                Write-Host "Backup Report Generated" -ForegroundColor Green
                Write-Host "Period: Last $($report.PeriodDays) days"
                Write-Host "Total Backups: $($report.BackupStats.TotalBackups)"
                Write-Host "Success Rate: $([math]::Round(($report.BackupStats.SuccessfulBackups / [Math]::Max($report.BackupStats.TotalBackups, 1)) * 100, 1))%"
                Write-Host "Average Size: $([math]::Round($report.BackupStats.AverageSize / 1MB, 2)) MB"
            }
        }

        "health" {
            $health = Get-BackupHealth -Config $config -LogFile $logFile
            $health | ConvertTo-Json -Depth 3
        }

        "schedule" {
            Start-ScheduledMonitoring -Config $config -LogFile $logFile
        }

        default {
            Write-MonitorLog -Level "ERROR" -Message "Invalid mode: $Mode" -LogFile $logFile
            exit 1
        }
    }
}

# ── Entry Point ──────────────────────────────────────────────────────────────

# Execute main function if script is run directly
if ($MyInvocation.InvocationName -ne '.') {
    try {
        Start-BackupMonitor -Mode $Mode -ConfigPath $ConfigPath -EmailTo $EmailTo
    }
    catch {
        Write-Error "Backup monitor failed: $($_.Exception.Message)"
        exit 1
    }
}