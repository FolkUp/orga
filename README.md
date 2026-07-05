# ORGA — Underground Academia

> Платформа культурной сейсмографии. Статический Astro-сайт, русский как основной язык, английский как вторичный.
>
> Production: **[underground.folkup.life](https://underground.folkup.life)**
>
> **Текущая фаза:** 3C — статическая Astro-сборка на **Cloudflare Pages canonical** (post-INC-006 2026-06-07, CX33 decommissioned); legal + longform коллекции наполнены (7 longreads live); @fontsource self-hosted typography (ORGA-098, 2026-05-20).

[![Astro 5](https://img.shields.io/badge/Astro-5.18-BC52EE?logo=astro&logoColor=white)](https://astro.build/)
[![License: MIT](https://img.shields.io/badge/Code-MIT-blue.svg)](LICENSE)
[![License: CC BY 4.0](https://img.shields.io/badge/Content-CC_BY_4.0-green.svg)](LICENSE-CONTENT)

## О проекте

Underground Academia — исследовательская платформа, фиксирующая подземные культурные сдвиги до того, как они проявляются на поверхности.

**Longform collection (7 pieces LIVE):**
- «Организация» Оксимирона (RU + EN) — 333-дневная сейсмографическая дуга (первый лонгрид)
- **FolkUp book series companion** «Как жить умно и свободно» — 4 первой волны, по одному лонгриду на кн.1/2/3/5 трилогии Agile Sapiens (cont +46 2026-07-04):
  - Палимпсест Архимеда: посчитайте руки (кн.5)
  - Письмо из одних согласных (кн.2)
  - Лайнер или архипелаг (кн.3)
  - Вам продали обратно то, что вы умели с детства (кн.1)
- **Серия «Что осталось за переплётом»** (счётчик 3/7) — реальные истории, не вошедшие в книги:
  - Человек, который купил Архимеда — и раздал (кн.5)
  - Рай по предоплате (кн.3)

## Многомерный анализ "Организация"

Проект расширения существующего лонгрида четырёхмерным анализом песни Оксимирона:
- **🎵 Виленский** — музыкальная сейсмография, аккордовые прогрессии, культурное предсказание
- **🎭 Цветик** — поэтическая архитектура, дольник, связь с серебряным веком
- **⚡ КиберГонзо** — OSINT культурная сейсмография, верификация tremors 2021-2022
- **📚 Архивариус** — исторический контекст, культурные прецеденты

**Статус:** Первый лонгрид опубликован; четырёхмерное расширение — внутренняя редакционная методология (применяется при подготовке текста; не отдельные публичные ленты).

Методология сочетает академическую строгость с независимостью от институциональных рамок: banking-level верификация фактов, прозрачный редакционный процесс, OSINT-подход к первоисточникам.

## Технологический стек

- **[Astro 5.18](https://astro.build/)** — статический сайт-генератор (`output: 'static'`)
- **Content Collections (Zod)** — типизированные коллекции: `longform`, `legal`
- **Svelte 5** — островная интерактивность (где нужна)
- **@astrojs/sitemap** — bilingual URLs с `hreflang` alternates + `<lastmod>` per URL
- **@astrojs/mdx** — расширенный Markdown для контента
- **Self-hosted typography** — `@fontsource/playfair-display` + `@fontsource/source-sans-3` (latin + cyrillic subsets via `unicode-range`); никаких third-party CDN-запросов на шрифты
- **Hosting:** Hetzner VPS (nginx + Docker bind-mount) за `nginx-proxy` + Cloudflare TLS proxy в front

## Структура репозитория

```
orga/
├── astro/                        # Astro-проект (основной)
│   ├── src/
│   │   ├── content/              # контент-коллекции
│   │   │   ├── longform/         # премиум-лонгриды (bilingual)
│   │   │   └── legal/            # юридические документы (EN + ru/ mirror)
│   │   ├── layouts/              # BaseLayout, PremiumLongformLayout
│   │   ├── pages/                # маршруты (dynamic [...slug])
│   │   └── components/           # Svelte + Astro-компоненты
│   ├── public/                   # статические ассеты (_headers, robots.txt, PDF)
│   ├── astro.config.mjs
│   └── package.json
├── scripts/                      # backup + access-management скрипты
├── audit/                        # UX/accessibility audit harness (Playwright + axe-core via NODE_PATH bridge к ../../dayforge)
├── docs/audit/                   # дата-проштампованные SUMMARY.md по результатам аудита; raw артефакты gitignore'нуты
├── _meta/                        # внутренние заметки, экспертные ревью, аудит (не деплоится)
│   └── archive/                  # исторические артефакты (Hugo era, self-hosted deploy)
├── LICENSE                       # MIT для исходного кода
└── LICENSE-CONTENT               # CC BY 4.0 для контента
```

## Языковая политика

- **RU** — основной язык. URL без префикса: `/longform/organizatsiya/`, `/legal/privacy-policy/` — русская версия (где она есть).
- **EN** — вторичный. URL с префиксом `/en/` или `/legal/en/` для синхронных переводов.
- **hreflang x-default = RU** для SEO-сигнала.
- Португальский и другие языки в scope проекта не входят.

## Разработка

Предполагается установленный Node.js 20+.

```bash
# Установка зависимостей
cd astro
npm install

# Dev-сервер (http://localhost:4321)
npm run dev

# Продакшен-сборка (в astro/dist/)
npm run build

# Локальный просмотр собранного
npm run preview

# Типовая проверка Astro + Zod
npm run check
```

## Деплой

Production разворачивается на **self-hosted infrastructure** (Hetzner VPS) с полной интеграцией в FolkUp экосистему. Build pipeline: GitHub Actions → rsync → nginx-proxy + Let's Encrypt.

Security headers (CSP, HSTS, Permissions-Policy) — обслуживаются nginx-proxy на HTTP-уровне в рамках unified FolkUp infrastructure pattern.

Migration от Cloudflare Pages завершена 2026-04-28. Migration-era артефакты сохранены в `_meta/archive/` (общая) и `_meta/archive/dns-flip-2026-05/` (DNS-flip one-shots). Unified infrastructure обеспечивает консистентность со всеми FolkUp проектами.

## Авторская разметка

Frontmatter-схемы определены в `astro/src/content/config.ts`. Полный список полей — см. Zod-схему.

Ключевые коллекции:

- `longform/` — премиум-лонгриды в жанре personal-essay-criticism. Обязательна banking-level верификация (fact/legal/editorial/hostile reviewed).
- `legal/` — юридические документы с `language` и `translations` (sibling-slug pointer).

Переводы: suffix-паттерн (`organizatsiya.en.md`) для longform; nested-folder (`legal/ru/privacy-policy.md`) для legal — каждый путь даёт тот URL, который вы видите.

## Редакционный процесс

Каждый опубликованный лонгрид проходит через цепочку:

1. **Fact verification** — каждая дата, цифра, атрибуция сверяется с независимыми источниками
2. **Legal review** — PII-аудит, naming-justification (тройной тест), risk-classification
3. **Editorial review** — стиль, согласованность, fact-checking финального текста
4. **Hostile review** — adversarial агенты ищут слабые места и compliance-пробелы
5. **Final editorial pass** — человек-редактор принимает или откатывает все правки

Подробнее о применении автоматизированных инструментов: [/legal/ai-transparency/](https://underground.folkup.life/legal/ai-transparency/) (EU AI Act Art. 50 transparency).

## Лицензии

- **Исходный код:** [MIT](LICENSE)
- **Контент** (тексты расследований, лонгриды, данные): [Creative Commons BY 4.0](LICENSE-CONTENT)

Третьеcторонние зависимости — см. `astro/package.json` и их соответствующие лицензии.

## Контакт

- Общие вопросы: `contact@folkup.app`
- Редакторская обратная связь и сообщения об ошибках: `contact@folkup.app`
- Часть экосистемы [FolkUp](https://folkup.app)

## Ссылки

- [Privacy Policy](https://underground.folkup.life/legal/privacy-policy/)
- [Terms of Use](https://underground.folkup.life/legal/terms-of-use/)
- [Cookie Policy](https://underground.folkup.life/legal/cookie-policy/)
- [AI Transparency](https://underground.folkup.life/legal/ai-transparency/)

---

*Last updated: 2026-07-04 · Doc version: 5.4 (post-cont +46 longform batch: 7 pieces LIVE including FolkUp book series companions «Как жить умно и свободно» + серия «Что осталось за переплётом»; Phase 3C = **CF Pages canonical** post-INC-006 2026-06-07 CX33 decommissioned; commits 7380984→4ffde56)*
*Prior: Doc version 5.3 2026-05-22 — post-ORGA-094 UX audit harness + accessibility batch ORGA-107..116 (color-contrast, focus-not-obscured SC 2.4.11, text-spacing clean, audit harness 128/128; commits 78c6e34→b5868c3)*
