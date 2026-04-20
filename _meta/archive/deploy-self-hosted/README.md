---
title: "Archive — Self-hosted deployment artifacts"
date_archived: 2026-04-20
archive_reason: "ORGA-028 decision (Вариант A): Underground Academia stays on Cloudflare Pages. Self-hosted Hetzner infrastructure preserved here for history / potential future migration."
status: historical
---

# _meta/archive/deploy-self-hosted/ — Self-hosted infrastructure archive

Артефакты self-hosted деплоя, подготовленные в ORGA-026/027 (2026-04-15/16). **Не используются в продакшене.** Продакшен на Cloudflare Pages (ORGA-028 Вариант A, 2026-04-20).

## Что здесь

| Файл | Назначение |
|------|------------|
| `DEPLOYMENT-GUIDE.md` | 17-страничный banking-level protocol деплоя на Hetzner CX33 (46.225.107.2) |
| `deploy-orga.sh` | Master deployment script (nginx container + nginx-proxy auto-discovery) |
| `dns-setup-underground.sh` | Cloudflare API-based DNS A record setup (SOPS-encrypted tokens) |
| `nginx-orga.conf` | nginx virtualhost config с security headers + WCAG-friendly caching |

## Контекст решения

Self-hosted инфраструктура была развёрнута и готова к flip'у DNS. Финальное решение — остаться на Cloudflare Pages по причинам:

1. Phase 1 goals уже достигнуты на CF Pages
2. Vendor lock-in минимален (Astro static, `_headers` портативен)
3. Underground Academia не имеет SLA требующих self-hosted HA
4. Меньше ops overhead — фокус на контенте

Полный decision memo: `orga repo:_meta/orga-028-decision-memo-20260420.md`

## Если когда-нибудь понадобится re-activation

1. `git mv _meta/archive/deploy-self-hosted/` → `deploy/`
2. Verify server state at 46.225.107.2 (nginx container ещё running?)
3. Execute `dns-setup-underground.sh` с SOPS access
4. SSL auto-provisions через acme-companion
5. Update README.md canonicalizing self-hosted path
6. Deprecate Cloudflare Pages project в CF dashboard

## Where current state lives

| Тема | Актуальный источник |
|------|---------------------|
| Deploy mechanism | Cloudflare Pages auto-deploy from main |
| Security headers | `astro/public/_headers` |
| Site config | `astro/astro.config.mjs` |
| Backup strategy | Git-based (source = repo), scripts в `scripts/` — available для self-hosted scenario |

---

*Archived: 2026-04-20 · ORGA-057 · Decision ref: ORGA-028 Вариант A*
