---
title: "Archive — Historical _meta documents"
date_archived: 2026-04-20
archive_reason: "Pre-Astro migration artifacts (Hugo era) + self-hosted deployment infrastructure (post ORGA-028 CF decision)."
status: historical
---

# _meta/archive/ — Historical documents

## Hugo era (ORGA-056, 2026-04-20)

Документы описывают **Hugo + Blowfish** стек, который использовался как тестовый вариант до миграции на Astro 5.18 (см. ORGA-055). **Не отражают текущее состояние проекта.**

| Файл | Что это | Оригинальная дата |
|------|---------|-------------------|
| `HERO_IMPLEMENTATION.md` | Hero video section (Hugo partial + shortcode) | 2026-03-28 |
| `DEPLOYMENT-READINESS-CHECKLIST.md` | Pre-deploy чеклист Hugo-стека | 2026-03-28 |
| `ARCHITECTURE_AUDIT.md` | Phase 0B Timeline architecture (Blowfish shortcodes) | 2026-03-27 |
| `shortcode-cultural-armor.md` | Cultural Armor shortcode документация | 2024-04-08 (вероятно 2026) |
| `PHASE3-MIGRATION-VERIFICATION-REPORT.md` | Git subtree миграция контента из lucerna | 2026-04-04 |
| `_performance-audit.md` | Core Web Vitals для Blowfish-стека | — |
| `TECHNICAL_SPECS.md` | Hugo + Blowfish технические спецификации | 2026-03-26 |

## Self-hosted deployment (ORGA-057, 2026-04-20)

Артефакты self-hosted nginx deployment на Hetzner, подготовленные в ORGA-026/027. **Не используются** — решение ORGA-028 Вариант A: stay on Cloudflare Pages. Детали: `deploy-self-hosted/README.md`.

| Папка | Что это |
|-------|---------|
| `deploy-self-hosted/` | nginx config + deployment guide + DNS script + deploy automation |

## Где искать актуальное

| Тема | Актуальный источник |
|------|---------------------|
| Стек и архитектура | `/README.md`, `astro/astro.config.mjs` |
| Контент-схемы | `astro/src/content/config.ts` |
| Deploy | `/README.md` → раздел «Деплой» (Cloudflare Pages) |
| Security headers | `astro/public/_headers` |
| Backup | `scripts/` — git-based + опциональные scripts для self-hosted scenario |

---

*Last updated: 2026-04-20 · ORGA-056 (Hugo) + ORGA-057 (deploy)*
