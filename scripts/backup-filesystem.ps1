# =============================================================================
# ORGA Filesystem & Windows Environment Backup Script
# =============================================================================
# PowerShell script for Windows-specific backup components
# Banking-level security: AES-256 encryption, integrity verification
# =============================================================================

param(
    [switch]$Verbose,
    [switch]$DryRun,
    [string]$ConfigPath = "$env:USERPROFILE\.backup\orga-backup-config.json"
)

# ── Configuration & Settings ─────────────────────────────────────────────────

$ErrorActionPreference = "Stop"
$VerbosePreference = if ($Verbose) { "Continue" } else { "SilentlyContinue" }

# Default configuration
$DefaultConfig = @{
    BackupBasePath = "C:\backup\orga"
    ProjectPath = "C:\JOHNDOE_CLAUDE\orga"
    EncryptionKeyFile = "$env:USERPROFILE\.backup\orga-backup.key"
    RetentionDays = 30
    CompessionLevel = "Optimal"
    IncludeSystemInfo = $true
    IncludeEnvironment = $true
    IncludeRegistryKeys = @(
        "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall"
        "HKCU:\Environment"
    )
    ExcludePatterns = @(
        "*.tmp"
        "*.log"
        "Thumbs.db"
        "*.cache"
        "node_modules"
        "dist"
        ".DS_Store"
    )
}

# ── Logging Functions ────────────────────────────────────────────────────────

function Write-LogMessage {
    param(
        [Parameter(Mandatory)]
        [ValidateSet("INFO", "WARN", "ERROR", "SUCCESS")]
        [string]$Level,

        [Parameter(Mandatory)]
        [string]$Message,

        [string]$LogFile
    )

    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] [$Level] $Message"

    # Console output with colors
    switch ($Level) {
        "INFO"    { Write-Host $LogEntry -ForegroundColor Cyan }
        "WARN"    { Write-Host $LogEntry -ForegroundColor Yellow }
        "ERROR"   { Write-Host $LogEntry -ForegroundColor Red }
        "SUCCESS" { Write-Host $LogEntry -ForegroundColor Green }
    }

    # File logging
    if ($LogFile) {
        Add-Content -Path $LogFile -Value $LogEntry -Encoding UTF8
    }
}

function Test-AdministratorRights {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# ── Configuration Management ─────────────────────────────────────────────────

function Get-BackupConfiguration {
    param([string]$ConfigPath)

    if (Test-Path $ConfigPath) {
        try {
            $config = Get-Content $ConfigPath -Raw | ConvertFrom-Json -AsHashtable
            Write-LogMessage -Level "INFO" -Message "Loaded configuration from: $ConfigPath"
            return $config
        }
        catch {
            Write-LogMessage -Level "WARN" -Message "Failed to load config file, using defaults: $($_.Exception.Message)"
        }
    }

    # Create default config file
    $configDir = Split-Path $ConfigPath
    if (-not (Test-Path $configDir)) {
        New-Item -Path $configDir -ItemType Directory -Force | Out-Null
    }

    $DefaultConfig | ConvertTo-Json -Depth 3 | Set-Content $ConfigPath -Encoding UTF8
    Write-LogMessage -Level "INFO" -Message "Created default configuration: $ConfigPath"

    return $DefaultConfig
}

# ── System Information Collection ───────────────────────────────────────────

function Get-SystemInformation {
    Write-LogMessage -Level "INFO" -Message "Collecting system information..."

    $systemInfo = @{
        ComputerName = $env:COMPUTERNAME
        UserName = $env:USERNAME
        Domain = $env:USERDOMAIN
        WindowsVersion = (Get-WmiObject -Class Win32_OperatingSystem).Caption
        PowerShellVersion = $PSVersionTable.PSVersion.ToString()
        .NETVersion = [System.Environment]::Version.ToString()
        TimeZone = (Get-TimeZone).Id
        LastBootTime = (Get-CimInstance Win32_OperatingSystem).LastBootUpTime
        TotalPhysicalMemory = (Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory
        Processors = (Get-CimInstance Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors)
        InstalledSoftware = @()
        EnvironmentVariables = @{}
        NetworkAdapters = @()
        Timestamp = Get-Date -Format "O"
    }

    # Collect installed software (user scope only for security)
    try {
        $software = Get-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*" -ErrorAction SilentlyContinue |
            Where-Object { $_.DisplayName } |
            Select-Object DisplayName, DisplayVersion, Publisher, InstallDate |
            Sort-Object DisplayName

        $systemInfo.InstalledSoftware = $software
    }
    catch {
        Write-LogMessage -Level "WARN" -Message "Could not collect software inventory: $($_.Exception.Message)"
    }

    # Collect relevant environment variables (excluding sensitive ones)
    $safeEnvVars = @("PATH", "TEMP", "TMP", "USERPROFILE", "ProgramFiles", "ProgramData", "APPDATA", "LOCALAPPDATA")
    foreach ($varName in $safeEnvVars) {
        $value = [Environment]::GetEnvironmentVariable($varName)
        if ($value) {
            $systemInfo.EnvironmentVariables[$varName] = $value
        }
    }

    # Network adapter information
    try {
        $adapters = Get-NetAdapter | Where-Object { $_.Status -eq "Up" } |
            Select-Object Name, InterfaceDescription, LinkSpeed, MacAddress
        $systemInfo.NetworkAdapters = $adapters
    }
    catch {
        Write-LogMessage -Level "WARN" -Message "Could not collect network adapter info: $($_.Exception.Message)"
    }

    return $systemInfo
}

# ── File System Backup Functions ────────────────────────────────────────────

function New-FilesystemBackup {
    param(
        [hashtable]$Config,
        [string]$BackupName,
        [string]$LogFile
    )

    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupPath = Join-Path $Config.BackupBasePath "temp\$BackupName-filesystem"
    $archivePath = Join-Path $Config.BackupBasePath "temp\$BackupName-filesystem.7z"

    Write-LogMessage -Level "INFO" -Message "Starting filesystem backup..." -LogFile $LogFile

    # Create backup directory structure
    $backupDirs = @("config", "environment", "project-metadata")
    foreach ($dir in $backupDirs) {
        $dirPath = Join-Path $backupPath $dir
        New-Item -Path $dirPath -ItemType Directory -Force | Out-Null
    }

    # Backup project-specific configuration files
    $configFiles = @(
        ".vscode\settings.json"
        ".vscode\launch.json"
        ".vscode\tasks.json"
        ".editorconfig"
        ".gitignore"
        ".gitattributes"
        "package.json"
        "package-lock.json"
        "astro.config.mjs"
        "tailwind.config.mjs"
        "tsconfig.json"
    )

    foreach ($file in $configFiles) {
        $sourcePath = Join-Path $Config.ProjectPath $file
        if (Test-Path $sourcePath) {
            $destPath = Join-Path $backupPath "config\$($file -replace '[\\/]', '_')"
            Copy-Item $sourcePath $destPath -Force
            Write-Verbose "Backed up config: $file"
        }
    }

    # Collect system information
    $systemInfo = Get-SystemInformation
    $systemInfoPath = Join-Path $backupPath "environment\system-info.json"
    $systemInfo | ConvertTo-Json -Depth 5 | Set-Content $systemInfoPath -Encoding UTF8

    # Backup Windows-specific project metadata
    $projectMetadata = @{
        ProjectPath = $Config.ProjectPath
        BackupTimestamp = $timestamp
        FileCounts = @{}
        DirectorySizes = @{}
        FileExtensions = @{}
        LastModified = @{}
    }

    if (Test-Path $Config.ProjectPath) {
        try {
            # Collect file statistics
            $files = Get-ChildItem $Config.ProjectPath -Recurse -File -ErrorAction SilentlyContinue

            # Group by extension
            $extensions = $files | Group-Object Extension |
                ForEach-Object { @{ Extension = $_.Name; Count = $_.Count; TotalSize = ($_.Group | Measure-Object Length -Sum).Sum } }
            $projectMetadata.FileExtensions = $extensions

            # Directory sizes
            $directories = Get-ChildItem $Config.ProjectPath -Directory -ErrorAction SilentlyContinue
            foreach ($dir in $directories) {
                $size = (Get-ChildItem $dir.FullName -Recurse -File -ErrorAction SilentlyContinue |
                        Measure-Object Length -Sum).Sum
                $projectMetadata.DirectorySizes[$dir.Name] = $size
            }

            # Recent files (modified in last 30 days)
            $recentFiles = $files | Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-30) } |
                Select-Object FullName, Length, LastWriteTime, CreationTime |
                Sort-Object LastWriteTime -Descending |
                Select-Object -First 100
            $projectMetadata.RecentlyModified = $recentFiles

        }
        catch {
            Write-LogMessage -Level "WARN" -Message "Could not collect all project metadata: $($_.Exception.Message)" -LogFile $LogFile
        }
    }

    $metadataPath = Join-Path $backupPath "project-metadata\orga-metadata.json"
    $projectMetadata | ConvertTo-Json -Depth 5 | Set-Content $metadataPath -Encoding UTF8

    # Create compressed archive
    if ($DryRun) {
        Write-LogMessage -Level "INFO" -Message "DRY RUN: Would create archive at $archivePath" -LogFile $LogFile
        return @{
            ArchivePath = $archivePath
            Size = 0
            Success = $true
        }
    }

    try {
        # Use 7-Zip if available, otherwise use Compress-Archive
        if (Get-Command "7z" -ErrorAction SilentlyContinue) {
            Write-LogMessage -Level "INFO" -Message "Using 7-Zip for compression..." -LogFile $LogFile
            & 7z a -t7z -mx=$($Config.CompressionLevel -eq "Optimal" ? "9" : "5") $archivePath $backupPath\*
            $success = $LASTEXITCODE -eq 0
        }
        else {
            Write-LogMessage -Level "INFO" -Message "Using PowerShell Compress-Archive..." -LogFile $LogFile
            Compress-Archive -Path "$backupPath\*" -DestinationPath $archivePath -CompressionLevel $Config.CompressionLevel -Force
            $success = $true
        }

        if ($success) {
            $archiveSize = (Get-Item $archivePath).Length
            Write-LogMessage -Level "SUCCESS" -Message "Filesystem backup created: $([math]::Round($archiveSize / 1MB, 2)) MB" -LogFile $LogFile

            # Cleanup temp directory
            Remove-Item $backupPath -Recurse -Force

            return @{
                ArchivePath = $archivePath
                Size = $archiveSize
                Success = $true
            }
        }
        else {
            throw "Archive creation failed"
        }
    }
    catch {
        Write-LogMessage -Level "ERROR" -Message "Failed to create filesystem backup: $($_.Exception.Message)" -LogFile $LogFile
        return @{
            ArchivePath = $null
            Size = 0
            Success = $false
        }
    }
}

# ── Encryption Functions ─────────────────────────────────────────────────────

function Protect-BackupFile {
    param(
        [string]$FilePath,
        [string]$EncryptionKeyFile,
        [string]$LogFile
    )

    if (-not (Test-Path $FilePath)) {
        Write-LogMessage -Level "ERROR" -Message "File not found for encryption: $FilePath" -LogFile $LogFile
        return $null
    }

    $encryptedPath = "$FilePath.enc"
    $checksumPath = "$FilePath.sha256"

    try {
        # Read encryption key
        if (-not (Test-Path $EncryptionKeyFile)) {
            Write-LogMessage -Level "WARN" -Message "Encryption key not found, generating new one..." -LogFile $LogFile
            $keyDir = Split-Path $EncryptionKeyFile
            if (-not (Test-Path $keyDir)) {
                New-Item -Path $keyDir -ItemType Directory -Force | Out-Null
            }

            # Generate random 256-bit key
            $key = [System.Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes(32)
            [Convert]::ToBase64String($key) | Set-Content $EncryptionKeyFile -Encoding UTF8
            Write-LogMessage -Level "SUCCESS" -Message "Generated new encryption key: $EncryptionKeyFile" -LogFile $LogFile
        }

        $keyData = Get-Content $EncryptionKeyFile -Raw
        $key = [Convert]::FromBase64String($keyData.Trim())

        # Encrypt file using AES-256
        $fileBytes = [System.IO.File]::ReadAllBytes($FilePath)

        using namespace System.Security.Cryptography
        $aes = [AES]::Create()
        $aes.Key = $key
        $aes.GenerateIV()

        $encryptor = $aes.CreateEncryptor()
        $encryptedBytes = $encryptor.TransformFinalBlock($fileBytes, 0, $fileBytes.Length)

        # Prepend IV to encrypted data
        $finalBytes = $aes.IV + $encryptedBytes
        [System.IO.File]::WriteAllBytes($encryptedPath, $finalBytes)

        # Create integrity checksum
        $hash = Get-FileHash $encryptedPath -Algorithm SHA256
        "$($hash.Hash)  $(Split-Path $encryptedPath -Leaf)" | Set-Content $checksumPath -Encoding UTF8

        # Remove original file
        Remove-Item $FilePath -Force

        $encryptedSize = (Get-Item $encryptedPath).Length
        Write-LogMessage -Level "SUCCESS" -Message "File encrypted: $([math]::Round($encryptedSize / 1MB, 2)) MB" -LogFile $LogFile

        return @{
            EncryptedPath = $encryptedPath
            ChecksumPath = $checksumPath
            Size = $encryptedSize
        }
    }
    catch {
        Write-LogMessage -Level "ERROR" -Message "Encryption failed: $($_.Exception.Message)" -LogFile $LogFile
        return $null
    }
}

# ── Main Execution Function ──────────────────────────────────────────────────

function Start-ORGAFilesystemBackup {
    param(
        [string]$ConfigPath = "$env:USERPROFILE\.backup\orga-backup-config.json"
    )

    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupName = "orga-filesystem-$timestamp"

    # Load configuration
    $config = Get-BackupConfiguration -ConfigPath $ConfigPath

    # Setup logging
    $logDir = Join-Path $config.BackupBasePath "logs"
    New-Item -Path $logDir -ItemType Directory -Force | Out-Null
    $logFile = Join-Path $logDir "backup-filesystem-$(Get-Date -Format 'yyyy-MM').log"

    Write-LogMessage -Level "INFO" -Message "=== ORGA Filesystem Backup v1.0 ===" -LogFile $logFile
    Write-LogMessage -Level "INFO" -Message "Started at $(Get-Date)" -LogFile $logFile

    # Check prerequisites
    if (-not $DryRun -and -not (Test-AdministratorRights)) {
        Write-LogMessage -Level "WARN" -Message "Administrator rights recommended for full system access" -LogFile $logFile
    }

    # Create backup directories
    $backupDirs = @("archives", "temp", "logs", "metadata")
    foreach ($dir in $backupDirs) {
        $dirPath = Join-Path $config.BackupBasePath $dir
        New-Item -Path $dirPath -ItemType Directory -Force | Out-Null
    }

    try {
        # Create filesystem backup
        $backupResult = New-FilesystemBackup -Config $config -BackupName $backupName -LogFile $logFile

        if (-not $backupResult.Success) {
            throw "Filesystem backup failed"
        }

        if (-not $DryRun) {
            # Encrypt the backup
            $encryptionResult = Protect-BackupFile -FilePath $backupResult.ArchivePath -EncryptionKeyFile $config.EncryptionKeyFile -LogFile $logFile

            if ($encryptionResult) {
                # Move to archives directory
                $finalPath = Join-Path $config.BackupBasePath "archives\$(Split-Path $encryptionResult.EncryptedPath -Leaf)"
                $finalChecksumPath = Join-Path $config.BackupBasePath "archives\$(Split-Path $encryptionResult.ChecksumPath -Leaf)"

                Move-Item $encryptionResult.EncryptedPath $finalPath -Force
                Move-Item $encryptionResult.ChecksumPath $finalChecksumPath -Force

                Write-LogMessage -Level "SUCCESS" -Message "Backup completed: $finalPath" -LogFile $logFile

                # Cleanup old backups
                $cutoffDate = (Get-Date).AddDays(-$config.RetentionDays)
                Get-ChildItem (Join-Path $config.BackupBasePath "archives") -Filter "orga-filesystem-*.enc" |
                    Where-Object { $_.LastWriteTime -lt $cutoffDate } |
                    ForEach-Object {
                        Remove-Item $_.FullName -Force
                        Remove-Item "$($_.FullName.Replace('.enc', '')).sha256" -Force -ErrorAction SilentlyContinue
                        Write-LogMessage -Level "INFO" -Message "Removed old backup: $($_.Name)" -LogFile $logFile
                    }
            }
        }

        Write-LogMessage -Level "SUCCESS" -Message "ORGA filesystem backup completed successfully!" -LogFile $logFile
        return $true
    }
    catch {
        Write-LogMessage -Level "ERROR" -Message "Backup failed: $($_.Exception.Message)" -LogFile $logFile
        return $false
    }
}

# ── Entry Point ──────────────────────────────────────────────────────────────

# Execute main function if script is run directly
if ($MyInvocation.InvocationName -ne '.') {
    $result = Start-ORGAFilesystemBackup -ConfigPath $ConfigPath
    exit ($result ? 0 : 1)
}