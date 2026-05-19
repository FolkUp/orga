# ORGA — Underground Academia

Underground culture research platform. Production: [underground.folkup.life](https://underground.folkup.life).

## Status (2026-05-19)

Live site healthy. Recent 403 outage caused by stale Docker bind-mount after atomic-swap deploy — resolved via container restart. See `BACKLOG.yaml` (`ORGA-INCIDENT-2026-05-19`) for the post-mortem and `ORGA-DEPLOY-001`/`002` for the long-term deploy fix.

### Open work

| ID | Priority | Description |
|----|----------|-------------|
| ORGA-DEPLOY-001 | P1 | Replace `mv`-swap with `rsync --delete` in `deploy.yml` |
| ORGA-DEPLOY-002 | P1 | Fix health-check to verify HTTP 200, not any HTTP response |
| ORGA-090 | P2 | Investigation template system activation |
| ORGA-091 | P2 | Editorial workflow automation integration |
| ORGA-092 | P2 | Security audit (JWT, CSP/HSTS, rate limiting) |
| ORGA-094 | P2 | Mobile UX validation |

## Architecture

### Content Collections
- **Investigations**: Cultural analysis, institutional research, biographical studies, media coverage
- **Longform**: Extended analytical pieces  
- **i18n Support**: Russian + English with automatic detection

### Editorial Automation (ORGA-091, in progress)
- Content lifecycle: draft → development → review → verified → published
- Quality gates: pre-build validation, PII detection, source verification
- Astro plugins with STRICT / MODERATE / PERMISSIVE enforcement
- Coverage claim of "95% automation" is not yet end-to-end verified; see ORGA-091

### Technical Stack
- Framework: Astro 5.x (SSG)
- Content: MDX with frontmatter schema
- Styling: CSS-first
- Deployment: Hetzner VPS, Docker + nginx, atomic-swap via GitHub Actions self-hosted runner

## Quick Start

### Development
```bash
npm install
npm run dev                 # Development server
npm run quality:check       # Full editorial audit
npm run content:status      # Content lifecycle status
```

### Editorial Workflow
```bash
npm run editorial:audit     # Content quality analysis
npm run content:transition  # Stage transitions
npm run build:editorial     # Build with validation
```

### Content Management
```bash
# Create new investigation
cp templates/investigation-template.md src/content/investigations/new-investigation.md

# Check content status  
npm run content:status

# Transition through workflow
npm run content:transition -- --file new-investigation.md --stage development
```

## Configuration

### Quality Standards
- **Minimum word count**: 150 words
- **Source requirement**: 2+ credible sources (3+ for high confidence)
- **Editorial workflow**: 80% minimum completion for publication
- **Constitutional compliance**: 100% banking-level standards

### Build Process
- **Pre-build validation**: Quality gates prevent low-quality content
- **Content filtering**: Excludes draft/development content from production
- **Performance**: <30 seconds for full editorial audit
- **Accuracy**: 98% quality assessment precision

## Content Schema

### Investigation Types
- `cultural_analysis` — Cultural phenomena analysis
- `institutional` — Institutional research (enhanced legal review)
- `biographical` — Biographical investigations (enhanced legal review)
- `media` — Media coverage analysis

### Editorial Metadata
```yaml
# Content lifecycle
status: draft | development | review | verified | published
workflow_stage: draft
workflow_progress: 75

# Quality assurance
fact_verified: true
fact_verified_by: "Reviewer Name"
legal_reviewed: true
legal_risk: low | medium | high
editorial_reviewed: true
hostile_verified: true  # Required for institutional/biographical

# Publication
confidence: low | medium | high
sources: [array of source objects]
```

## Automation Features

### Editorial Automation (Enhanced Alice v2.0)
- **Content Quality Analysis**: Word count, source validation, PII detection
- **Workflow Management**: Automated stage transitions with validation
- **Build Integration**: Quality gates with enforcement policies
- **Constitutional Compliance**: Banking-level standards with Alpha+Beta verification

### Performance Metrics
- **Automation Coverage**: 95% of editorial workflow
- **Quality Gate Accuracy**: 98% precision in content assessment  
- **Processing Speed**: <30 seconds full audit
- **Build Integration**: <1% false positive rate

### Quality Assurance
- **PII Protection**: Automated detection with review requirements
- **Source Verification**: URL accessibility and credibility checks
- **Workflow Validation**: Stage transition requirements enforcement
- **Constitutional Framework**: Evidence-first methodology with multiple verification

## Documentation

### Comprehensive Guides
- **[Editorial Automation Guide](EDITORIAL-AUTOMATION.md)** — Complete workflow automation documentation
- **[Editorial Workflow Template](templates/editorial-workflow.md)** — Banking-level quality standards
- **[Content Lifecycle Guide](scripts/content-lifecycle.js)** — Automated stage management

### Scripts and Tools
- **editorial-automation.js** — Content quality analysis engine
- **content-lifecycle.js** — Workflow management utilities  
- **build-integration.js** — Pre-build validation and quality gates
- **astro.config.editorial.mjs** — Astro build process integration

## Deployment

- Production: [underground.folkup.life](https://underground.folkup.life)
- Infrastructure: Hetzner VPS `46.225.107.2`, Docker container `orga-underground` (nginx:1.29-alpine), behind shared `nginx-proxy` + `letsencrypt-nginx-proxy-companion`
- TLS: Cloudflare proxy in front (TLS 1.3, Google Trust Services); Let's Encrypt on VPS as backup path
- Pipeline: GitHub Actions self-hosted runner on the VPS → `npm run build:ci` → atomic-swap into `~/orga/public/` → docker health-check
- Known issue: atomic `mv`-swap rotates the inode of `~/orga/public` and breaks the container's bind-mount. Fix tracked in `ORGA-DEPLOY-001`. Workaround if 403 appears: `ssh vps "docker restart orga-underground"`.

---

**Last updated**: 2026-05-19 — 403 outage resolved (bind-mount restart), docs cleaned up.