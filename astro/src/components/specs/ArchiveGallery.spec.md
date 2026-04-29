# ArchiveGallery Component Specification

**Version:** 1.0  
**Date:** 2026-04-29  
**Status:** Specification Phase  
**Expert:** Архивариус (Historical Context)

---

## Component Overview

Interactive gallery showcasing historical documents and cultural precedents that establish the 400-year pattern of performative declaration → State ratification cycles in Russian cultural resistance.

### Purpose
- Visual documentation of historical precedents (Радищев 1790 → Мандельштам 1933 → Оксимирон 2021)
- Archive-quality presentation of cultural DNA evidence
- Interactive exploration of pattern recognition methodology
- Educational bridge between historical and contemporary resistance forms

### Component Type
- **Framework:** Svelte 5
- **Integration:** Astro island component
- **Rendering:** Image gallery with archive-quality zoom and metadata

---

## Technical Specification

### Props Interface
```typescript
interface ArchiveGalleryProps {
  // Archive Collections
  collections: Array<{
    id: string;
    title: string;                     // e.g., "Радищев: Путешествие из Петербурга в Москву"
    period: string;                    // "1790" | "1933" | "2021"
    category: 'literary' | 'political' | 'legal' | 'cultural' | 'media';
    description: string;               // Архивариус interpretation
    
    documents: Array<{
      id: string;
      title: string;
      date: string;
      document_type: 'manuscript' | 'publication' | 'official_document' | 'media_coverage';
      
      // Archive Integration
      thumbnail_url: string;           // High-quality thumbnail
      full_image_url: string;         // Archive-quality full resolution
      archive_source: string;         // Institution/archive name
      catalog_number?: string;        // Official archive reference
      
      // Historical Context
      historical_significance: string;  // Архивариус analysis
      pattern_relevance: string;       // Connection to 400-year cycle
      survival_mechanism: string;      // How it survived/transmitted
      
      // Metadata
      transcription?: string;          // Text content if applicable
      translation?: string;            // English translation if needed
      scholarly_notes: string[];      // Academic annotations
      related_documents: string[];    // IDs of related documents
      
      // Copyright & Attribution
      copyright_status: 'public_domain' | 'fair_use' | 'permission_granted';
      attribution: string;
      rights_holder?: string;
    }>;
    
    // Pattern Analysis
    cultural_dna: {
      core_pattern: string;            // Unchanging resistance pattern
      adaptation_method: string;       // How pattern evolves with era
      transmission_path: string;       // Underground → mainstream path
      modern_parallel: string;         // Connection to 2021 events
    };
  }>;
  
  // Display Configuration
  layout: 'grid' | 'timeline' | 'comparison';
  showTranscriptions: boolean;        // Toggle document text overlay
  enableZoom: boolean;                // Archive-quality zoom functionality
  highlightPatterns: boolean;         // Visual pattern highlighting
  showScholarly: boolean;             // Academic annotations display
  
  // Interactive Features
  comparisonMode: boolean;            // Side-by-side historical comparison
  lightboxEnabled: boolean;           // Full-screen document examination
  searchEnabled: boolean;             // Text search within transcriptions
}
```

### State Management
```typescript
interface ComponentState {
  selectedCollection: string | null;   // Currently viewed collection
  selectedDocument: string | null;     // Currently examined document
  zoomLevel: number;                   // 1x to 10x magnification
  lightboxOpen: boolean;               // Full-screen document view
  comparisonDocs: string[];            // Documents selected for comparison
  
  // Archive Navigation
  currentPeriod: string | null;        // Filter by historical period
  searchQuery: string;                 // Text search within documents
  annotationLayer: boolean;            // Scholarly annotations overlay
  
  // Pattern Analysis
  patternMode: boolean;                // Highlight pattern connections
  dnaVisualization: boolean;           // Cultural DNA display mode
}
```

### Data Source
- **Input Format:** Curated archive data from Архивариус research
- **Data Location:** `astro/public/data/organizatsiya-archives.json`
- **Image Storage:** WebP format for efficiency, original quality preserved

---

## Archive Quality Standards

### Image Requirements
```typescript
interface ArchiveImageSpecs {
  thumbnail: {
    format: 'webp';
    dimensions: '400x300px';
    quality: 85;
    loading: 'lazy';
  };
  
  full_resolution: {
    format: 'webp';
    max_dimensions: '2400x1800px';
    quality: 95;
    progressive: true;
  };
  
  zoom_tiles: {
    // Deep Zoom format for archive-quality examination
    tile_size: 256;
    overlap: 1;
    max_level: 8;  // Up to 10x magnification
  };
}
```

### Metadata Standards
```typescript
interface ArchiveMetadata {
  dublin_core: {
    title: string;
    creator: string;
    date: string;
    description: string;
    subject: string[];
    rights: string;
    source: string;
  };
  
  scholarly_apparatus: {
    provenance: string;              // Document history
    condition_notes: string;         // Physical condition
    editorial_notes: string[];      // Academic commentary
    bibliography: string[];          // Related scholarship
  };
  
  technical_metadata: {
    digitization_date: string;
    scanner_settings: string;
    color_profile: string;
    dpi: number;
  };
}
```

---

## Visual Design Specification

### Brand Guide v2.5 Integration
- **Archive Aesthetic:**
  - Bordeaux (#7D4450) - archive frames, period markers
  - Sage (#839E75) - scholarly annotations, metadata
  - Amber (#E8AD4A) - pattern highlights, connections
  - Ivory (#FEFCF6) - document backgrounds, reading areas

### Gallery Layout Modes
```
GRID MODE:
┌─────────────────────────────────────────────┐
│ 📚 ИСТОРИЧЕСКИЕ КОРНИ: 400-летний паттерн    │
├─────────────────────────────────────────────┤
│ [1790] [1933] [2021] [All] [Pattern View]   │
├─────────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │
│ │ 1790 │ │ 1933 │ │ 2021 │ │Pattern│        │
│ │ [📜] │ │ [📰] │ │ [🎵] │ │ [🔗] │        │
│ │Радищ.│ │Мандел.│ │Оксим.│ │ DNA │        │
│ └──────┘ └──────┘ └──────┘ └──────┘        │
├─────────────────────────────────────────────┤
│ Selected: Радищев "Путешествие..." (1790)   │
│ Pattern: Performative declaration of truth  │
│ Result: State ratification through censure  │
└─────────────────────────────────────────────┘

COMPARISON MODE:
┌─────────────────────────────────────────────┐
│ 1790: Радищев          │ 2021: Оксимирон    │
│ ┌─────────────────────┐ │ ┌─────────────────┐│
│ │ [Manuscript scan]   │ │ │ [Album cover]   ││
│ │ "Чудище обло, озор- │ │ │ "В восьмидесят- ││
│ │ но, огромно, стозев-│ │ │ ых всё было..."  ││
│ └─────────────────────┘ │ └─────────────────┘│
│ Pattern: Literary      │ Pattern: Musical    │
│ Method: Allegory       │ Method: Direct      │
│ Result: Exile         │ Result: Investigation│
└─────────────────────────────────────────────┘
```

### Pattern Visualization
```typescript
interface PatternVisualization {
  cultural_dna: {
    declaration_phase: {
      color: '#E8AD4A';  // Amber
      symbol: '📢';
      description: 'Performative truth declaration';
    };
    transmission_phase: {
      color: '#839E75';  // Sage  
      symbol: '🌊';
      description: 'Underground circulation';
    };
    ratification_phase: {
      color: '#7D4450';  // Bordeaux
      symbol: '⚖️';
      description: 'State response/validation';
    };
  };
  
  timeline_connections: {
    stroke_style: 'dashed';
    opacity: 0.7;
    animation: 'flow_animation';
  };
}
```

---

## Accessibility Compliance

### WCAG 2.1 AA Requirements
- **Image Alt Text:** Comprehensive descriptions for all archive documents
- **Keyboard Navigation:** Full gallery navigation without mouse
- **Screen Reader Support:** Structured markup for document metadata
- **Zoom Accessibility:** Keyboard-controlled magnification for vision support

### Archive Accessibility
```typescript
// Comprehensive alt text for historical documents
const generateArchiveAltText = (document: ArchiveDocument): string => {
  return `Historical document from ${document.date}: ${document.title}. 
          Document type: ${document.document_type}. 
          Archived at: ${document.archive_source}. 
          Scholarly significance: ${document.pattern_relevance}`;
};

// Structured metadata for screen readers
const documentSchema = {
  '@type': 'ArchivalResource',
  'name': document.title,
  'dateCreated': document.date,
  'creator': document.attribution,
  'description': document.historical_significance,
  'isPartOf': document.archive_source
};
```

### Keyboard Interactions
```typescript
const keyboardControls = {
  'Arrow Keys': 'Navigate between documents in grid',
  'Enter': 'Open document in lightbox',
  'Space': 'Toggle pattern highlighting',
  'Z': 'Toggle zoom mode',
  'T': 'Toggle transcription overlay',
  'C': 'Enter comparison mode',
  'Escape': 'Exit lightbox/comparison mode',
  'S': 'Open search within transcriptions'
};
```

---

## Security Considerations

### Archive Content Security
```typescript
// Image security validation
const validateArchiveImage = (imageUrl: string): boolean => {
  const allowedDomains = [
    'underground.folkup.life',  // Our domain
    'archive.org',              // Internet Archive
    'digitool.rsl.ru',         // Russian State Library  
    'nlr.ru',                  // National Library of Russia
    'manuscript-archives.org'   // Verified manuscript collections
  ];
  
  try {
    const url = new URL(imageUrl);
    return allowedDomains.some(domain => url.hostname.endsWith(domain));
  } catch {
    return false;
  }
};

// Transcription content sanitization
const sanitizeTranscription = (text: string): string => {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: ['em', 'strong', 'span', 'sup', 'sub'],
    ALLOWED_ATTR: ['class', 'lang'],
    STRIP_COMMENTS: true
  });
};
```

### Copyright Compliance
```typescript
interface CopyrightVerification {
  public_domain: {
    criteria: 'pre-1926 OR author_death_plus_70_years';
    verification_required: true;
  };
  
  fair_use: {
    purpose: 'educational' | 'scholarly' | 'criticism';
    amount: 'minimal_necessary_excerpt';
    market_effect: 'no_commercial_substitution';
    documentation_required: true;
  };
  
  permission_granted: {
    rights_holder: string;
    permission_scope: string;
    expiration_date?: string;
    documentation_path: string;
  };
}
```

---

## Performance Requirements

### Performance Budget
- **Bundle Size:** <25KB component + archive viewer
- **Image Loading:** <2s for high-resolution document load
- **Gallery Navigation:** <100ms thumbnail load and transition
- **Zoom Performance:** <16ms for smooth pan/zoom operations

### Optimization Strategies
- **Progressive Images:** WebP with JPEG fallback
- **Lazy Loading:** Images load as they enter viewport
- **Image Caching:** Intelligent prefetching of likely-viewed documents
- **Virtual Scrolling:** Efficient rendering for large collections

---

## Mobile UX Specification

### Touch Interactions
- **Tap Document:** Open in lightbox with metadata
- **Long Press:** Quick pattern comparison with other periods
- **Pinch Zoom:** Archive-quality examination with text recognition
- **Swipe Navigation:** Move between documents in collection
- **Two-Finger Pan:** Navigate zoomed document view

### Mobile Layout Adaptations
```css
@media (max-width: 768px) {
  .archive-gallery {
    /* Single column on mobile */
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .document-comparison {
    /* Vertical comparison on mobile */
    flex-direction: column;
    height: 100vh;
  }
  
  .metadata-panel {
    /* Collapsible metadata */
    position: fixed;
    bottom: 0;
    transform: translateY(80%);
    transition: transform 0.3s;
  }
}
```

---

## Historical Content Integration

### Архивариус Expert Framework
```typescript
interface ArchivariusAnalysis {
  pattern_recognition: {
    core_elements: string[];          // Unchanging resistance patterns
    adaptive_mechanisms: string[];    // Era-specific adaptations
    survival_strategies: string[];    // Cultural transmission methods
  };
  
  historical_precedents: {
    radishchev_1790: {
      method: 'allegorical_literature';
      state_response: 'siberian_exile';
      cultural_impact: 'underground_circulation';
      modern_parallel: 'metaphorical_resistance_in_hip_hop';
    };
    
    mandelstam_1933: {
      method: 'direct_poetic_criticism';
      state_response: 'arrest_and_deportation';
      cultural_impact: 'samizdat_preservation';
      modern_parallel: 'social_media_viral_resistance';
    };
    
    oxymiron_2021: {
      method: 'musical_cultural_seismography';
      state_response: 'investigation_and_pressure';
      cultural_impact: 'mainstream_cultural_shift';
      historical_validation: '400_year_pattern_confirmation';
    };
  };
  
  cultural_dna_analysis: {
    transmission_mechanisms: string[];
    adaptation_patterns: string[];
    persistence_factors: string[];
    modern_manifestations: string[];
  };
}
```

### Document Collections Structure
```json
{
  "collection": {
    "id": "radishchev-journey-1790",
    "title": "А.Н. Радищев: Путешествие из Петербурга в Москву",
    "period": "1790",
    "documents": [
      {
        "id": "journey-title-page",
        "title": "Титульный лист первого издания",
        "document_type": "publication",
        "historical_significance": "Первое печатное проявление паттерна performative declaration в русской культуре",
        "pattern_relevance": "Establishes template: literary vehicle → social criticism → state response",
        "survival_mechanism": "Underground circulation despite imperial ban",
        "transcription": "[Historical text excerpt for educational analysis]",
        "copyright_status": "public_domain",
        "attribution": "Российская государственная библиотека"
      }
    ]
  }
}
```

---

## Testing Requirements

### Archive Quality Testing
- **Image Fidelity:** Lossless zoom to 10x magnification
- **Text Readability:** OCR accuracy for transcribed documents
- **Metadata Integrity:** Complete scholarly apparatus display
- **Cross-Platform:** Consistent rendering across browsers/devices

### Historical Accuracy Testing
- **Date Verification:** Cross-reference with multiple historical sources
- **Attribution Accuracy:** Verify all archive sources and catalog numbers
- **Pattern Analysis:** Scholarly review of historical connections
- **Cultural Sensitivity:** Respectful presentation of all periods

### Performance Testing
- **Large Collections:** Gallery performance with 100+ documents
- **High-Resolution Zoom:** Performance with 10MB+ archive images
- **Mobile Performance:** Touch interaction responsiveness
- **Network Resilience:** Graceful degradation with slow connections

---

## Integration Points

### Astro Integration
```typescript
// astro/src/pages/longform/organizatsiya.astro
---
import ArchiveGallery from '@components/ArchiveGallery.svelte';
import { getArchiveCollections } from '@utils/archive-data';

const archiveData = await getArchiveCollections('resistance-patterns-400-years');
---

<ArchiveGallery 
  client:visible
  collections={archiveData.collections}
  layout="grid"
  showTranscriptions={true}
  enableZoom={true}
  highlightPatterns={true}
  comparisonMode={false}
  lightboxEnabled={true}
/>
```

### Archive Management System
```typescript
// Archive metadata management
interface ArchiveManagement {
  digital_preservation: {
    backup_schedule: 'daily';
    format_migration: 'webp_to_avif_when_supported';
    integrity_checking: 'sha256_verification';
  };
  
  access_control: {
    public_domain: 'unrestricted_access';
    fair_use: 'educational_context_only';
    permission_granted: 'scope_limited_access';
  };
  
  scholarly_updates: {
    annotation_versioning: true;
    expert_review_cycle: '6_months';
    community_contribution: 'moderated_submission';
  };
}
```

---

## Deployment Checklist

### Pre-deployment Verification
- [ ] Архивариус expert approval of historical analysis
- [ ] All archive images accessible and properly attributed
- [ ] Copyright status verified for all documents
- [ ] Pattern analysis scholarly reviewed
- [ ] Performance budget compliance confirmed
- [ ] Accessibility audit passed (WCAG 2.1 AA)

### Legal Compliance
```typescript
// Copyright compliance verification
const copyrightAudit = {
  public_domain_verification: 'all_pre_1926_documents_cleared',
  fair_use_documentation: 'educational_purpose_documented',
  archive_permissions: 'institutional_agreements_signed',
  attribution_completeness: 'all_sources_properly_credited'
};
```

### Archive Partnership Requirements
- **Russian State Library:** Digital access agreement
- **Internet Archive:** Backup hosting arrangement
- **Academic Institutions:** Scholarly review partnerships
- **Cultural Organizations:** Community engagement protocols

---

## Success Metrics

### Archive Quality Metrics
- **Image Quality:** 100% archive-standard digitization
- **Metadata Completeness:** Full Dublin Core compliance
- **Scholarly Standards:** Peer-reviewable historical analysis
- **Attribution Accuracy:** 100% proper source crediting

### Educational Metrics
- **Pattern Comprehension:** Clear historical connection demonstration
- **Cultural Bridge:** Successful linking of historical and contemporary
- **Academic Value:** University-level educational resource quality
- **Community Engagement:** Public appreciation for cultural heritage

### Technical Metrics
- **Performance:** Gallery loads <2s for complete collections
- **Accessibility:** Full WCAG 2.1 AA compliance maintained
- **Mobile Optimization:** Archive quality maintained on mobile devices
- **Archive Integrity:** Zero data loss, full metadata preservation

---

**SPECIFICATION STATUS:** Complete and ready for constitutional verification  
**HISTORICAL METHODOLOGY:** Archive-quality standards maintained throughout  
**CULTURAL SENSITIVITY:** Respectful preservation of Russian cultural heritage

---

*Specification prepared under Level 3 Cartouche Autonome authority*  
*Archive standards and scholarly integrity enforced*