# ORGA — Underground Academia

Underground culture research platform. Production: [underground.folkup.life](https://underground.folkup.life).

## Status (2026-05-20)

Live site healthy. Deploy pipeline hardened (rsync-in-place instead of `mv`-swap — Docker bind-mount inode preserved across deploys, verified empirically in GitHub Actions run #26160196680). Security headers (CSP, HSTS, X-Frame-Options, COOP, CORP, etc.) enforced at the `nginx-proxy` reverse-proxy layer via `infra/nginx-proxy-vhost.d/underground.folkup.life`. Honest auth.ts review at `docs/AUTH-SECURITY-REVIEW.md` documents the real (static SSG) threat model. Phantom `investigations` infrastructure removed 2026-05-20 — the collection was never registered in `src/content/config.ts`; templates, validator scripts, dormant API endpoint, and 404-bound nav links are gone. What remains targets longform criticism only.

### Open work

| ID | Priority | Description |
|----|----------|-------------|
| ORGA-094 | P2 | Mobile UX validation |
| ORGA-092 (remainder) | P2 | Phase 3C readiness — real JWT lib selection, rate-limit storage, `ORGA_API_SECRET` env management. Tracked in `docs/AUTH-SECURITY-REVIEW.md` as P2 production-readiness items. |

## Architecture

### Content Collections (registered in `src/content/config.ts`)
- **Legal**: Privacy policy, terms, cookie policy, AI transparency (bilingual EN+RU)
- **Longform**: Premium personal-essay music/culture criticism (bilingual)

### Technical Stack
- Framework: Astro 5.x (SSG, `output: 'static'` — middleware does not run at runtime; see `docs/AUTH-SECURITY-REVIEW.md`)
- Content: MDX with frontmatter schema (`src/content/config.ts`)
- Styling: CSS-first
- Deployment: Hetzner VPS, Docker + `nginx-proxy`, `rsync --delete` in-place via GitHub Actions self-hosted runner (preserves bind-mount inode)

## Quick Start

```bash
npm install
npm run dev        # Development server
npm run build:ci   # CI build (= astro build)
npm run check      # Astro type-check
```

Other available scripts: `build` (build + bundle-size monitor), `preview`, `monitor` (bundle size report).

## Deployment

- **Production**: [underground.folkup.life](https://underground.folkup.life)
- **Infrastructure**: Hetzner VPS, Docker container `orga-underground` (nginx:1.29-alpine), behind shared `nginx-proxy` + `letsencrypt-nginx-proxy-companion`. Backend bind-mount `~/orga/public → /usr/share/nginx/html:ro`.
- **TLS**: Cloudflare proxy in front (TLS 1.3, Google Trust Services); Let's Encrypt on VPS as backup path.
- **Pipeline**: GitHub Actions self-hosted runner on the VPS → `npm run build:ci` → `rsync --delete` in-place into `~/orga/public/` → wget health-check requiring `HTTP/[0-9.]+ 200`. The previous atomic `mv`-swap rotated the directory inode and broke the container's bind-mount; rsync-in-place keeps the inode stable (verified ДО=894237 / ПОСЛЕ=894237 across both manual and CI deploys on 2026-05-20).
- **Security headers**: applied at the reverse-proxy layer through `infra/nginx-proxy-vhost.d/underground.folkup.life` (mounted into `nginx-proxy` via the `folkup_vhost` Docker volume). CSP whitelists only Spotify/YouTube embeds — fonts are self-hosted via `@fontsource/playfair-display` + `@fontsource/source-sans-3`, so neither `fonts.googleapis.com` nor `fonts.gstatic.com` appears in `style-src` / `font-src`. The Netlify-format `public/_headers` is kept in sync for documentation but is not consumed by the production proxy.

---

**Last updated**: 2026-05-20 — phantom investigations infrastructure removed; deploy + security pipelines documented honestly.
