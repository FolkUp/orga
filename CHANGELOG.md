# Changelog

All notable changes to the ORGA project.

## [Unreleased] - astro-rebuild-safe branch

### Added
- Astro 5.18.1 migration foundation (Phase 0)
- AudioStoryPlayer component (multimedia audio storytelling with synchronized transcript)
- EvidenceGallery component (interactive evidence presentation system)
- FolkUp Brand Guide v2.5 token integration
- Test pages for component validation (test-audio-story.astro, test-evidence-gallery.astro)
- Comprehensive demo content for investigation storytelling

### Fixed
- SVG malformed elements in AudioStoryPlayer (folder → path tags)
- Focus trap implementation in EvidenceGallery modal
- Chapter marker positioning (migrated from CSS to JavaScript)
- WCAG 2.1 AA accessibility foundations

### Known Issues
- i18n system broken (all keys return "not found")
- CSS variable naming mismatch (--color-accent-primary vs --color-primary-500)
- Missing variables.css file import (404 runtime error)

## [1.0.0] - 2026-04-08 (main branch, Hugo)

### Added
- Phase 4 Production Excellence (CSP, HSTS, security headers)
- Phase 1 Content Excellence (evidence integrity improved to 52%)
- Interactive Cultural Timeline Chart
- Complete content migration from lucerna repository
- Blowfish theme integration with FolkUp branding
- Multi-language support (RU/EN)
- Banking-level compliance (GDPR, EU AI Act Article 50)

### Fixed
- Cross-repository link assessment (zero emergency fixes required)
- Git history preservation during migration
- Hugo build optimization (0 errors, 0 warnings)

### Infrastructure
- OAuth2-proxy integration ready (auth.folkup.app)
- orga.folkup.app domain configuration pending
- CI/CD pipeline architecture defined

## [0.1.0-alpha] - 2026-04-04

### Added
- Initial project structure and migration from lucerna
- Basic Hugo configuration with Blowfish theme
- Core investigation content (35.5KB)
- Interactive timeline data structure
- Project documentation and context files

---

**Note**: Version 1.0.0 represents the Hugo-based production system. Astro migration (unreleased) represents the next-generation multimedia journalism platform currently in development.