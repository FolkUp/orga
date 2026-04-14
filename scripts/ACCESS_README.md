# ORGA Production Access Protocol Documentation

**Version:** 1.0
**Date:** April 2026
**Banking-Level Security Implementation**

## Overview

The ORGA Production Access Protocol implements secure remote access to production infrastructure with banking-level security controls, comprehensive audit trails, and emergency procedures.

### Security Features

- **Multi-Factor Authentication (MFA)** with TOTP tokens
- **SSH Key Rotation** with automated lifecycle management
- **Session Recording** and comprehensive audit trails
- **Emergency Access Protocol** with break-glass procedures
- **Banking-Level Compliance** with audit retention and monitoring
- **Zero-Trust Architecture** with continuous verification

### Access Architecture

```
Client Access Control
├── MFA Authentication (TOTP)
├── SSH Key Verification (Ed25519)
├── Session Monitoring & Recording
├── Command Logging & Filtering
└── Emergency Break-Glass Protocol
```

## Requirements

### System Requirements

- **Linux/macOS:** bash, ssh, openssl, jq, oathtool
- **Logging:** sudo access for /var/log/orga-access/ directory
- **MFA:** TOTP generator (oathtool, Google Authenticator, Authy)
- **Network:** Secure connection to production infrastructure

### Security Requirements

- **SSH Keys:** Ed25519 keys with proper permissions (600)
- **MFA Secret:** TOTP shared secret in `~/.orga/mfa-secret`
- **Config File:** Server configuration in `~/.orga/access-config.json`
- **Audit Logs:** Comprehensive session and security event logging

## Quick Start

### 1. Initial Setup

```bash
# Create ORGA configuration directory
mkdir -p ~/.orga
chmod 700 ~/.orga

# Copy configuration template
cp scripts/access-config-template.json ~/.orga/access-config.json

# Generate MFA secret (replace with your actual secret)
echo "YOUR_TOTP_SECRET_HERE" > ~/.orga/mfa-secret
chmod 600 ~/.orga/mfa-secret

# Create audit log directory (requires sudo)
sudo mkdir -p /var/log/orga-access
sudo chown root:adm /var/log/orga-access
sudo chmod 750 /var/log/orga-access
```

### 2. Generate SSH Keys

```bash
# Generate new production SSH key pair
./scripts/production-access.sh rotate-keys

# Add public key to authorized_keys on production servers
# (Key will be displayed after generation)
```

### 3. Standard Production Access

```bash
# Connect to production server
./scripts/production-access.sh connect prod

# Check access status
./scripts/production-access.sh status

# List active sessions
./scripts/production-access.sh list-sessions
```

### 4. Emergency Procedures

```bash
# Emergency access (bypasses normal controls)
./scripts/production-access.sh emergency prod

# Revoke user access immediately
./scripts/production-access.sh revoke username
```

## Detailed Usage

### Production Access (`production-access.sh`)

Secure remote access with comprehensive security controls.

**Features:**
- Multi-factor authentication with TOTP
- SSH key-based authentication with Ed25519 keys
- Session recording and audit trails
- Emergency access procedures
- Automated security monitoring

**Usage:**
```bash
# Standard access
./scripts/production-access.sh connect [server]

# Emergency access
./scripts/production-access.sh emergency [server]

# Security audit
./scripts/production-access.sh audit [--last-24h|--last-7d|--last-30d]

# Key management
./scripts/production-access.sh rotate-keys

# User management
./scripts/production-access.sh revoke [username]
```

**Available Servers:**
- `prod` - Production server (default)
- `staging` - Staging server
- `backup` - Backup server

**MFA Setup:**
```bash
# Install TOTP generator
sudo apt-get install oathtool  # Ubuntu/Debian
brew install oath-toolkit       # macOS

# Configure MFA secret
echo "YOUR_32_CHAR_BASE32_SECRET" > ~/.orga/mfa-secret
chmod 600 ~/.orga/mfa-secret

# Test TOTP generation
oathtool --totp --base32 "$(cat ~/.orga/mfa-secret)"
```

## Configuration

### Server Configuration (`~/.orga/access-config.json`)

Complete server and access policy configuration.

**Format:**
```json
{
  "servers": {
    "prod": {
      "host": "production.example.com",
      "port": 22,
      "user": "deploy",
      "environment": "production",
      "criticality": "high"
    }
  },
  "access_policies": {
    "production": {
      "required_approvals": 1,
      "session_recording": true,
      "command_logging": true,
      "allowed_hours": "06:00-22:00 UTC"
    }
  }
}
```

**Security Policies:**
- **Production Access:** MFA required, session recording, command logging
- **Staging Access:** Reduced security controls, 24/7 availability
- **Emergency Access:** Break-glass procedure with automatic revocation

### SSH Key Management

**Key Generation:**
```bash
# Rotate SSH keys (Ed25519)
./scripts/production-access.sh rotate-keys

# Manual key generation
ssh-keygen -t ed25519 -f ~/.ssh/orga_prod -C "orga-prod-$(whoami)-$(date +%Y%m%d)"
chmod 600 ~/.ssh/orga_prod
```

**Key Deployment:**
```bash
# Add public key to production servers
cat ~/.ssh/orga_prod.pub | ssh user@server 'cat >> ~/.ssh/authorized_keys'

# Verify key deployment
ssh -i ~/.ssh/orga_prod user@server 'echo "Key verified"'
```

## Security Controls

### Multi-Factor Authentication

**TOTP Implementation:**
- 30-second token validity window
- Base32-encoded shared secret
- RFC 6238 compliant TOTP generation
- Backup codes for emergency access

**Setup Process:**
1. Generate or obtain TOTP shared secret
2. Store secret in `~/.orga/mfa-secret` (permissions: 600)
3. Configure TOTP app with shared secret
4. Test token generation and verification

### Session Security

**Session Recording:**
- All production sessions recorded to `/var/log/orga-access/`
- Session logs include timestamp, user, server, commands
- Automatic log rotation with configurable retention
- Secure log storage with restricted access

**Command Filtering:**
```bash
# Restricted commands (configurable)
"rm -rf /"
"dd if=/dev/zero"
"mkfs.*"
"fdisk"
"wipefs"
```

**Session Monitoring:**
- Real-time session activity logging
- Failed authentication attempt tracking
- Concurrent session limit enforcement
- Automatic session timeout

### Emergency Procedures

**Break-Glass Access:**
1. Run emergency access command
2. Provide justification for emergency access
3. Bypass normal MFA requirements (optional)
4. Automatic security event logging
5. Post-incident review and documentation

**Emergency Access Command:**
```bash
./scripts/production-access.sh emergency prod
# Prompts for justification
# Logs all emergency actions
# Automatic audit trail generation
```

**Access Revocation:**
```bash
# Immediate user access revocation
./scripts/production-access.sh revoke username

# Bulk access revocation (emergency)
./scripts/production-access.sh emergency-revoke-all
```

## Monitoring & Auditing

### Access Audit (`audit` command)

Comprehensive security audit with detailed reporting.

**Audit Reports:**
- Access attempt statistics
- Authentication success/failure rates
- Emergency access events
- Session duration analysis
- Command execution logs

**Usage:**
```bash
# Last 24 hours
./scripts/production-access.sh audit --last-24h

# Last 7 days
./scripts/production-access.sh audit --last-7d

# Custom time range
./scripts/production-access.sh audit "2026-04-01 00:00:00"
```

**Sample Audit Report:**
```
=== Access Audit Report ===
Time period: Last 24 hours
Report generated: 2026-04-14 15:30:45

Total access attempts: 15
Successful authentications: 14
Failed authentications: 1
Emergency access events: 0

=== Recent Access Sessions ===
2026-04-14 14:20:15 [INFO] SSH connection established to prod by admin
2026-04-14 13:45:32 [INFO] SSH connection established to staging by dev
2026-04-14 12:30:45 [SECURITY] MFA authentication failed for unknown_user
```

### Security Events

**Logged Events:**
- Authentication attempts (success/failure)
- SSH connections (established/terminated)
- Emergency access activation
- Key rotation events
- Access revocation actions
- Security policy violations

**Alert Thresholds:**
- Failed authentication attempts > 3
- Emergency access usage
- After-hours production access
- Concurrent session limit exceeded
- Restricted command execution attempts

### Compliance Features

**Audit Trail:**
- Immutable security event logs
- Comprehensive session recordings
- Command execution history
- User activity tracking
- Incident response documentation

**Banking-Level Standards:**
- Zero-trust verification at every step
- Comprehensive audit retention (365 days)
- Encrypted log storage and transmission
- Regular security control validation
- Incident response procedures

## Troubleshooting

### Common Issues

**1. MFA Token Rejection**
```bash
# Check TOTP secret
cat ~/.orga/mfa-secret

# Test token generation
oathtool --totp --base32 "$(cat ~/.orga/mfa-secret)"

# Verify system time synchronization
sudo ntpdate -s time.nist.gov
```

**2. SSH Key Authentication Failure**
```bash
# Check key permissions
ls -la ~/.ssh/orga_prod
# Should be: -rw------- (600)

# Fix permissions
chmod 600 ~/.ssh/orga_prod

# Test key
ssh -i ~/.ssh/orga_prod -T user@server
```

**3. Configuration Issues**
```bash
# Validate configuration
jq '.' ~/.orga/access-config.json

# Check server connectivity
./scripts/production-access.sh status

# Verify prerequisites
./scripts/production-access.sh --dry-run connect prod
```

**4. Audit Log Access Issues**
```bash
# Check log directory permissions
ls -la /var/log/orga-access/

# Fix permissions (if needed)
sudo chown root:adm /var/log/orga-access/
sudo chmod 750 /var/log/orga-access/
```

### Error Codes

| Error Code | Description | Resolution |
|------------|-------------|------------|
| 1 | Prerequisites check failed | Install required tools, check permissions |
| 2 | MFA verification failed | Check TOTP secret, verify time sync |
| 3 | SSH connection failed | Verify key permissions, server connectivity |
| 4 | Configuration invalid | Validate JSON syntax, check server config |
| 5 | Access denied | Check user permissions, verify server access |

### Log Analysis

**Important Log Patterns:**
```bash
# Successful access
grep "SSH connection established" /var/log/orga-access/*.log

# Failed authentications
grep "MFA authentication failed" /var/log/orga-access/*.log

# Emergency access events
grep "EMERGENCY ACCESS" /var/log/orga-access/*.log

# Security violations
grep "\[SECURITY\]" /var/log/orga-access/*.log
```

## Automation & Integration

### Scheduled Tasks

**Daily Operations:**
```bash
# Add to crontab for automated monitoring
0 6 * * * /path/to/orga/scripts/production-access.sh audit --last-24h | mail -s "Daily Access Report" admin@folkup.app

# Weekly key health check
0 0 * * 0 /path/to/orga/scripts/production-access.sh status | mail -s "Weekly Access Status" admin@folkup.app
```

### Integration Points

**Monitoring Systems:**
- Grafana dashboards for access metrics
- Prometheus metrics collection
- AlertManager integration for security events
- Slack/Teams notifications for critical events

**CI/CD Integration:**
```bash
# Automated deployment access
./scripts/production-access.sh connect prod --non-interactive --key-file /path/to/deploy-key
```

## Security Considerations

### Threat Model

**Mitigated Threats:**
- Credential compromise (MFA protection)
- Unauthorized access (SSH keys + audit trails)
- Privilege escalation (restricted commands)
- Insider threats (comprehensive logging)
- Session hijacking (SSH key verification)

**Attack Vectors:**
- **Social Engineering:** MFA and justification requirements
- **Credential Theft:** SSH keys with proper permissions
- **Network Interception:** SSH encryption + key verification
- **Malicious Insiders:** Command logging + session recording

### Compliance Requirements

**Banking-Level Security:**
- Multi-factor authentication mandatory
- Comprehensive audit trails with retention
- Session recording for high-criticality access
- Emergency procedures with approval workflows
- Regular security control validation

**GDPR Compliance:**
- Personal data minimization in logs
- Audit trail retention policies
- User consent for monitoring
- Data protection impact assessments

## Operational Procedures

### Daily Operations

1. **Monitor Access Logs** - Review overnight access attempts
2. **Check Security Alerts** - Respond to failed authentication alerts
3. **Validate Active Sessions** - Verify legitimate session activity
4. **Update Access Status** - Maintain current access documentation

### Weekly Operations

1. **Access Audit Review** - Comprehensive 7-day access analysis
2. **Key Health Check** - Verify SSH key validity and permissions
3. **Configuration Validation** - Review and update access policies
4. **Emergency Procedure Test** - Validate break-glass procedures

### Monthly Operations

1. **SSH Key Rotation** - Rotate production SSH keys
2. **Security Control Review** - Validate all security controls
3. **Compliance Assessment** - Ensure banking-level compliance
4. **Incident Response Drill** - Test emergency procedures

### Emergency Procedures

**Security Incident Response:**
1. Identify security event (failed auth, suspicious activity)
2. Assess impact and scope of potential breach
3. Activate emergency access if required
4. Revoke compromised credentials immediately
5. Document incident and remediation actions

**System Compromise Response:**
1. Immediate access revocation for affected systems
2. Emergency backup access activation
3. Incident containment and analysis
4. System recovery and hardening
5. Post-incident review and improvements

## Support & Maintenance

### Version History

- **v1.0** (April 2026) - Initial implementation with banking-level security

### Future Enhancements

- Hardware security key (FIDO2/WebAuthn) support
- Certificate-based authentication
- Integration with identity providers (LDAP, AD)
- Advanced behavioral analytics
- Automated threat response

### Contact Information

For security incidents or access issues:

- **Security Team:** security@folkup.app
- **Emergency Contact:** +1234567890
- **Documentation:** This README file
- **Incident Response:** Follow organizational security procedures

---

**ORGA Production Access Protocol v1.0**
**Implementation Date:** April 2026
**Banking-Level Security Compliance**
**Zero-Trust Architecture**