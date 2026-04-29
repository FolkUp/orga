# Timeline Component Specification

**Version:** 1.0  
**Date:** 2026-04-29  
**Status:** Specification Phase  
**Expert:** КиберГонзо (OSINT Cultural Seismography)

---

## Component Overview

Interactive timeline visualization of cultural tremors and political correlations during the 333-day arc (Nov 8, 2021 → Oct 7, 2022), implementing falsifiable OSINT methodology for cultural seismography analysis.

### Purpose
- Document verified cultural events and political correlations
- Provide transparent source verification for all claims
- Enable temporal pattern analysis with confidence ratings
- Demonstrate cultural seismography methodology with academic rigor

### Component Type
- **Framework:** Svelte 5
- **Integration:** Astro island component
- **Rendering:** SVG timeline with Canvas performance optimization

---

## Technical Specification

### Props Interface
```typescript
interface TimelineProps {
  // Event Data
  events: Array<{
    id: string;
    date: string;                       // ISO 8601 format
    type: 'cultural' | 'political' | 'correlation' | 'tremor';
    category: 'music' | 'social' | 'media' | 'policy' | 'enforcement';
    title: string;
    description: string;
    
    // OSINT Verification
    sources: Array<{
      url: string;
      title: string;
      type: 'primary' | 'secondary' | 'archive';
      credibility: 'high' | 'medium' | 'low';
      archived_url?: string;            // Archive.org backup
      access_date: string;
    }>;
    
    confidence: 'high' | 'medium' | 'low';
    verification_status: 'verified' | 'partially_verified' | 'unverified';
    
    // Cultural Seismography
    tremor_magnitude?: number;          // 1-10 scale
    political_correlation?: {
      event_id: string;                 // Related political event
      time_delta: number;               // Days between events
      correlation_strength: number;     // 0-1 confidence
      causal_claim: boolean;            // Whether causation is claimed
    };
    
    // Metadata
    added_by: 'КиберГонзо' | 'Архивариус' | 'verified_source';
    methodology_notes?: string;
  }>;
  
  // Display Configuration
  dateRange: [string, string];          // Visible date range
  showSourceLinks: boolean;             // Enable source verification links
  highlightCorrelations: boolean;       // Visual correlation indicators
  filterByConfidence: 'all' | 'high' | 'verified';
  
  // Interactive Features
  zoomLevel: number;                    // 1x to 10x timeline zoom
  playbackSpeed: number;                // Animation speed for timeline replay
  enableSourceModal: boolean;           // Modal for source examination
}
```

### State Management
```typescript
interface ComponentState {
  selectedEvent: string | null;         // Currently selected event
  selectedTimeRange: [Date, Date] | null;  // User-selected period
  sourceModalOpen: boolean;             // Source verification modal
  correlationFilter: string[];          // Active correlation filters
  playbackPosition: Date | null;        // Current playback position
  
  // OSINT Methodology
  showMethodology: boolean;             // Methodology explanation panel
  showBiasWarnings: boolean;            // Bias prevention warnings
  verificationMode: boolean;            // Enhanced source checking
}
```

### Data Source
- **Input Format:** OSINT research data from КиберГонзо analysis
- **Data Location:** `astro/public/data/organizatsiya-timeline.json`
- **Archive Integration:** Links to archived sources for persistence

---

## OSINT Methodology Framework

### Falsifiable Claims Structure
```typescript
interface FalsifiableClaim {
  claim: string;                        // Specific, testable assertion
  evidence: Array<{
    source: string;
    evidence_type: 'direct' | 'indirect' | 'circumstantial';
    strength: number;                   // 1-5 evidence strength
  }>;
  counter_evidence?: Array<{
    description: string;
    source: string;
    impact_on_claim: 'refutes' | 'weakens' | 'contextualizes';
  }>;
  confidence_calculation: {
    base_confidence: number;
    source_reliability: number;
    evidence_strength: number;
    counter_evidence_impact: number;
    final_confidence: number;
  };
}
```

### Bias Prevention Protocol
- **Pre-registration:** Methodology documented before analysis
- **Cherry-picking Guard:** Include non-correlating events
- **Hindsight Bias:** Clear "retrospective analysis only" disclaimers
- **Correlation vs Causation:** Explicit warnings against causal inference

---

## Visual Design Specification

### Brand Guide v2.5 Integration
- **Timeline Axis:** Bordeaux (#7D4450) - main timeline spine
- **Event Categories:**
  - Cultural events: Sage (#839E75)
  - Political events: Amber (#E8AD4A) 
  - Correlations: Gradient between relevant colors
- **Background:** Ivory (#FEFCF6)
- **Text:** High contrast black/white for readability

### Timeline Layout
```
┌─────────────────────────────────────────────────────────────┐
│ ⚡ КУЛЬТУРНАЯ СЕЙСМОГРАФИЯ: 333-дневная дуга                  │
├─────────────────────────────────────────────────────────────┤
│ [All] [Cultural] [Political] [High Confidence] Filters      │
├─────────────────────────────────────────────────────────────┤
│ Nov 2021    │    Feb 2022    │    Jun 2022    │    Oct 2022 │
│      ●       │        ◆       │        ▲       │        ●    │
│   Release    │    Policy      │   Media        │  Political  │
│             ╱│╲               │   Coverage     │   Response  │
│            ╱ │ ╲              │        │       │      │      │
│           ╱  │  ╲             │        ▼       │      ▼      │
│          Cultural Tremor ─────┴────Correlation─┴──Response   │
├─────────────────────────────────────────────────────────────┤
│ Selected: "Организация" Release (2021-11-08)               │
│ Sources: [Official Release] [Social Media] [Archive.org]    │
│ Confidence: High | Verification: ✓ Verified               │
│ Correlation: +47 days → Policy Response (confidence: 0.73) │
└─────────────────────────────────────────────────────────────┘
```

### Event Visualization
```typescript
interface EventVisualization {
  cultural: {
    shape: 'circle';
    color: '#839E75';
    size_by_magnitude: boolean;
  };
  political: {
    shape: 'diamond';
    color: '#E8AD4A';
    size_by_impact: boolean;
  };
  correlation: {
    type: 'connecting_line';
    style: 'dashed' | 'solid' | 'dotted';
    opacity_by_confidence: boolean;
  };
}
```

---

## Accessibility Compliance

### WCAG 2.1 AA Requirements
- **Color Independence:** Timeline readable without color (shapes, patterns, text)
- **Keyboard Navigation:** Full timeline navigation via keyboard
- **Screen Reader Support:** Comprehensive ARIA labels and descriptions
- **Focus Management:** Clear focus indicators, logical tab order

### Interaction Accessibility
```typescript
// Keyboard shortcuts
const keyboardControls = {
  'Left/Right Arrow': 'Navigate timeline',
  'Up/Down Arrow': 'Navigate events in time period',
  'Enter': 'Select event and show details',
  'Space': 'Play/pause timeline animation',
  'S': 'Open source verification modal',
  'M': 'Toggle methodology panel',
  'Escape': 'Close modals, clear selection'
};
```

### Screen Reader Support
```html
<div 
  role="application"
  aria-label="Interactive timeline of cultural and political events from November 2021 to October 2022"
  aria-describedby="timeline-instructions"
>
  <div id="timeline-instructions" class="sr-only">
    Use arrow keys to navigate events, Enter to select, Space to play animation
  </div>
</div>
```

---

## Security Considerations

### Source Verification Security
```typescript
// URL validation for external sources
const validateSourceURL = (url: string): boolean => {
  const allowedDomains = [
    'archive.org',
    'github.com',
    'official-government-sites',
    'verified-news-outlets'
  ];
  
  try {
    const urlObj = new URL(url);
    return allowedDomains.some(domain => urlObj.hostname.includes(domain));
  } catch {
    return false;
  }
};

// Sanitize event descriptions
const sanitizeEventContent = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['strong', 'em', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOWED_URI_REGEXP: /^https?:\/\/(archive\.org|github\.com)/
  });
};
```

### OSINT Data Protection
- **Source Anonymization:** Personal information redacted from sources
- **Archive Links:** All external sources backed up to Archive.org
- **No Real-Time Scraping:** Static data only, no live API calls
- **Metadata Stripping:** Images and documents sanitized of EXIF data

---

## Performance Requirements

### Performance Budget
- **Bundle Size:** <20KB component + timeline data
- **Initial Load:** <1s for 100 events timeline
- **Zoom Performance:** <50ms response time for zoom operations
- **Animation:** 60fps for timeline playback and smooth scrolling

### Optimization Strategies
- **Virtualization:** Render only visible timeline segments
- **Data Chunking:** Lazy load event details on demand
- **SVG Optimization:** Minimal DOM nodes for timeline elements
- **Progressive Enhancement:** Basic timeline without JavaScript, enhanced with interactivity

---

## Mobile UX Specification

### Touch Interactions
- **Tap Event:** Show event details
- **Long Press:** Open source verification modal
- **Horizontal Pan:** Navigate timeline left/right
- **Pinch Zoom:** Zoom into time period for detail
- **Two-Finger Drag:** Select time range for analysis

### Mobile Layout Adaptations
```css
@media (max-width: 768px) {
  .timeline-container {
    /* Vertical timeline on mobile */
    flex-direction: column;
    height: 100vh;
    overflow-y: scroll;
  }
  
  .event-details {
    /* Full-screen modal on mobile */
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
}
```

### Responsive Event Display
- **Desktop:** Horizontal timeline with hover details
- **Tablet:** Hybrid layout with expandable events
- **Mobile:** Vertical timeline with tap-to-expand cards

---

## OSINT Source Integration

### Source Credibility Framework
```typescript
interface SourceCredibility {
  primary_sources: {
    // Official statements, first-hand accounts
    weight: 1.0;
    verification: 'direct';
    examples: ['government_statements', 'artist_posts', 'official_press'];
  };
  
  secondary_sources: {
    // News reports, analysis pieces
    weight: 0.8;
    verification: 'editorial';
    examples: ['news_articles', 'expert_analysis', 'verified_journalism'];
  };
  
  tertiary_sources: {
    // Social media, forums, blogs
    weight: 0.4;
    verification: 'crowdsourced';
    examples: ['social_media', 'forums', 'unverified_blogs'];
  };
}
```

### Evidence Documentation
```json
{
  "event": {
    "id": "org-release-2021-11-08",
    "title": "«Организация» официальный релиз",
    "sources": [
      {
        "url": "https://music.yandex.ru/album/16847511",
        "type": "primary",
        "credibility": "high",
        "archived_url": "https://web.archive.org/web/20211108/...",
        "verification_notes": "Official release on verified platform"
      }
    ],
    "methodology": {
      "search_terms": ["Oxymiron Организация release November 2021"],
      "search_period": "2021-10-01 to 2021-11-30",
      "excluded_sources": ["unverified_leak_sites", "speculative_posts"],
      "confidence_calculation": {
        "base_confidence": 0.9,
        "source_triangulation": 0.1,
        "final_confidence": 1.0
      }
    }
  }
}
```

---

## Testing Requirements

### OSINT Verification Testing
- **Source Accessibility:** All source links active and archived
- **Date Accuracy:** Cross-verification of event dates across sources
- **Methodology Consistency:** Bias prevention protocols followed
- **Confidence Calibration:** Confidence ratings match evidence strength

### Interactive Testing
- **Timeline Navigation:** Smooth scrolling and zoom functionality
- **Event Selection:** Proper highlighting and detail display
- **Source Modal:** Functional source verification interface
- **Correlation Display:** Accurate visual correlation representation

### Performance Testing
- **Large Dataset:** Timeline performance with 500+ events
- **Zoom Stress Test:** Extreme zoom levels (10x magnification)
- **Mobile Performance:** Touch interaction responsiveness
- **Network Resilience:** Graceful handling of failed source loads

---

## Methodological Disclaimers

### Academic Integrity
```typescript
const methodologyDisclaimer = `
МЕТОДОЛОГИЧЕСКОЕ ПРЕДУПРЕЖДЕНИЕ:

Данный анализ представляет ретроспективное исследование корреляций 
между культурными и политическими событиями в период ноября 2021 - 
октября 2022 года. 

ОГРАНИЧЕНИЯ:
• Корреляция не означает причинно-следственную связь
• Анализ носит retrospective характер, не predictive
• Источники верифицированы, но интерпретация может содержать субъективные элементы
• Временные совпадения могут быть случайными

КРИТЕРИИ ДОСТОВЕРНОСТИ:
• High confidence: 2+ независимых первоисточника
• Medium confidence: 1 первоисточник + подтверждающие данные  
• Low confidence: единственный источник или противоречивые данные

Исследование проведено в соответствии с OSINT best practices 
и принципами академической честности.
`;
```

---

## Integration Points

### Astro Integration
```typescript
// astro/src/pages/longform/organizatsiya.astro
---
import Timeline from '@components/Timeline.svelte';
import { getTimelineData } from '@utils/osint-data';

const timelineEvents = await getTimelineData('organizatsiya-333-arc');
---

<Timeline 
  client:visible
  events={timelineEvents.events}
  dateRange={['2021-11-01', '2022-11-01']}
  showSourceLinks={true}
  highlightCorrelations={true}
  enableSourceModal={true}
/>
```

### КиберГонзо Content Integration
```typescript
// Expert analysis integration
interface CyberGonzoAnalysis {
  tremor_detection: {
    methodology: string;
    criteria: string[];
    bias_prevention: string[];
  };
  source_evaluation: {
    credibility_framework: SourceCredibility;
    verification_protocol: string;
  };
  correlation_analysis: {
    statistical_method: string;
    confidence_calculation: string;
    causal_disclaimers: string[];
  };
}
```

---

## Deployment Checklist

### Pre-deployment Verification
- [ ] КиберГонзо expert approval of OSINT methodology
- [ ] All source links functional and archived
- [ ] Confidence ratings calibrated and documented  
- [ ] Bias prevention protocols implemented
- [ ] Performance budget compliance verified
- [ ] Accessibility audit passed (WCAG 2.1 AA)

### Source Archival Requirements
```bash
# Archive all external sources
for url in timeline_sources:
  curl -X POST "https://web.archive.org/save/${url}"
  verify_archive_success(url)
```

### Ethical Review Checklist
- [ ] No private individuals exposed without consent
- [ ] Political analysis remains factual, not partisan
- [ ] Cultural sensitivity maintained throughout
- [ ] Academic standards met for all claims

---

## Success Metrics

### OSINT Quality Metrics
- **Source Verification:** 100% of high-confidence events have 2+ primary sources
- **Archive Coverage:** 100% of external sources have archive.org backups
- **Methodology Transparency:** Complete documentation of research process
- **Bias Prevention:** Implementation of all planned bias mitigation strategies

### Technical Metrics
- **Performance:** Timeline loads <1s for 100 events
- **Accuracy:** Event dates verified against multiple sources
- **Accessibility:** Full WCAG 2.1 AA compliance
- **Mobile Optimization:** Responsive design tested on target devices

### Editorial Metrics
- **Expert Approval:** КиберГонзо validation of methodology implementation
- **Academic Standard:** Peer-reviewable research methodology
- **Cultural Sensitivity:** Respectful analysis of sensitive political period
- **Transparency:** Clear documentation of limitations and uncertainties

---

**SPECIFICATION STATUS:** Complete and ready for constitutional verification  
**OSINT METHODOLOGY:** Falsifiable criteria and bias prevention implemented  
**QUALITY STANDARD:** Banking-level source verification maintained

---

*Specification prepared under Level 3 Cartouche Autonome authority*  
*Academic integrity and OSINT best practices enforced*