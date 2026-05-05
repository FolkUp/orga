# Editorial Workflow Template - ORGA Phase 3B

**Enhanced Alice v2.0 Editorial Automation**  
**Banking-level Quality Standards Applied**

## Content Lifecycle Stages

### Stage 1: Draft Creation
- [ ] **Initial content creation**
- [ ] **Frontmatter completion** (title, date, investigation_type, etc.)
- [ ] **Initial source gathering** (minimum 2 sources)
- [ ] **Draft status:** `draft: true`

### Stage 2: Content Development  
- [ ] **Word count target:** ≥150 words minimum
- [ ] **Source validation:** Verify all URLs, add archive URLs where needed
- [ ] **Placeholder removal:** Eliminate all [brackets], {variables}, TODO markers
- [ ] **PII scan:** Review for personal information, apply redaction if needed

### Stage 3: Technical Review
- [ ] **Metadata completeness:** All required fields populated
- [ ] **Schema validation:** Conforms to content/config.ts schema
- [ ] **Link validation:** All internal and external links functional
- [ ] **Build test:** Content builds without errors

### Stage 4: Editorial Review Workflow

#### 4.1 Fact Verification
```yaml
fact_verified: true
fact_verified_by: "Reviewer Name"
fact_verified_date: YYYY-MM-DD
fact_verification_reports: ["report1.md", "report2.md"]
```

**Checklist:**
- [ ] Claims verified against primary sources
- [ ] Dates and timeline accuracy confirmed
- [ ] Quotes and citations verified
- [ ] Context accuracy validated

#### 4.2 Legal & Compliance Review
```yaml
legal_reviewed: true
legal_reviewed_by: "Legal Reviewer"
legal_risk: "low" | "medium" | "high"
pii_reviewed: true
pii_reviewed_by: "Privacy Officer"
naming_justified: true
```

**Checklist:**
- [ ] PII redaction review completed
- [ ] Public figure naming justified
- [ ] Copyright/fair use compliance
- [ ] Legal risk assessment completed

#### 4.3 Editorial Quality Review
```yaml
editorial_reviewed: true
editorial_reviewed_by: ["Editor 1", "Editor 2"]
```

**Checklist:**
- [ ] Grammar and style consistency
- [ ] Narrative flow and structure
- [ ] Brand voice alignment
- [ ] Technical accuracy

#### 4.4 Hostile Verification (Banking-Level)
```yaml
hostile_verified: true
hostile_verified_by: ["Hostile Reviewer", "Independent Verifier"]
```

**Checklist:**
- [ ] Devil's advocate review completed
- [ ] Counter-arguments considered
- [ ] Bias assessment performed
- [ ] Independent verification obtained

### Stage 5: Publication Preparation
- [ ] **Status update:** `draft: false`, `status: "verified"`
- [ ] **Confidence assessment:** Set appropriate confidence level
- [ ] **SEO optimization:** Description and keywords added
- [ ] **Social media assets:** OG image if needed

### Stage 6: Quality Assurance
- [ ] **Automated quality check:** Run editorial-automation.js
- [ ] **Build verification:** Successful deployment test
- [ ] **Cross-device testing:** Mobile/desktop compatibility
- [ ] **Performance check:** Page load times acceptable

---

## Quality Standards Compliance

### Content Quality Metrics
- **Minimum word count:** 150 words
- **Source requirement:** 2+ credible sources
- **High confidence content:** 3+ sources required
- **Placeholder content:** 0 instances
- **PII instances:** All reviewed and justified

### Editorial Workflow Completion
- **Minimum completion:** 80% for publication
- **High-risk content:** 100% completion required
- **Banking-level content:** Hostile verification mandatory

### Review Requirements by Content Type

| Investigation Type | Fact Check | Legal Review | Editorial Review | Hostile Verify |
|-------------------|------------|--------------|------------------|-----------------|
| **cultural_analysis** | Required | Standard | Required | Optional |
| **institutional** | Required | Enhanced | Required | Required |
| **biographical** | Required | Enhanced | Required | Required |
| **media** | Required | Standard | Required | Optional |

### Legal Risk Assessment

| Risk Level | Requirements |
|------------|--------------|
| **Low** | Standard review process |
| **Medium** | Legal review + documentation |
| **High** | Legal approval + hostile verification + stakeholder sign-off |

---

## Automation Integration

### Editorial Automation Commands
```bash
# Run quality analysis
node scripts/editorial-automation.js

# Generate editorial report
node scripts/editorial-automation.js --report

# Validate specific file
node scripts/editorial-automation.js --file investigations/cultural_analysis/example.md
```

### Quality Gates
- **Pre-commit:** Automated placeholder detection
- **Pre-build:** Schema validation + quality metrics
- **Pre-deploy:** Full editorial workflow verification

### Workflow Status Tracking
```yaml
# Add to frontmatter for workflow tracking
workflow_stage: "draft" | "development" | "review" | "verified" | "published"
workflow_progress: 75  # Percentage complete
workflow_blockers: ["Legal review pending", "Source verification needed"]
workflow_next_steps: ["Complete PII review", "Obtain editorial sign-off"]
```

---

## Template Usage

### For New Investigations
1. Copy investigation template from `/templates/investigation-template.md`
2. Complete frontmatter with appropriate metadata
3. Follow editorial workflow stages 1-6
4. Run automation checks before publication

### For Existing Content Updates
1. Update `lastmod` field
2. Re-run relevant review stages
3. Update workflow completion percentage
4. Document changes in version control

### Quality Assurance Checklist
- [ ] All workflow stages completed
- [ ] Automation checks passed
- [ ] Banking-level standards applied where required
- [ ] Constitutional compliance verified
- [ ] Ready for Phase 3B publication

---

**Enhanced Alice v2.0 Editorial Automation**  
*Banking-level quality standards with constitutional compliance*  
*Updated: 2026-05-05*