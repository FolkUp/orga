---
title: "Verification Report — Oxymiron Cultural Seismography Longread"
date: 2026-04-20
investigator: Alice (PM)
target_file: content/investigations/oxymiron-cultural-seismography.md
target_status_in_frontmatter: verified
target_confidence: high
methodology: WebSearch + WebFetch cross-source verification
scope_note: |
  Per Андрей editorial decision (20.04.2026): later author scandals (Meduza investigation 03.2025)
  are out of scope. Subject of investigation = cultural artifact (song, November 2021), not author's
  moral biography. Free information > reputational risk avoidance.
---

## Summary

| Категория | Verdict |
|-----------|---------|
| Critical facts (4) | 4/4 CONFIRMED |
| Math (108 days, 333 days) | CORRECT |
| Sources (10 in frontmatter) | 6 CONFIRMED, 1 FABRICATED, 1 PARTIAL, 2 UNVERIFIED (geo/access) |
| Fabricated metrics | 2 FOUND (must be removed) |
| Lyrical citations | 0 (significant credibility gap) |
| Phase3 untracked file | 1 leak (agent signatures `// Цветик` `// Фонарщик`) |
| Contextual misframing | 2 issues (mixtape vs album; missing «Цунами» context) |

**Overall:** лонгрид частично верифицирован. Базовая фактология (даты, режиссёр, foreign agent) подтверждена. Фабрикованные элементы (URL #2, метрики M1/M2) требуют замены/удаления. Тематический фрейминг требует уточнений (mixtape vs album). Полный текст песни и цитаты — отдельный editorial task.

## A. Critical Facts (4/4 CONFIRMED)

| # | Утверждение | Verdict | Источник |
|---|-------------|---------|----------|
| F1 | miXXXtape III released 12.11.2021 | ✅ CONFIRMED | Wikipedia, AllMusic, Spotify, Discogs |
| F2 | «Организация» released 8.11.2021 | ✅ CONFIRMED (видео-премьера) | Fontanka 8.11.2021, Iz.ru 8.11.2021. Уточнение: трек на стримингах попал с альбомом 12.11; видео-релиз 8.11 |
| F3 | Tim ROHO directed «Организация» video | ✅ CONFIRMED | The-flow.ru, ROHO team production credit (DOP Arsen Sarkisyan, art Kostivgosti) |
| F4 | Foreign agent designation 7.10.2022 | ✅ CONFIRMED | Meduza 7.10.2022, Wikipedia |

**Math сверка:**
- 8.11.2021 → 24.02.2022 = **108 дней** ✅
- 8.11.2021 → 7.10.2022 = **333 дня** ✅

## B. Sources Verification (10 URL в frontmatter)

| # | URL (укорочено) | Verdict | Заметка |
|---|------------------|---------|---------|
| 1 | fontanka.ru/2021/11/08/70240067/ | ⚠️ PARTIAL | URL рабочий, статья реальная (8.11.2021). Но title в frontmatter «Oxymiron - Организация (Official Audio)» неточен — это **новостная статья**, не official audio. Type `primary-evidence` неверный. **Рекомендация:** изменить title → «Fontanka: Oxymiron выпустил сингл «Организация»», type → `news-coverage`. |
| 2 | allmusic.com/artist/oxxxymironcoverage | ❌ FABRICATED | 404. Синтетический URL. **Рекомендация:** заменить на реальный AllMusic URL для miXXXtape III: `allmusic.com/album/mixxxtape-iii-smutnoe-vremja-mw0003673088` |
| 3 | minjust.gov.ru/foreign-agents | ⚠️ UNVERIFIED | ECONNREFUSED (geo-block likely). URL домена реальный, страница не верифицирована. **Рекомендация:** заменить на Meduza/OVD-Info как первичный источник, Минюст оставить как secondary с пометкой. |
| 4 | hrw.org/news/2019/02/28/russia-censorship-younger-generations-music | ✅ CONFIRMED | Реальная HRW статья 28.02.2019, упоминает Oxymiron в защиту Husky |
| 5 | rferl.org/.../32070998.html | ⚠️ UNVERIFIED | 403 forbidden (geo-block likely). URL формат корректный, не верифицирован. **Рекомендация:** оставить с пометкой `access_restricted` или дублировать через web.archive.org snapshot |
| 6 | meduza.io/en/news/2022/10/07/oxxxymiron-and-dmitry-glukhovsky-declared-foreign-agents | ✅ CONFIRMED | Реальная Meduza статья 7.10.2022 |
| 7 | re-russia.net/en/analytics/0350/ | ✅ CONFIRMED | Реальная статья (опубликована 20.10.2025, дата accessed в frontmatter 8.04.2026 — хронология ОК). Title в frontmatter совпадает |
| 8 | nme.com/.../3184465 | ✅ CONFIRMED | Реальная NME статья 17.03.2022 про Стамбульский концерт |
| 9 | themoscowtimes.com/2022/03/16/.../a76960 | ✅ CONFIRMED | Реальная Moscow Times статья 16.03.2022, автор Samantha Berkhead |
| 10 | digitalmusicnews.com/2022/03/28/spotify-suspends-service-inside-russia/ | ⚠️ UNVERIFIED | 403 forbidden. URL формат корректный. **Рекомендация:** дублировать через web.archive.org или заменить на Reuters/AP coverage Spotify suspension |

**Итого:** 6 CONFIRMED, 1 FABRICATED, 1 PARTIAL, 2 UNVERIFIED (по геоблокам, а не подделке).

## C. Fabricated Metrics

| ID | Метрика в лонгриде | Verdict | Действие |
|----|---------------------|---------|----------|
| M1 | «Computational analysis identifies 23 phrases and metaphorical structures that directly correlate with events from February-October 2022» | ❌ FABRICATED | Источник не найден ни в одном поиске. **Удалить** или заменить на реальный анализ с указанием методики и кода |
| M2 | «300% increase in underground sharing of «Организация» following foreign agent designation» | ❌ FABRICATED | Источник не найден. **Удалить** или заменить на реальные стриминговые данные (Spotify, Yandex.Music — если доступны) |

## D. Lyrical Citations Gap

Лонгрид содержит секцию **«Lyrical Themes in 'Организация'»** (строки 143-155) — но **ни одной цитаты из песни**. Только обобщённые тематические описания («Organizational Structures», «State-Society Tension», «Cultural Resistance», «Temporal Urgency»).

Без конкретных цитат — claim о «прескиентности» песни не верифицируется. Underground music curator quote (строка 209) — анонимный, не верифицируется.

**Status текста:** WebFetch блокирует получение полного текста (copyright filter). Известные источники: Genius, lyricsroll, hiphop4real, lyrics.ws, txt-music.ru, YouTube official channel oxxxymironofficial.

**Рекомендация:**
1. Получить полный текст песни локально (у Андрея или manual lookup)
2. Сохранить в `_meta/sources/organizatsiya-lyrics-2021.md` с атрибуцией
3. Цветик переписывает «Lyrical Themes» секцию с 3-5 конкретными цитатами + аналитическим комментарием
4. Соответствие internal citation compliance rules (copyrighted work — до 300 слов прозы / до 3 строк поэзии для современных произведений; см. internal compliance documentation)

## E. Contextual Misframing

| # | Утверждение в лонгриде | Реальность | Действие |
|---|------------------------|------------|----------|
| C1 | «miXXXtape III delivered a complete cultural statement whose thematic architecture would map onto the civilizational upheaval» (строка 159) | miXXXtape III = **compilation** из 36 треков 2014-2021 + только 2 новых (одна из них «Организация»). Не «complete cultural statement» новой работы. | Уточнить: прескиентным был **сингл «Организация»**, mixtape — выборка карьерных треков с 2 новинками |
| C2 | «Организация» позиционируется как первое прескиентное высказывание | Fontanka 8.11.2021: «Организация» — это **второй сингл** с нового альбома. Первый был «Цунами». | Добавить контекст про «Цунами» как первый сингл; отметить что цикл прескиентности шире одного трека |

## F. Phase3 Untracked File

`content/investigations/organizatsiya-phase3-tim-roho-integration.md` (120 строк, untracked):
- Содержит подписи `// Цветик` `// Фонарщик` — leak агентских маркеров
- Контент уже **частично интегрирован** в основной лонгрид (Tim ROHO секция, строки 267-287)
- Не в git index = не задеплоен (хорошо)

**Решение (на твой выбор):**
- (a) **Удалить файл** — контент уже в лонгриде, дубликат не нужен
- (b) **Переместить в `_meta/drafts/`** без подписей — сохранить как editorial reference
- (c) **Восстановить как отдельную статью** про Tim ROHO + интеграцию в новой структуре

## G. Sources Не упомянутые в лонгриде, но релевантные

При verification обнаружились дополнительные источники, которые усиливают research base:
- **Iz.ru 8.11.2021** — «Рэпер Оксимирон выпустил трек «Организация»» — независимое подтверждение даты
- **Show-biz.by** — каталогизирует выход трека 8.11.2021
- **The-flow.ru** — публикация про клип «Организация» с production credits
- **Apple Music music-video URL** — `music.apple.com/ru/music-video/.../1699493436` — официальная страница клипа
- **Spotify track URL** — `open.spotify.com/track/18OGgA3bRnZEQEj2ri3ZPf`

Можно добавить 2-3 в frontmatter для усиления credibility.

## Verdict

| Категория | Severity |
|-----------|----------|
| Базовая фактология | ✅ ОК — публикабельна |
| URL #2 (allmusic 404) | 🔴 BLOCKER — заменить или удалить |
| Метрики M1, M2 | 🔴 BLOCKER — фабрикация, удалить |
| Lyrical citations gap | 🟡 IMPORTANT — credibility issue |
| Mixtape vs album фрейминг | 🟡 IMPORTANT — точностное искажение |
| Контекст «Цунами» | 🟢 NICE-TO-HAVE — усиление |
| Phase3 untracked файл | 🟡 IMPORTANT — leak маркеров |
| URL #1 fontanka title/type | 🟢 NICE-TO-HAVE — точность frontmatter |

**Не блокеры публикации** (clarification per Андрей 20.04.2026):
- Поздние скандалы автора (вне scope исследования)
- Репутационные/PR риски (не критерий FolkUp)
- WebFetch недоступность 2 sources (geo-block, не fabrication)

## Recommended Next Steps

1. **Немедленно:** убрать M1 («23 phrases») и M2 («300% increase») из лонгрида — простой Edit
2. **Немедленно:** заменить allmusic URL #2 на реальный
3. **Решение по phase3 файлу** — твой выбор (a/b/c)
4. **Editorial task для Цветика:** получить текст песни + добавить 3-5 цитат в lyrical analysis секцию
5. **Editorial task для Наборщика:** уточнить mixtape vs album фрейминг + добавить контекст «Цунами»
6. **После пунктов 1-5:** статус `verified` оправдан. Оставить.
