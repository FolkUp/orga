# ORGA — Underground Academia

> Платформа культурной сейсмографии. Статический Astro-сайт, русский как основной язык, английский как вторичный.
>
> Production: **[underground.folkup.life](https://underground.folkup.life)**

[![Astro 5](https://img.shields.io/badge/Astro-5.18-BC52EE?logo=astro&logoColor=white)](https://astro.build/)
[![License: MIT](https://img.shields.io/badge/Code-MIT-blue.svg)](LICENSE)
[![License: CC BY 4.0](https://img.shields.io/badge/Content-CC_BY_4.0-green.svg)](LICENSE-CONTENT)

## О проекте

Underground Academia — исследовательская платформа, фиксирующая подземные культурные сдвиги до того, как они проявляются на поверхности. Первый лонгрид — «Организация» Оксимирона как случай 333-дневной сейсмографической дуги (ноябрь 2021 → октябрь 2022).

Методология сочетает академическую строгость с независимостью от институциональных рамок: banking-level верификация фактов, прозрачный редакционный процесс, OSINT-подход к первоисточникам.

## Технологический стек

- **[Astro 5.18](https://astro.build/)** — статический сайт-генератор
- **Content Collections (Zod)** — типизированные коллекции: `longform`, `investigations`, `legal`
- **Svelte 5** — островная интерактивность (где нужна)
- **@astrojs/sitemap** — sitemap с bilingual URLs
- **@astrojs/mdx** — расширенный Markdown для контента
- **Системные шрифты** (Georgia, system-ui) — нулевой сетевой запрос на шрифты
- **Hosting:** Cloudflare Pages

## Структура репозитория

```
orga/
├── astro/                        # Astro-проект (основной)
│   ├── src/
│   │   ├── content/              # контент-коллекции
│   │   │   ├── longform/         # премиум-лонгриды (bilingual)
│   │   │   ├── investigations/   # расследования
│   │   │   └── legal/            # юридические документы (RU + EN)
│   │   │       └── ru/           # русские версии legal
│   │   ├── layouts/              # BaseLayout, PremiumLongformLayout, InvestigationLayout
│   │   ├── pages/                # маршруты (dynamic [...slug])
│   │   └── components/           # Svelte + Astro-компоненты
│   ├── public/                   # статические ассеты (_headers, robots.txt, PDF)
│   ├── astro.config.mjs
│   └── package.json
├── deploy/                       # серверная инфраструктура (nginx, DNS, self-hosted fallback)
├── scripts/                      # backup + access-management скрипты
├── _meta/                        # внутренние заметки, экспертные ревью, аудит (не деплоится)
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

Production разворачивается **Cloudflare Pages** автоматически при push в ветку `main` (или настроенную deploy-branch в Cloudflare UI). Build-команда: `cd astro && npm run build`, output: `astro/dist/`.

Security headers (CSP, HSTS, Permissions-Policy, Cache-Control) — в `astro/public/_headers`, обслуживаются Cloudflare Pages на HTTP-уровне.

Альтернативный self-hosted вариант — в `deploy/` (nginx-конфиг, DNS-скрипт, инструкция). Используется как fallback.

## Авторская разметка

Frontmatter-схемы определены в `astro/src/content/config.ts`. Полный список полей — см. Zod-схему.

Ключевые коллекции:

- `longform/` — премиум-лонгриды в жанре personal-essay-criticism. Обязательна banking-level верификация (fact/legal/editorial/hostile reviewed).
- `investigations/` — расследования с уровнями confidence (high/medium/low) и status (verified/partially_verified/unverified/draft).
- `legal/` — юридические документы с `language` и `translations` (sibling-slug pointer).

Переводы: suffix-паттерн (`organizatsiya.en.md`) для longform и investigations; nested-folder (`legal/ru/privacy-policy.md`) для legal — каждый путь даёт тот URL, который вы видите.

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
- Расследования и редакторская обратная связь: `contact@folkup.app`
- Часть экосистемы [FolkUp](https://folkup.app)

## Ссылки

- [Privacy Policy](https://underground.folkup.life/legal/privacy-policy/)
- [Terms of Use](https://underground.folkup.life/legal/terms-of-use/)
- [Cookie Policy](https://underground.folkup.life/legal/cookie-policy/)
- [AI Transparency](https://underground.folkup.life/legal/ai-transparency/)

---

*Last updated: 2026-04-20 · Commit: [`499be21`](https://github.com/FolkUp/orga/commit/499be21) · Doc version: 2.0 (post-Hugo cleanup)*
