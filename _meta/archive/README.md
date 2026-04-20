---
title: "Archive — Historical _meta documents"
date_archived: 2026-04-20
archive_reason: "Pre-Astro migration artifacts (Hugo + Blowfish stack). Stack removed in ORGA-055 Hugo cleanup."
status: historical
---

# _meta/archive/ — Historical documents

Документы ниже описывают **Hugo + Blowfish** стек, который использовался как тестовый вариант до миграции на Astro 5.18 (см. ORGA-055, commit `499be21`, 2026-04-20).

Сохранены для справки — архитектурные решения, phase reports, verification logs. **Не отражают текущее состояние проекта.**

## Содержимое

| Файл | Что это | Оригинальная дата |
|------|---------|-------------------|
| `HERO_IMPLEMENTATION.md` | Hero video section (Hugo partial + shortcode) | 2026-03-28 |
| `DEPLOYMENT-READINESS-CHECKLIST.md` | Pre-deploy чеклист Hugo-стека | 2026-03-28 |
| `ARCHITECTURE_AUDIT.md` | Phase 0B Timeline architecture (Blowfish shortcodes) | 2026-03-27 |
| `shortcode-cultural-armor.md` | Cultural Armor shortcode документация | 2024-04-08 (вероятно 2026) |
| `PHASE3-MIGRATION-VERIFICATION-REPORT.md` | Git subtree миграция контента из lucerna | 2026-04-04 |
| `_performance-audit.md` | Core Web Vitals для Blowfish-стека | — |
| `TECHNICAL_SPECS.md` | Hugo + Blowfish технические спецификации | 2026-03-26 |

## Где искать актуальное

| Тема | Актуальный источник |
|------|---------------------|
| Стек и архитектура | `/README.md`, `astro/astro.config.mjs` |
| Контент-схемы | `astro/src/content/config.ts` |
| Deploy | `/README.md` → раздел «Деплой», `deploy/` |
| Performance | Cloudflare Pages + `astro/public/_headers` |

---

*Archived: 2026-04-20 · ORGA-056 _meta cleanup*
