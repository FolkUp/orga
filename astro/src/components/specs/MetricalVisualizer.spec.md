# MetricalVisualizer Component Specification

**Version:** 1.0  
**Date:** 2026-04-29  
**Status:** Specification Phase  
**Expert:** Цветик (Poetic Architecture)

---

## Component Overview

Interactive visualization of poetic metre and rhythmic structure in Oxymiron "Организация", connecting modern hip-hop to Silver Age Russian poetry traditions.

### Purpose
- Visual analysis of 3-ictus dolnik patterns
- Connection to Silver Age poetry (Блок, Ахматова)
- Rhythm conflict visualization (86 BPM musical vs 94 BPM natural speech)
- Interactive exploration of metrical architecture

### Component Type
- **Framework:** Svelte 5
- **Integration:** Astro island component  
- **Rendering:** SVG-based with Canvas fallback

---

## Technical Specification

### Props Interface
```typescript
interface MetricalProps {
  // Verse Data
  verses: Array<{
    id: string;
    text: string;                       // Original Russian text
    transcription: string;              // Phonetic notation
    metre: {
      type: 'dol3' | 'dol4' | 'iambic' | 'trochaic' | 'mixed';
      ictuses: number[];                // Stressed positions
      intervals: number[];              // Variable intervals between ictuses
      confidence: 'high' | 'medium' | 'low';
    };
    silverAgeConnection?: {
      poet: 'Блок' | 'Ахматова' | 'Мандельштам' | 'Гумилёв';
      poem: string;
      similarity: number;               // 0-1 similarity score
      analysis: string;                 // Цветик interpretation
    };
    rhythmConflict?: {
      musicalBPM: 86;
      speechBPM: 94;
      tensionEffect: string;            // Analysis of productive tension
    };
  }>;
  
  // Display Configuration
  showStressMarks: boolean;             // Visual stress indicators
  highlightDolnik: boolean;             // Highlight dolnik patterns
  showSilverAge: boolean;               // Show classical connections
  interactiveMode: boolean;             // Enable hover/click interactions
  
  // Visual Settings
  colorScheme: 'bordeaux' | 'sage' | 'amber';  // Brand Guide v2.5
  fontSize: 'small' | 'medium' | 'large';      // Accessibility scaling
}
```

### State Management
```typescript
interface ComponentState {
  selectedVerse: string | null;         // Currently selected verse ID
  highlightedPattern: string | null;    // Highlighted metrical pattern
  showAnalysis: boolean;                // Toggle detailed analysis panel
  comparisonMode: boolean;              // Side-by-side Silver Age comparison
  activePoet: string | null;            // Selected poet for comparison
}
```

### Data Source
- **Input Format:** Metrical analysis data from Цветик expert
- **Data Location:** `astro/public/data/organizatsiya-metrics.json`
- **Linguistic Data:** Stress patterns, phonetic transcriptions, classical parallels

---

## Visual Design Specification

### Brand Guide v2.5 Integration
- **Typography:** 
  - Playfair Display (headings, classical quotes)
  - Source Sans 3 (analysis text)
  - Crimson Text (Russian poetry, better Cyrillic support)
- **Colors:**
  - Bordeaux (#7D4450) - main text, stress marks
  - Sage (#839E75) - metrical patterns, classical connections
  - Amber (#E8AD4A) - highlighted elements, rhythm conflicts
  - Ivory (#FEFCF6) - background, reading area

### Layout Structure
```
┌─────────────────────────────────────────────┐
│ 🎭 ПОЭТИЧЕСКАЯ АРХИТЕКТУРА                   │
├─────────────────────────────────────────────┤
│ [Dolnik] [Stress] [Silver Age] Toggle       │
├─────────────────────────────────────────────┤
│ Verse 1: "В восьмидесятых все было..."      │
│    ∪   ́∪   ́∪     ∪   ́∪     ∪   ́∪           │
│         1     2         3    (3-ictus dolnik)│
├─────────────────────────────────────────────┤
│ 📖 Silver Age Connection: А. Блок           │
│ "Ночь, улица, фонарь, аптека..."           │
│    ́∪    ́∪∪     ́∪      ́∪∪                    │
│  Similarity: 87% - identical dolnik pattern │
├─────────────────────────────────────────────┤
│ 🎵 Rhythm Conflict Analysis:                │
│ Musical: 86 BPM | Speech: 94 BPM           │
│ Effect: Productive tension creates urgency  │
└─────────────────────────────────────────────┘
```

### Metrical Notation System
```typescript
interface MetricalNotation {
  stressed: '́';           // Primary stress mark
  unstressed: '∪';        // Unstressed syllable  
  secondary: '̀';          // Secondary stress
  pause: '|';             // Caesura/pause
  ictus: '●';             // Ictus position marker
}
```

### Interactive Elements
- **Verse Hover:** Highlight metrical pattern and show analysis
- **Stress Click:** Toggle individual stress mark interpretation
- **Poet Comparison:** Side-by-side view with classical text
- **Pattern Animation:** Animated visualization of rhythmic flow

---

## Accessibility Compliance

### WCAG 2.1 AA Requirements
- **Text Contrast:** All metrical marks and text ≥4.5:1 contrast ratio
- **Screen Reader Support:** Alt-text for metrical diagrams, structured semantic markup
- **Keyboard Navigation:** Tab through verses, Enter to expand analysis
- **Text Scaling:** Support 200% zoom without horizontal scrolling

### Linguistic Accessibility
- **Cyrillic Support:** Proper Unicode handling for Russian text
- **Phonetic Notation:** International Phonetic Alphabet (IPA) symbols
- **Font Fallbacks:** Robust font stack for Cyrillic characters

### Alternative Navigation
```typescript
// Keyboard shortcuts
const keyboardShortcuts = {
  'ArrowUp/Down': 'Navigate between verses',
  'Enter': 'Show detailed analysis',
  'S': 'Toggle stress marks',
  'D': 'Toggle dolnik highlighting', 
  'C': 'Toggle classical comparison',
  'Escape': 'Close analysis panel'
};
```

---

## Security Considerations

### Input Sanitization
```typescript
// Text content sanitization
const sanitizeRussianText = (text: string): string => {
  // Allow Cyrillic, basic punctuation, metrical symbols
  return text.replace(/[^\u0400-\u04FF\s\p{P}́∪̀●|]/gu, '');
};

// Prevent XSS in analysis content
const sanitizeAnalysis = (html: string): string => {
  return DOMPurify.sanitize(html, { 
    ALLOWED_TAGS: ['em', 'strong', 'span'],
    ALLOWED_ATTR: ['class']
  });
};
```

### Content Security
- **No External Scripts:** Self-contained component
- **Safe Rendering:** No dangerouslySetInnerHTML for metrical notation
- **URL Validation:** Classical poetry source links verified

---

## Performance Requirements

### Performance Budget
- **Bundle Size:** <12KB component + metrical data
- **Rendering Time:** <300ms for complex verses with analysis
- **Animation Performance:** 60fps for stress pattern transitions
- **Memory Usage:** <5MB for full poetry corpus data

### Optimization Strategies
- **SVG Efficiency:** Minimal DOM nodes for metrical marks
- **Text Rendering:** Efficient font loading and fallbacks
- **Data Lazy Loading:** Classical comparisons loaded on demand

---

## Mobile UX Specification

### Touch Interactions
- **Tap Verse:** Show metrical analysis
- **Long Press:** Compare with Silver Age equivalent
- **Swipe:** Navigate between verses
- **Pinch Text:** Zoom for better readability

### Responsive Typography
```css
/* Responsive font scaling */
.verse-text {
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  line-height: 1.6;
}

.metrical-marks {
  font-size: clamp(0.9rem, 2vw, 1.1rem);
}

.analysis-panel {
  font-size: clamp(0.95rem, 2.2vw, 1.2rem);
}
```

### Mobile Layout Adaptations
- **Vertical Stacking:** Analysis panel below verse on mobile
- **Simplified Notation:** Reduced metrical mark density
- **Touch Targets:** Minimum 44px tap areas for interactive elements

---

## Expert Content Integration

### Цветик Analysis Structure
```json
{
  "verse": {
    "text": "В восьмидесятых всё было понятно и просто",
    "metre": {
      "type": "dol3",
      "pattern": "∪́∪∪́∪∪́∪ ∪́∪∪∪́∪∪́∪",
      "ictuses": [2, 6, 9, 12, 16, 19],
      "analysis": "Трёхиктный дольник с характерными для Блока интервалами"
    },
    "silverAge": {
      "poet": "Блок",
      "poem": "Ночь, улица, фонарь, аптека",
      "connection": "Идентичная метрическая структура создаёт мост между серебряным веком и современным хип-хопом",
      "significance": "Дольник исторически связан с устной традицией и подпольным знанием"
    }
  }
}
```

### Educational Context
- **Metrical Theory:** Clear explanation of dolnik vs traditional metres
- **Cultural Bridge:** Connection between classical and contemporary poetry
- **Historical Significance:** Dolnik as vehicle for underground culture

---

## Testing Requirements

### Linguistic Testing
- **Cyrillic Rendering:** Correct display across browsers and devices
- **Stress Mark Positioning:** Accurate placement above/below characters
- **Font Loading:** Graceful fallbacks if custom fonts fail
- **Text Selection:** Proper selection behavior with metrical marks

### Interactive Testing
- **Pattern Recognition:** Accurate highlighting of metrical patterns
- **Comparison Mode:** Proper alignment of classical/modern texts
- **Animation Smoothness:** Fluid transitions between analysis states

### Cross-Platform Testing
- **Browser Support:** Chrome, Firefox, Safari, Edge
- **Operating Systems:** Windows (Cyrillic fonts), macOS, iOS, Android
- **Screen Readers:** NVDA, JAWS, VoiceOver compatibility

---

## Integration Points

### Astro Integration
```typescript
// astro/src/pages/longform/organizatsiya.astro
---
import MetricalVisualizer from '@components/MetricalVisualizer.svelte';
import { getPoetryAnalysis } from '@utils/analysis-data';

const metricalData = await getPoetryAnalysis('organizatsiya-metrics');
---

<MetricalVisualizer 
  client:visible
  verses={metricalData.verses}
  showSilverAge={true}
  colorScheme="sage"
  interactiveMode={true}
/>
```

### Content Management
```typescript
// Poetry corpus management
interface PoetryCorpus {
  silverAge: {
    [poet: string]: {
      [poem: string]: {
        text: string;
        metre: MetricalPattern;
        historical_context: string;
      }
    }
  };
  modern: {
    organizatsiya: MetricalAnalysis;
  };
}
```

---

## Deployment Checklist

### Pre-deployment Verification
- [ ] Цветик expert approval of metrical analysis
- [ ] Russian typography rendering tested across devices
- [ ] Silver Age poetry attribution verified
- [ ] Performance budget compliance confirmed
- [ ] Accessibility audit passed (WCAG 2.1 AA)

### Feature Flag Integration
```typescript
const featureFlags = {
  metricalVisualizer: import.meta.env.PUBLIC_ENABLE_METRICS === 'true',
  silverAgeComparison: import.meta.env.PUBLIC_ENABLE_CLASSICAL === 'true'
};
```

### Error Handling
```typescript
// Graceful degradation
if (!font.supports('Cyrillic')) {
  useSystemFontFallback();
}

if (!canvasSupported) {
  renderStaticAnalysis();
}
```

---

## Cultural Sensitivity Guidelines

### Poetic Tradition Respect
- **Academic Approach:** Scholarly analysis, not casual comparison
- **Attribution:** Full credit to both classical and contemporary poets
- **Context:** Clear historical and cultural context for connections

### Hip-Hop Culture Sensitivity
- **Genre Respect:** Understanding hip-hop as legitimate poetic tradition
- **Artistic Integrity:** No patronizing or diminishing language
- **Cultural Bridge:** Emphasis on connection, not appropriation

---

## Success Metrics

### Functional Metrics
- **Metrical Accuracy:** 100% correct stress pattern visualization
- **Performance:** <300ms rendering time for complex analysis
- **Accessibility:** Full WCAG 2.1 AA compliance verified

### Educational Metrics
- **Comprehension:** Clear explanation of dolnik patterns
- **Cultural Connection:** Successful bridge between classical and modern
- **Expert Approval:** Цветик validation of poetic analysis quality

### Technical Metrics  
- **Cross-Platform:** Consistent rendering across all target platforms
- **Typography:** Perfect Cyrillic character display
- **Interactive Response:** <16ms interaction feedback

---

**SPECIFICATION STATUS:** Complete and ready for constitutional verification  
**EXPERT INTEGRATION:** Цветик poetic architecture analysis framework  
**QUALITY STANDARD:** Banking-level academic rigor maintained

---

*Specification prepared under Level 3 Cartouche Autonome authority*  
*Cultural sensitivity and academic standards enforced*