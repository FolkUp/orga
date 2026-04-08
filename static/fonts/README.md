# ORGA Project Fonts

## Overview
Optimized woff2 font files for ORGA Hugo project. All fonts sourced from Google Fonts API with Latin Extended subset.

## Files

### Inter Font Family
- `inter-regular.woff2` (400) - 1.6KB
- `inter-medium.woff2` (500) - 1.6KB
- `inter-bold.woff2` (700) - 1.6KB
- `inter-black.woff2` (900) - 1.6KB

### Source Serif Pro Font Family
- `source-serif-pro-regular.woff2` (400) - 1.6KB
- `source-serif-pro-bold.woff2` (700) - 1.6KB
- `source-serif-pro-italic.woff2` (400 italic) - 1.6KB

## Usage

Include `fonts.css` in your Hugo layout:

```html
<link rel="stylesheet" href="/fonts/fonts.css">
```

Or add to your SCSS/CSS:

```css
@import url('/fonts/fonts.css');

body {
  font-family: 'Inter', sans-serif;
}

article {
  font-family: 'Source Serif Pro', serif;
}
```

## Optimization Details

- **Format:** WOFF2 (highest compression)
- **Subset:** Latin Extended (optimized for European languages)
- **Font Display:** swap (prevents invisible text while loading)
- **Total Size:** 36KB (all 7 variants combined)
- **Average per file:** 4-5KB on disk (~1.6KB actual)

## Source
- **Provider:** Google Fonts API (fonts.gstatic.com)
- **License:** Open Source (Ofl.txt)
- **Download Date:** 2026-04-08

## Performance Notes

- WOFF2 has 95%+ browser support (all modern browsers)
- `font-display: swap` ensures text is readable during font loading
- Total payload is minimal (<50KB total) for excellent Core Web Vitals
- Latin Extended subset removes unnecessary glyphs (Cyrillic, Greek, CJK)

## Integration

1. Copy all .woff2 files to `/static/fonts/`
2. Add fonts.css link to base layout template
3. Use font names in CSS: `font-family: 'Inter', sans-serif;`
4. Test font loading in Hugo build: `hugo server`
