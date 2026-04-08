# Orga — Культурная сейсмография

[![Hugo](https://img.shields.io/badge/Hugo-Extended-0052CC?style=flat&logo=hugo)](https://gohugo.io/)
[![Blowfish](https://img.shields.io/badge/Theme-Blowfish-blueviolet)](https://github.com/nunocoracao/blowfish)
[![License](https://img.shields.io/badge/License-CC_BY_4.0-green.svg)](https://creativecommons.org/licenses/by/4.0/)

Мультимедийное расследование культурного феномена: как художники интуитивно улавливают культурные изменения до их массового проявления.

## 🎯 Проект

Исследование песни Оксимирона и смены названия как примера "культурной сейсмографии" — способности художников чувствовать подземные толчки культурных сдвигов до их проявления на поверхности.

### Ключевые особенности

- **Интерактивная временная шкала** с многоуровневым анализом
- **Мультимедийный лонгрид** с видео, аудио и визуальными материалами
- **Культурная аналитика** на базе OSINT-методологии
- **Трёхъязычная поддержка** (RU/PT/EN)

## 🏗️ Технологии

- [Hugo](https://gohugo.io/) с расширенной сборкой
- Тема [Blowfish](https://github.com/nunocoracao/blowfish)
- Мультиязычная архитектура (i18n)
- Интерактивные компоненты и визуализации

## 🚀 Запуск

```bash
# Клонирование
git clone https://github.com/FolkUp/orga.git
cd orga

# Локальный сервер разработки
hugo server -D

# Сборка для продакшена
hugo --gc --minify
```

## 📁 Структура

```
orga/
├── content/
│   └── investigations/     # Основное расследование
├── data/
│   └── oxymiron_timeline.yaml  # Интерактивная временная шкала
├── static/
│   └── media/             # Мультимедийные ресурсы
├── layouts/               # Кастомные шаблоны
└── config/                # Конфигурация Hugo
```

## 🎨 Дизайн-система

Проект следует [Brand Guide v2.5](https://docs.folkup.app/brand/) FolkUp:
- Палитра D (тёмная тема по умолчанию)
- Типографика: Inter + Source Serif Pro
- WCAG 2.1 AA compliance

## 📄 Лицензия

- **Контент**: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- **Код**: [MIT License](LICENSE)

## 🔗 Связь

- **Сайт**: [orga.folkup.app](https://orga.folkup.app/)
- **Экосистема**: [FolkUp](https://folkup.app/)
- **Поддержка**: [Ko-fi](https://ko-fi.com/folkup)

---

*Часть экосистемы [FolkUp](https://folkup.app/) — платформы для исследовательской журналистики и культурной аналитики.*