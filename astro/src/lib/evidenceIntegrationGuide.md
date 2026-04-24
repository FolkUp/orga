# Evidence Gallery Integration Guide

## Overview

The ORGA Evidence Gallery is a comprehensive, WCAG 2.1 AA compliant evidence viewing system designed for cultural investigations. It provides advanced search, filtering, and modal viewing capabilities with full accessibility support and legal compliance framework.

## Architecture

### Component Structure

```
evidence/
├── EvidenceGallery.svelte         # Main gallery component
├── EvidenceModal.svelte           # Full-screen evidence viewer
├── EvidenceCard.svelte            # Individual evidence preview
├── EvidenceFilter.svelte          # Search and filtering controls
├── EvidenceSearch.svelte          # Advanced search functionality
└── EvidenceAccessibility.svelte   # Screen reader and a11y support
```

### Integration Layer

```
components/
└── EvidenceGalleryIntegration.astro  # Astro wrapper component

lib/
├── evidenceData.js                   # Data structure and utilities
└── evidenceIntegrationGuide.md       # This documentation

pages/
└── evidence-gallery-demo.astro      # Complete demo implementation
```

## Quick Start

### Basic Usage

```astro
---
// pages/investigation.astro
import EvidenceGalleryIntegration from '../components/EvidenceGalleryIntegration.astro';
import { sampleEvidenceData } from '../lib/evidenceData.js';
---

<EvidenceGalleryIntegration
  evidenceData={sampleEvidenceData}
  viewMode="grid"
  enableLazyLoading={true}
  itemsPerPage={12}
/>
```

### Custom Evidence Data

```javascript
// lib/customEvidenceData.js
export const customEvidence = [
  {
    id: "evidence-custom-001",
    title: "Custom Evidence Item",
    date: "2024-04-24",
    type: "media", // media, legal, social, academic, visual, document
    significance: "critical", // critical, primary, supporting, contextual
    source: "Original Research",
    description: "Detailed description of the evidence item...",
    culturalContext: "Cultural significance and analysis...",
    media: {
      type: "image",
      url: "/path/to/evidence.webp",
      thumbnail: "/path/to/thumbnail.webp",
      alt: "Descriptive alt text",
      caption: "Optional caption"
    },
    metadata: {
      verificationLevel: "primary-source",
      culturalImpact: "high",
      // Additional custom metadata
    },
    timelineConnection: ["2024-04-24"],
    heroConnection: ["scene-1"],
    tags: ["custom", "evidence", "research"],
    legal: {
      quotationLength: 150,
      purpose: "analysis",
      attribution: "Original research documentation",
      dateAccessed: "2024-04-24"
    }
  }
];
```

## Configuration Options

### EvidenceGalleryIntegration Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `evidenceData` | `Array` | `sampleEvidenceData` | Array of evidence items |
| `viewMode` | `'grid' \| 'list'` | `'grid'` | Initial display mode |
| `enableLazyLoading` | `boolean` | `true` | Enable lazy loading for performance |
| `itemsPerPage` | `number` | `12` | Items per page (if not lazy loading) |
| `timelineConnection` | `string \| null` | `null` | Initial timeline filter |
| `heroConnection` | `string \| null` | `null` | Initial hero scene filter |
| `initialFilter` | `string` | `'all'` | Initial significance filter |
| `initialSearch` | `string` | `''` | Initial search term |
| `className` | `string` | `''` | Additional CSS class |

### Evidence Data Schema

#### Required Fields

```typescript
interface EvidenceItem {
  id: string;                    // Unique identifier
  title: string;                 // Evidence title
  date: string;                  // ISO date string
  type: EvidenceType;           // Evidence category
  significance: SignificanceLevel; // Importance level
  source: string;               // Source attribution
  description: string;          // Evidence description
}

type EvidenceType = 'media' | 'legal' | 'social' | 'academic' | 'visual' | 'document';
type SignificanceLevel = 'critical' | 'primary' | 'supporting' | 'contextual';
```

#### Optional Fields

```typescript
interface EvidenceItemOptional {
  culturalContext?: string;     // Cultural analysis
  media?: MediaObject;          // Media content
  metadata?: MetadataObject;    // Additional metadata
  timelineConnection?: string[]; // Timeline event IDs
  heroConnection?: string[];    // Hero scene IDs
  tags?: string[];             // Searchable tags
  legal?: LegalObject;         // Legal compliance data
}

interface MediaObject {
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;                 // Media file URL
  thumbnail?: string;          // Thumbnail URL
  alt?: string;               // Alt text for images
  caption?: string;           // Media caption
}

interface MetadataObject {
  verificationLevel?: 'primary-source' | 'secondary-source' | 'tertiary-source';
  culturalImpact?: 'high' | 'medium' | 'low';
  [key: string]: any;         // Additional custom metadata
}

interface LegalObject {
  quotationLength: number;     // Character count for fair use
  purpose: 'criticism' | 'review' | 'analysis'; // Fair dealing purpose
  attribution: string;        // Source attribution
  dateAccessed: string;       // ISO date when accessed
}
```

## Cross-Component Integration

### Timeline Integration

```javascript
// Listen for evidence navigation to timeline
window.addEventListener('evidence:navigateTimeline', (event) => {
  const { eventId, evidenceId } = event.detail;
  // Navigate to timeline component and highlight event
  navigateToTimelineEvent(eventId);
});

// Navigate from timeline to evidence
const evidenceGallery = window.__EVIDENCE_GALLERY__;
if (evidenceGallery) {
  evidenceGallery.filterByTimelineEvent(eventId);
}
```

### Hero Component Integration

```javascript
// Listen for evidence navigation to hero
window.addEventListener('evidence:navigateHero', (event) => {
  const { sceneId, evidenceId } = event.detail;
  // Navigate to hero component and highlight scene
  navigateToHeroScene(sceneId);
});

// Navigate from hero to evidence
const evidenceGallery = window.__EVIDENCE_GALLERY__;
if (evidenceGallery) {
  evidenceGallery.filterByHeroScene(sceneId);
}
```

## Accessibility Features

### WCAG 2.1 AA Compliance

- **Keyboard Navigation**: Full keyboard accessibility with focus management
- **Screen Reader Support**: Complete ARIA labeling and live regions
- **Focus Trap**: Proper focus containment in modals
- **Skip Links**: Quick navigation to main content
- **Color Contrast**: Minimum 4.5:1 contrast ratios
- **Touch Targets**: Minimum 44×44px touch targets
- **Reduced Motion**: Respects `prefers-reduced-motion`
- **High Contrast**: Enhanced visibility in high contrast mode

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` / `Shift+Tab` | Navigate between elements |
| `Enter` / `Space` | Activate buttons and open evidence |
| `Escape` | Close modals and dialogs |
| `Ctrl/Cmd + F` | Focus search input |
| `Ctrl/Cmd + G` | Toggle grid/list view |
| `Arrow Keys` | Navigate within modal or suggestions |
| `?` / `Alt + H` | Show keyboard shortcuts help |
| `Alt + S` | Skip to main content |
| `Alt + N` | Skip to navigation |

### Screen Reader Announcements

The gallery provides comprehensive screen reader support with:
- Live region announcements for filter changes
- Modal state announcements
- Navigation change announcements
- Loading state announcements
- Error state announcements

## Performance Optimization

### Built-in Optimizations

1. **Lazy Loading**: Images and content loaded on demand
2. **Virtual Scrolling**: Efficient rendering of large datasets
3. **Image Optimization**: WebP format with JPEG fallbacks
4. **Thumbnail Preloading**: Critical evidence thumbnails preloaded
5. **Component Splitting**: Modular loading of heavy components
6. **Intersection Observer**: Efficient visibility detection

### Performance Monitoring

```javascript
// Performance metrics are automatically tracked
performance.getEntriesByName('evidence-gallery-init');
performance.getEntriesByName('evidence-data-loaded');

// Custom performance tracking
window.addEventListener('evidence:performanceMetric', (event) => {
  const { metric, value, context } = event.detail;
  // Send to analytics service
});
```

### Bundle Size Optimization

| Component | Estimated Size | Notes |
|-----------|---------------|-------|
| EvidenceGallery.svelte | ~8KB | Core gallery functionality |
| EvidenceModal.svelte | ~6KB | Modal viewer with a11y |
| EvidenceCard.svelte | ~4KB | Individual card component |
| EvidenceFilter.svelte | ~5KB | Advanced filtering |
| EvidenceSearch.svelte | ~4KB | Search and suggestions |
| EvidenceAccessibility.svelte | ~3KB | Accessibility utilities |
| **Total** | ~30KB | Gzipped: ~8KB |

## Legal Compliance

### EU Fair Dealing Framework

The evidence gallery includes built-in legal compliance features:

1. **Quotation Tracking**: Automatic monitoring of quoted content length
2. **Attribution Management**: Required source attribution for all evidence
3. **Purpose Classification**: Fair dealing purpose tracking (criticism, review, analysis)
4. **Access Date Logging**: Date when evidence was accessed and analyzed

### Compliance Validation

```javascript
import { evidenceUtils } from '../lib/evidenceData.js';

// Validate evidence legal compliance
evidenceData.forEach(item => {
  try {
    evidenceUtils.validateEvidenceItem(item);
    console.log(`✅ Evidence ${item.id} is compliant`);
  } catch (error) {
    console.error(`❌ Evidence ${item.id}: ${error.message}`);
  }
});
```

## Testing Guide

### Accessibility Testing

#### Automated Testing

```bash
# Install testing dependencies
npm install --save-dev @axe-core/playwright

# Run accessibility tests
npx playwright test accessibility.spec.js
```

```javascript
// tests/accessibility.spec.js
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Evidence Gallery accessibility', async ({ page }) => {
  await page.goto('/evidence-gallery-demo');

  // Test initial state
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);

  // Test modal accessibility
  await page.click('[data-testid="evidence-card-0"]');
  await page.waitForSelector('[role="dialog"]');

  const modalScanResults = await new AxeBuilder({ page }).analyze();
  expect(modalScanResults.violations).toEqual([]);

  // Test keyboard navigation
  await page.keyboard.press('Escape');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
});
```

#### Manual Testing Checklist

- [ ] Keyboard-only navigation works throughout
- [ ] Screen reader announces all state changes
- [ ] Focus is visible and well-managed
- [ ] Color contrast meets WCAG standards
- [ ] Touch targets are appropriately sized
- [ ] Modal focus trap works correctly
- [ ] Skip links function properly

### Functional Testing

#### Search and Filter Testing

```javascript
// tests/functionality.spec.js
import { test, expect } from '@playwright/test';

test('Evidence Gallery search functionality', async ({ page }) => {
  await page.goto('/evidence-gallery-demo');

  // Test basic search
  await page.fill('[data-testid="search-input"]', 'Oxxxymiron');
  await expect(page.locator('[data-testid="results-count"]')).toContainText('1');

  // Test filter syntax
  await page.fill('[data-testid="search-input"]', 'type:media');
  await expect(page.locator('[data-testid="evidence-card"]')).toHaveCount(2);

  // Test significance filter
  await page.selectOption('[data-testid="significance-filter"]', 'critical');
  await expect(page.locator('[data-testid="evidence-card"]')).toHaveCount(1);
});
```

#### Modal Testing

```javascript
test('Evidence Modal functionality', async ({ page }) => {
  await page.goto('/evidence-gallery-demo');

  // Open modal
  await page.click('[data-testid="evidence-card-0"]');
  await expect(page.locator('[role="dialog"]')).toBeVisible();

  // Test modal navigation
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-testid="evidence-counter"]')).toContainText('2 / 8');

  // Test modal close
  await page.keyboard.press('Escape');
  await expect(page.locator('[role="dialog"]')).not.toBeVisible();
});
```

### Performance Testing

#### Loading Performance

```javascript
// tests/performance.spec.js
import { test, expect } from '@playwright/test';

test('Evidence Gallery performance', async ({ page }) => {
  await page.goto('/evidence-gallery-demo');

  // Measure initial load time
  const navigationTiming = await page.evaluate(() => {
    return JSON.stringify(performance.getEntriesByType('navigation')[0]);
  });

  const timing = JSON.parse(navigationTiming);
  expect(timing.loadEventEnd - timing.loadEventStart).toBeLessThan(2000); // 2s max

  // Test lazy loading
  const imageCount = await page.locator('img[loading="lazy"]').count();
  expect(imageCount).toBeGreaterThan(0);

  // Test search performance
  const searchStart = Date.now();
  await page.fill('[data-testid="search-input"]', 'test query');
  await page.waitForSelector('[data-testid="results-count"]');
  const searchTime = Date.now() - searchStart;
  expect(searchTime).toBeLessThan(500); // 500ms max search response
});
```

## Common Integration Issues

### Issue: Svelte Component Not Hydrating

**Symptoms**: Gallery appears as static content, no interactivity

**Solution**:
```javascript
// Ensure Svelte component is properly imported in Astro
<script>
  import EvidenceGallery from '../components/evidence/EvidenceGallery.svelte';
  
  // Check for proper client:load directive
</script>
```

### Issue: Images Not Loading

**Symptoms**: Broken image placeholders in evidence cards

**Solution**:
```javascript
// Verify image paths are correct relative to public folder
// Check Astro asset optimization in astro.config.mjs
export default defineConfig({
  image: {
    domains: ['your-domain.com'],
    formats: ['webp', 'jpeg']
  }
});
```

### Issue: Search Not Working

**Symptoms**: Search input doesn't filter results

**Solution**:
```javascript
// Ensure evidence data has searchable fields
const evidence = {
  title: "Required for search",
  description: "Required for search", 
  tags: ["required", "for", "search"],
  // ... other fields
};
```

### Issue: Accessibility Warnings

**Symptoms**: WAVE or axe-core reports accessibility issues

**Solution**:
```html
<!-- Ensure proper ARIA labels -->
<button aria-label="Close evidence modal" aria-describedby="modal-description">
<!-- Ensure proper heading hierarchy -->
<h1>Page Title</h1>
  <h2>Gallery Section</h2>
    <h3>Evidence Title</h3>
```

## Advanced Customization

### Custom Evidence Types

```javascript
// Add custom evidence types
const customTypeConfig = {
  'audio': {
    label: 'Audio Evidence',
    icon: '🎵',
    class: 'evidence-card--audio'
  },
  'video': {
    label: 'Video Evidence', 
    icon: '📹',
    class: 'evidence-card--video'
  }
};

// Extend default configuration in EvidenceCard.svelte
const typeConfig = { ...defaultTypeConfig, ...customTypeConfig };
```

### Custom Styling

```css
/* Override default evidence gallery styles */
.evidence-gallery {
  /* Custom grid layout */
  --evidence-grid-columns: repeat(auto-fill, minmax(350px, 1fr));
  --evidence-gap: 2rem;
  
  /* Custom color scheme */
  --evidence-primary-color: #custom-color;
  --evidence-secondary-color: #custom-color-2;
  
  /* Custom typography */
  --evidence-title-font: 'Custom Font', serif;
  --evidence-body-font: 'Custom Body Font', sans-serif;
}

/* Custom evidence card styling */
.evidence-card.custom-theme {
  background: linear-gradient(135deg, #custom-1, #custom-2);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

### Custom Search Suggestions

```javascript
// Extend search suggestions in EvidenceSearch.svelte
const customSuggestions = [
  'custom-search-term',
  'domain-specific-term',
  'organization:specific-filter'
];

const searchSuggestionsData = [
  ...defaultSuggestions,
  ...customSuggestions
];
```

## Deployment Considerations

### Production Optimization

1. **Enable Image Optimization** in Astro config
2. **Configure CDN** for evidence media files
3. **Enable Compression** for static assets
4. **Set up Analytics** for usage tracking
5. **Configure CSP Headers** for security

### SEO Optimization

```astro
---
// Add structured data for evidence collections
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": "Evidence Collection",
  "description": "Cultural investigation evidence",
  "numberOfItems": evidenceData.length
};
---

<script type="application/ld+json" set:html={JSON.stringify(structuredData)}></script>
```

### Security Considerations

1. **Sanitize Evidence Data** before rendering
2. **Validate File Uploads** for media evidence
3. **Implement CSP Headers** to prevent XSS
4. **Use HTTPS** for all evidence media
5. **Audit Dependencies** regularly

## Support and Maintenance

### Regular Maintenance Tasks

- [ ] Update evidence data validation schemas
- [ ] Review accessibility compliance quarterly
- [ ] Monitor performance metrics
- [ ] Update legal compliance framework
- [ ] Security audit of dependencies
- [ ] User feedback analysis and implementation

### Getting Help

- **Documentation**: This guide and inline code comments
- **Issue Reporting**: Create detailed bug reports with reproduction steps
- **Feature Requests**: Submit with use case and requirements
- **Accessibility Issues**: Include WCAG guideline references

## License and Attribution

This evidence gallery system is part of the ORGA cultural investigation framework and follows academic fair use principles. All evidence items must include proper attribution and comply with applicable copyright laws.

### Required Attribution

When using this system, please include:
- Source attribution for all evidence items
- Compliance with EU fair dealing requirements  
- Proper academic citation format
- Legal compliance documentation

---

**Version**: 1.0.0  
**Last Updated**: 2024-04-24  
**Compatibility**: Astro 5.18+, Svelte 5+  
**WCAG Compliance**: 2.1 AA