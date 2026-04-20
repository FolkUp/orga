# Expert Panel Results — Phase 2 Editorial Fixes

**Date:** 2026-04-20
**Authority:** Carte Blanche Level 3
**Subject:** `content/investigations/oxymiron-cultural-seismography.md`

---

## Batch 1 — Лев (Compliance Gate)

**CITATION_LIMIT для «Организация» Oxymiron:**
- **3 строки суммарно**, не более 2 строк из одного куплета
- Обоснование: EU InfoSoc Dir. Art.5(3)(d) + Portuguese CDADC Art.75(2)(b) — rap классифицируется как поэзия, лимит ≤10% или 3 строки (что меньше)
- Ko-fi монетизация требует консервативного лимита; academic purpose повышает tolerance

**ATTRIBUTION_FORMAT:**
```
Oxymiron (Мирон Фёдоров). «Организация» (2021). Полный оригинал: «текст строки».
[При переводе]: (авторский перевод) или (перевод автора)
В сноске: название трека, дата выпуска 08.11.2021, лейбл/платформа
```

**SPECIAL_CASES:**
- Припев повторяется 3-4 раза → считается ОДНИМ блоком, не умножать
- Иноагентский статус не влияет на авторские права в EU (Berne Convention)
- Обвинения 2025 не меняют IP-статус (из scope исключены)

**PHASE3 файл verdict:**
- Категория: (b) Operational hygiene + (c) Brand integrity (НЕ Level 1)
- Действие: **Удалить строки 108-121** (от `// Цветик` до конца) → перенести в `_meta/drafts/phase3-tim-roho-draft.md` БЕЗ блока подписей
- Контент строк 1-107 — clean, можно интегрировать
- **НЕ коммитить файл в текущем виде** в public repo

**RATIONALE:** Rap lyrics = поэзия по EU law; fair dealing для cultural analysis допускает ~3 строки при обязательной атрибуции и non-substitution.

// Лев

---

## Batch 2 — Цветик (Lyrical Themes Rewrite)

**REWRITE_STRATEGY:** Заменить bullet-list абстракций конкретной структурой: цитата → аналитический комментарий → просодический разбор. С плейсхолдерами для 3 строк в рамках правового лимита.

**LINES_TO_DELETE:** строки 149-152 — четыре bullet-пункта внутри evidence-card («Organizational Structures», «State-Society Tension», «Cultural Resistance», «Temporal Urgency») — чистая вода без доказательной базы.

**NEW_STRUCTURE:**
1. Вводное предложение: что делает припев юридически заряженным (формулировка «запрещённая организация» как калька из российского реестра НКО/иноагентов)
2. `[LYRIC_QUOTE_1]` — строка из припева
3. Аналитический комментарий (2-3 предл.): буквальное vs переносное в формулировке
4. `[LYRIC_QUOTE_2]` + `[LYRIC_QUOTE_3]` — по одной строке из разных куплетов

**PROSODIC_ANALYSIS:** Припев — ударный четырёхстопник с цезурой после второй стопы — ритм приказа, декрета. Рэп-доставка намеренно нейтральна, имитирует казённый язык. Просодический троп: бюрократическая форма заполнена антибюрократическим содержанием.

**MIXTAPE_NUANCE (строка 159):** Заменить «the full album miXXXtape III delivered a complete cultural statement» на: «miXXXtape III — компиляция 36 треков 2014-2021 + два новых; ретроспективный срез, не единый авторский манифест. Именно поэтому его тематическая связность с событиями 2022 года показательна: prescience не была спроектирована post-hoc, она накапливалась органически восемь лет.»

**PLACEHOLDERS:**
- `[LYRIC_QUOTE_1: припев, «запрещённая организация» — юридическая формула]`
- `[LYRIC_QUOTE_2: куплет 1 или 2, природный/органический образ распространения]`
- `[LYRIC_QUOTE_3: куплет иной, исторический/субкультурный регистр]`
- Атрибуция под каждой: Oxymiron (Мирон Фёдоров). «Организация» (2021).

// Цветик

---

## Batch 2 — Наборщик (Editorial Review)

### NEW P0 ISSUES (помимо identified в verification)

| Line | Issue | Suggested fix |
|------|-------|---------------|
| 318 | Сноска ⁵ продублирована: уже на строке 290 (Boris Groys), здесь переназначена на Bakhtin — нумерация сломана | Перенумеровать: Groys = ⁵, Bakhtin (Dialogic Imagination) = ⁷, Lotman (Culture and Explosion) = ⁶ |
| 241 | «exactly 333 days after the release» — математика верифицирована (математически точно), но риторическое «exactly» создаёт мистификационный нарратив | Убрать «exactly» — оставить «333 days» без академической драматизации. Math подтверждена. |
| 43 | Source #2 frontmatter: title «miXXXtape III Album Coverage» misleading + URL fabricated 404 | Полностью удалить из frontmatter (Наборщик предлагает удалить, не заменить) |

### NEW P1 ISSUES

| Line | Issue | Suggested fix |
|------|-------|---------------|
| 101 | AI fingerprint: «rigorous analysis», «systematic state suppression», «complete arc» — корпоративная гиперболизация | Разбить, убрать «rigorous» и «complete arc» |
| 216 | `<div id="year-2020">` anchor в секции про 2021-2022 — явная ошибка разметки | Исправить на `year-2022` |
| 97+ | Inconsistent: «Oxymiron» (без x3) в Executive Summary vs «Oxxxymiron» в frontmatter (#3, #6, #8) | Выбрать одно написание (артист использует «Oxxxymiron» — три X), применить единообразно |
| 273 | «In November 2021, Tim ROHO's visual treatment» — конкретная дата ноябрь 2021 не подтверждена | Tim ROHO как режиссёр верифицирован, но точная дата — добавить источник или убрать «In November 2021» |
| 262/314/356 | «300% increase» используется **ТРИЖДЫ**, включая выводы — кратно умножает editorial risk | Убрать ВСЕ три упоминания (не только одно) |

### OVERALL
- AI_FINGERPRINT_DENSITY: **medium** — основной текст аутентичен, но методология/выводы содержат паттерны («rigorous», «systematic», «comprehensive», «measurable precision»)
- Концептуально сильный лонгрид (Лотман, Бахтин, Беньямин), подрывается сломанными сносками + fabricated метриками в ключевых местах

// Наборщик

---

## Batch 3 — Фонарщик (Brand Voice + Phase3 Confirm)

**PHASE3_BRAND_VERDICT:** confirm Лев + amend — `_meta/drafts/` правильно. Phase3 контент уже интегрирован в основной лонгрид (строки 267-290, 338-370). Подписи `// Цветик` `// Фонарщик` в публичном репо — brand integrity violation: раскрывают multi-agent review process (operational hygiene нарушено).

**VOICE_ISSUES (10):**

| Line | Issue type | Quote (короткая) | Suggested fix |
|------|------------|------------------|---------------|
| 101 | AI-narrative trope | "through rigorous analysis" | удалить «rigorous» |
| 101 | Corporate perform | "revealing how cultural expression operates as an early warning system" | сократить — резюме повторяет conclusions буквально |
| 111 | Numbering клише | "**1. Textual Analysis**... **5. State Response**" | убрать bold нумерацию (akademisches IMRaD-клише) |
| 155 | Temporal overexplication | "108 days before the war began represents a temporal gap that transforms casual listening into retrospective prophecy" | оставить «108 дней до» — остальное performance |
| 283 | Circular self-reference | "Underground Academia emerges as cultural early warning system" | 4-й раз в тексте — удалить повтор |
| 298 | Mixed register | "like the canary in the coal mine—an analogy that proves instructive precisely because..." | footnote-style meta-commentary внутри prose breaking voice |
| 307 | Thin paragraph | "Platform Censorship as Validation / The pattern of increasing..." | 2 строки после 15-строчного анализа — expand или merge |
| 354 | Brand overclaim | "viral credibility loops that operate independently from official cultural frameworks" | tech-marketing register, не UA tone |
| 363-370 | Listicle register | "1. Embedded Cultural Analysis... 5. Retrospective Validation" | numbered list разрушает prose register |
| 396 | Evidence verdict | "**EVIDENCE STRENGTH**: Comprehensive" | AI-summary marker; заменить содержательным вердиктом |

**ACADEMIC_OVERLOAD: balanced** — Лотман/Бахтин/Беньямин органичны. Эйзенштейн/Гройс необходимы для Tim ROHO section. Шкловский в черновике излишний.
**UNDERGROUND_AUTHENTICITY: medium** — Kassandra arc сильная и органичная. Финальные разделы «Replication Protocols» и «Brand Architecture» пишут об Underground Academia в третьем лице как о продукте — бренд-буклет, не investigation. Voice теряет boundary-dwelling позицию.

**OVERALL_BRAND_FIT: CONDITIONAL_PASS** — ядро (Kassandra, Lotman-explosion, Prophet's Exile) достигает Underground Academia DNA с настоящей интеллектуальной плотностью; финальные секции про «replication protocols» переключаются в self-promotional register, несовместимый с тоном первых двух третей.

// Фонарщик

---

## Batch 3 — КиберГонзо (Web.archive Snapshots + Source #3 Discovery)

**Wayback Machine:** ECONNREFUSED во всех попытках через WebFetch. Верификация выполнена через альтернативные источники (Wayback API + Google search + cross-reference).

**Source #3 (Минюст) — КРИТИЧЕСКАЯ НАХОДКА:**
- `minjust.gov.ru/foreign-agents` — **URL некорректный**, не существует (не индексируется)
- **Реальный URL** реестра физлиц-иноагентов: `https://minjust.gov.ru/ru/activity/directions/942/spisok-lic-vypolnyayushih-funkcii-inostrannogo-agenta/`
- Факт добавления Oxxxymiron 7.10.2022 подтверждён 8+ независимыми источниками (Moscow Times, Anadolu, Seattle Times, Yahoo)

**Source #5 (RFE/RL):**
- URL корректный, статья существует, заголовок: «Popular Russian Rapper Labeled 'Foreign Agent' By Russian Justice Ministry»
- Дата: 8 октября 2022 (день после foreign agent)
- 403 = anti-scraper, не geo-block

**Source #10 (Digital Music News):**
- URL корректный, статья от 28.03.2022, факт о Spotify suspension подтверждён 10+ источниками (TechCrunch, Rolling Stone, Variety, CNBC)
- 403 = anti-scraper защита

**RECOMMENDATIONS:**

| # | Действие |
|---|----------|
| 3 | **ЗАМЕНИТЬ URL** на корректный Минюст (`/ru/activity/directions/942/...`) + добавить дублирующий source: Moscow Times `themoscowtimes.com/2022/10/07/russia-labels-star-rapper-oxxxymiron-a-foreign-agent-a79028` |
| 5 | **ОСТАВИТЬ** URL как есть — статья существует, факт верифицирован. Добавить пометку «403 = anti-scraper» |
| 10 | **ОСТАВИТЬ** URL — факт тройно верифицирован. Опционально дополнить TechCrunch URL |

// КиберГонзо


