#!/usr/bin/env bash
# =============================================================================
# ORGA Backup Validation & Integrity Verification Script
# =============================================================================
# Validates backup archives, tests restoration, verifies integrity
# Banking-level verification: checksums, decryption, restore testing
# =============================================================================

set -euo pipefail

# ── Configuration ────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_BASE_DIR="C:/backup/orga"
VALIDATION_DIR="$BACKUP_BASE_DIR/validation"
ENCRYPTION_KEY_FILE="$HOME/.backup/orga-backup.key"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ── Logging ──────────────────────────────────────────────────────────────────

LOG_FILE="$BACKUP_BASE_DIR/logs/validation-$(date +%Y%m).log"

log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

info() { log "INFO" "$@"; }
warn() { log "WARN" "$@"; echo -e "${YELLOW}$@${NC}" >&2; }
error() { log "ERROR" "$@"; echo -e "${RED}$@${NC}" >&2; }
success() { log "SUCCESS" "$@"; echo -e "${GREEN}$@${NC}"; }

# ── Validation Functions ─────────────────────────────────────────────────────

validate_backup_structure() {
    local backup_dir="$1"
    local validation_report="$2"

    info "Validating backup directory structure..."

    local required_dirs=("archives" "metadata" "logs")
    local missing_dirs=()

    for dir in "${required_dirs[@]}"; do
        if [[ ! -d "$backup_dir/$dir" ]]; then
            missing_dirs+=("$dir")
        fi
    done

    if [[ ${#missing_dirs[@]} -gt 0 ]]; then
        error "Missing required directories: ${missing_dirs[*]}"
        echo "STRUCTURE: FAIL - Missing directories: ${missing_dirs[*]}" >> "$validation_report"
        return 1
    fi

    # Check for backup files
    local backup_count=$(find "$backup_dir/archives" -name "orga-*.enc" 2>/dev/null | wc -l)
    if [[ $backup_count -eq 0 ]]; then
        warn "No encrypted backup files found in archives/"
        echo "STRUCTURE: WARN - No backup files found" >> "$validation_report"
    else
        success "Found $backup_count backup files"
        echo "STRUCTURE: PASS - $backup_count backup files found" >> "$validation_report"
    fi

    return 0
}

verify_checksum_integrity() {
    local backup_file="$1"
    local validation_report="$2"

    info "Verifying checksum integrity for $(basename "$backup_file")..."

    local checksum_file="${backup_file}.sha256"

    if [[ ! -f "$checksum_file" ]]; then
        error "Checksum file not found: $(basename "$checksum_file")"
        echo "CHECKSUM: FAIL - Missing checksum file" >> "$validation_report"
        return 1
    fi

    # Verify checksum
    local stored_checksum=$(cut -d' ' -f1 "$checksum_file")
    local current_checksum=$(sha256sum "$backup_file" | cut -d' ' -f1)

    if [[ "$stored_checksum" == "$current_checksum" ]]; then
        success "Checksum verification passed"
        echo "CHECKSUM: PASS - SHA-256 verified" >> "$validation_report"
        return 0
    else
        error "Checksum mismatch! File may be corrupted."
        error "Expected: $stored_checksum"
        error "Actual:   $current_checksum"
        echo "CHECKSUM: FAIL - SHA-256 mismatch" >> "$validation_report"
        return 1
    fi
}

test_decryption() {
    local encrypted_file="$1"
    local validation_report="$2"
    local test_output="$VALIDATION_DIR/decrypt_test_$(basename "$encrypted_file" .enc)"

    info "Testing decryption for $(basename "$encrypted_file")..."

    if [[ ! -f "$ENCRYPTION_KEY_FILE" ]]; then
        error "Encryption key not found: $ENCRYPTION_KEY_FILE"
        echo "DECRYPTION: FAIL - Missing encryption key" >> "$validation_report"
        return 1
    fi

    # Attempt decryption
    if openssl enc -aes-256-cbc -d -in "$encrypted_file" -out "$test_output" -pass file:"$ENCRYPTION_KEY_FILE" 2>/dev/null; then
        # Verify decrypted file is valid
        local file_type=$(file "$test_output" | cut -d: -f2)

        if [[ "$file_type" == *"tar archive"* ]] || [[ "$file_type" == *"gzip"* ]] || [[ "$file_type" == *"7-zip"* ]]; then
            success "Decryption successful - valid archive format"
            echo "DECRYPTION: PASS - Archive format verified" >> "$validation_report"
            rm -f "$test_output"
            return 0
        else
            warn "Decryption completed but file format unclear: $file_type"
            echo "DECRYPTION: WARN - Unclear file format" >> "$validation_report"
            rm -f "$test_output"
            return 0
        fi
    else
        error "Decryption failed"
        echo "DECRYPTION: FAIL - Cannot decrypt" >> "$validation_report"
        return 1
    fi
}

test_archive_extraction() {
    local encrypted_file="$1"
    local validation_report="$2"
    local extract_dir="$VALIDATION_DIR/extract_test_$(date +%s)"

    info "Testing archive extraction for $(basename "$encrypted_file")..."

    mkdir -p "$extract_dir"

    # Decrypt and extract in pipeline
    if openssl enc -aes-256-cbc -d -in "$encrypted_file" -pass file:"$ENCRYPTION_KEY_FILE" | \
       tar xzf - -C "$extract_dir" 2>/dev/null; then

        # Verify extracted content structure
        local extracted_files=$(find "$extract_dir" -type f | wc -l)
        local extracted_size=$(du -sh "$extract_dir" | cut -f1)

        if [[ $extracted_files -gt 0 ]]; then
            success "Archive extraction successful - $extracted_files files, $extracted_size"
            echo "EXTRACTION: PASS - $extracted_files files extracted" >> "$validation_report"

            # Quick content verification
            if [[ -f "$extract_dir"/*.bundle ]] || [[ -f "$extract_dir"/*.tar.gz ]]; then
                success "Expected backup components found in archive"
                echo "CONTENT: PASS - Expected components found" >> "$validation_report"
            else
                warn "Expected backup components not found"
                echo "CONTENT: WARN - Components unclear" >> "$validation_report"
            fi
        else
            error "Archive appears empty after extraction"
            echo "EXTRACTION: FAIL - No files extracted" >> "$validation_report"
            rm -rf "$extract_dir"
            return 1
        fi
    else
        error "Archive extraction failed"
        echo "EXTRACTION: FAIL - Cannot extract archive" >> "$validation_report"
        rm -rf "$extract_dir"
        return 1
    fi

    # Cleanup
    rm -rf "$extract_dir"
    return 0
}

validate_git_bundle() {
    local bundle_file="$1"
    local validation_report="$2"

    info "Validating Git bundle: $(basename "$bundle_file")..."

    if git bundle verify "$bundle_file" >/dev/null 2>&1; then
        # Get bundle information
        local refs_count=$(git bundle list-heads "$bundle_file" 2>/dev/null | wc -l)
        success "Git bundle validation passed - $refs_count references"
        echo "GIT_BUNDLE: PASS - $refs_count refs verified" >> "$validation_report"
        return 0
    else
        error "Git bundle validation failed"
        echo "GIT_BUNDLE: FAIL - Bundle verification failed" >> "$validation_report"
        return 1
    fi
}

test_restore_simulation() {
    local backup_file="$1"
    local validation_report="$2"
    local restore_dir="$VALIDATION_DIR/restore_test_$(date +%s)"

    info "Running restore simulation for $(basename "$backup_file")..."

    mkdir -p "$restore_dir"

    # Full restore test
    if openssl enc -aes-256-cbc -d -in "$backup_file" -pass file:"$ENCRYPTION_KEY_FILE" | \
       tar xzf - -C "$restore_dir" 2>/dev/null; then

        # Validate restored structure
        local critical_files=(
            "*.bundle"
            "*-content.tar.gz"
            "*.json"
        )

        local found_files=0
        for pattern in "${critical_files[@]}"; do
            if compgen -G "$restore_dir/$pattern" > /dev/null 2>&1; then
                ((found_files++))
            fi
        done

        if [[ $found_files -ge 2 ]]; then
            success "Restore simulation passed - critical files recovered"
            echo "RESTORE: PASS - Critical files recovered" >> "$validation_report"

            # Test Git bundle if present
            local bundle_files=($(find "$restore_dir" -name "*.bundle"))
            if [[ ${#bundle_files[@]} -gt 0 ]]; then
                validate_git_bundle "${bundle_files[0]}" "$validation_report"
            fi

            rm -rf "$restore_dir"
            return 0
        else
            error "Restore simulation failed - missing critical files"
            echo "RESTORE: FAIL - Critical files missing" >> "$validation_report"
            rm -rf "$restore_dir"
            return 1
        fi
    else
        error "Restore simulation failed - cannot extract backup"
        echo "RESTORE: FAIL - Cannot extract backup" >> "$validation_report"
        rm -rf "$restore_dir"
        return 1
    fi
}

# ── Comprehensive Validation Workflow ───────────────────────────────────────

validate_single_backup() {
    local backup_file="$1"
    local validation_report="$2"

    info "=== Validating $(basename "$backup_file") ==="

    local tests=(
        "verify_checksum_integrity"
        "test_decryption"
        "test_archive_extraction"
        "test_restore_simulation"
    )

    local passed=0
    local total=${#tests[@]}

    echo "BACKUP: $(basename "$backup_file")" >> "$validation_report"
    echo "TIMESTAMP: $(date)" >> "$validation_report"
    echo "SIZE: $(stat -c%s "$backup_file" 2>/dev/null || stat -f%z "$backup_file" 2>/dev/null || echo "0") bytes" >> "$validation_report"

    for test in "${tests[@]}"; do
        if $test "$backup_file" "$validation_report"; then
            ((passed++))
        fi
    done

    echo "OVERALL: $passed/$total tests passed" >> "$validation_report"
    echo "---" >> "$validation_report"

    if [[ $passed -eq $total ]]; then
        success "All validation tests passed for $(basename "$backup_file")"
        return 0
    else
        error "Some validation tests failed for $(basename "$backup_file")"
        return 1
    fi
}

# ── Main Validation Function ─────────────────────────────────────────────────

main() {
    echo -e "${BLUE}=== ORGA Backup Validation System v1.0 ===${NC}"
    echo "Starting validation at $(date)"
    echo

    # Setup validation environment
    mkdir -p "$VALIDATION_DIR" "$BACKUP_BASE_DIR/logs"

    local validation_report="$VALIDATION_DIR/validation-report-$(date +%Y%m%d_%H%M%S).txt"

    # Start validation report
    cat > "$validation_report" <<EOF
ORGA BACKUP VALIDATION REPORT
Generated: $(date)
Validation ID: $(date +%s)

=== SYSTEM INFORMATION ===
Host: $(hostname)
User: $(whoami)
Validation Directory: $VALIDATION_DIR
Encryption Key: $ENCRYPTION_KEY_FILE

=== VALIDATION RESULTS ===

EOF

    # Validate backup structure
    if ! validate_backup_structure "$BACKUP_BASE_DIR" "$validation_report"; then
        error "Backup structure validation failed"
        return 1
    fi

    # Find all backup files
    local backup_files=($(find "$BACKUP_BASE_DIR/archives" -name "orga-*.enc" | sort -r))

    if [[ ${#backup_files[@]} -eq 0 ]]; then
        error "No backup files found to validate"
        echo "ERROR: No backup files found" >> "$validation_report"
        return 1
    fi

    info "Found ${#backup_files[@]} backup files to validate"

    # Validate each backup file
    local validated=0
    for backup_file in "${backup_files[@]}"; do
        if validate_single_backup "$backup_file" "$validation_report"; then
            ((validated++))
        fi
    done

    # Summary
    echo
    echo -e "${BLUE}=== VALIDATION SUMMARY ===${NC}"
    echo "Total backups found: ${#backup_files[@]}"
    echo "Successfully validated: $validated"
    echo "Failed validation: $((${#backup_files[@]} - validated))"
    echo "Report saved: $validation_report"

    if [[ $validated -eq ${#backup_files[@]} ]]; then
        success "All backups passed validation!"
        echo
        echo "SUMMARY: ALL PASS - $validated/$((${#backup_files[@]})) backups validated" >> "$validation_report"
        return 0
    else
        error "Some backups failed validation"
        echo
        echo "SUMMARY: PARTIAL FAIL - $validated/$((${#backup_files[@]})) backups validated" >> "$validation_report"
        return 1
    fi
}

# ── Command Line Interface ───────────────────────────────────────────────────

show_help() {
    cat <<EOF
ORGA Backup Validation Script

Usage: $0 [OPTIONS] [BACKUP_FILE]

OPTIONS:
    -h, --help          Show this help message
    -l, --list          List available backup files
    -r, --report        Show latest validation report
    -c, --cleanup       Cleanup old validation files

EXAMPLES:
    $0                                    # Validate all backups
    $0 backup.tar.gz.enc                 # Validate specific backup
    $0 --list                            # List available backups
    $0 --report                          # Show latest report

EOF
}

# Parse command line arguments
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    -l|--list)
        echo "Available backup files:"
        find "$BACKUP_BASE_DIR/archives" -name "orga-*.enc" | sort -r | while read -r file; do
            local size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null || echo "0")
            local size_mb=$((size / 1024 / 1024))
            local date=$(stat -c%y "$file" 2>/dev/null || stat -f%Sm "$file" 2>/dev/null || echo "unknown")
            echo "  $(basename "$file") - ${size_mb}MB - $date"
        done
        exit 0
        ;;
    -r|--report)
        local latest_report=$(find "$VALIDATION_DIR" -name "validation-report-*.txt" 2>/dev/null | sort -r | head -1)
        if [[ -f "$latest_report" ]]; then
            echo "Latest validation report:"
            cat "$latest_report"
        else
            echo "No validation reports found"
        fi
        exit 0
        ;;
    -c|--cleanup)
        info "Cleaning up old validation files..."
        find "$VALIDATION_DIR" -name "validation-report-*.txt" -mtime +30 -delete 2>/dev/null || true
        find "$VALIDATION_DIR" -type d -empty -delete 2>/dev/null || true
        success "Cleanup completed"
        exit 0
        ;;
    "")
        # No arguments - validate all backups
        main
        ;;
    *)
        # Specific backup file provided
        if [[ -f "$1" ]]; then
            backup_file="$1"
            validation_report="$VALIDATION_DIR/single-validation-$(date +%Y%m%d_%H%M%S).txt"
            validate_single_backup "$backup_file" "$validation_report"
            echo "Validation report: $validation_report"
        else
            error "Backup file not found: $1"
            exit 1
        fi
        ;;
esac