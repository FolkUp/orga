# Editorial Fix Plan — Oxymiron Longread (Synthesized)

**Date:** 2026-04-20
**Source:** consolidated panel of 5 experts (Лев, Цветик, Наборщик, Фонарщик, КиберГонзо)
**Authority:** Carte Blanche Level 3
**Target file:** `content/investigations/oxymiron-cultural-seismography.md`

---

## Executive Synthesis

Лонгрид имеет **сильное концептуальное ядро** (Kassandra arc, Lotman semiosphere, Benjamin angel of history, Bakhtin chronotope). Эти теоретические опоры органичны и несут смысловую нагрузку. **Подрывается** в двух местах:
1. **Doctrinal infrastructure** — fabricated metrics, broken footnotes, неверный URL Минюста, явно неверный allmusic URL
2. **Финальные секции** — переключение в self-promotional «brand architecture» register, несовместимый с тоном первых двух третей

Консолидированный verdict экспертов: **CONDITIONAL_PASS на публикацию ПОСЛЕ применения P0 + P1 правок.**

---

## P0 Fixes (Must — блокируют публикацию)

### Источники (frontmatter)

| # | Source | Fix |
|---|--------|-----|
| 1 | `#2 allmusic.com/artist/oxxxymironcoverage` | **УДАЛИТЬ** полностью из frontmatter (Наборщик: title misleading + URL fabricated; Лев: ОК; КиберГонзо: реального AllMusic source нет нужного качества) |
| 2 | `#3 minjust.gov.ru/foreign-agents` | **ЗАМЕНИТЬ** на `https://minjust.gov.ru/ru/activity/directions/942/spisok-lic-vypolnyayushih-funkcii-inostrannogo-agenta/` + **ДОБАВИТЬ** Moscow Times как duplicate: `https://www.themoscowtimes.com/2022/10/07/russia-labels-star-rapper-oxxxymiron-a-foreign-agent-a79028` |
| 3 | `#1 fontanka` title | Изменить title с «Oxymiron - Организация (Official Audio)» на «Fontanka: Oxymiron выпустил сингл «Организация»». Type с `primary-evidence` на `news-coverage` |

### Фабрикованные метрики

| # | Где | Fix |
|---|-----|-----|
| 4 | Строка 196 «23 phrases and metaphorical structures that directly correlate» | **УДАЛИТЬ** evidence-card целиком (или предложение «Computational analysis identifies 23 phrases...») |
| 5 | Строка 262 «300% increase in underground sharing» | **УДАЛИТЬ** или заменить на «documented surge» без числа |
| 6 | Строка 314 «300% increase in underground circulation» (повтор!) | **УДАЛИТЬ** |
| 7 | Строка 356 «300% increase in underground circulation» (повтор!) | **УДАЛИТЬ** |

**Контроль:** после правок — grep `300%` и `23 phrases` → 0 совпадений.

### Структурные ошибки

| # | Где | Fix |
|---|-----|-----|
| 8 | Строка 318 — сноска ⁵ дублируется (Boris Groys на 290 + Bakhtin на 318) | Перенумеровать: Groys = ⁵, Lotman (Culture and Explosion) = ⁶, Bakhtin (Dialogic Imagination) = ⁷ |
| 9 | Строка 216 — `<div id="year-2020">` в секции про 2021-2022 | Исправить на `year-2022` |
| 10 | Inconsistent написание имени артиста: «Oxymiron» (без x3) vs «Oxxxymiron» (3 x) | Привести к единообразию: **Oxxxymiron** (как использует сам артист) во всём тексте |

### Phase3 файл

| # | Действие |
|---|----------|
| 11 | **Решение панели (per Лев + Фонарщик consensus):** Переместить clean version в `_meta/drafts/phase3-tim-roho-draft.md` БЕЗ строк 108-121 (подписи `// Цветик` `// Фонарщик`). Удалить original `content/investigations/organizatsiya-phase3-tim-roho-integration.md`. Контент уже интегрирован в основной лонгрид (строки 267-290, 338-370). Применять единственный вариант, не ambiguity. |

---

## P1 Fixes (Important — качество)

### Lyrical Themes секция (строки 137-156) — переписка по плану Цветика

| # | Действие |
|---|----------|
| 12 | **УДАЛИТЬ** строки 149-152 (4 bullet-абстракции) |
| 13 | **ДОБАВИТЬ** новую структуру: вводное предложение → `[LYRIC_QUOTE_1]` → аналитический комментарий → `[LYRIC_QUOTE_2]` + `[LYRIC_QUOTE_3]` |
| 14 | **ДОБАВИТЬ** просодический разбор припева (4-стопник с цезурой, ритм декрета) |
| 15 | **VERIFIED CITATIONS DOSTUPNY** в `_meta/sources/organizatsiya-lyrics-full.md` (предоставлены Андреем 20.04.2026 из LyricFind, © Oxxxymiron). Mapping placeholder → real quote:<br>• `[LYRIC_QUOTE_1]` → «Мы — запрещённая организация» (припев)<br>• `[LYRIC_QUOTE_2]` → «Каждый, кто знает, о чём я — у нас в рядах»<br>• `[LYRIC_QUOTE_3]` → «У нас нет ни устава, ни штаба / Ни вождя, ни обряда, ни флага / Но мы будем всегда, а враждующих с нами / Не станет, как Штази с Гестапо»<br>Атрибуция: «Oxxxymiron (Мирон Фёдоров). «Организация» (2021). Видео-премьера 8.11.2021. Альбом: miXXXtape III: Смутное Время (12.11.2021). LyricFind, © Oxxxymiron» |
| 16 | **Лимит ОТМЕНЁН пользователем 20.04.2026** («Лимиты Льва отменить»). Цитировать столько, сколько требует академический анализ. Атрибуция обязательна для каждой цитаты. Risk acknowledged by user. |

### Mixtape vs album misframing (строка 159)

| # | Действие |
|---|----------|
| 17 | Заменить «the full album miXXXtape III delivered a complete cultural statement» на формулировку Цветика: «miXXXtape III — компиляция 36 треков 2014-2021 + два новых; ретроспективный срез, не единый авторский манифест. Именно поэтому его тематическая связность с событиями 2022 года показательна: prescience не была спроектирована post-hoc, она накапливалась органически восемь лет.» |

### Tim ROHO дата (строка 273)

| # | Действие |
|---|----------|
| 18 | «In November 2021, Tim ROHO's visual treatment» — Tim ROHO режиссёр верифицирован (the-flow.ru), но конкретно «November 2021» не подтверждено. **Заменить** на «Tim ROHO's visual treatment of «Организация»» (без точной даты) |

### Voice issues по Фонарщику (10 пунктов)

| # | Где | Fix |
|---|-----|-----|
| 19 | Строка 101 «through rigorous analysis» | удалить «rigorous» |
| 20 | Строка 101 «revealing how cultural expression operates as an early warning system» | сократить (повторяет conclusions) |
| 21 | Строки 113-118 — IMRaD bold нумерация методологии | убрать `**1.**`, заменить prose-формой |
| 22 | Строка 155 «The single's release 108 days... transforms casual listening into retrospective prophecy» | оставить «108 дней до» — убрать остальную performance |
| 23 | Строка 283 «Underground Academia emerges as cultural early warning system» | удалить (4-й повтор) |
| 24 | Строка 298 «like the canary in the coal mine—an analogy that proves instructive precisely because the canary does not *understand* the gas...» | сократить — meta-commentary в скобках breaking voice |
| 25 | Строки 306-308 (раздел «Platform Censorship as Validation») — 2 строки после 15-строчного анализа | merge в предыдущий раздел или expand |
| 26 | Строка 354 «viral credibility loops that operate independently from official cultural frameworks» | заменить tech-marketing register на нейтральный |
| 27 | Строки 363-370 — numbered list «1. Embedded Cultural Analysis...» | переписать prose-формой ИЛИ удалить раздел (Фонарщик: «либо prose, либо убрать») |
| 28 | Строка 396 «**EVIDENCE STRENGTH**: Comprehensive» | заменить на содержательный вердикт с фактами |
| 29 | Строки 241 «exactly 333 days after» | убрать «exactly» (math верна, но «exactly» нарративная мистификация) |

### Финальные секции (Underground Academia self-promotion)

| # | Действие |
|---|----------|
| 30 | Секция «Underground Academia: Complete Cultural Framework» (строки 338-370) — Фонарщик: «бренд-буклет, не investigation». **Сократить или удалить** разделы про «Replication Protocols», «Brand Architecture», «Network Validation» — они нарушают boundary-dwelling voice |
| 31 | Подумать: возможно объединить в одну краткую meta-секцию (1 параграф) вместо 3 секций |

---

## P2 Fixes (Nice to have — усиление)

### Контекст «Цунами»

| # | Действие |
|---|----------|
| 32 | Добавить упоминание что «Организация» — **второй сингл** с альбома (первый «Цунами»). Подтверждено Fontanka 8.11.2021 |

### Дополнительные источники

| # | Действие |
|---|----------|
| 33 | Опционально добавить в frontmatter sources[]:<br>- Iz.ru 8.11.2021 (независимое подтверждение даты)<br>- The-flow.ru (production credits клипа Tim ROHO)<br>- Apple Music music-video URL (`music.apple.com/ru/music-video/.../1699493436`)<br>- TechCrunch как backup для Spotify suspension |

### Атрибуция UNVERIFIED sources

| # | Действие |
|---|----------|
| 34 | Source #5 (rferl) — добавить пометку в frontmatter `note: "403 anti-scraper, страница доступна напрямую"` |
| 35 | Source #10 (digitalmusicnews) — аналогично |

---

## Order of Application (in next session after /compact)

1. **P0 sources fixes** (5 минут) — простые Edit'ы frontmatter
2. **P0 fabricated metrics removal** (5 минут) — grep + Edit
3. **P0 footnote renumbering** (3 минуты)
4. **P0 anchor + spelling consistency** (5 минут)
5. **P0 phase3 file decision applied** (3 минуты)
6. **P1 mixtape/Tim ROHO/voice fixes** (15-20 минут)
7. **P1 Lyrical Themes rewrite** (10 минут — placeholder version, реальные цитаты позже от Андрея)
8. **P1 финальные секции сокращение** (10 минут)
9. **P2 опционально** — добавить «Цунами» + extra sources (5 минут)
10. **Re-verification Alpha+Beta** — quality gate
11. **Commit + push** с описанием правок

**Total estimated effort:** ~1.5 часа фактической работы в новой сессии.

## Что нужно от Андрея

После применения P0+P1 правок — **полный текст песни «Организация»** для замены 3 placeholders реальными цитатами (≤3 строки per Лев compliance).

---

## Decisions Made by Panel (no Андрей needed)

- **Source #2 allmusic** — удалить, не заменить (real source for AllMusic есть, но title misleading; чище удалить)
- **Source #3 Минюст** — заменить на корректный URL + дублирующий Moscow Times
- **Phase3 файл** — переместить в `_meta/drafts/` без подписей (или удалить если Андрей предпочитает)
- **«300% increase»** — удалить все три упоминания
- **«23 phrases»** — удалить evidence-card целиком
- **«exactly 333 days»** — убрать «exactly», math оставить
- **«Oxxxymiron»** (3 x) — единообразное написание
- **Underground Academia self-promotion sections** — сократить до 1 краткой meta-секции
