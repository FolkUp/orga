#!/usr/bin/env bash
# =============================================================================
# ORGA Master Backup Orchestrator
# =============================================================================
# Coordinates complete backup workflow: source + filesystem + validation
# Banking-level orchestration with comprehensive error handling
# =============================================================================

set -euo pipefail

# ── Configuration ────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_BASE_DIR="C:/backup/orga"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Operation flags
RUN_SOURCE_BACKUP=true
RUN_FILESYSTEM_BACKUP=true
RUN_VALIDATION=true
RUN_MONITORING=true
SEND_ALERTS=false
DRY_RUN=false

# ── Logging ──────────────────────────────────────────────────────────────────

LOG_FILE="$BACKUP_BASE_DIR/logs/orchestrator-$(date +%Y%m).log"

log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

info() { log "INFO" "$@"; echo -e "${CYAN}$@${NC}"; }
warn() { log "WARN" "$@"; echo -e "${YELLOW}$@${NC}" >&2; }
error() { log "ERROR" "$@"; echo -e "${RED}$@${NC}" >&2; }
success() { log "SUCCESS" "$@"; echo -e "${GREEN}$@${NC}"; }
header() { echo -e "${BLUE}=== $@ ===${NC}"; }

# ── Helper Functions ─────────────────────────────────────────────────────────

show_usage() {
    cat <<EOF
ORGA Master Backup Orchestrator v1.0

Usage: $0 [OPTIONS]

OPTIONS:
    -h, --help              Show this help message
    -s, --source-only       Run source backup only
    -f, --filesystem-only   Run filesystem backup only
    -v, --validate-only     Run validation only
    -m, --monitor-only      Run monitoring only
    -n, --dry-run          Simulate operations without actual execution
    -a, --send-alerts      Send alerts after completion
    --no-source            Skip source backup
    --no-filesystem        Skip filesystem backup
    --no-validation        Skip validation
    --no-monitoring        Skip monitoring

EXAMPLES:
    $0                      # Full backup workflow
    $0 --source-only        # Source code backup only
    $0 --dry-run            # Test run without actual backup
    $0 --send-alerts        # Run with alert notifications

EOF
}

check_prerequisites() {
    info "Checking prerequisites..."

    # Check if we're in the right directory
    if [[ ! -f "$PROJECT_DIR/astro.config.mjs" ]]; then
        error "Not in ORGA project directory. Expected astro.config.mjs"
        return 1
    fi

    # Check backup directory structure
    mkdir -p "$BACKUP_BASE_DIR"/{archives,temp,logs,metadata,validation}

    # Check required scripts
    local required_scripts=(
        "$SCRIPT_DIR/backup-source.sh"
        "$SCRIPT_DIR/backup-filesystem.ps1"
        "$SCRIPT_DIR/validate-backup.sh"
        "$SCRIPT_DIR/backup-monitor.ps1"
    )

    local missing_scripts=()
    for script in "${required_scripts[@]}"; do
        if [[ ! -f "$script" ]]; then
            missing_scripts+=("$(basename "$script")")
        fi
    done

    if [[ ${#missing_scripts[@]} -gt 0 ]]; then
        error "Missing required scripts: ${missing_scripts[*]}"
        return 1
    fi

    # Check required tools
    local missing_tools=()
    for tool in git tar gzip openssl sha256sum; do
        if ! command -v "$tool" >/dev/null 2>&1; then
            missing_tools+=("$tool")
        fi
    done

    # Check PowerShell availability
    if ! command -v powershell >/dev/null 2>&1; then
        warn "PowerShell not found - filesystem backup will be skipped"
        RUN_FILESYSTEM_BACKUP=false
    fi

    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        error "Missing required tools: ${missing_tools[*]}"
        return 1
    fi

    success "Prerequisites check passed"
    return 0
}

# ── Backup Operations ────────────────────────────────────────────────────────

run_source_backup() {
    header "Source Code & Content Backup"

    if [[ "$DRY_RUN" == "true" ]]; then
        info "DRY RUN: Would execute source backup"
        return 0
    fi

    info "Starting source code backup..."

    if "$SCRIPT_DIR/backup-source.sh"; then
        success "Source backup completed successfully"
        return 0
    else
        error "Source backup failed"
        return 1
    fi
}

run_filesystem_backup() {
    header "Filesystem & Environment Backup"

    if ! command -v powershell >/dev/null 2>&1; then
        warn "PowerShell not available - skipping filesystem backup"
        return 0
    fi

    if [[ "$DRY_RUN" == "true" ]]; then
        info "DRY RUN: Would execute filesystem backup"
        return 0
    fi

    info "Starting filesystem backup..."

    local ps_args=()
    if [[ "$DRY_RUN" == "true" ]]; then
        ps_args+=("-DryRun")
    fi

    if powershell -File "$SCRIPT_DIR/backup-filesystem.ps1" "${ps_args[@]}"; then
        success "Filesystem backup completed successfully"
        return 0
    else
        error "Filesystem backup failed"
        return 1
    fi
}

run_validation() {
    header "Backup Validation & Integrity Check"

    if [[ "$DRY_RUN" == "true" ]]; then
        info "DRY RUN: Would execute backup validation"
        return 0
    fi

    info "Starting backup validation..."

    if "$SCRIPT_DIR/validate-backup.sh"; then
        success "Backup validation completed successfully"
        return 0
    else
        error "Backup validation failed"
        return 1
    fi
}

run_monitoring() {
    header "Backup System Monitoring"

    if ! command -v powershell >/dev/null 2>&1; then
        warn "PowerShell not available - skipping monitoring"
        return 0
    fi

    if [[ "$DRY_RUN" == "true" ]]; then
        info "DRY RUN: Would execute monitoring check"
        return 0
    fi

    info "Running backup system health check..."

    local ps_args=("-Mode" "status")
    if [[ "$SEND_ALERTS" == "true" ]]; then
        ps_args=("-Mode" "alert")
    fi

    if powershell -File "$SCRIPT_DIR/backup-monitor.ps1" "${ps_args[@]}"; then
        success "Monitoring check completed successfully"
        return 0
    else
        error "Monitoring check failed"
        return 1
    fi
}

# ── Main Orchestration Logic ─────────────────────────────────────────────────

main() {
    local start_time=$(date +%s)

    header "ORGA Master Backup Orchestrator v1.0"
    info "Starting backup workflow at $(date)"
    info "Workflow ID: backup-$TIMESTAMP"

    if [[ "$DRY_RUN" == "true" ]]; then
        warn "DRY RUN MODE - No actual backups will be created"
    fi

    # Prerequisites check
    if ! check_prerequisites; then
        error "Prerequisites check failed - aborting"
        return 1
    fi

    # Track operation results
    local operations_run=0
    local operations_successful=0
    local failed_operations=()

    # Execute backup operations in sequence
    if [[ "$RUN_SOURCE_BACKUP" == "true" ]]; then
        ((operations_run++))
        if run_source_backup; then
            ((operations_successful++))
        else
            failed_operations+=("source-backup")
        fi
    fi

    if [[ "$RUN_FILESYSTEM_BACKUP" == "true" ]]; then
        ((operations_run++))
        if run_filesystem_backup; then
            ((operations_successful++))
        else
            failed_operations+=("filesystem-backup")
        fi
    fi

    if [[ "$RUN_VALIDATION" == "true" ]]; then
        ((operations_run++))
        if run_validation; then
            ((operations_successful++))
        else
            failed_operations+=("validation")
        fi
    fi

    if [[ "$RUN_MONITORING" == "true" ]]; then
        ((operations_run++))
        if run_monitoring; then
            ((operations_successful++))
        else
            failed_operations+=("monitoring")
        fi
    fi

    # Calculate runtime
    local end_time=$(date +%s)
    local runtime=$((end_time - start_time))
    local runtime_formatted=$(printf "%02d:%02d:%02d" $((runtime / 3600)) $((runtime % 3600 / 60)) $((runtime % 60)))

    # Generate summary
    header "Backup Workflow Summary"
    echo "Workflow ID: backup-$TIMESTAMP"
    echo "Runtime: $runtime_formatted"
    echo "Operations run: $operations_run"
    echo "Successful: $operations_successful"
    echo "Failed: $((operations_run - operations_successful))"

    if [[ ${#failed_operations[@]} -gt 0 ]]; then
        error "Failed operations: ${failed_operations[*]}"
        echo "Check logs at: $LOG_FILE"
        return 1
    else
        success "All backup operations completed successfully!"

        # Show backup location summary
        if [[ -d "$BACKUP_BASE_DIR/archives" ]]; then
            local backup_count=$(ls "$BACKUP_BASE_DIR/archives"/*.enc 2>/dev/null | wc -l)
            local total_size=$(du -sh "$BACKUP_BASE_DIR/archives" 2>/dev/null | cut -f1 || echo "unknown")
            echo "Total backups: $backup_count"
            echo "Total size: $total_size"
            echo "Location: $BACKUP_BASE_DIR/archives"
        fi

        return 0
    fi
}

# ── Command Line Argument Parsing ───────────────────────────────────────────

parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_usage
                exit 0
                ;;
            -s|--source-only)
                RUN_SOURCE_BACKUP=true
                RUN_FILESYSTEM_BACKUP=false
                RUN_VALIDATION=false
                RUN_MONITORING=false
                shift
                ;;
            -f|--filesystem-only)
                RUN_SOURCE_BACKUP=false
                RUN_FILESYSTEM_BACKUP=true
                RUN_VALIDATION=false
                RUN_MONITORING=false
                shift
                ;;
            -v|--validate-only)
                RUN_SOURCE_BACKUP=false
                RUN_FILESYSTEM_BACKUP=false
                RUN_VALIDATION=true
                RUN_MONITORING=false
                shift
                ;;
            -m|--monitor-only)
                RUN_SOURCE_BACKUP=false
                RUN_FILESYSTEM_BACKUP=false
                RUN_VALIDATION=false
                RUN_MONITORING=true
                shift
                ;;
            -n|--dry-run)
                DRY_RUN=true
                shift
                ;;
            -a|--send-alerts)
                SEND_ALERTS=true
                shift
                ;;
            --no-source)
                RUN_SOURCE_BACKUP=false
                shift
                ;;
            --no-filesystem)
                RUN_FILESYSTEM_BACKUP=false
                shift
                ;;
            --no-validation)
                RUN_VALIDATION=false
                shift
                ;;
            --no-monitoring)
                RUN_MONITORING=false
                shift
                ;;
            *)
                error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
}

# ── Entry Point ──────────────────────────────────────────────────────────────

# Setup logging directory
mkdir -p "$BACKUP_BASE_DIR/logs"

# Parse command line arguments
parse_arguments "$@"

# Execute main workflow
if main; then
    exit 0
else
    exit 1
fi