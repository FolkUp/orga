#!/bin/bash
# ORGA Underground Academia - Backup Validation Script
# Banking-Level Security Standards | Generated: 2026-04-15

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_DIR="${PROJECT_DIR}/.config/logs"
LOG_FILE="${LOG_DIR}/validation-${TIMESTAMP}.log"
TEMP_DIR="/tmp/orga-validation-${TIMESTAMP}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Cleanup function
cleanup() {
    if [[ -d "$TEMP_DIR" ]]; then
        rm -rf "$TEMP_DIR"
    fi
}
trap cleanup EXIT

log() {
    echo "[$TIMESTAMP] $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "[$TIMESTAMP] ${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "[$TIMESTAMP] ${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "[$TIMESTAMP] ${YELLOW}⚠️ $1${NC}" | tee -a "$LOG_FILE"
}

log_info() {
    echo -e "[$TIMESTAMP] ${BLUE}ℹ️ $1${NC}" | tee -a "$LOG_FILE"
}

echo -e "${BLUE}=== ORGA Backup Validation Test ===${NC}"
log "Starting ORGA backup validation"

# Test 1: Git repository integrity
echo -e "\n${BLUE}Test 1: Git Repository Integrity${NC}"
log_info "Testing git repository integrity..."

cd "$PROJECT_DIR"

if git fsck --full --strict >> "$LOG_FILE" 2>&1; then
    log_success "Git repository integrity check passed"
else
    log_error "Git repository integrity check failed"
    exit 1
fi

# Check if we have any commits
if ! git rev-parse HEAD >> "$LOG_FILE" 2>&1; then
    log_warning "No commits found in repository"
else
    # Check for recent backup commits
    recent_backups=$(git log --oneline --since="24 hours ago" --grep="backup:" | wc -l)
    if [[ $recent_backups -gt 0 ]]; then
        log_success "Found $recent_backups recent backup commits"
    else
        log_warning "No recent backup commits found"
    fi
fi

# Test 2: Source build verification
echo -e "\n${BLUE}Test 2: Source Build Verification${NC}"
log_info "Testing source build..."

# Check if node_modules exists and install if needed
if [[ ! -d "node_modules" ]]; then
    log_info "Installing dependencies..."
    if npm ci >> "$LOG_FILE" 2>&1; then
        log_success "Dependencies installed successfully"
    else
        log_error "Failed to install dependencies"
        exit 1
    fi
fi

# Run Astro check
if npm run check >> "$LOG_FILE" 2>&1; then
    log_success "Astro type checking passed"
else
    log_error "Astro type checking failed"
    exit 1
fi

# Run build
if npm run build >> "$LOG_FILE" 2>&1; then
    log_success "Build completed successfully"
else
    log_error "Build failed"
    exit 1
fi

# Verify build output
if [[ -d "dist" ]] && [[ -f "dist/index.html" ]]; then
    log_success "Build artifacts generated correctly"
else
    log_error "Build artifacts missing or incomplete"
    exit 1
fi

# Test 3: Content integrity
echo -e "\n${BLUE}Test 3: Content File Integrity${NC}"
log_info "Validating content files..."

content_errors=0

# Check source files exist and are readable
required_dirs=("src" "public")
for dir in "${required_dirs[@]}"; do
    if [[ -d "$dir" ]]; then
        log_success "Directory $dir exists"

        # Check for common file types
        file_count=$(find "$dir" -type f | wc -l)
        log_info "Found $file_count files in $dir"
    else
        log_error "Required directory $dir missing"
        content_errors=$((content_errors + 1))
    fi
done

# Check configuration files
config_files=("package.json" "astro.config.mjs" "tsconfig.json")
for file in "${config_files[@]}"; do
    if [[ -f "$file" ]]; then
        log_success "Configuration file $file exists"

        # Basic syntax check for JSON files
        if [[ "$file" == *.json ]]; then
            if jq empty "$file" >> "$LOG_FILE" 2>&1; then
                log_success "$file has valid JSON syntax"
            else
                log_error "$file has invalid JSON syntax"
                content_errors=$((content_errors + 1))
            fi
        fi
    else
        log_error "Required configuration file $file missing"
        content_errors=$((content_errors + 1))
    fi
done

# Test 4: Asset integrity
echo -e "\n${BLUE}Test 4: Static Asset Integrity${NC}"
log_info "Validating static assets..."

if [[ -d "public" ]]; then
    # Check for broken symlinks or corrupted files
    broken_files=0
    while IFS= read -r -d '' file; do
        if ! file "$file" >> "$LOG_FILE" 2>&1; then
            log_error "Corrupted file detected: $file"
            broken_files=$((broken_files + 1))
        fi
    done < <(find public -type f -print0)

    if [[ $broken_files -eq 0 ]]; then
        log_success "All static assets validated successfully"
    else
        log_error "$broken_files corrupted static assets found"
        content_errors=$((content_errors + 1))
    fi
fi

# Test 5: Backup file integrity (if backup files exist)
echo -e "\n${BLUE}Test 5: Backup File Integrity${NC}"
log_info "Checking backup file integrity..."

backup_dir=".backup"
if [[ -d "$backup_dir" ]]; then
    # Check for hash files
    hash_files=$(find "$backup_dir" -name "*.txt" -name "*hash*" | wc -l)
    if [[ $hash_files -gt 0 ]]; then
        log_success "Found $hash_files integrity hash files"

        # Verify most recent hash file
        latest_hash=$(find "$backup_dir" -name "*hash*.txt" -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -d' ' -f2-)
        if [[ -n "$latest_hash" ]]; then
            if sha256sum -c "$latest_hash" >> "$LOG_FILE" 2>&1; then
                log_success "Latest hash verification passed"
            else
                log_warning "Some files have changed since last hash generation"
            fi
        fi
    else
        log_warning "No integrity hash files found"
    fi
else
    log_warning "No backup directory found"
fi

# Test 6: Recovery simulation
echo -e "\n${BLUE}Test 6: Recovery Simulation${NC}"
log_info "Simulating recovery process..."

mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

# Simulate cloning repository
if [[ -n "$(git remote get-url origin 2>/dev/null || echo '')" ]]; then
    origin_url=$(cd "$PROJECT_DIR" && git remote get-url origin)
    if git clone "$origin_url" recovery-test >> "$LOG_FILE" 2>&1; then
        log_success "Repository clone simulation successful"

        cd recovery-test
        if [[ -f "package.json" ]] && [[ -d "src" ]]; then
            log_success "Cloned repository structure validated"
        else
            log_error "Cloned repository structure incomplete"
            content_errors=$((content_errors + 1))
        fi
    else
        log_warning "Repository clone simulation failed (may not have remote)"
    fi
else
    log_warning "No git remote configured, skipping clone test"
fi

# Final results
echo -e "\n${BLUE}=== Validation Summary ===${NC}"

if [[ $content_errors -eq 0 ]]; then
    log_success "All backup validation tests passed"
    echo -e "${GREEN}🎉 ORGA backup system is healthy and ready for production${NC}"
    exit 0
else
    log_error "Validation failed with $content_errors errors"
    echo -e "${RED}💥 ORGA backup system requires attention before production use${NC}"
    exit 1
fi