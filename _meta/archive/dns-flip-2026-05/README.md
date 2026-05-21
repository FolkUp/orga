# DNS-flip era one-shots (2026-04-28)

One-shot scripts and reports from the Cloudflare Pages → Hetzner VPS migration of `underground.folkup.life`, archived from the repository root for declutter.

## Contents

| File | Purpose | Era |
|---|---|---|
| `dns-flip-manual-procedure.md` | Step-by-step manual DNS proxy flip procedure for the cutover | 2026-04-28 |
| `monitor-dns-transition.sh` | Bash script that polled DNS resolution + ran health checks during cutover | 2026-04-28 |
| `verify-site-health.sh` | One-shot site-health verification script run post-DNS-flip | 2026-04-28 |
| `deployment-report.txt` | Production build report from 2026-04-08 (118 HTML pages — pre-investigations-deletion build snapshot) | 2026-04-08 |

## Notes

- These scripts contain the VPS IP `46.225.107.2` in plaintext. The IP was already exposed at the repository root for several weeks before archiving and remains visible in git history. Archiving does **not** redact it; it only removes it from the immediate root-level view. If full redaction is required, that needs a separate history-rewrite operation.
- Active deployment uses GitHub Actions self-hosted runner with `rsync` (see `.github/workflows/`). None of the files in this archive are invoked by current automation.
- Replaces the broken `_meta/archive/cloudflare-pages/` reference that previously appeared in root `README.md` (fixed in the same commit batch as this archive).
