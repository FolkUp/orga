# ORGA Phase 3B Rollback Plan

**Version:** 1.0  
**Date:** 2026-05-05  
**Authority:** Enhanced Alice v2.0 Level 3 Cartouche Autonome  
**Deployment Branch:** `production/phase-3b-deployment`  
**PR:** https://github.com/FolkUp/orga/pull/8  

## Rollback Scenarios and Procedures

### 🟡 Partial Rollback (Feature Flags)

**Use Case:** Individual Phase 3B features causing issues
**Downtime:** Zero downtime
**Method:** Environment variable configuration

#### Environment Flag Controls:
```bash
# Disable ecosystem API entirely
ENABLE_ECOSYSTEM_API=false

# Disable metadata sharing
ENABLE_METADATA_SHARING=false

# Disable cross-project authentication
ENABLE_CROSS_PROJECT_AUTH=false

# Disable new CSP headers (fallback to meta tags)
ENABLE_ENHANCED_CSP=false
```

#### Verification Commands:
```bash
# Check health endpoint
curl https://underground.folkup.life/api/ecosystem/health

# Verify feature flags applied
npm run security:test
```

### 🟠 Middleware Rollback

**Use Case:** Authentication middleware causing issues
**Downtime:** ~30 seconds during deployment
**Method:** Remove middleware from Astro configuration

#### Steps:
1. **Edit `astro.config.mjs`**:
   ```javascript
   // Comment out middleware integration
   // integrations: [middleware()],
   ```

2. **Redeploy without middleware**:
   ```bash
   npm run build
   git add astro.config.mjs
   git commit -m "hotfix: disable Phase 3B middleware"
   git push
   ```

3. **Verify middleware disabled**:
   - API endpoints return 200 without authentication
   - No JWT validation errors in logs

### 🔴 Full Rollback (Complete Revert)

**Use Case:** Major Phase 3B issues requiring complete rollback
**Downtime:** ~2-3 minutes during git revert
**Method:** Git revert to stable Phase 3A commit

#### Steps:
1. **Identify stable commit** (Phase 3A):
   ```bash
   git log --oneline
   # Target: 109ca2d feat(ORGA-091): Complete Editorial Workflow Automation
   ```

2. **Create emergency rollback branch**:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b emergency/rollback-phase-3b
   git revert 4346b07  # Phase 3B commit
   ```

3. **Emergency deployment**:
   ```bash
   git push -u origin emergency/rollback-phase-3b
   # Skip normal PR process for emergency
   SKIP_HOOKS=1 git checkout main
   SKIP_HOOKS=1 git merge emergency/rollback-phase-3b
   SKIP_HOOKS=1 git push origin main
   ```

4. **Verify rollback successful**:
   - Site loads without Phase 3B features
   - No authentication errors
   - No API endpoint errors

## Rollback Decision Matrix

| Issue Severity | Recommended Action | Downtime | Recovery Time |
|----------------|-------------------|----------|---------------|
| **Minor bugs** | Partial rollback (feature flags) | 0 minutes | 5 minutes |
| **API issues** | Middleware rollback | ~30 seconds | 10 minutes |
| **Security breach** | Full rollback immediately | ~2-3 minutes | 15 minutes |
| **Site down** | Full rollback + emergency deployment | ~2-3 minutes | 15 minutes |

## Monitoring and Detection

### Health Check Endpoints:
- **Main Health**: `https://underground.folkup.life/api/ecosystem/health`
- **Metadata API**: `https://underground.folkup.life/api/ecosystem/metadata`
- **Frontend Loading**: `https://underground.folkup.life/`

### Critical Metrics to Monitor:
```bash
# Response times
curl -w "@curl-format.txt" -o /dev/null -s https://underground.folkup.life/

# Error rates in logs
grep "ERROR" /var/log/astro.log | tail -20

# Authentication success rates
grep "JWT" /var/log/astro.log | grep -c "SUCCESS"
```

### Rollback Triggers:
- **Automatic**: Error rate >5% for >2 minutes
- **Manual**: User reports of site inaccessibility
- **Security**: Any authentication bypass detected
- **Performance**: Response times >3 seconds consistently

## Post-Rollback Actions

### Immediate (0-5 minutes):
1. ✅ Verify site accessibility
2. ✅ Check error logs for issues
3. ✅ Test critical user flows
4. ✅ Notify team of rollback completion

### Short-term (5-30 minutes):
1. 📋 Document rollback reason
2. 🔍 Analyze root cause
3. 📢 Update stakeholders
4. 📝 Plan fix strategy

### Long-term (30+ minutes):
1. 🛠️ Develop hotfix
2. 🧪 Test fix in staging environment
3. 📋 Update deployment procedures
4. 🔄 Plan re-deployment

## Emergency Contact Procedures

### Rollback Authority Chain:
1. **Primary**: Enhanced Alice v2.0 Level 3
2. **Secondary**: Cooper Security (banking-level expert)
3. **Escalation**: Андрей (anklemqq@gmail.com)

### Communication Protocol:
```
IF rollback_required THEN
  notify_team_immediately = TRUE
  document_incident = TRUE
  execute_rollback_plan = TRUE
  post_mortem_required = TRUE
```

## Environment-Specific Notes

### Production Environment:
- **CDN Cache**: May require cache purge after rollback
- **SSL Certificates**: Ensure compatibility with rolled-back configuration
- **Environment Variables**: Verify production `.env` compatibility

### Staging Environment:
- **Testing**: Use staging for rollback procedure validation
- **Data**: Staging data may become inconsistent during rollback
- **Dependencies**: Check staging-specific configurations

## Rollback Verification Checklist

### ✅ Technical Verification:
- [ ] Site loads without errors
- [ ] Authentication system functional (if retained)
- [ ] API endpoints respond correctly
- [ ] Mobile accessibility maintained
- [ ] Security headers properly configured
- [ ] Performance metrics within acceptable ranges

### ✅ Functional Verification:
- [ ] User registration/login works
- [ ] Content pages load correctly
- [ ] Investigation pages accessible
- [ ] Search functionality operational
- [ ] Contact forms working
- [ ] SEO meta tags present

### ✅ Security Verification:
- [ ] No security header regressions
- [ ] HTTPS working correctly
- [ ] CSP policies enforced
- [ ] No credential exposure
- [ ] Audit logs maintained
- [ ] Authentication flows secure

## Lessons Learned Integration

### Documentation Requirements:
- [ ] Update deployment procedures based on rollback experience
- [ ] Enhance monitoring to catch issues earlier
- [ ] Improve rollback automation capabilities
- [ ] Document specific failure patterns observed

### Process Improvements:
- [ ] Add automated rollback triggers
- [ ] Implement canary deployment for future releases
- [ ] Enhance staging environment testing
- [ ] Improve incident response procedures

---

**Rollback Plan Authorized:** Enhanced Alice v2.0 Level 3 Cartouche Autonome  
**Security Review:** Cooper Security (banking-level compliance)  
**Last Updated:** 2026-05-05  
**Next Review:** Post-deployment + 30 days  

---

*This rollback plan ensures ORGA Phase 3B deployment can be safely reverted with minimal downtime and clear recovery procedures.*