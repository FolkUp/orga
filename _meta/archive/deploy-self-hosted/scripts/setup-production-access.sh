#!/usr/bin/env bash
# =============================================================================
# ORGA Production Access Setup Script
# =============================================================================
# Initial configuration and validation for production access protocol
# Banking-level security setup with comprehensive verification
# =============================================================================

set -euo pipefail

# ── Configuration ────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ORGA_CONFIG_DIR="$HOME/.orga"
ACCESS_CONFIG="$ORGA_CONFIG_DIR/access-config.json"
MFA_SECRET_FILE="$ORGA_CONFIG_DIR/mfa-secret"
LOG_DIR="/var/log/orga-access"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Setup flags
FORCE_OVERWRITE=false
SKIP_MFA_SETUP=false
DRY_RUN=false
VERBOSE=false

# ── Logging ──────────────────────────────────────────────────────────────────

log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "[$timestamp] [$level] $message"
}

info() { log "INFO" "$@"; echo -e "${CYAN}$@${NC}"; }
warn() { log "WARN" "$@"; echo -e "${YELLOW}$@${NC}" >&2; }
error() { log "ERROR" "$@"; echo -e "${RED}$@${NC}" >&2; }
success() { log "SUCCESS" "$@"; echo -e "${GREEN}$@${NC}"; }
security() { log "SECURITY" "$@"; echo -e "${RED}[SECURITY]${NC} $@"; }

# ── Helper Functions ─────────────────────────────────────────────────────────

show_usage() {
    cat <<EOF
ORGA Production Access Setup v1.0

Usage: $0 [OPTIONS]

OPTIONS:
    -h, --help              Show this help message
    -f, --force             Force overwrite existing configuration
    -s, --skip-mfa          Skip MFA setup (not recommended)
    -d, --dry-run          Simulate setup without making changes
    -v, --verbose          Enable verbose output

EXAMPLES:
    $0                      # Interactive setup
    $0 --force              # Overwrite existing config
    $0 --skip-mfa           # Setup without MFA configuration
    $0 --dry-run            # Test setup without changes

DESCRIPTION:
    Sets up ORGA production access protocol with:
    - Configuration directory creation
    - SSH key generation
    - MFA secret configuration
    - Audit log directory setup
    - System prerequisite validation
    - Security compliance verification

EOF
}

check_prerequisites() {
    info "Checking system prerequisites..."

    local missing_tools=()
    local recommended_tools=()

    # Required tools
    for tool in ssh ssh-keygen openssl jq; do
        if ! command -v "$tool" >/dev/null 2>&1; then
            missing_tools+=("$tool")
        fi
    done

    # Recommended tools
    for tool in oathtool qrencode; do
        if ! command -v "$tool" >/dev/null 2>&1; then
            recommended_tools+=("$tool")
        fi
    done

    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        error "Missing required tools: ${missing_tools[*]}"
        echo
        echo "Install commands:"
        echo "  Ubuntu/Debian: sudo apt-get install openssh-client openssl jq"
        echo "  RHEL/CentOS:   sudo yum install openssh-clients openssl jq"
        echo "  macOS:         brew install openssh openssl jq"
        return 1
    fi

    if [[ ${#recommended_tools[@]} -gt 0 ]]; then
        warn "Missing recommended tools: ${recommended_tools[*]}"
        echo
        echo "Install commands (for MFA support):"
        echo "  Ubuntu/Debian: sudo apt-get install oathtool qrencode"
        echo "  RHEL/CentOS:   sudo yum install oathtool qrencode"
        echo "  macOS:         brew install oath-toolkit qrencode"
        echo
    fi

    # Check for sudo access (needed for log directory)
    if ! sudo -n true 2>/dev/null; then
        warn "Sudo access required for log directory setup"
        warn "You may be prompted for password during setup"
    fi

    success "Prerequisites check completed"
    return 0
}

create_config_directory() {
    info "Creating ORGA configuration directory..."

    if [[ -d "$ORGA_CONFIG_DIR" ]]; then
        if [[ "$FORCE_OVERWRITE" == "true" ]]; then
            warn "Overwriting existing configuration directory"
            rm -rf "$ORGA_CONFIG_DIR"
        elif [[ "$DRY_RUN" != "true" ]]; then
            warn "Configuration directory already exists: $ORGA_CONFIG_DIR"
            echo -n "Overwrite? [y/N]: "
            read -r response
            if [[ "$response" =~ ^[Yy]$ ]]; then
                rm -rf "$ORGA_CONFIG_DIR"
            else
                error "Setup aborted. Use --force to overwrite."
                return 1
            fi
        fi
    fi

    if [[ "$DRY_RUN" == "true" ]]; then
        info "DRY RUN: Would create directory $ORGA_CONFIG_DIR"
        return 0
    fi

    mkdir -p "$ORGA_CONFIG_DIR"
    chmod 700 "$ORGA_CONFIG_DIR"

    success "Configuration directory created: $ORGA_CONFIG_DIR"
    return 0
}

setup_access_configuration() {
    info "Setting up access configuration..."

    local config_template="$SCRIPT_DIR/access-config-template.json"

    if [[ ! -f "$config_template" ]]; then
        error "Configuration template not found: $config_template"
        return 1
    fi

    if [[ "$DRY_RUN" == "true" ]]; then
        info "DRY RUN: Would copy configuration from template"
        return 0
    fi

    # Copy template to user config
    cp "$config_template" "$ACCESS_CONFIG"
    chmod 600 "$ACCESS_CONFIG"

    # Interactive configuration
    info "Configuring server endpoints..."
    echo "Current configuration uses example hosts. Update for your infrastructure:"
    echo "  Production: $(jq -r '.servers.prod.host' "$ACCESS_CONFIG")"
    echo "  Staging:    $(jq -r '.servers.staging.host' "$ACCESS_CONFIG")"
    echo

    if [[ "$VERBOSE" == "true" ]]; then
        echo "Configuration file: $ACCESS_CONFIG"
        echo "Edit this file to customize server endpoints and access policies."
    fi

    success "Access configuration created"
    return 0
}

generate_ssh_keys() {
    info "Generating SSH keys for production access..."

    local ssh_key_path="$HOME/.ssh/orga_prod"

    if [[ -f "$ssh_key_path" ]]; then
        if [[ "$FORCE_OVERWRITE" == "true" ]]; then
            warn "Overwriting existing SSH key"
        elif [[ "$DRY_RUN" != "true" ]]; then
            warn "SSH key already exists: $ssh_key_path"
            echo -n "Generate new key? [y/N]: "
            read -r response
            if [[ ! "$response" =~ ^[Yy]$ ]]; then
                info "Keeping existing SSH key"
                return 0
            fi
        fi
    fi

    if [[ "$DRY_RUN" == "true" ]]; then
        info "DRY RUN: Would generate SSH key pair"
        return 0
    fi

    # Generate Ed25519 key pair
    ssh-keygen -t ed25519 -f "$ssh_key_path" \
        -C "orga-prod-$(whoami)-$(date +%Y%m%d)" -N ""

    # Set proper permissions
    chmod 600 "$ssh_key_path"
    chmod 644 "${ssh_key_path}.pub"

    success "SSH key pair generated: $ssh_key_path"

    # Display public key for server configuration
    echo
    echo -e "${YELLOW}=== Public Key for Server Configuration ===${NC}"
    echo "Add this public key to authorized_keys on your production servers:"
    echo
    cat "${ssh_key_path}.pub"
    echo
    echo "Example command for server configuration:"
    echo "  cat ~/.ssh/orga_prod.pub | ssh user@server 'cat >> ~/.ssh/authorized_keys'"
    echo

    return 0
}

setup_mfa() {
    if [[ "$SKIP_MFA_SETUP" == "true" ]]; then
        info "Skipping MFA setup as requested"
        return 0
    fi

    info "Setting up Multi-Factor Authentication..."

    if [[ "$DRY_RUN" == "true" ]]; then
        info "DRY RUN: Would set up MFA secret"
        return 0
    fi

    # Check for existing MFA secret
    if [[ -f "$MFA_SECRET_FILE" ]]; then
        if [[ "$FORCE_OVERWRITE" == "true" ]]; then
            warn "Overwriting existing MFA secret"
        else
            warn "MFA secret already exists: $MFA_SECRET_FILE"
            echo -n "Generate new secret? [y/N]: "
            read -r response
            if [[ ! "$response" =~ ^[Yy]$ ]]; then
                info "Keeping existing MFA secret"
                return 0
            fi
        fi
    fi

    # Generate new MFA secret
    local mfa_secret=$(openssl rand -base32 20)

    # Save MFA secret
    echo "$mfa_secret" > "$MFA_SECRET_FILE"
    chmod 600 "$MFA_SECRET_FILE"

    success "MFA secret generated and saved"

    # Display setup information
    echo
    echo -e "${YELLOW}=== MFA Setup Instructions ===${NC}"
    echo "1. Install a TOTP app (Google Authenticator, Authy, 1Password)"
    echo "2. Add a new account with this secret:"
    echo
    echo "   Secret: $mfa_secret"
    echo
    echo "3. Or scan this QR code (if qrencode is available):"

    # Generate QR code if qrencode is available
    if command -v qrencode >/dev/null 2>&1; then
        local totp_uri="otpauth://totp/ORGA-Production:$(whoami)?secret=$mfa_secret&issuer=ORGA"
        echo
        echo "$totp_uri" | qrencode -t UTF8
        echo
    else
        warn "qrencode not available - install for QR code generation"
    fi

    # Test TOTP generation if oathtool is available
    if command -v oathtool >/dev/null 2>&1; then
        echo "4. Test token generation:"
        echo "   Current token: $(oathtool --totp --base32 "$mfa_secret")"
        echo
        echo "Configure your TOTP app, then test with:"
        echo "   ./scripts/production-access.sh status"
    else
        warn "oathtool not available - install for TOTP testing"
    fi

    echo

    return 0
}

setup_audit_logs() {
    info "Setting up audit log directory..."

    if [[ "$DRY_RUN" == "true" ]]; then
        info "DRY RUN: Would create audit log directory"
        return 0
    fi

    # Create log directory with sudo
    if sudo mkdir -p "$LOG_DIR" 2>/dev/null; then
        sudo chown root:adm "$LOG_DIR" 2>/dev/null || sudo chown root:wheel "$LOG_DIR" 2>/dev/null || true
        sudo chmod 750 "$LOG_DIR"
        success "Audit log directory created: $LOG_DIR"
    else
        warn "Failed to create system log directory"
        warn "Creating user log directory instead: $ORGA_CONFIG_DIR/logs"
        mkdir -p "$ORGA_CONFIG_DIR/logs"
        chmod 750 "$ORGA_CONFIG_DIR/logs"
    fi

    return 0
}

validate_setup() {
    info "Validating setup configuration..."

    local validation_errors=()

    # Check configuration directory
    if [[ ! -d "$ORGA_CONFIG_DIR" ]]; then
        validation_errors+=("Configuration directory missing: $ORGA_CONFIG_DIR")
    elif [[ $(stat -c%a "$ORGA_CONFIG_DIR" 2>/dev/null || stat -f%Lp "$ORGA_CONFIG_DIR" 2>/dev/null) != "700" ]]; then
        validation_errors+=("Configuration directory permissions incorrect (should be 700)")
    fi

    # Check access configuration
    if [[ ! -f "$ACCESS_CONFIG" ]]; then
        validation_errors+=("Access configuration missing: $ACCESS_CONFIG")
    elif ! jq '.' "$ACCESS_CONFIG" >/dev/null 2>&1; then
        validation_errors+=("Access configuration invalid JSON")
    fi

    # Check SSH keys
    if [[ ! -f "$HOME/.ssh/orga_prod" ]]; then
        validation_errors+=("SSH private key missing: $HOME/.ssh/orga_prod")
    elif [[ $(stat -c%a "$HOME/.ssh/orga_prod" 2>/dev/null || stat -f%Lp "$HOME/.ssh/orga_prod" 2>/dev/null) != "600" ]]; then
        validation_errors+=("SSH private key permissions incorrect (should be 600)")
    fi

    if [[ ! -f "$HOME/.ssh/orga_prod.pub" ]]; then
        validation_errors+=("SSH public key missing: $HOME/.ssh/orga_prod.pub")
    fi

    # Check MFA setup (if not skipped)
    if [[ "$SKIP_MFA_SETUP" != "true" ]]; then
        if [[ ! -f "$MFA_SECRET_FILE" ]]; then
            validation_errors+=("MFA secret missing: $MFA_SECRET_FILE")
        elif [[ $(stat -c%a "$MFA_SECRET_FILE" 2>/dev/null || stat -f%Lp "$MFA_SECRET_FILE" 2>/dev/null) != "600" ]]; then
            validation_errors+=("MFA secret permissions incorrect (should be 600)")
        fi
    fi

    # Check log directory
    if [[ ! -d "$LOG_DIR" ]] && [[ ! -d "$ORGA_CONFIG_DIR/logs" ]]; then
        validation_errors+=("Audit log directory missing")
    fi

    # Report validation results
    if [[ ${#validation_errors[@]} -gt 0 ]]; then
        error "Setup validation failed:"
        for error in "${validation_errors[@]}"; do
            echo "  - $error"
        done
        return 1
    else
        success "Setup validation passed"
        return 0
    fi
}

test_production_access() {
    info "Testing production access script..."

    local access_script="$SCRIPT_DIR/production-access.sh"

    if [[ ! -f "$access_script" ]]; then
        error "Production access script not found: $access_script"
        return 1
    fi

    if [[ ! -x "$access_script" ]]; then
        chmod +x "$access_script"
        info "Made production access script executable"
    fi

    if [[ "$DRY_RUN" == "true" ]]; then
        info "DRY RUN: Would test production access script"
        return 0
    fi

    # Test script execution
    if "$access_script" --help >/dev/null 2>&1; then
        success "Production access script test passed"
    else
        error "Production access script test failed"
        return 1
    fi

    return 0
}

show_setup_summary() {
    echo
    echo -e "${BLUE}=== ORGA Production Access Setup Complete ===${NC}"
    echo "Setup completed: $(date)"
    echo

    echo -e "${CYAN}Configuration Files:${NC}"
    echo "  Config directory: $ORGA_CONFIG_DIR"
    echo "  Access config:    $ACCESS_CONFIG"
    echo "  SSH private key:  $HOME/.ssh/orga_prod"
    echo "  SSH public key:   $HOME/.ssh/orga_prod.pub"
    if [[ "$SKIP_MFA_SETUP" != "true" ]]; then
        echo "  MFA secret:       $MFA_SECRET_FILE"
    fi
    echo

    echo -e "${CYAN}Next Steps:${NC}"
    echo "1. Add SSH public key to production server authorized_keys"
    echo "2. Configure TOTP app with MFA secret (if not skipped)"
    echo "3. Update server endpoints in $ACCESS_CONFIG"
    echo "4. Test connection:"
    echo "   ./scripts/production-access.sh status"
    echo

    if [[ "$SKIP_MFA_SETUP" != "true" ]]; then
        echo -e "${YELLOW}Security Reminders:${NC}"
        echo "- Keep MFA secret secure and backed up"
        echo "- Rotate SSH keys regularly (recommended: 90 days)"
        echo "- Monitor access logs in $LOG_DIR"
        echo "- Review access configuration periodically"
        echo
    fi

    echo -e "${GREEN}Banking-level security controls are now active.${NC}"
    echo
}

# ── Command Line Argument Parsing ───────────────────────────────────────────

parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_usage
                exit 0
                ;;
            -f|--force)
                FORCE_OVERWRITE=true
                shift
                ;;
            -s|--skip-mfa)
                SKIP_MFA_SETUP=true
                shift
                ;;
            -d|--dry-run)
                DRY_RUN=true
                shift
                ;;
            -v|--verbose)
                VERBOSE=true
                set -x
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

# ── Main Setup Function ──────────────────────────────────────────────────────

main() {
    echo -e "${BLUE}=== ORGA Production Access Setup v1.0 ===${NC}"
    echo "Banking-Level Security Configuration"
    echo "Setup started: $(date)"
    echo

    if [[ "$DRY_RUN" == "true" ]]; then
        warn "DRY RUN MODE - No actual changes will be made"
        echo
    fi

    # Execute setup steps
    local setup_functions=(
        "check_prerequisites"
        "create_config_directory"
        "setup_access_configuration"
        "generate_ssh_keys"
        "setup_mfa"
        "setup_audit_logs"
        "validate_setup"
        "test_production_access"
    )

    for func in "${setup_functions[@]}"; do
        if ! $func; then
            error "Setup step failed: $func"
            exit 1
        fi
        echo
    done

    show_setup_summary
    security "Production access setup completed by $(whoami)"
}

# ── Entry Point ──────────────────────────────────────────────────────────────

# Parse command line arguments
parse_arguments "$@"

# Execute main setup
if main; then
    exit 0
else
    exit 1
fi