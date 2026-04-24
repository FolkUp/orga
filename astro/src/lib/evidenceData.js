/**
 * Sample Evidence Data for ORGA Cultural Investigation
 * Evidence gallery data structure with full metadata support
 * Complies with EU fair dealing framework for cultural analysis
 */

export const sampleEvidenceData = [
  {
    id: "evidence-001",
    title: "Oxxxymiron Song Release Announcement",
    date: "2021-11-08",
    type: "media",
    significance: "critical",
    source: "YouTube Official Channel",
    description: "Original release announcement video on YouTube showing the first public reveal of the new song. Features official artwork and metadata that became culturally significant in the post-Soviet hip-hop scene.",
    culturalContext: "This release marked a significant moment in Russian hip-hop culture, representing the intersection of artistic expression and cultural identity in contemporary post-Soviet society.",
    media: {
      type: "image",
      url: "/evidence/youtube-release-announcement.webp",
      thumbnail: "/evidence/thumbs/youtube-release-thumb.webp",
      alt: "YouTube video thumbnail showing Oxxxymiron song release announcement with official artwork",
      caption: "Official release announcement, 8 November 2021"
    },
    metadata: {
      views: 2100000,
      engagement: "45K likes, 2.3K comments",
      culturalImpact: "high",
      verificationLevel: "primary-source",
      platform: "YouTube",
      duration: "3:42"
    },
    timelineConnection: ["2021-11-08", "timeline-event-release"],
    heroConnection: ["scene-1", "hero-announcement"],
    tags: ["release", "youtube", "announcement", "music-video", "official"],
    legal: {
      quotationLength: 120, // characters in description
      purpose: "criticism", // EU fair dealing
      attribution: "Screenshot of public YouTube video",
      dateAccessed: "2024-04-20"
    }
  },

  {
    id: "evidence-002",
    title: "Social Media Cultural Impact Analysis",
    date: "2021-11-09",
    type: "social",
    significance: "primary",
    source: "Twitter / VKontakte Aggregated Data",
    description: "Comprehensive analysis of social media response within first 24 hours, showing viral spread patterns and cultural discourse around the release across multiple platforms.",
    culturalContext: "Social media analytics reveal how contemporary Russian hip-hop culture spreads through digital networks, particularly among younger demographics in post-Soviet states.",
    media: {
      type: "image",
      url: "/evidence/social-media-analysis.webp",
      thumbnail: "/evidence/thumbs/social-media-thumb.webp",
      alt: "Charts and graphs showing social media engagement metrics and sentiment analysis",
      caption: "24-hour social media impact analysis, multiple platforms"
    },
    metadata: {
      platforms: ["Twitter", "VKontakte", "Instagram", "TikTok"],
      totalMentions: 15600,
      sentimentPositive: "78%",
      culturalImpact: "high",
      verificationLevel: "secondary-source",
      methodology: "Social media API aggregation"
    },
    timelineConnection: ["2021-11-09", "timeline-social-response"],
    heroConnection: ["scene-2", "hero-viral-spread"],
    tags: ["social-media", "cultural-impact", "analytics", "viral", "reception"],
    legal: {
      quotationLength: 200,
      purpose: "analysis",
      attribution: "Aggregated public social media data",
      dateAccessed: "2024-04-20"
    }
  },

  {
    id: "evidence-003",
    title: "Academic Paper on Post-Soviet Hip-Hop",
    date: "2022-03-15",
    type: "academic",
    significance: "supporting",
    source: "Journal of Popular Music Studies, Vol. 34, No. 2",
    description: "Scholarly analysis of hip-hop's role in post-Soviet cultural identity formation, with specific reference to the November 2021 cultural moment.",
    culturalContext: "Academic perspective on how hip-hop serves as a vehicle for cultural expression and identity formation in post-Soviet societies, providing theoretical framework for understanding the broader cultural significance.",
    media: {
      type: "document",
      url: "/evidence/academic-paper-post-soviet-hiphop.pdf",
      thumbnail: "/evidence/thumbs/academic-paper-thumb.webp",
      alt: "First page of academic paper showing title and abstract",
      caption: "Petrov, A. (2022). Hip-Hop and Cultural Identity in Post-Soviet Space"
    },
    metadata: {
      author: "Dr. Aleksei Petrov",
      institution: "Moscow State University",
      doi: "10.1111/jpms.12345",
      citations: 23,
      culturalImpact: "medium",
      verificationLevel: "primary-source",
      peerReviewed: true
    },
    timelineConnection: ["2022-03-15", "timeline-academic-analysis"],
    heroConnection: ["scene-3", "hero-academic-context"],
    tags: ["academic", "hip-hop", "post-soviet", "cultural-identity", "peer-reviewed"],
    legal: {
      quotationLength: 500,
      purpose: "review",
      attribution: "Petrov, A. (2022). Journal of Popular Music Studies",
      dateAccessed: "2024-04-20"
    }
  },

  {
    id: "evidence-004",
    title: "Music Video Cultural Symbolism Analysis",
    date: "2021-11-10",
    type: "visual",
    significance: "primary",
    source: "Frame-by-frame analysis of official music video",
    description: "Detailed visual analysis of symbolic elements in the official music video, identifying references to Soviet and post-Soviet cultural imagery and their contemporary recontextualization.",
    culturalContext: "Visual symbols in the video demonstrate complex relationship between Soviet heritage and contemporary Russian identity, particularly in artistic expression.",
    media: {
      type: "image",
      url: "/evidence/music-video-symbolism.webp",
      thumbnail: "/evidence/thumbs/video-symbolism-thumb.webp",
      alt: "Collage of key frames from music video highlighting symbolic elements and cultural references",
      caption: "Key symbolic moments from official music video (fair use for cultural analysis)"
    },
    metadata: {
      videoLength: "4:23",
      keyFrames: 12,
      symbolsIdentified: ["Soviet architecture", "Contemporary urban landscape", "Cultural fusion elements"],
      culturalImpact: "high",
      verificationLevel: "primary-source",
      analysisMethod: "Visual semiotics"
    },
    timelineConnection: ["2021-11-10", "timeline-video-release"],
    heroConnection: ["scene-4", "hero-visual-analysis"],
    tags: ["music-video", "symbolism", "visual-analysis", "cultural-fusion", "semiotics"],
    legal: {
      quotationLength: 0, // visual analysis, not text quote
      purpose: "criticism",
      attribution: "Frame analysis of official music video for cultural research",
      dateAccessed: "2024-04-20"
    }
  },

  {
    id: "evidence-005",
    title: "Legal Framework for Cultural Expression",
    date: "2021-12-01",
    type: "legal",
    significance: "contextual",
    source: "Russian Federation Cultural Policy Document 2021",
    description: "Official government position on contemporary music and cultural expression, providing legal and policy context for understanding the cultural environment in which the work was released.",
    culturalContext: "Government policy documents reveal the official stance on cultural expression and artistic freedom, contextualizing the significance of independent hip-hop culture in contemporary Russia.",
    media: {
      type: "document",
      url: "/evidence/cultural-policy-document.pdf",
      thumbnail: "/evidence/thumbs/legal-document-thumb.webp",
      alt: "Official government document header showing Russian Federation cultural policy guidelines",
      caption: "Russian Federation Cultural Policy Document, December 2021"
    },
    metadata: {
      documentType: "Government Policy",
      authority: "Ministry of Culture, Russian Federation",
      publicationDate: "2021-12-01",
      pageCount: 47,
      culturalImpact: "medium",
      verificationLevel: "primary-source",
      officialStatus: true
    },
    timelineConnection: ["2021-12-01", "timeline-policy-context"],
    heroConnection: ["scene-5", "hero-legal-context"],
    tags: ["legal", "cultural-policy", "government", "artistic-freedom", "context"],
    legal: {
      quotationLength: 300,
      purpose: "analysis",
      attribution: "Russian Federation Ministry of Culture Policy Document (2021)",
      dateAccessed: "2024-04-20"
    }
  },

  {
    id: "evidence-006",
    title: "Fan Community Response Documentation",
    date: "2021-11-12",
    type: "social",
    significance: "supporting",
    source: "Fan Forum Archives and Community Platforms",
    description: "Comprehensive documentation of fan community responses, including fan art, discussion threads, and community-generated content that emerged in response to the release.",
    culturalContext: "Fan community responses demonstrate grassroots cultural engagement and the participatory nature of contemporary music culture in digital spaces.",
    media: {
      type: "image",
      url: "/evidence/fan-community-response.webp",
      thumbnail: "/evidence/thumbs/fan-community-thumb.webp",
      alt: "Collage of fan art, forum posts, and community content showing diverse community responses",
      caption: "Fan community response compilation (anonymized for privacy)"
    },
    metadata: {
      platforms: ["Rap.ru", "VK Communities", "Reddit", "Discord"],
      postsAnalyzed: 1200,
      fanArtPieces: 34,
      communitySize: "50K+ active members",
      culturalImpact: "medium",
      verificationLevel: "secondary-source",
      privacyStatus: "Anonymized"
    },
    timelineConnection: ["2021-11-12", "timeline-fan-response"],
    heroConnection: ["scene-6", "hero-community-impact"],
    tags: ["fan-community", "grassroots", "participatory-culture", "digital-culture", "community"],
    legal: {
      quotationLength: 150,
      purpose: "analysis",
      attribution: "Anonymized fan community posts (consent obtained)",
      dateAccessed: "2024-04-20"
    }
  },

  {
    id: "evidence-007",
    title: "Music Industry Context Report",
    date: "2021-11-15",
    type: "media",
    significance: "contextual",
    source: "Music Industry Weekly Analysis",
    description: "Professional music industry analysis placing the release within broader context of Russian hip-hop market trends and industry developments during late 2021.",
    culturalContext: "Industry analysis provides insight into commercial and artistic pressures shaping contemporary Russian hip-hop, contextualizing the work within broader market dynamics.",
    media: {
      type: "document",
      url: "/evidence/industry-analysis-report.pdf",
      thumbnail: "/evidence/thumbs/industry-report-thumb.webp",
      alt: "Industry report cover showing market analysis charts and Russian music industry branding",
      caption: "Music Industry Weekly - Russian Hip-Hop Market Analysis, November 2021"
    },
    metadata: {
      publication: "Music Industry Weekly",
      analyst: "Dmitri Volkov",
      marketSize: "€45M (Russian hip-hop 2021)",
      growthRate: "+18% YoY",
      culturalImpact: "medium",
      verificationLevel: "secondary-source",
      industryFocus: true
    },
    timelineConnection: ["2021-11-15", "timeline-industry-context"],
    heroConnection: ["scene-7", "hero-market-analysis"],
    tags: ["music-industry", "market-analysis", "commercial-context", "trends", "economics"],
    legal: {
      quotationLength: 400,
      purpose: "analysis",
      attribution: "Music Industry Weekly Analysis (November 2021)",
      dateAccessed: "2024-04-20"
    }
  },

  {
    id: "evidence-008",
    title: "Cross-Cultural Comparison Study",
    date: "2022-01-20",
    type: "academic",
    significance: "supporting",
    source: "International Journal of Cultural Studies",
    description: "Comparative study examining similar cultural moments in post-Soviet hip-hop across different countries (Russia, Ukraine, Kazakhstan), highlighting regional variations in cultural expression.",
    culturalContext: "Cross-cultural analysis reveals how post-Soviet hip-hop culture manifests differently across various post-Soviet states, while maintaining common threads of cultural identity and expression.",
    media: {
      type: "document",
      url: "/evidence/cross-cultural-comparison.pdf",
      thumbnail: "/evidence/thumbs/comparison-study-thumb.webp",
      alt: "Academic paper cover showing comparative analysis charts across post-Soviet states",
      caption: "Cross-Cultural Analysis of Post-Soviet Hip-Hop Expression (2022)"
    },
    metadata: {
      authors: ["Dr. Elena Kozlova", "Prof. Sergey Petrov", "Dr. Aida Nazarbayeva"],
      universities: ["MSU", "Kyiv National University", "Al-Farabi Kazakh University"],
      countries: ["Russia", "Ukraine", "Kazakhstan"],
      sampleSize: "300 artists",
      culturalImpact: "high",
      verificationLevel: "primary-source",
      comparative: true
    },
    timelineConnection: ["2022-01-20", "timeline-comparative-analysis"],
    heroConnection: ["scene-8", "hero-regional-context"],
    tags: ["comparative-study", "post-soviet", "regional-analysis", "cultural-variation", "academic"],
    legal: {
      quotationLength: 600,
      purpose: "review",
      attribution: "Kozlova et al. (2022). International Journal of Cultural Studies",
      dateAccessed: "2024-04-20"
    }
  }
];

/**
 * Evidence data utilities
 */
export const evidenceUtils = {
  /**
   * Get evidence by ID
   */
  getById: (id) => sampleEvidenceData.find(item => item.id === id),

  /**
   * Get evidence by type
   */
  getByType: (type) => sampleEvidenceData.filter(item => item.type === type),

  /**
   * Get evidence by significance
   */
  getBySignificance: (significance) => sampleEvidenceData.filter(item => item.significance === significance),

  /**
   * Get evidence by timeline connection
   */
  getByTimelineEvent: (eventId) => sampleEvidenceData.filter(item =>
    item.timelineConnection && item.timelineConnection.includes(eventId)
  ),

  /**
   * Get evidence by hero scene connection
   */
  getByHeroScene: (sceneId) => sampleEvidenceData.filter(item =>
    item.heroConnection && item.heroConnection.includes(sceneId)
  ),

  /**
   * Get all unique types
   */
  getAllTypes: () => [...new Set(sampleEvidenceData.map(item => item.type))],

  /**
   * Get all unique significance levels
   */
  getAllSignificanceLevels: () => [...new Set(sampleEvidenceData.map(item => item.significance))],

  /**
   * Get evidence statistics
   */
  getStatistics: () => {
    const stats = {
      total: sampleEvidenceData.length,
      byType: {},
      bySignificance: {},
      byVerificationLevel: {},
      dateRange: {
        earliest: null,
        latest: null
      }
    };

    sampleEvidenceData.forEach(item => {
      // Count by type
      stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;

      // Count by significance
      stats.bySignificance[item.significance] = (stats.bySignificance[item.significance] || 0) + 1;

      // Count by verification level
      if (item.metadata.verificationLevel) {
        stats.byVerificationLevel[item.metadata.verificationLevel] =
          (stats.byVerificationLevel[item.metadata.verificationLevel] || 0) + 1;
      }

      // Track date range
      const itemDate = new Date(item.date);
      if (!stats.dateRange.earliest || itemDate < stats.dateRange.earliest) {
        stats.dateRange.earliest = itemDate;
      }
      if (!stats.dateRange.latest || itemDate > stats.dateRange.latest) {
        stats.dateRange.latest = itemDate;
      }
    });

    return stats;
  },

  /**
   * Validate evidence item structure
   */
  validateEvidenceItem: (item) => {
    const required = ['id', 'title', 'date', 'type', 'significance', 'source', 'description'];
    const missing = required.filter(field => !item[field]);

    if (missing.length > 0) {
      throw new Error(`Evidence item missing required fields: ${missing.join(', ')}`);
    }

    // Validate media structure if present
    if (item.media) {
      const mediaRequired = ['type', 'url'];
      const mediaMissing = mediaRequired.filter(field => !item.media[field]);
      if (mediaMissing.length > 0) {
        throw new Error(`Evidence media missing required fields: ${mediaMissing.join(', ')}`);
      }
    }

    // Validate legal compliance fields
    if (item.legal) {
      const legalRequired = ['purpose', 'attribution'];
      const legalMissing = legalRequired.filter(field => !item.legal[field]);
      if (legalMissing.length > 0) {
        throw new Error(`Evidence legal compliance missing required fields: ${legalMissing.join(', ')}`);
      }
    }

    return true;
  },

  /**
   * Export evidence for external analysis
   */
  exportEvidence: (format = 'json') => {
    switch (format) {
      case 'json':
        return JSON.stringify(sampleEvidenceData, null, 2);

      case 'csv':
        const headers = ['id', 'title', 'date', 'type', 'significance', 'source'];
        const rows = sampleEvidenceData.map(item =>
          headers.map(field => item[field] || '').join(',')
        );
        return [headers.join(','), ...rows].join('\n');

      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }
};

/**
 * Performance optimization utilities
 */
export const evidencePerformance = {
  /**
   * Preload critical evidence thumbnails
   */
  preloadThumbnails: () => {
    const criticalEvidence = sampleEvidenceData
      .filter(item => item.significance === 'critical')
      .slice(0, 4);

    criticalEvidence.forEach(item => {
      if (item.media && item.media.thumbnail) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = item.media.thumbnail;
        document.head.appendChild(link);
      }
    });
  },

  /**
   * Lazy load evidence images with intersection observer
   */
  setupLazyLoading: () => {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px'
    });

    return imageObserver;
  }
};