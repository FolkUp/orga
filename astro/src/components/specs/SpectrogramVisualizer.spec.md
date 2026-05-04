# SpectrogramVisualizer Component Specification

**Version:** 1.0  
**Date:** 2026-04-29  
**Status:** Specification Phase  
**Expert:** Виленский (Musical Analysis)

---

## Component Overview

Visual-only spectrogram and waveform analyzer for Oxymiron "Организация" musical analysis. **NO AUDIO PLAYBACK** to avoid sound recording license requirements.

### Purpose
- Visual representation of harmonic structure
- Cultural analysis through musical pattern analysis  
- Interactive exploration of musical elements without copyright infringement

### Component Type
- **Framework:** Svelte 5
- **Integration:** Astro island component
- **Rendering:** Canvas-based visualization

---

## Technical Specification

### Props Interface
```typescript
interface SpectrogramProps {
  // Data
  waveformData: Float32Array;           // Pre-computed waveform data
  harmonicMarkers: Array<{              // Key harmonic points
    timestamp: number;                  // Position in seconds
    frequency: number;                  // Hz
    amplitude: number;                  // 0-1
    musicalNote: string;               // "Am", "F", "C", "G"
    culturalSignificance: string;      // Виленский interpretation
  }>;
  
  // Visual Configuration
  width: number;                        // Canvas width (responsive)
  height: number;                       // Canvas height (min 200px)
  colorScheme: 'bordeaux' | 'sage' | 'amber';  // Brand Guide v2.5
  
  // Interaction
  showHarmonicAnalysis: boolean;        // Toggle analytical overlay
  highlightProgression: boolean;        // Highlight Am-F-C-G progression
}
```

### State Management
```typescript
interface ComponentState {
  selectedMarker: number | null;        // Currently selected harmonic point
  zoomLevel: number;                    // 1x to 4x zoom
  analysisMode: 'waveform' | 'harmonic' | 'cultural';
  isLoading: boolean;
  error: string | null;
}
```

### Data Source
- **Input Format:** Pre-processed audio analysis data (JSON)
- **No Real-Time Processing:** Static visualization only
- **Data Location:** `astro/public/data/organizatsiya-analysis.json`

---

## Visual Design Specification

### Brand Guide v2.5 Integration
- **Primary Colors:**
  - Bordeaux (#7D4450) - waveform base color
  - Sage (#839E75) - harmonic markers
  - Amber (#E8AD4A) - cultural significance highlights
  - Ivory (#FEFCF6) - background/text

### Layout Structure
```
┌─────────────────────────────────────────────┐
│ 🎵 МУЗЫКАЛЬНЫЙ АНАЛИЗ                      │
├─────────────────────────────────────────────┤
│ [Harmonic] [Cultural] [Waveform] Mode Toggle│
├─────────────────────────────────────────────┤
│                                             │
│     ████████ WAVEFORM VISUALIZATION ███████  │
│     ██      ██    ████      ██      ██      │
│     ██  Am  ██ F  ████  C   ██  G   ██      │
│                                             │
├─────────────────────────────────────────────┤
│ Selected: Am → F (0:45)                     │
│ Cultural Significance: "Baroque progression │
│ in hip-hop creates temporal bridge..."      │
└─────────────────────────────────────────────┘
```

### Responsive Behavior
- **Desktop:** Full-width canvas with detailed annotations
- **Tablet:** Reduced annotation density, touch-friendly markers
- **Mobile:** Vertical layout, simplified view, swipe navigation

---

## Accessibility Compliance

### WCAG 2.1 AA Requirements
- **Keyboard Navigation:** Arrow keys for marker selection, Enter to activate
- **Screen Reader Support:** Descriptive ARIA labels for all interactive elements
- **Color Contrast:** All text/background combinations ≥4.5:1 ratio
- **Focus Indicators:** Clear visual focus states for all interactive elements

### Alternative Text
```html
<canvas 
  role="img" 
  aria-label="Musical spectrogram of Организация showing Am-F-C-G chord progression with cultural analysis markers"
  tabindex="0"
>
```

### Keyboard Interactions
- **Arrow Keys:** Navigate between harmonic markers
- **Enter/Space:** Select marker and show analysis
- **Escape:** Clear selection
- **Plus/Minus:** Zoom in/out
- **H:** Toggle harmonic analysis mode

---

## Security Considerations

### XSS Prevention
- **Input Sanitization:** All marker text sanitized through DOMPurify
- **No Dynamic HTML:** Pure canvas rendering, no innerHTML usage
- **URL Validation:** Any external links validated and sanitized

### Content Security Policy
```typescript
// Safe operations only
const sanitizeText = (text: string): string => {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
};

// No eval() or Function() constructors
// No dangerouslySetInnerHTML equivalent
```

---

## Performance Requirements

### Performance Budget
- **Bundle Size:** <15KB component + dependencies
- **Initial Render:** <500ms on 3G connection
- **Interaction Response:** <16ms (60fps) for smooth animations
- **Memory Usage:** <10MB peak for waveform data

### Optimization Strategies
- **Canvas Rendering:** Efficient redraw with dirty region tracking
- **Data Loading:** Lazy load waveform data on component visibility
- **Animation:** RequestAnimationFrame for smooth transitions

---

## Mobile UX Specification

### Touch Interactions
- **Tap:** Select harmonic marker
- **Long Press:** Show detailed cultural analysis
- **Pinch Zoom:** Zoom into waveform section
- **Pan:** Navigate across timeline when zoomed

### Device Matrix Testing
- **iPhone 13/14:** Safari, Chrome mobile
- **Samsung Galaxy S23:** Chrome, Samsung Browser
- **iPad:** Safari, responsive layout
- **Low-end Android:** Performance baseline testing

---

## Integration Points

### Astro Integration
```typescript
// astro/src/pages/longform/organizatsiya.astro
---
import SpectrogramVisualizer from '@components/SpectrogramVisualizer.svelte';
import { getAnalysisData } from '@utils/analysis-data';

const spectrogramData = await getAnalysisData('organizatsiya-spectrogram');
---

<SpectrogramVisualizer 
  client:load
  waveformData={spectrogramData.waveform}
  harmonicMarkers={spectrogramData.markers}
  colorScheme="bordeaux"
/>
```

### Expert Content Integration
```json
// Example harmonic marker from Виленский analysis
{
  "timestamp": 45.2,
  "frequency": 196.0,
  "amplitude": 0.8,
  "musicalNote": "Am",
  "culturalSignificance": "Минорная тоника устанавливает элегический тон, характерный для русской культурной традиции протеста"
}
```

---

## Testing Requirements

### Unit Tests
- **Component Mounting:** Proper initialization with valid props
- **Event Handling:** Marker selection, zoom functionality
- **Error States:** Invalid data handling, loading states
- **Accessibility:** Keyboard navigation, ARIA attributes

### Integration Tests
- **Data Loading:** Async data fetching and error handling
- **Responsive Behavior:** Layout adaptation across breakpoints
- **Performance:** Rendering time under performance budget

### Visual Regression Tests
- **Waveform Rendering:** Consistent visual output across browsers
- **Brand Compliance:** Color scheme accuracy
- **Mobile Layout:** Touch target sizes, responsive design

---

## Content Guidelines

### Cultural Sensitivity
- **Academic Tone:** Respectful analysis of artistic work
- **Attribution:** Clear crediting of Oxymiron as artist
- **Methodology:** Transparent about analytical limitations

### Copyright Compliance
- **No Audio Files:** Visual analysis only, no sound reproduction
- **Fair Use Scope:** Educational/analytical purpose clearly stated
- **Source Attribution:** Official sources and academic references

---

## Deployment Checklist

### Pre-deployment
- [ ] Component specification approved by Johnny (CSS) + Фонарщик (brand)
- [ ] Security review by Купер
- [ ] Performance testing meets budget requirements
- [ ] Accessibility audit passes WCAG 2.1 AA
- [ ] Mobile device testing completed

### Feature Flag Configuration
```typescript
// Feature flag integration
const featureFlags = {
  spectrogramVisualizer: import.meta.env.PUBLIC_ENABLE_SPECTROGRAM === 'true'
};
```

### Rollback Plan
- **Graceful Degradation:** Static image fallback if component fails
- **Emergency Disable:** Feature flag toggle without redeployment
- **Error Boundary:** Component crashes don't break page layout

---

## Success Metrics

### Functional Metrics
- **Load Success Rate:** >99.5% successful component initialization
- **Interaction Response:** <16ms average response time
- **Error Rate:** <0.1% JavaScript errors

### User Experience Metrics
- **Accessibility Compliance:** 100% WCAG 2.1 AA conformance
- **Mobile Performance:** Lighthouse score >90
- **Brand Consistency:** Visual design matches Brand Guide v2.5

### Content Quality Metrics
- **Expert Approval:** Виленский approval of musical analysis integration
- **Cultural Authenticity:** Respectful representation of hip-hop culture
- **Academic Standards:** Methodology documentation suitable for peer review

---

**SPECIFICATION STATUS:** Complete and ready for Alpha+Beta constitutional verification  
**NEXT PHASE:** Component implementation after specification approval  
**QUALITY GATE:** Banking-level standards enforced throughout development

---

*Specification prepared under Level 3 Cartouche Autonome authority*  
*Quality > Speed > Cost principle maintained*