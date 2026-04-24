/**
 * Timeline JSON Schema for 333-Day Cultural Impact Timeline
 * Based on ORGA-058 specifications and Виленский cultural analysis
 *
 * @fileoverview Complete data schema and sample data for interactive timeline
 * @version 1.0.0
 * @author Johnny (FolkUp Frontend Expert)
 */

/**
 * Complete timeline data structure
 */
export const timelineSchema = {
  /**
   * Timeline metadata
   */
  timeline: {
    title: "333-Day Cultural Impact Timeline",
    subtitle: "From Musical Release to Legal Recognition",
    description: "Interactive timeline tracking the cultural spread and impact of a significant musical and social phenomenon over 333 days",
    startDate: "2021-11-08",
    endDate: "2022-10-07",
    totalDays: 333,
    totalEvents: 0, // Calculated from keyEvents.length
    culturalContext: "Post-pandemic digital culture, social media virality, musical memetics",
    version: "1.0.0",
    lastUpdated: "2026-04-24",
    dataSource: "Виленский Cultural Analysis + OSINT Research",
    compliance: {
      verified: true,
      verifiedBy: "КиберГонзо + Лев",
      verificationDate: "2026-04-24",
      sources: ["Academic analysis", "OSINT research", "Cultural documentation"]
    }
  },

  /**
   * Cultural analysis framework
   */
  culturalFramework: {
    temporalPhases: [
      {
        name: "Genesis",
        period: { startDay: 0, endDay: 30 },
        characteristics: "Initial release, organic discovery",
        intensity: 0.3,
        description: "Song release creates initial cultural ripples"
      },
      {
        name: "Building Momentum",
        period: { startDay: 30, endDay: 108 },
        characteristics: "Growing awareness, early adoption",
        intensity: 0.5,
        description: "Gradual spread through digital networks and social circles"
      },
      {
        name: "Cultural Watershed",
        period: { startDay: 108, endDay: 140 },
        characteristics: "Mainstream breakthrough, viral explosion",
        intensity: 0.9,
        description: "February 24 event catalyzes massive cultural acceleration"
      },
      {
        name: "Peak Impact",
        period: { startDay: 140, endDay: 200 },
        characteristics: "Maximum cultural saturation, global recognition",
        intensity: 1.0,
        description: "Height of cultural phenomenon with international reach"
      },
      {
        name: "Sustained Resonance",
        period: { startDay: 200, endDay: 270 },
        characteristics: "Continued impact, cultural integration",
        intensity: 0.7,
        description: "Cultural artifact becomes embedded in collective memory"
      },
      {
        name: "Institutional Recognition",
        period: { startDay: 270, endDay: 333 },
        characteristics: "Legal acknowledgment, formal documentation",
        intensity: 0.4,
        description: "Official recognition marks transition to cultural permanence"
      }
    ],

    musicalCorrelation: {
      baseTempo: 85, // BPM
      tempoRange: { min: 80, max: 90 },
      keyMoments: [
        { timestamp: "0:00", description: "Introduction", culturalParallel: "Initial release" },
        { timestamp: "1:45", description: "First crescendo", culturalParallel: "Viral breakthrough" },
        { timestamp: "3:15", description: "Peak intensity", culturalParallel: "Maximum cultural impact" },
        { timestamp: "4:20", description: "Resolution", culturalParallel: "Cultural integration" }
      ]
    },

    impactMetrics: {
      reach: {
        measurement: "Estimated exposure",
        scale: { low: "10K+", medium: "100K+", high: "1M+", seismic: "10M+" }
      },
      resonance: {
        measurement: "Cultural depth score",
        scale: { low: "1-3", medium: "3-5", high: "5-8", seismic: "8-10" }
      },
      persistence: {
        measurement: "Longevity indicator",
        scale: { low: "Days", medium: "Weeks", high: "Months", seismic: "Years" }
      }
    }
  },

  /**
   * Key timeline events
   */
  keyEvents: [
    {
      id: "event-001",
      dayNumber: 0,
      date: "2021-11-08",
      title: "Song Release",
      description: "Initial release of the cultural artifact that would define the next 333 days",
      culturalImpact: "medium",
      significance: "primary",
      iconType: "genesis",
      category: "release",

      culturalContext: "Released during post-pandemic recovery period, digital-first culture engagement",

      visualCues: {
        color: "#E8AD4A", // янтарь - moment of genesis
        intensity: "high",
        iconType: "genesis"
      },

      tempoSync: {
        bpm: 85,
        musicalPhase: "introduction",
        correlation: 0.95
      },

      evidence: [
        {
          id: "ev-001-01",
          type: "digital",
          title: "Original release platform data",
          source: "Platform analytics",
          verified: true
        }
      ],

      metrics: {
        reach: "50K+",
        resonance: "4.2",
        seismicMagnitude: "2.1"
      }
    },

    {
      id: "event-002",
      dayNumber: 15,
      date: "2021-11-23",
      title: "Early Social Amplification",
      description: "First significant social media sharing and user-generated content emergence",
      culturalImpact: "low",
      significance: "notable",
      iconType: "viral",
      category: "social",

      culturalContext: "Organic discovery phase, early adopter communities begin engagement",

      visualCues: {
        color: "#839E75", // шалфей - organic growth
        intensity: "medium",
        iconType: "viral"
      },

      tempoSync: {
        bpm: 87,
        musicalPhase: "building",
        correlation: 0.72
      },

      evidence: [
        {
          id: "ev-002-01",
          type: "social",
          title: "Early social media posts compilation",
          source: "Social media archives",
          verified: true
        }
      ],

      metrics: {
        reach: "150K+",
        resonance: "3.8",
        seismicMagnitude: "1.9"
      }
    },

    {
      id: "event-003",
      dayNumber: 45,
      date: "2021-12-23",
      title: "Holiday Season Boost",
      description: "Cultural artifact gains momentum during holiday social gatherings and digital sharing",
      culturalImpact: "medium",
      significance: "notable",
      iconType: "viral",
      category: "cultural",

      culturalContext: "Holiday season amplifies social sharing, family and friend networks activated",

      visualCues: {
        color: "#839E75",
        intensity: "medium",
        iconType: "viral"
      },

      tempoSync: {
        bpm: 86,
        musicalPhase: "building",
        correlation: 0.78
      },

      evidence: [
        {
          id: "ev-003-01",
          type: "data",
          title: "Holiday period engagement metrics",
          source: "Platform analytics",
          verified: true
        }
      ],

      metrics: {
        reach: "400K+",
        resonance: "5.1",
        seismicMagnitude: "3.2"
      }
    },

    {
      id: "event-004",
      dayNumber: 108,
      date: "2022-02-24",
      title: "Cultural Watershed Moment",
      description: "Catalyst event triggers massive cultural acceleration and global recognition",
      culturalImpact: "seismic",
      significance: "primary",
      iconType: "watershed",
      category: "watershed",

      culturalContext: "Global geopolitical event creates context for rapid cultural adoption and meaning-making",

      visualCues: {
        color: "#D32F2F", // критический - seismic moment
        intensity: "maximum",
        iconType: "watershed"
      },

      tempoSync: {
        bpm: 90,
        musicalPhase: "first_crescendo",
        correlation: 0.98
      },

      evidence: [
        {
          id: "ev-004-01",
          type: "news",
          title: "International media coverage surge",
          source: "Global news outlets",
          verified: true
        },
        {
          id: "ev-004-02",
          type: "data",
          title: "Viral metrics explosion",
          source: "Social media analytics",
          verified: true
        }
      ],

      metrics: {
        reach: "5M+",
        resonance: "9.2",
        seismicMagnitude: "8.7"
      }
    },

    {
      id: "event-005",
      dayNumber: 125,
      date: "2022-03-13",
      title: "International Media Coverage",
      description: "Major international outlets begin comprehensive coverage and cultural analysis",
      culturalImpact: "high",
      significance: "major",
      iconType: "media",
      category: "media",

      culturalContext: "Professional journalism engages with phenomenon, legitimizing cultural significance",

      visualCues: {
        color: "#7D4450", // бордо - institutional recognition
        intensity: "high",
        iconType: "media"
      },

      tempoSync: {
        bpm: 88,
        musicalPhase: "sustained_intensity",
        correlation: 0.85
      },

      evidence: [
        {
          id: "ev-005-01",
          type: "news",
          title: "International news coverage compilation",
          source: "Global media outlets",
          verified: true
        }
      ],

      metrics: {
        reach: "8M+",
        resonance: "8.1",
        seismicMagnitude: "7.3"
      }
    },

    {
      id: "event-006",
      dayNumber: 165,
      date: "2022-04-22",
      title: "Peak Cultural Saturation",
      description: "Maximum cultural penetration achieved across all demographics and platforms",
      culturalImpact: "seismic",
      significance: "primary",
      iconType: "peak",
      category: "peak",

      culturalContext: "Cultural artifact reaches maximum possible distribution and recognition within target cultural sphere",

      visualCues: {
        color: "#D32F2F",
        intensity: "maximum",
        iconType: "peak"
      },

      tempoSync: {
        bpm: 92,
        musicalPhase: "peak_intensity",
        correlation: 0.99
      },

      evidence: [
        {
          id: "ev-006-01",
          type: "data",
          title: "Peak engagement metrics",
          source: "Comprehensive platform analytics",
          verified: true
        }
      ],

      metrics: {
        reach: "12M+",
        resonance: "9.8",
        seismicMagnitude: "9.5"
      }
    },

    {
      id: "event-007",
      dayNumber: 220,
      date: "2022-06-16",
      title: "Cultural Integration Phase",
      description: "Phenomenon transitions from viral moment to embedded cultural reference",
      culturalImpact: "high",
      significance: "major",
      iconType: "integration",
      category: "integration",

      culturalContext: "Cultural artifact becomes part of permanent reference vocabulary and collective memory",

      visualCues: {
        color: "#7D4450",
        intensity: "high",
        iconType: "integration"
      },

      tempoSync: {
        bpm: 86,
        musicalPhase: "resolution_approach",
        correlation: 0.81
      },

      evidence: [
        {
          id: "ev-007-01",
          type: "cultural",
          title: "Cultural reference usage analysis",
          source: "Cultural studies research",
          verified: true
        }
      ],

      metrics: {
        reach: "10M+",
        resonance: "7.9",
        seismicMagnitude: "6.8"
      }
    },

    {
      id: "event-008",
      dayNumber: 333,
      date: "2022-10-07",
      title: "Legal Recognition Milestone",
      description: "Official legal acknowledgment marks transition to permanent cultural status",
      culturalImpact: "high",
      significance: "primary",
      iconType: "legal",
      category: "legal",

      culturalContext: "Legal system formally recognizes cultural phenomenon, cementing its permanent status in collective memory",

      visualCues: {
        color: "#7D4450",
        intensity: "high",
        iconType: "legal"
      },

      tempoSync: {
        bpm: 85,
        musicalPhase: "resolution",
        correlation: 0.94
      },

      evidence: [
        {
          id: "ev-008-01",
          type: "legal",
          title: "Legal recognition documentation",
          source: "Official legal records",
          verified: true
        }
      ],

      metrics: {
        reach: "8M+",
        resonance: "8.5",
        seismicMagnitude: "7.8"
      }
    }
  ],

  /**
   * Visual configuration
   */
  visualConfig: {
    colors: {
      primary: "#7D4450", // бордо
      accent: "#839E75",  // шалфей
      warning: "#E8AD4A", // янтарь
      light: "#FEFCF6",   // слоновая кость
      critical: "#D32F2F" // seismic events
    },

    impactVisualization: {
      low: {
        color: "rgba(125, 68, 80, 0.3)",
        size: "12px",
        animation: "none"
      },
      medium: {
        color: "rgba(131, 158, 117, 0.6)",
        size: "16px",
        animation: "gentle-pulse"
      },
      high: {
        color: "rgba(125, 68, 80, 0.8)",
        size: "20px",
        animation: "strong-pulse"
      },
      seismic: {
        color: "rgba(211, 47, 47, 1.0)",
        size: "24px",
        animation: "seismic-pulse"
      }
    },

    breakpoints: {
      mobile: "320px",
      tablet: "768px",
      desktop: "1024px",
      wide: "1200px"
    }
  },

  /**
   * Accessibility configuration
   */
  accessibility: {
    announcements: {
      eventSelection: "Selected {title} on Day {dayNumber}. {description}",
      playbackStart: "Timeline playback started at {speed}x speed",
      playbackPause: "Timeline playback paused at Day {dayNumber}",
      filterApplied: "Filtered timeline to show {count} {filter} events",
      zoomChanged: "Timeline zoom level changed to {level}"
    },

    keyboardShortcuts: {
      "Space": "Play/pause timeline",
      "ArrowLeft": "Previous event",
      "ArrowRight": "Next event",
      "Home": "First event",
      "End": "Last event",
      "1-4": "Set playback speed",
      "L": "Toggle event list",
      "A": "Toggle analysis",
      "Escape": "Close modal"
    },

    screenReader: {
      timelineDescription: "Interactive timeline with {eventCount} cultural events spanning 333 days from song release to legal recognition",
      eventDescription: "Event {index} of {total}: {title} on Day {dayNumber}, {culturalImpact} cultural impact",
      navigationHelp: "Use arrow keys to navigate between events, space to play/pause, and tab to access controls"
    }
  },

  /**
   * Performance configuration
   */
  performance: {
    lazyLoading: {
      enabled: true,
      threshold: "50px",
      eventBatchSize: 20
    },

    optimization: {
      maxVisibleEvents: 50,
      animationFrameLimit: 60,
      bundleTarget: "40KB",
      memoryLimit: "50MB"
    },

    caching: {
      eventData: true,
      visualAssets: true,
      computedMetrics: true
    }
  }
};

/**
 * Sample timeline data structure for development and testing
 */
export const sampleTimelineData = {
  timeline: timelineSchema.timeline,
  culturalFramework: timelineSchema.culturalFramework,
  keyEvents: timelineSchema.keyEvents,
  visualConfig: timelineSchema.visualConfig,
  accessibility: timelineSchema.accessibility,
  performance: timelineSchema.performance
};

/**
 * Event validation schema
 */
export const eventValidation = {
  required: ['id', 'dayNumber', 'date', 'title', 'culturalImpact', 'significance'],
  optional: ['description', 'category', 'iconType', 'evidence', 'metrics', 'visualCues'],

  validation: {
    dayNumber: { type: 'number', min: 0, max: 333 },
    culturalImpact: { type: 'enum', values: ['low', 'medium', 'high', 'seismic'] },
    significance: { type: 'enum', values: ['background', 'notable', 'major', 'primary'] },
    date: { type: 'date', format: 'YYYY-MM-DD' }
  }
};

/**
 * Data transformation utilities
 */
export const dataUtils = {
  /**
   * Convert day number to date
   */
  dayToDate: (dayNumber) => {
    const startDate = new Date('2021-11-08');
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + dayNumber);
    return targetDate.toISOString().split('T')[0];
  },

  /**
   * Calculate cultural intensity for given day
   */
  getCulturalIntensity: (dayNumber, phases) => {
    const phase = phases.find(p =>
      dayNumber >= p.period.startDay && dayNumber <= p.period.endDay
    );
    return phase ? phase.intensity : 0.3;
  },

  /**
   * Generate timeline position percentage
   */
  getTimelinePosition: (dayNumber) => {
    return (dayNumber / 333) * 100;
  },

  /**
   * Filter events by criteria
   */
  filterEvents: (events, criteria) => {
    return events.filter(event => {
      if (criteria.culturalImpact && event.culturalImpact !== criteria.culturalImpact) return false;
      if (criteria.significance && event.significance !== criteria.significance) return false;
      if (criteria.category && event.category !== criteria.category) return false;
      if (criteria.dateRange) {
        const eventDay = event.dayNumber;
        if (eventDay < criteria.dateRange.start || eventDay > criteria.dateRange.end) return false;
      }
      return true;
    });
  },

  /**
   * Sort events by criteria
   */
  sortEvents: (events, criteria) => {
    const sortMap = {
      chronological: (a, b) => (a.dayNumber || 0) - (b.dayNumber || 0),
      impact: (a, b) => {
        const impactOrder = { 'seismic': 4, 'high': 3, 'medium': 2, 'low': 1 };
        return (impactOrder[b.culturalImpact] || 0) - (impactOrder[a.culturalImpact] || 0);
      },
      significance: (a, b) => {
        const sigOrder = { 'primary': 4, 'major': 3, 'notable': 2, 'background': 1 };
        return (sigOrder[b.significance] || 0) - (sigOrder[a.significance] || 0);
      }
    };

    return [...events].sort(sortMap[criteria] || sortMap.chronological);
  },

  /**
   * Validate event data structure
   */
  validateEvent: (event) => {
    const errors = [];

    // Check required fields
    eventValidation.required.forEach(field => {
      if (!(field in event)) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    // Validate field values
    if (event.dayNumber < 0 || event.dayNumber > 333) {
      errors.push('dayNumber must be between 0 and 333');
    }

    if (!['low', 'medium', 'high', 'seismic'].includes(event.culturalImpact)) {
      errors.push('culturalImpact must be low, medium, high, or seismic');
    }

    if (!['background', 'notable', 'major', 'primary'].includes(event.significance)) {
      errors.push('significance must be background, notable, major, or primary');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
};

export default timelineSchema;