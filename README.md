# Underground Academia · Независимая longform-платформа FolkUp

[![License MIT (code)](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![License CC BY-SA 4.0 (content)](https://img.shields.io/badge/content-CC%20BY--SA%204.0-green.svg)](LICENSE-CONTENT)
[![Site](https://img.shields.io/badge/live-underground.folkup.life-blue.svg)](https://underground.folkup.life)
[![DMCA Policy](https://img.shields.io/badge/DMCA-info%40folkup.app-lightgrey.svg)](DMCA.md)

**Astro 5 SSG для лонгридов, OSINT-исследований, эссе за переплётом книг FolkUp. Не корпоративное медиа, не университетский журнал — независимая kitchen-table academia на русском языке.**

## About / Manifesto

«Underground Academia» — не про эстетику андеграунда 90-х. Про academic mode of inquiry вне institutional gatekeeping:

- Longform, а не clickbait
- Argument с evidence, а не op-ed с эмоцией
- CC BY-SA 4.0 — knowledge should propagate, not gatekeep

Формат: essays (5000–15000 слов), OSINT investigations, критические анализы.

LIVE at [underground.folkup.life](https://underground.folkup.life).

Автор — Команданте FolkUp (Команданте FolkUp is a literary pseudonym; legal identification and AI-use disclosure: [/legal/ai-transparency/](https://underground.folkup.life/legal/ai-transparency/)).

## Опубликованные лонгриды

- **«Организация» Оксимирона** (RU + EN) — культурная сейсмография
- **Companion-серия к трилогии Agile Sapiens** «Как жить умно и свободно»:
  - Палимпсест Архимеда: посчитайте руки (кн.5)
  - Письмо из одних согласных (кн.2)
  - Лайнер или архипелаг (кн.3)
  - Вам продали обратно то, что вы умели с детства (кн.1)
- **Серия «Что осталось за переплётом»** — реальные истории, не вошедшие в книги:
  - Человек, который купил Архимеда — и раздал (кн.5)
  - Рай по предоплате (кн.3)

## Стек

- **[Astro 5.18](https://astro.build/)** — статический сайт-генератор (`output: 'static'`)
- **Content Collections (Zod)** — типизированные коллекции: `longform`, `legal`
- **Svelte 5** — островная интерактивность (где нужна)
- **@astrojs/sitemap** — bilingual URLs с `hreflang` alternates + `<lastmod>` per URL
- **@astrojs/mdx** — расширенный Markdown для контента
- **Self-hosted typography** — `@fontsource/playfair-display` + `@fontsource/source-sans-3` (latin + cyrillic subsets via `unicode-range`); никаких third-party CDN-запросов на шрифты
- **Hosting:** Cloudflare Pages (canonical post-INC-006 2026-06-07)

## Разработка

Node.js 20+ required.

```bash
cd astro
npm install

npm run dev        # Dev-сервер (http://localhost:4321)
npm run build      # Продакшен-сборка (astro/dist/)
npm run preview    # Локальный просмотр собранного
npm run check      # Типовая проверка Astro + Zod
```

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
├── translations/                 # multi-language translation packages (см. translations/README.md)
├── LICENSE                       # MIT для исходного кода
├── LICENSE-CONTENT               # CC BY-SA 4.0 для контента
└── DMCA.md                       # DMCA policy
```

## Языковая политика

- **RU** — основной язык. URL без префикса: `/longform/organizatsiya/`, `/legal/privacy-policy/` — русская версия (где она есть).
- **EN** — вторичный. URL с префиксом `/en/` или `/legal/en/` для синхронных переводов.
- **hreflang x-default = RU** для SEO-сигнала.
- Португальский и другие языки в scope проекта не входят.

## Deploy

Production runs on **Cloudflare Pages** (canonical post-INC-006 2026-06-07). Push to `main` triggers GitHub Actions build + `wrangler pages deploy`.

Security headers (CSP, HSTS, Permissions-Policy) обслуживаются через `_headers` файл в CF Pages.

## Авторская разметка

Frontmatter-схемы определены в `astro/src/content/config.ts`. Полный список полей — см. Zod-схему.

Ключевые коллекции:

- `longform/` — премиум-лонгриды в жанре personal-essay-criticism. Обязательна banking-level верификация (fact / legal / editorial / hostile reviewed).
- `legal/` — юридические документы с `language` и `translations` (sibling-slug pointer).

Переводы: suffix-паттерн (`organizatsiya.en.md`) для longform; nested-folder (`legal/ru/privacy-policy.md`) для legal — каждый путь даёт тот URL, который вы видите.

## Редакционный процесс

Каждый опубликованный лонгрид проходит через цепочку:

1. **Fact verification** — каждая дата, цифра, атрибуция сверяется с независимыми источниками
2. **Legal review** — PII-аудит, naming-justification, risk-classification
3. **Editorial review** — стиль, согласованность, fact-checking финального текста
4. **Hostile review** — adversarial проверки на слабые места и compliance-пробелы
5. **Final editorial pass** — человек-редактор принимает или откатывает все правки

Подробнее о применении автоматизированных инструментов: [/legal/ai-transparency/](https://underground.folkup.life/legal/ai-transparency/) (EU AI Act Art. 50 transparency).

## Related projects (FolkUp Ecosystem)

- [folkup-books-portal](https://github.com/FolkUp/folkup-books-portal) — books.folkup.life (портал семикнижной серии)
- [agile-sapiens](https://github.com/FolkUp/agile-sapiens) — kn.1 monograph source
- [folkup-landing](https://github.com/FolkUp/folkup-landing) — FolkUp ecosystem entry point

Full ecosystem map: [folkup.app](https://folkup.app).

## Licensing

Dual-licensed following the FolkUp ecosystem canon:

- **Code (Astro components, Svelte islands, scripts, config, workflows)** — MIT.
  See [`LICENSE`](./LICENSE).
- **Content (longforms, OSINT investigations, essays, legal documents)** —
  Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0).
  See [`LICENSE-CONTENT`](./LICENSE-CONTENT).

Attribution format for CC BY-SA content:

> «Longform Title» by Команданте FolkUp, licensed under CC BY-SA 4.0.
> Source: https://github.com/FolkUp/orga/blob/main/astro/src/content/longform/<path>
> Modifications: [describe if any].

Copyright infringement notices → [`DMCA.md`](./DMCA.md) (GitHub referral +
direct contact `info@folkup.app`, subject: DMCA).

## Contributing

Pull requests welcomed. Content edits and code contributions: DCO Signed-off-by required.

## Contact

- Editorial / content: `info@folkup.app`
- DMCA / copyright: `info@folkup.app` (subject: DMCA) — see [`DMCA.md`](./DMCA.md)
- Publisher: Команданте FolkUp / FolkUp Ecosystem

---

**© 2026 Команданте FolkUp · Publisher: FolkUp Ecosystem · Content CC BY-SA 4.0 · Code MIT**
