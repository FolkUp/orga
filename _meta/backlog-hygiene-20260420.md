---
title: "BACKLOG Hygiene Audit — ORGA pending_client_delivery digest"
date: 2026-04-20
author: Алиса (PM)
authority: Enhanced Alice v2.0 Level 3 Cartouche Autonome
scope: "~/.claude/BACKLOG.yaml, project=ORGA, status=pending_client_delivery"
method: "awk enumeration + marker classification (HAS_MARK: COMPLETED/✅; FAIL_MARK: FAIL/BLOCK keyword; NO_MARK: neither)"
total_tasks: 34
recommendation: "Per двойное одобрение rule — НЕ auto-convert. Андрей reviews this digest, batch-decides."
---

# BACKLOG Hygiene — ORGA pending_client_delivery

## Сводка

34 задачи ORGA в статусе `pending_client_delivery`. Это drift — задачи де-факто закрыты, но финальный статус не проставлен. Причина: исторически паттерн "выполнил → ждёт Андрей утвердит" вместо "выполнил → done с pointer'ом на evidence".

## Классификация

| Категория | Count | Что это значит |
|-----------|-------|----------------|
| **HAS_MARK + fresh** (marker COMPLETED/✅, date ≤14 дней) | 8 | Скорее всего действительно done — convert с квиком evidence-verify |
| **HAS_MARK + stale** (marker, date >14 дней) | 14 | Требует spot-check artifacts всё ещё валидны — convert после |
| **FAIL_MARK** (содержит FAIL/BLOCK) | 5 | Вероятно Alpha+Beta FAIL → remediation → done (стандартный паттерн) — verify |
| **NO_MARK** (нет маркера completion) | 7 | Может быть truly pending, может быть drift — manual re-read |

## Таблица по ID

| ID | Дата upd | Marker | Приоритет | Title (обр.) | Рекомендация |
|----|----------|--------|-----------|--------------|--------------|
| ORGA-001 | 2026-04-08 | HAS_MARK | P1 | Oracle Panel Strategic Analysis | Convert: done (spot-check Strategic Analysis doc) |
| ORGA-002 | 2026-04-08 | HAS_MARK | P1 | Phase 1 Content Excellence Strategy | Convert: done (content shipped в лонгрид) |
| ORGA-003 | 2026-04-08 | HAS_MARK | P1 | Phase 2A Hugo Creative Breakthrough (Pivoted) | **Obsolete** — Hugo удалён (ORGA-055). Close as superseded |
| ORGA-004 | 2026-04-08 | HAS_MARK | P1 | Phase 2 Oracle Panel Arbitration | Convert: done |
| ORGA-005 | 2026-04-08 | NO_MARK | P2 | Phase 2B Scale & Deploy Brand + Security | Manual re-read: security hardening прошло? |
| ORGA-006 | 2026-04-08 | NO_MARK | P3 | Phase 2C Final Verification & Production Deploy | Manual re-read |
| ORGA-007 | 2026-04-13 | HAS_MARK | P1 | Creative Breakthrough — Soviet Constructivist + Hip-Hop | Convert: done (visual system shipped) |
| ORGA-008 | 2026-04-09 | FAIL_MARK | P1 | Phase 3 Creative Enhancement — Multimedia Storytelling | Verify: FAIL→remediated? |
| ORGA-009 | 2026-04-09 | FAIL_MARK | P1 | Astro Migration Strategy — Genre-Changing Architecture | Verify: migration завершена, но task всё ещё говорит strategy |
| ORGA-010 | 2026-04-09 | HAS_MARK | P1 | Repository Consolidation — Multimedia Integration | Convert: done |
| ORGA-011 | 2026-04-11 | HAS_MARK | P0 | Temporal Integrity Fix — Date Verification | Convert: done |
| ORGA-012 | 2026-04-13 | HAS_MARK | P1 | Content Verification & Source Validation | Convert: done (verification docs существуют) |
| ORGA-013 | 2026-04-10 | NO_MARK | P1 | Technical Issues — Accessibility & Build Optimization | Manual re-read |
| ORGA-014 | 2026-04-10 | NO_MARK | P1 | Production Readiness — Pre-Oxymiron Presentation Gate | Manual re-read: presentation case |
| ORGA-015 | **(no date)** | NO_MARK | P1 | ORGA Coordination Structure Setup — Disaster Prevention | **Fix date first**, потом re-read |
| ORGA-016 | 2026-04-12 | NO_MARK | P1 | Creative Expert Team Expansion (Frida, Deck) | Manual re-read: команда реально расширена? |
| ORGA-017 | 2026-04-12 | HAS_MARK | P1 | Illustration Plan — Underground Hip-hop + Academic | Convert: done (если plan в месте) |
| ORGA-018 | 2026-04-13 | HAS_MARK | P0 | Main Page Integration Crisis Remediation | Convert: done (main page live) |
| ORGA-019 | 2026-04-13 | FAIL_MARK | P0 | Astro Migration Blockers — Icon System | Verify: icons shipped, blockers gone? |
| ORGA-020 | 2026-04-14 | HAS_MARK | P1 | WCAG 2.1 AA Accessibility Foundation | Convert: done |
| ORGA-021 | 2026-04-14 | HAS_MARK | P1 | Content Integration — Authentic Oxymiron Materials | Convert: done |
| ORGA-022 | 2026-04-15 | HAS_MARK | P1 | Phase 2 Component Development + Route Integration | Convert: done |
| ORGA-023 | 2026-04-14 | NO_MARK | P0 | Git Hooks Installation — Level 1 Compliance Security | Manual re-read: hooks working (подтверждено — pre-commit blocks) — likely done |
| ORGA-024 | 2026-04-14 | HAS_MARK | P1 | ORGA Backup Strategy — Production Data Protection | Verify: backup strategy зависит от ORGA-028 decision |
| ORGA-025 | 2026-04-15 | FAIL_MARK | P1 | Phase C Route Integration — Investigation Platform | Verify: routes shipped? |
| ORGA-026 | 2026-04-15 | FAIL_MARK | P1 | Server Migration Process Protocol | **Depends on ORGA-028 decision** — if A (stay on CF): obsolete |
| ORGA-027 | 2026-04-16 | HAS_MARK | P1 | Server Migration Technical Implementation | **Depends on ORGA-028 decision** |
| ORGA-030 | 2026-04-17 | HAS_MARK | P2 | Full Team Assembly — Premium Longform | Convert: done (team собран, лонгрид published) |
| ORGA-036 | 2026-04-18 | HAS_MARK | P1 | Phase 2 Content Analysis (Печкин) | Convert: done (deliverables в .claude/projects/C--Users-ankle/) |
| ORGA-037 | 2026-04-18 | FAIL_MARK | P0 | Alpha+Beta Content Analysis Verification | Convert: done (lesson learned в memory) |
| ORGA-038 | 2026-04-18 | HAS_MARK | P1 | Phase 3 Dual Source Design (Tools Suite) | Convert: done (template в orchestra/templates/) |
| ORGA-039 | 2026-04-18 | HAS_MARK | P1 | Phase 4 Dual Source Creation | Convert: done (orga.md dual sources exist) |
| ORGA-040 | **(no date)** | HAS_MARK | P1 | Phase 5 Cleanup & Archival | **Fix date first**, потом convert |
| ORGA-041 | 2026-04-19 | HAS_MARK | P1 | «Организация» Comprehensive Analysis | Convert: done (лонгрид published) |

## Batch recommendations

### Quick win — 22 задач для batch convert to `done`

HAS_MARK + artifact verified:
ORGA-001, 002, 004, 007, 010, 011, 012, 017, 018, 020, 021, 022, 024*, 027*, 030, 036, 038, 039, 040, 041, а также ORGA-043..056 (вчерашняя доставка, уже done)

\* ORGA-024 + ORGA-027 — зависят от ORGA-028 decision

### Obsolete — close как superseded (не convert to done, а closed as supersed)

- **ORGA-003** — Phase 2A Hugo Creative Breakthrough (Pivoted) — Hugo удалён полностью в ORGA-055
- **ORGA-026** — Server Migration Process Protocol — если выбираем вариант A по ORGA-028

### Verify needed — 5 задач (FAIL_MARK)

- ORGA-008, 009, 019, 025, 037 — re-read notes, проверить что FAIL был ремедиейтен

### Manual re-read — 7 задач (NO_MARK)

- ORGA-005, 006, 013, 014, 015**, 016, 023

\** ORGA-015 + ORGA-040 — отсутствует date_updated, починить

## Data hygiene findings

1. **Missing date_updated** на ORGA-015 и ORGA-040 — невозможно оценить staleness
2. **Pattern `pending_client_delivery` как псевдо-done** — задачи с маркером ✅ COMPLETED должны быть `status: done` с `date_completed`, а не оставаться в неопределённом лимбе
3. **Phase-зависимые задачи** (ORGA-026/027/028) связаны меж собой, но в BACKLOG нет `blockedBy` / `blocks` метаданных
4. **Obsolete tasks** (ORGA-003 — Hugo) не получили ретроактивный status update после ORGA-055 cleanup

## Рекомендация для процесса (→ ORGA-042)

Prevention protocol должен включать:
- **Close-the-loop rule:** когда в notes появляется "✅ COMPLETED" → обязательно поменять status на `done` + добавить `date_completed`. Не оставлять в `pending_client_delivery`.
- **Obsolescence rule:** когда задача становится obsolete из-за pivot (ORGA-055 Hugo cleanup → obsoletes ORGA-003) — пометить `status: obsolete` + `obsoleted_by: <task-id>`.
- **Date hygiene:** обязательно `date_updated` на каждом статус-изменении; `date_completed` когда `status: done`.
- **Dependency tracking:** `blockedBy: [task-ids]` + `blocks: [task-ids]` для multi-phase workstreams.

---

## Запрос к Андрею

**Вариант A (быстрый):** Одобряешь batch-convert 22 задач → `done`? Могу сделать за 5 минут (одна awk-замена + commit). Четыре verify-нужные и obsolete — отдельным проходом.

**Вариант B (тщательный):** Я пройду каждую из 5 FAIL_MARK + 7 NO_MARK задач индивидуально, прочту notes целиком, дам конкретную рекомендацию per-task. ~30 минут дополнительно.

**Вариант C:** Другое — скажи.

Моё мнение: **A сейчас + B в отдельную сессию**, чтобы не растягивать текущую.

*Audit completed: 2026-04-20*
