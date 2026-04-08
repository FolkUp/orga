# Evidence Image Placeholder Script

This document outlines the placeholder evidence images needed for the enhanced timeline demo. These would typically be actual screenshots and documents, but for demonstration purposes, we need placeholder images.

## Required Evidence Files

### Primary Analysis Images
1. `oxymiron-album-analysis.webp` - Album cover analysis with tracklist
2. `streaming-patterns-2021.webp` - Platform streaming data from November 2021
3. `lyrical-correlation-matrix.webp` - Computational lyrical theme analysis

### Geopolitical Context Images
4. `geopolitical-context.webp` - Timeline correlation with Ukraine invasion
5. `platform-response-feb.webp` - Platform censorship response February 2022

### Official Documentation
6. `foreign-agent-document.webp` - Russian Ministry of Justice designation
7. `censorship-timeline.webp` - Comprehensive platform censorship timeline

## Image Creation Script

To create placeholder images for development, use the following approach:

### Using ImageMagick (if available)
```bash
# Create placeholder evidence images with text
convert -size 800x600 xc:white \
  -pointsize 40 -fill black \
  -annotate +50+300 "Oxymiron Album Analysis\nmiXXXtape III\nNovember 12, 2021" \
  oxymiron-album-analysis.webp

convert -size 800x600 xc:lightblue \
  -pointsize 30 -fill darkblue \
  -annotate +50+200 "Streaming Patterns Analysis\nNovember 2021\nPlatform Data Visualization" \
  streaming-patterns-2021.webp

convert -size 800x600 xc:lightgreen \
  -pointsize 25 -fill darkgreen \
  -annotate +50+150 "Lyrical Correlation Matrix\nComputational Analysis\nThematic Structure Mapping\nPredictive Pattern Detection" \
  lyrical-correlation-matrix.webp

convert -size 800x600 xc:lightyellow \
  -pointsize 35 -fill orange \
  -annotate +50+250 "Geopolitical Context\nFebruary 24, 2022\nUkraine Invasion Timeline" \
  geopolitical-context.webp

convert -size 800x600 xc:lightcoral \
  -pointsize 30 -fill darkred \
  -annotate +50+200 "Platform Response\nFebruary 2022\nCensorship Acceleration\nContent Removal Data" \
  platform-response-feb.webp

convert -size 800x600 xc:lightgray \
  -pointsize 25 -fill black \
  -annotate +50+150 "Foreign Agent Document\nMinistry of Justice\nOctober 7, 2022\nOfficial Designation\nState Response Analysis" \
  foreign-agent-document.webp

convert -size 800x600 xc:lavender \
  -pointsize 20 -fill purple \
  -annotate +50+100 "Comprehensive Censorship Timeline\n2021-2022 Platform Response Analysis\nAutomatic Content Detection\nGeographic Restrictions\nDemonetization Patterns\nRemoval Statistics" \
  censorship-timeline.webp
```

### Alternative: CSS-Generated Placeholders

For web development without ImageMagick, create CSS-based placeholders that can be screenshot:

```html
<div style="width:800px;height:600px;background:white;padding:50px;font-family:Arial;">
  <h2>Oxymiron Album Analysis</h2>
  <p>miXXXtape III<br>November 12, 2021</p>
  <p>Tracklist analysis and thematic correlation</p>
</div>
```

## Usage in Development

Once placeholder images are created, place them in:
```
/static/images/evidence/
```

The enhanced evidence gallery will automatically process these through Hugo's image processing pipeline to create the required variants (full, thumbnail, micro).

## Production Replacement

In production, replace these placeholders with:

1. **Actual Screenshots**: Platform interfaces, official documents
2. **Data Visualizations**: Charts, graphs, analysis results
3. **Document Scans**: Legal papers, official notices
4. **Interface Captures**: Censorship evidence, platform changes

Ensure all production images meet the technical requirements:
- WebP format
- Minimum 1200px width
- Quality 85-90 compression
- Descriptive filenames
- Proper accessibility alt text