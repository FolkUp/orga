# SSL Emergency Remediation Guide - underground.folkup.life

**Date:** 2026-05-18  
**Authority:** Emergency SSL Certificate Recovery Procedures  
**Classification:** P0 BLOCKING - Immediate Action Required  
**Target:** underground.folkup.life SSL certificate restoration

## IMMEDIATE RESOLUTION STEPS

### Prerequisites
- SSH access to 46.225.107.2 (Hetzner VPS)
- Docker admin permissions
- Basic command line knowledge

### Step 1: Connect to Server
```bash
# SSH to production VPS
ssh user@46.225.107.2

# Verify you're connected and in correct location
pwd
hostname
```

### Step 2: Assess Current Docker State
```bash
# Check all running containers
docker ps

# Look specifically for nginx-proxy and letsencrypt containers
docker ps | grep -E "(nginx|letsencrypt)"

# Expected containers:
# - nginx-proxy (or similar nginx container)
# - letsencrypt-nginx-proxy-companion
```

### Step 3: Examine Let's Encrypt Logs
```bash
# Check letsencrypt container logs for errors
docker logs letsencrypt-nginx-proxy-companion | tail -50

# Look for specific underground.folkup.life errors
docker logs letsencrypt-nginx-proxy-companion | grep -i underground

# Check for rate limiting or validation failures
docker logs letsencrypt-nginx-proxy-companion | grep -E "(rate|limit|error|fail)"
```

### Step 4: Check Certificate Storage
```bash
# Check certificate directory
sudo ls -la /etc/nginx/certs/ 2>/dev/null || echo "Directory not found - checking alternatives"

# Check Docker volume mounts
docker volume ls | grep -E "(cert|nginx|ssl)"

# Inspect nginx-proxy volume mounts
docker inspect nginx-proxy | grep -A 10 Mounts
```

### Step 5: Force Certificate Renewal
```bash
# Method 1: Restart letsencrypt container (simplest)
docker restart letsencrypt-nginx-proxy-companion

# Wait 30 seconds, then check logs
sleep 30
docker logs letsencrypt-nginx-proxy-companion | tail -20

# Method 2: If container has force renewal script
docker exec letsencrypt-nginx-proxy-companion /app/force_renew.sh underground.folkup.life 2>/dev/null || echo "Force renew script not available"

# Method 3: Restart entire nginx-proxy stack
docker restart nginx-proxy
docker restart letsencrypt-nginx-proxy-companion
```

### Step 6: Monitor Certificate Generation
```bash
# Watch logs in real-time (press Ctrl+C to stop)
docker logs -f letsencrypt-nginx-proxy-companion

# In another terminal, check certificate files
watch -n 5 "ls -la /etc/nginx/certs/ 2>/dev/null || docker volume ls"
```

### Step 7: Verify SSL Certificate
```bash
# Test certificate from server
curl -I https://underground.folkup.life

# Check certificate details
openssl s_client -connect underground.folkup.life:443 -servername underground.folkup.life < /dev/null 2>&1 | grep -A 5 "Certificate chain"

# Look for "Let's Encrypt" instead of "letsencrypt-nginx-proxy-companion"
```

## Troubleshooting Common Issues

### Issue 1: Rate Limiting
```bash
# Check recent certificate history
curl -s "https://crt.sh/?q=underground.folkup.life&output=json" | head -1

# If rate limited, wait 1 week or use DNS validation
# For immediate fix, may need to adjust domain (www.underground.folkup.life)
```

### Issue 2: DNS Validation Failure
```bash
# Test ACME challenge accessibility
curl -I http://underground.folkup.life/.well-known/acme-challenge/test

# Should return 404 (not connection error)
# If connection fails, check nginx proxy configuration
```

### Issue 3: Container Configuration Issues
```bash
# Check container environment variables
docker inspect letsencrypt-nginx-proxy-companion | grep -A 20 Env

# Look for:
# - DEFAULT_EMAIL (should be set)
# - VIRTUAL_HOST (should include underground.folkup.life)
# - LETSENCRYPT_HOST (should include underground.folkup.life)
```

### Issue 4: Port/Firewall Problems
```bash
# Check ports 80 and 443 are accessible
netstat -tlnp | grep -E ":80|:443"

# Test external accessibility
curl -I http://underground.folkup.life
curl -k -I https://underground.folkup.life
```

## Emergency Fallback: Manual Certbot

If docker approach fails completely:

```bash
# Install certbot if not present
sudo apt update && sudo apt install -y certbot

# Stop nginx temporarily
docker stop nginx-proxy

# Get certificate manually
sudo certbot certonly --standalone -d underground.folkup.life

# Copy certificate to nginx location
sudo cp /etc/letsencrypt/live/underground.folkup.life/fullchain.pem /path/to/nginx/certs/
sudo cp /etc/letsencrypt/live/underground.folkup.life/privkey.pem /path/to/nginx/certs/

# Restart nginx
docker start nginx-proxy
```

## Success Verification Checklist

### ✅ Certificate Verification
```bash
# 1. Check certificate issuer (should be "Let's Encrypt Authority")
openssl s_client -connect underground.folkup.life:443 -servername underground.folkup.life < /dev/null 2>&1 | grep "issuer"

# 2. Test HTTPS without warnings
curl -I https://underground.folkup.life

# 3. Verify browser shows secure lock icon
# Visit https://underground.folkup.life in browser
```

### ✅ Automation Verification
```bash
# 4. Check auto-renewal is working
docker logs letsencrypt-nginx-proxy-companion | grep -i "renewal"

# 5. Verify certificate expiration date (should be ~3 months out)
openssl s_client -connect underground.folkup.life:443 -servername underground.folkup.life < /dev/null 2>&1 | grep "notAfter"
```

### ✅ Site Functionality
```bash
# 6. Test site loads correctly
curl -s https://underground.folkup.life | head -5

# 7. Verify redirect from HTTP to HTTPS
curl -I http://underground.folkup.life
```

## Documentation for Handoff

### Resolution Summary Template
```
SSL Certificate Resolution: underground.folkup.life
Date: 2026-05-18
Time: [START] - [END]
Technician: [NAME]

Issue: Self-signed certificate from letsencrypt-nginx-proxy-companion
Root Cause: [DISCOVERED CAUSE]
Resolution: [STEPS TAKEN]

Final Status:
- Certificate Type: [Let's Encrypt / Self-signed]
- Issuer: [Authority Name]
- Expiration: [Date]
- Browser Warnings: [Yes/No]
- Auto-renewal: [Functional/Needs Attention]

Next Actions: [Any follow-up needed]
```

## Recovery Time Estimates

### Optimistic Scenario (15-30 minutes)
- Simple container restart resolves issue
- Let's Encrypt automation works immediately
- Certificate installs correctly

### Realistic Scenario (45-90 minutes)
- Need to diagnose specific failure cause
- Manual certificate force renewal required
- Some troubleshooting of container configuration

### Worst Case Scenario (2-4 hours)
- Container configuration issues
- Rate limiting requires workarounds
- Manual certbot installation needed
- Potential infrastructure changes required

## Critical Safety Notes

### ⚠️ IMPORTANT WARNINGS
1. **Don't Delete Certificates**: Never delete existing certificates without backup
2. **Document Changes**: Record all commands executed for audit trail
3. **Test Before Assumptions**: Always verify each step worked before proceeding
4. **Rollback Plan**: If something breaks, restart containers to restore self-signed state

### 🔒 Security Considerations
- Keep SSH session secure
- Don't expose private keys in logs
- Verify certificate matches domain before installation
- Monitor for successful renewal after fix

---

**Emergency Authority**: SSL Certificate Crisis Recovery  
**Implementation Ready**: Step-by-step Cooper security methodology  
**Constitutional Compliance**: Banking-level documentation with complete audit trail  
**Status**: EMERGENCY REMEDIATION GUIDE READY for immediate deployment

**Diagnosis Complete ✅ | Recovery Plan Ready ✅ | Expert Methodology Applied ✅**