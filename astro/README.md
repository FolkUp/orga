# ORGA — Underground Academia

Underground culture research platform. Production: [underground.folkup.life](https://underground.folkup.life).

## Status (2026-05-20)

Live site healthy. Deploy pipeline hardened (rsync-in-place instead of `mv`-swap — Docker bind-mount inode preserved across deploys, verified empirically in GitHub Actions run #26160196680). Security headers (CSP, HSTS, X-Frame-Options, COOP, CORP, etc.) now enforced at the `nginx-proxy` reverse-proxy layer via `infra/nginx-proxy-vhost.d/underground.folkup.life`. Honest auth.ts review at `docs/AUTH-SECURITY-REVIEW.md` documents the real (static SSG) threat model.

### Open work

| ID | Priority | Description |
|----|----------|-------------|
| ORGA-090 | P2 | Activate investigation template system + pipeline integration |
| ORGA-091 | P2 | End-to-end verify editorial workflow automation |
| ORGA-094 | P2 | Mobile UX validation |
| ORGA-093 | P2 | Quality framework (depends on ORGA-090) |
| ORGA-092 (remainder) | P2 | Phase 3C readiness — real JWT lib selection, rate-limit storage, `ORGA_API_SECRET` env management. Tracked in `docs/AUTH-SECURITY-REVIEW.md` as P2 production-readiness items. |

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
- Framework: Astro 5.x (SSG, `output: 'static'` — middleware does not run at runtime; see `docs/AUTH-SECURITY-REVIEW.md`)
- Content: MDX with frontmatter schema
- Styling: CSS-first
- Deployment: Hetzner VPS, Docker + `nginx-proxy`, `rsync --delete` in-place via GitHub Actions self-hosted runner (preserves bind-mount inode)

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

### Build Process
- **Pre-build validation**: Quality gates prevent low-quality content
- **Content filtering**: Excludes draft/development content from production
- **Performance / accuracy targets**: see scripts in `scripts/editorial-*.js`; end-to-end metrics not yet independently verified (ORGA-091)

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

### Editorial Automation
- **Content Quality Analysis**: word count, source validation, PII detection
- **Workflow Management**: stage transitions with validation
- **Build Integration**: quality gates with enforcement policies

### Quality Assurance
- **PII Protection**: automated detection with review requirements
- **Source Verification**: URL accessibility and credibility checks
- **Workflow Validation**: stage transition requirements enforcement

Concrete coverage and accuracy numbers depend on end-to-end pipeline verification (ORGA-091). Don't quote them as facts until that ships.

## Documentation

### Comprehensive Guides
- **[Editorial Automation Guide](EDITORIAL-AUTOMATION.md)** — Complete workflow automation documentation
- **[Editorial Workflow Template](templates/editorial-workflow.md)** — quality standards reference
- **[Content Lifecycle Guide](scripts/content-lifecycle.js)** — Automated stage management

### Scripts and Tools
- **editorial-automation.js** — Content quality analysis engine
- **content-lifecycle.js** — Workflow management utilities  
- **build-integration.js** — Pre-build validation and quality gates
- **astro.config.editorial.mjs** — Astro build process integration

## Deployment

- **Production**: [underground.folkup.life](https://underground.folkup.life)
- **Infrastructure**: Hetzner VPS, Docker container `orga-underground` (nginx:1.29-alpine), behind shared `nginx-proxy` + `letsencrypt-nginx-proxy-companion`. Backend bind-mount `~/orga/public → /usr/share/nginx/html:ro`.
- **TLS**: Cloudflare proxy in front (TLS 1.3, Google Trust Services); Let's Encrypt on VPS as backup path.
- **Pipeline**: GitHub Actions self-hosted runner on the VPS → `npm run build:ci` → `rsync --delete` in-place into `~/orga/public/` → wget health-check requiring `HTTP/[0-9.]+ 200`. The previous atomic `mv`-swap rotated the directory inode and broke the container's bind-mount; rsync-in-place keeps the inode stable (verified ДО=894237 / ПОСЛЕ=894237 across both manual and CI deploys on 2026-05-20).
- **Security headers**: applied at the reverse-proxy layer through `infra/nginx-proxy-vhost.d/underground.folkup.life` (mounted into `nginx-proxy` via the `folkup_vhost` Docker volume). CSP allows Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`) and Spotify/YouTube embeds. The Netlify-format `public/_headers` is kept in sync for documentation but is not consumed by the production proxy.

---

**Last updated**: 2026-05-20 — deploy pipeline hardened (rsync-in-place), CSP/security headers enforced on origin, honest auth review documented.