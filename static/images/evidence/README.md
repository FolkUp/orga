# Evidence Images Directory

This directory contains evidence screenshots and documentation images for ORGA investigations.

## Current Evidence Files

For current ORGA investigations:

### Analysis Images
- `oxymiron-album-analysis.webp` - Album cover and tracklist analysis
- `lyrical-correlation-matrix.webp` - Computational analysis of lyrical themes
- `streaming-patterns-2021.webp` - Platform streaming data from Nov 2021

### Geopolitical Context
- `geopolitical-context.webp` - Timeline correlation with Ukraine invasion
- `platform-response-feb.webp` - Platform censorship response February 2022

### Official Documentation
- `foreign-agent-document.webp` - Russian Ministry of Justice designation
- `censorship-timeline.webp` - Comprehensive platform censorship timeline

## File Naming Conventions

Evidence files should follow these naming patterns:

- **Primary Evidence**: `subject-type-identifier.webp`
- **Analysis**: `analysis-type-subject.webp`
- **Documents**: `document-type-date.webp`
- **Screenshots**: `platform-action-date.webp`

### Legacy Format Examples:
- `spotify-metadata-oxymiron-20241215.webp`
- `apple-music-album-title-20241215.webp`
- `youtube-official-channel-20241215.webp`
- `yandex-music-track-info-20241215.webp`

## Technical Requirements

- **Format**: WebP for optimal compression and quality
- **Resolution**: Minimum 1200px wide for detailed viewing
- **Compression**: Quality 85-90 for balance of size/clarity
- **Accessibility**: Descriptive filenames for screen readers

## Integration with Timeline

Evidence images are automatically linked to timeline events based on:

1. **Filename patterns** - Images with keywords automatically associate
2. **Manual configuration** - Timeline events specify related evidence
3. **Smart filtering** - Gallery filters evidence by timeline selection

## Hugo Image Processing

Images are automatically processed by Hugo with these variants:

- **Full**: 1200x WebP Q90 (lightbox viewing)
- **Thumbnail**: 400x WebP Q80 (gallery grid)
- **Micro**: 150x WebP Q75 (carousel indicators)

## Usage in Shortcodes

### Enhanced Evidence Gallery
```html
{{</* enhanced-evidence-gallery
   images="analysis1.webp,document2.webp,screenshot3.webp"
   timeline-events="event1,event2"
*/>}}
```

### Legacy Evidence Gallery
```html
{{</* evidence-gallery images="spotify-metadata.webp,apple-music-album.webp" */>}}
```

## Legal Compliance

- Screenshots used under fair use for journalistic/educational purposes
- Platform interfaces captured for factual reporting
- No commercial redistribution of copyrighted content
- Attribution provided where required