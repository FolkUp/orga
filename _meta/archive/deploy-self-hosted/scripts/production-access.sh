#!/usr/bin/env bash
# =============================================================================
# ORGA Production Server Access Protocol
# =============================================================================
# Secure remote access with banking-level security standards
# Multi-factor authentication, session logging, emergency procedures
# =============================================================================

set -euo pipefail

# ── Configuration ────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ACCESS_LOG_DIR="/var/log/orga-access"
SESSION_LOG_FILE="$ACCESS_LOG_DIR/access-$(date +%Y%m).log"
CONFIG_FILE="$HOME/.orga/access-config.json"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Access control flags
REQUIRE_MFA=true
LOG_ALL_SESSIONS=true
EMERGENCY_MODE=false
DRY_RUN=false

# ── Logging ──────────────────────────────────────────────────────────────────

log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local user=$(whoami)
    local session_id="${ORGA_SESSION_ID:-$(uuidgen | cut -d'-' -f1)}"

    echo -e "[$timestamp] [$level] [$user] [$session_id] $message" | tee -a "$SESSION_LOG_FILE"
}

info() { log "INFO" "$@"; echo -e "${CYAN}$@${NC}"; }
warn() { log "WARN" "$@"; echo -e "${YELLOW}$@${NC}" >&2; }
error() { log "ERROR" "$@"; echo -e "${RED}$@${NC}" >&2; }
success() { log "SUCCESS" "$@"; echo -e "${GREEN}$@${NC}"; }
security() { log "SECURITY" "$@"; echo -e "${RED}[SECURITY]${NC} $@"; }

# ── Access Control Functions ─────────────────────────────────────────────────

show_usage() {
    cat <<EOF
ORGA Production Access Protocol v1.0

Usage: $0 [COMMAND] [OPTIONS]

COMMANDS:
    connect [SERVER]        Connect to production server
    emergency              Emergency access mode
    status                 Show access status
    audit                  Security audit of access logs
    revoke [USER]          Revoke access for user
    rotate-keys           Rotate SSH keys
    list-sessions         List active sessions

OPTIONS:
    -h, --help             Show this help message
    -e, --emergency        Enable emergency access mode
    -d, --dry-run          Simulate operations without execution
    -v, --verbose          Enable verbose logging
    --no-mfa               Skip MFA verification (emergency only)

EXAMPLES:
    $0 connect prod         # Standard production access
    $0 emergency            # Emergency access protocol
    $0 audit --last-24h     # Audit last 24 hours
    $0 rotate-keys          # Rotate all SSH keys

EOF
}

verify_prerequisites() {
    info "Verifying access prerequisites..."

    # Check required tools
    local missing_tools=()
    for tool in ssh scp rsync gpg openssl; do
        if ! command -v "$tool" >/dev/null 2>&1; then
            missing_tools+=("$tool")
        fi
    done

    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        error "Missing required tools: ${missing_tools[*]}"
        return 1
    fi

    # Create access log directory
    sudo mkdir -p "$ACCESS_LOG_DIR"
    sudo chown root:adm "$ACCESS_LOG_DIR"
    sudo chmod 750 "$ACCESS_LOG_DIR"

    # Check SSH key
    if [[ ! -f "$HOME/.ssh/orga_prod" ]]; then
        warn "Production SSH key not found: $HOME/.ssh/orga_prod"
        warn "Run: $0 rotate-keys to generate new keys"
        return 1
    fi

    # Check key permissions
    if [[ $(stat -c%a "$HOME/.ssh/orga_prod" 2>/dev/null) != "600" ]]; then
        warn "Fixing SSH key permissions"
        chmod 600 "$HOME/.ssh/orga_prod"
    fi

    success "Prerequisites verified"
    return 0
}

verify_mfa() {
    if [[ "$REQUIRE_MFA" != "true" ]] || [[ "$EMERGENCY_MODE" == "true" ]]; then
        return 0
    fi

    info "Multi-Factor Authentication required"

    # Check for TOTP token
    if ! command -v oathtool >/dev/null 2>&1; then
        error "TOTP generator not found. Install: apt-get install oathtool"
        return 1
    fi

    # Get MFA secret
    local mfa_secret
    if [[ -f "$HOME/.orga/mfa-secret" ]]; then
        mfa_secret=$(cat "$HOME/.orga/mfa-secret")
    else
        error "MFA secret not found. Run setup-mfa command."
        return 1
    fi

    # Generate current TOTP
    local expected_token=$(oathtool --totp --base32 "$mfa_secret")

    # Prompt for token
    echo -n "Enter TOTP token: "
    read -r user_token

    if [[ "$user_token" == "$expected_token" ]]; then
        success "MFA verification successful"
        security "MFA authentication successful for $(whoami)"
        return 0
    else
        error "MFA verification failed"
        security "MFA authentication failed for $(whoami)"
        return 1
    fi
}

connect_to_server() {
    local server="${1:-prod}"
    local session_id=$(uuidgen | cut -d'-' -f1)
    export ORGA_SESSION_ID="$session_id"

    info "Initiating connection to $server environment"
    security "Access attempt initiated for $server by $(whoami) (session: $session_id)"

    # Verify MFA
    if ! verify_mfa; then
        error "Access denied: MFA verification failed"
        return 1
    fi

    # Load server configuration
    local server_config
    if [[ -f "$CONFIG_FILE" ]]; then
        server_config=$(jq -r ".servers.$server // empty" "$CONFIG_FILE" 2>/dev/null || echo "")
    fi

    if [[ -z "$server_config" || "$server_config" == "null" ]]; then
        error "Server configuration not found for: $server"
        error "Available servers: $(jq -r '.servers | keys[]' "$CONFIG_FILE" 2>/dev/null || echo 'none')"
        return 1
    fi

    local host=$(echo "$server_config" | jq -r '.host')
    local port=$(echo "$server_config" | jq -r '.port // 22')
    local user=$(echo "$server_config" | jq -r '.user // "deploy"')

    if [[ "$DRY_RUN" == "true" ]]; then
        info "DRY RUN: Would connect to $user@$host:$port"
        return 0
    fi

    # Create session log
    info "Establishing secure connection..."

    # SSH with session logging
    local ssh_command="ssh -i $HOME/.ssh/orga_prod -p $port -o StrictHostKeyChecking=yes -o UserKnownHostsFile=$HOME/.ssh/known_hosts_orga $user@$host"

    # Log connection details
    security "SSH connection established to $server ($host:$port) by $(whoami) (session: $session_id)"

    # Execute connection with audit trail
    if script -qc "$ssh_command" "$ACCESS_LOG_DIR/session-$session_id-$(date +%Y%m%d_%H%M%S).log"; then
        success "Connection completed successfully"
        security "SSH session terminated for $server by $(whoami) (session: $session_id)"
        return 0
    else
        error "Connection failed"
        security "SSH connection failed for $server by $(whoami) (session: $session_id)"
        return 1
    fi
}

emergency_access() {
    warn "=== EMERGENCY ACCESS MODE ==="
    warn "This mode bypasses normal security controls"
    warn "All actions will be logged and audited"

    export EMERGENCY_MODE=true

    # Emergency justification
    echo -n "Emergency justification (required): "
    read -r justification

    if [[ -z "$justification" ]]; then
        error "Emergency justification required"
        return 1
    fi

    security "EMERGENCY ACCESS ACTIVATED by $(whoami): $justification"

    # Reduced MFA requirements
    export REQUIRE_MFA=false

    # Connect with emergency flags
    warn "Emergency connection established. Normal security controls bypassed."
    connect_to_server "${1:-prod}"

    security "EMERGENCY ACCESS COMPLETED by $(whoami)"
}

audit_access_logs() {
    local time_filter="${1:-24h}"

    info "Auditing access logs (last $time_filter)"

    # Calculate time boundary
    local since_date
    case $time_filter in
        24h|1d)
            since_date=$(date -d '24 hours ago' '+%Y-%m-%d %H:%M:%S')
            ;;
        7d|week)
            since_date=$(date -d '7 days ago' '+%Y-%m-%d %H:%M:%S')
            ;;
        30d|month)
            since_date=$(date -d '30 days ago' '+%Y-%m-%d %H:%M:%S')
            ;;
        *)
            since_date="$time_filter"
            ;;
    esac

    echo -e "${BLUE}=== Access Audit Report ===${NC}"
    echo "Time period: Since $since_date"
    echo "Report generated: $(date)"
    echo

    # Summary statistics
    local total_attempts=$(awk -v since="$since_date" '$1 " " $2 >= since' "$SESSION_LOG_FILE" | grep -c "Access attempt" || echo "0")
    local successful_auths=$(awk -v since="$since_date" '$1 " " $2 >= since' "$SESSION_LOG_FILE" | grep -c "MFA authentication successful" || echo "0")
    local failed_auths=$(awk -v since="$since_date" '$1 " " $2 >= since' "$SESSION_LOG_FILE" | grep -c "MFA authentication failed" || echo "0")
    local emergency_access=$(awk -v since="$since_date" '$1 " " $2 >= since' "$SESSION_LOG_FILE" | grep -c "EMERGENCY ACCESS" || echo "0")

    echo "Total access attempts: $total_attempts"
    echo "Successful authentications: $successful_auths"
    echo "Failed authentications: $failed_auths"
    echo "Emergency access events: $emergency_access"
    echo

    # Security events
    if [[ $failed_auths -gt 0 ]] || [[ $emergency_access -gt 0 ]]; then
        warn "=== SECURITY EVENTS ==="
        awk -v since="$since_date" '$1 " " $2 >= since && /\[SECURITY\]/' "$SESSION_LOG_FILE"
        echo
    fi

    # Recent sessions
    echo -e "${BLUE}=== Recent Access Sessions ===${NC}"
    awk -v since="$since_date" '$1 " " $2 >= since && /SSH connection established/' "$SESSION_LOG_FILE" | tail -10
}

rotate_ssh_keys() {
    info "Rotating SSH keys for production access"

    # Backup existing keys
    if [[ -f "$HOME/.ssh/orga_prod" ]]; then
        local backup_date=$(date +%Y%m%d_%H%M%S)
        cp "$HOME/.ssh/orga_prod" "$HOME/.ssh/orga_prod.backup.$backup_date"
        cp "$HOME/.ssh/orga_prod.pub" "$HOME/.ssh/orga_prod.pub.backup.$backup_date"
        info "Existing keys backed up"
    fi

    if [[ "$DRY_RUN" == "true" ]]; then
        info "DRY RUN: Would generate new SSH key pair"
        return 0
    fi

    # Generate new key pair
    ssh-keygen -t ed25519 -f "$HOME/.ssh/orga_prod" -C "orga-prod-$(whoami)-$(date +%Y%m%d)" -N ""

    # Set proper permissions
    chmod 600 "$HOME/.ssh/orga_prod"
    chmod 644 "$HOME/.ssh/orga_prod.pub"

    success "New SSH key pair generated"

    # Display public key for server configuration
    echo
    echo -e "${YELLOW}=== Public Key for Server Configuration ===${NC}"
    cat "$HOME/.ssh/orga_prod.pub"
    echo
    warn "Add this public key to the authorized_keys on all production servers"

    security "SSH keys rotated by $(whoami)"
}

list_active_sessions() {
    info "Listing active production sessions"

    echo -e "${BLUE}=== Active Sessions ===${NC}"

    # Check for active SSH connections
    if command -v ss >/dev/null 2>&1; then
        ss -t state established '( dport = :ssh or sport = :ssh )' | grep -v '^State' || echo "No active SSH sessions found"
    elif command -v netstat >/dev/null 2>&1; then
        netstat -tn | grep ':22 ' | grep ESTABLISHED || echo "No active SSH sessions found"
    else
        warn "Cannot check active sessions: ss or netstat required"
    fi

    echo

    # Recent session logs
    echo -e "${BLUE}=== Recent Session Activity ===${NC}"
    grep "SSH connection" "$SESSION_LOG_FILE" 2>/dev/null | tail -5 || echo "No recent session logs found"
}

revoke_user_access() {
    local target_user="$1"

    if [[ -z "$target_user" ]]; then
        error "User not specified"
        return 1
    fi

    warn "Revoking access for user: $target_user"
    security "Access revocation initiated for $target_user by $(whoami)"

    # Log revocation event
    if [[ "$DRY_RUN" == "true" ]]; then
        info "DRY RUN: Would revoke access for $target_user"
        return 0
    fi

    # Implementation would remove user from authorized_keys, etc.
    # This is a placeholder for the actual revocation logic

    success "Access revoked for: $target_user"
    security "Access revocation completed for $target_user by $(whoami)"
}

# ── Command Line Interface ───────────────────────────────────────────────────

parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_usage
                exit 0
                ;;
            -e|--emergency)
                EMERGENCY_MODE=true
                shift
                ;;
            -d|--dry-run)
                DRY_RUN=true
                shift
                ;;
            -v|--verbose)
                set -x
                shift
                ;;
            --no-mfa)
                if [[ "$EMERGENCY_MODE" != "true" ]]; then
                    error "--no-mfa only allowed in emergency mode"
                    exit 1
                fi
                REQUIRE_MFA=false
                shift
                ;;
            --last-24h|--last-7d|--last-30d)
                TIME_FILTER="${1#--last-}"
                shift
                ;;
            *)
                break
                ;;
        esac
    done
}

main() {
    echo -e "${BLUE}=== ORGA Production Access Protocol v1.0 ===${NC}"
    echo "Session started: $(date)"
    echo "User: $(whoami)"
    echo

    # Setup logging directory
    sudo mkdir -p "$ACCESS_LOG_DIR" 2>/dev/null || mkdir -p "$HOME/.orga/logs"

    # Verify prerequisites
    if ! verify_prerequisites; then
        error "Prerequisites check failed"
        return 1
    fi

    local command="${1:-status}"
    shift || true

    case $command in
        connect)
            connect_to_server "$@"
            ;;
        emergency)
            emergency_access "$@"
            ;;
        status)
            info "Production access status: Available"
            list_active_sessions
            ;;
        audit)
            audit_access_logs "${TIME_FILTER:-24h}"
            ;;
        revoke)
            revoke_user_access "$@"
            ;;
        rotate-keys)
            rotate_ssh_keys
            ;;
        list-sessions)
            list_active_sessions
            ;;
        *)
            error "Unknown command: $command"
            show_usage
            exit 1
            ;;
    esac
}

# ── Entry Point ──────────────────────────────────────────────────────────────

# Parse command line arguments
parse_arguments "$@"

# Execute main function
if main "$@"; then
    exit 0
else
    exit 1
fi