---
title: "ORGA-028 Decision Memo — Cloudflare Pages Deprecation Status"
date: 2026-04-20
author: Алиса (PM)
authority: Enhanced Alice v2.0 Level 3 Cartouche Autonome
status: awaiting_andrey_decision
---

# ORGA-028 Decision Memo — Cloudflare Pages Deprecation

## TL;DR

Два параллельных deployment-пути существуют одновременно. Evidence не форсирует однозначный ответ. Нужно решение Андрея по одному из трёх вариантов.

---

## Evidence Base

### Self-hosted Hetzner (deploy/)

**Статус:** Infrastructure deployed, DNS pending.

| Артефакт | Источник | Дата |
|----------|----------|------|
| nginx container `orga-underground` running | `.claude/ORGA-027-IMPLEMENTATION-COMPLETE.md` | 2026-04-16 |
| Server: Hetzner CX33 46.225.107.2 Ubuntu 24.04 | `deploy/DEPLOYMENT-GUIDE.md` | — |
| nginx-proxy auto-discovery operational | implementation-complete.md | — |
| SSL Let's Encrypt provisioning ready | implementation-complete.md | — |
| Compliance (GNRL-276 P0 blockers) | BACKLOG: GNRL-276 resolved | 2026-04-19 |
| **Pending:** DNS A record underground.folkup.life → 46.225.107.2 | implementation-complete.md §Phase 1 | — |

### Cloudflare Pages (current README canonical)

**Статус:** Канонизирован в README после ORGA-055 rewrite (мой коммит `c51596e`, 2026-04-20).

| Артефакт | Источник | Дата |
|----------|----------|------|
| README: "Hosting: Cloudflare Pages" | `README.md:25` | 2026-04-20 (мой rewrite) |
| README: "Production Cloudflare Pages auto-deploy from main" | `README.md:82` | 2026-04-20 |
| `astro/public/_headers` (CF Pages convention) | comment: "deployed to Cloudflare Pages" | 2026-04-20 |
| `deploy/` classified as "fallback" в README | `README.md:86` | 2026-04-20 |

### Противоречие

README (свежее, 2026-04-20) говорит: **Cloudflare Pages = primary**.
ORGA-027 docs (2026-04-16) говорят: **self-hosted deployed, DNS pending**.
ORGA-028 backlog note (2026-04-15) говорит: deprecation зависит от ORGA-027 completion.

DNS state не верифицируем из sandbox (curl: "Could not resolve host"). Правда вероятнее всего: **live prod на Cloudflare Pages**, self-hosted deployed но без трафика (DNS не переключён).

---

## Три легитимных варианта

### Вариант A — Stay on Cloudflare Pages (status quo)

**Действия:**
- Close ORGA-027 (технически deployed, но оставить без DNS-flip)
- Close ORGA-028 как "decided to stay on CF Pages"
- Archive `deploy/` в `deploy/archive/` или удалить (сохранить инструкцию в git history через tag)
- Обновить ORGA-024 Backup Strategy под CF Pages reality
- Убрать "fallback" формулировку в README или уточнить её смысл

**Плюсы:** простота, zero ops, DDoS protection от CF, global CDN, auto-deploy from main.
**Минусы:** vendor lock-in (частичный), data processor agreement уже есть с Cloudflare.

### Вариант B — Complete migration to self-hosted

**Действия:**
- Execute DNS flip: `./deploy/dns-setup-underground.sh` (Андрей, нужен SOPS)
- Verify SSL auto-provisions (Let's Encrypt через acme-companion)
- Deprecate Cloudflare Pages project в CF dashboard
- Update README: self-hosted canonical
- Set up CI/CD for self-hosted pushes (rsync + docker compose reload)
- ORGA-024 Backup Strategy — verify on self-hosted

**Плюсы:** full control, no vendor lock-in, consistent with Hetzner infra of other FolkUp projects.
**Минусы:** больше ops, SSL renewal ответственность, monitoring нужен, downtime risk при migration.

### Вариант C — Hybrid (CF primary, self-hosted warm standby)

**Действия:**
- CF Pages = live canonical
- Self-hosted = warm standby (container running, DNS не переключён, но готов)
- Document failover procedure в `deploy/FAILOVER.md`
- Monthly drill: manual failover test
- Update README: явное hybrid описание

**Плюсы:** high availability, vendor-lock mitigation, DDoS resistance.
**Минусы:** operational overhead, synchronization risk, cost (VPS running без трафика).

---

## Recommendation

Моё мнение как PM: **Вариант A**. Основания:

1. **Phase 1 goals achieved** на CF Pages — сайт живой, compliance ОК, 14 задач вчера уложены. Не чинить что работает.
2. **Self-hosted migration** (ORGA-026/027) делался в contexte compliance blockers (GNRL-276), которые РЕЗОЛВНУТЫ. Изначальный trigger исчез.
3. **Hybrid (C)** — операционная роскошь. Underground Academia не имеет SLA-требований уровня, где нужна warm standby.
4. **Vendor lock-in** с Cloudflare Pages минимален: Astro static, _headers перенесётся на любой хостинг за час.
5. **Self-hosted (B)** имеет смысл если: (a) Андрей не доверяет Cloudflare по принципу, (b) планируется server-side логика которая в CF Pages не умещается, (c) нужна полная data sovereignty.

**НО:** это не моё решение. Это vendor lock-in trade-off + операционные предпочтения Андрея. Я рекомендую A, но одинаково корректно реализую B или C.

---

## Действия после решения

| Вариант | Открыть задачу | Закрыть задачу |
|---------|----------------|----------------|
| A | ORGA-028.1 "Archive deploy/, update ORGA-024 Backup Strategy" | ORGA-028 (Decision: стаём на CF), ORGA-026/027 (superseded by decision) |
| B | ORGA-028.1 "Execute DNS flip + CF deprecation", ORGA-028.2 "Self-hosted CI/CD" | ORGA-028 (Decision: мигрируем) |
| C | ORGA-028.1 "Hybrid documentation + failover drill" | ORGA-028 (Decision: hybrid) |

---

## Request

Андрей, выбери A / B / C или предложи D. Автономно решение не принимаю — это vendor-lock trade-off.

*Memo prepared: 2026-04-20*
