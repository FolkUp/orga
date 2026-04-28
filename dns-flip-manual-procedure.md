# DNS Proxy Flip - Manual Procedure
**Target:** underground.folkup.life  
**Date:** 2026-04-28  
**Phase:** 4 - Critical DNS Proxy Flip  

## Current State (BEFORE)
- **Record Type:** CNAME
- **Target:** orga-underground-academia.pages.dev
- **Proxy Status:** Proxied (orange cloud)
- **IPs Resolved:** 104.21.52.41, 172.67.195.16 (CF Proxy)

## Target State (AFTER)
- **Record Type:** A
- **Target:** 46.225.107.2 (Hetzner VPS)
- **Proxy Status:** DNS-only (gray cloud)
- **Expected Resolution:** Direct to VPS

## Manual Steps (Cloudflare Dashboard)

### Step 1: Access CF Dashboard
1. Open: https://dash.cloudflare.com/
2. Login as anklemqq@gmail.com
3. Select Zone: folkup.life
4. Navigate to DNS > Records

### Step 2: Locate Record
- Find: underground.folkup.life CNAME orga-underground-academia.pages.dev (Proxied)
- Note: Current proxy status (orange cloud active)

### Step 3: Modify Record
1. Click Edit on underground.folkup.life record
2. Change Type: CNAME → A
3. Change Content: orga-underground-academia.pages.dev → 46.225.107.2
4. Change Proxy Status: Proxied → DNS-only (click orange cloud → gray cloud)
5. Confirm changes

### Step 4: Verify Change
- Expected new record: underground.folkup.life A 46.225.107.2 (DNS-only)
- Wait 30-60 seconds for CF dashboard to reflect change

## Verification Commands

```bash
# Check DNS resolution (should show 46.225.107.2)
nslookup underground.folkup.life

# Test HTTP access
curl -I http://underground.folkup.life

# Test HTTPS access (after SSL cert)
curl -I https://underground.folkup.life
```

## Rollback Procedure
If issues occur:
1. Return to CF Dashboard
2. Edit underground.folkup.life record
3. Change back to: CNAME orga-underground-academia.pages.dev (Proxied)
4. Verify CF proxy restoration

## Expected Timeline
- DNS Change: Immediate (CF dashboard)
- Global Propagation: 1-3 minutes
- SSL Certificate: 1-5 minutes (Let's Encrypt)
- Full Functionality: <5 minutes total

## Critical Success Factors
- ✅ Gray cloud (DNS-only) active
- ✅ A record pointing to 46.225.107.2
- ✅ HTTP 200 response from VPS
- ✅ SSL certificate generated
- ✅ Site content matches expected

Status: READY FOR MANUAL EXECUTION