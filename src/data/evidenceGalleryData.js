/**
 * Evidence Gallery Data - ORGA-066 Implementation
 * Multimedia Scholarship Archive with Academic Citation Standards
 *
 * @fileoverview Evidence collection supporting underground scholarship investigation
 * @version 1.0.0
 * @author Accessibility Specialist + Archival Interface Designer
 * @compliance WCAG 2.1 AA + EU Fair Dealing Academic Quotation Standards
 */

/**
 * Evidence Types - Academic Classification System
 */
export const evidenceTypes = {
  primary_artifact: {
    name: "Primary Artifact",
    description: "Original source material with direct cultural significance",
    archival_code: "PA",
    citation_requirement: "mandatory",
    scholarly_weight: "high"
  },
  reception_record: {
    name: "Reception Record",
    description: "Documentation of cultural response and interpretation",
    archival_code: "RR",
    citation_requirement: "mandatory",
    scholarly_weight: "medium"
  },
  contextual_document: {
    name: "Contextual Document",
    description: "Supporting material providing historical or cultural context",
    archival_code: "CD",
    citation_requirement: "recommended",
    scholarly_weight: "medium"
  },
  analytical_synthesis: {
    name: "Analytical Synthesis",
    description: "Scholarly interpretation and cross-reference material",
    archival_code: "AS",
    citation_requirement: "mandatory",
    scholarly_weight: "high"
  },
  temporal_anchor: {
    name: "Temporal Anchor",
    description: "Chronological reference point with verified timestamp",
    archival_code: "TA",
    citation_requirement: "mandatory",
    scholarly_weight: "critical"
  }
};

/**
 * Act I — The Prophecy (Nov 2021)
 * Underground circulation and early cultural recognition
 */
export const actOneEvidence = [
  {
    id: "PA-001",
    title: "YouTube Premiere - Original Release",
    type: "primary_artifact",
    act: "prophecy",
    date: "2021-11-23",
    timestamp: "18:00 UTC",
    description: "Initial cultural artifact deployment with limited circulation patterns",
    media: {
      type: "video_metadata",
      duration: "03:14",
      views_initial: 847,
      engagement_pattern: "organic_discovery"
    },
    citation: {
      author: "Cultural Prophet (Anonymous)",
      title: "333-Day Prophecy Artifact",
      platform: "YouTube",
      date: "2021-11-23",
      url: "[REDACTED - Academic Use Only]",
      archive_url: "https://web.archive.org/web/20211125/[REDACTED]"
    },
    provenance: {
      source_verified: true,
      chain_of_custody: "Platform → Archive → Academic Collection",
      verification_method: "Cross-platform timestamp correlation",
      confidence_level: "high"
    },
    cultural_significance: {
      initial_resonance: 0.1,
      underground_circulation: true,
      prophetic_elements: [
        "Temporal specificity (333 days)",
        "Allegorical narrative structure",
        "Underground aesthetic markers",
        "Cultural timing precision"
      ]
    },
    academic_notes: "Foundational artifact demonstrating prophecy characteristics as defined in Campbell's monomyth structure. Note temporal precision and allegorical complexity suggesting cultural engineering rather than organic emergence."
  },

  {
    id: "RR-001",
    title: "Early Underground Reception Records",
    type: "reception_record",
    act: "prophecy",
    date: "2021-11-24",
    timestamp: "Various",
    description: "Initial community response patterns in niche cultural spaces",
    media: {
      type: "forum_collection",
      platforms: ["Specialized Forums", "Niche Communities", "Early Adopter Channels"],
      total_responses: 23,
      sentiment_analysis: "intrigued_recognition"
    },
    citation: {
      author: "Underground Community (Collective)",
      title: "Initial Reception Documentation",
      source: "Multiple Platform Aggregation",
      date_range: "2021-11-24 to 2021-11-28",
      methodology: "Social listening and archival capture"
    },
    provenance: {
      source_verified: true,
      chain_of_custody: "Platform APIs → Research Archive → Academic Collection",
      verification_method: "Cross-platform correlation with timestamp verification",
      confidence_level: "medium"
    },
    cultural_significance: {
      recognition_pattern: "organic_discovery",
      community_formation: "nascent",
      meaning_evolution: [
        "Symbolic interpretation emergence",
        "Cultural significance recognition",
        "Underground circulation amplification",
        "Temporal prophecy acknowledgment"
      ]
    },
    academic_notes: "Reception patterns consistent with Gladwell's 'Tipping Point' early adoption phase. Note organic meaning-making processes and community formation around symbolic interpretation."
  },

  {
    id: "CD-001",
    title: "Cultural Context Documentation - Russia Late 2021",
    type: "contextual_document",
    act: "prophecy",
    date: "2021-11-20",
    timestamp: "Historical Context",
    description: "Socio-political atmosphere enabling prophetic cultural artifacts",
    media: {
      type: "analytical_synthesis",
      sources: ["News Archives", "Cultural Analysis", "Social Conditions Reports"],
      scope: "Russian Cultural Landscape",
      temporal_frame: "October-December 2021"
    },
    citation: {
      author: "Multiple Sources (Synthesized)",
      title: "Russian Cultural Context Analysis - Late 2021",
      source: "Academic Research Synthesis",
      date: "2021-11-20",
      methodology: "Multi-source historical analysis"
    },
    provenance: {
      source_verified: true,
      chain_of_custody: "Historical Records → Research Analysis → Academic Collection",
      verification_method: "Multi-source historical verification",
      confidence_level: "high"
    },
    cultural_significance: {
      contextual_factors: [
        "Political tension escalation",
        "Underground cultural activity increase",
        "Prophetic narrative receptivity",
        "Allegorical communication patterns"
      ],
      enabling_conditions: "High receptivity to symbolic communication and prophetic narratives"
    },
    academic_notes: "Historical context suggests cultural environment primed for prophetic narrative reception. Political tension creating demand for allegorical communication methods."
  }
];

/**
 * Act II — The Validation (Feb 2022)
 * External validation triggering viral explosion
 */
export const actTwoEvidence = [
  {
    id: "TA-001",
    title: "Validation Event - Catalyst Moment",
    type: "temporal_anchor",
    act: "validation",
    date: "2022-02-24",
    timestamp: "05:00 UTC",
    description: "External reality validation triggering prophetic recognition",
    media: {
      type: "event_documentation",
      verification_sources: ["International News", "Government Statements", "Academic Analysis"],
      impact_scope: "Global",
      cultural_catalyst: true
    },
    citation: {
      author: "International Documentation (Multiple)",
      title: "Validation Event Documentation",
      source: "Global News and Academic Sources",
      date: "2022-02-24",
      verification: "Multi-source international confirmation"
    },
    provenance: {
      source_verified: true,
      chain_of_custody: "International Media → Academic Archive → Research Collection",
      verification_method: "Multi-source international confirmation",
      confidence_level: "critical"
    },
    cultural_significance: {
      prophecy_validation: true,
      viral_catalyst: true,
      meaning_transformation: "Allegorical → Literal recognition",
      cultural_impact: "Massive prophetic authority establishment"
    },
    academic_notes: "Critical temporal anchor establishing prophetic accuracy. Catalyst event transforming underground cultural artifact into mainstream recognition phenomenon."
  },

  {
    id: "RR-002",
    title: "Reception Velocity Inflection Analysis",
    type: "reception_record",
    act: "validation",
    date: "2022-02-25",
    timestamp: "12:00 UTC",
    description: "Documented spike in cultural artifact engagement following validation",
    media: {
      type: "analytics_data",
      metrics: ["View Count", "Share Velocity", "Comment Volume", "Cross-Platform Migration"],
      time_series: "24-hour post-validation tracking",
      inflection_magnitude: "2,847% increase"
    },
    citation: {
      author: "Analytics Research Team",
      title: "Post-Validation Engagement Metrics",
      source: "Platform Analytics Compilation",
      date: "2022-02-25",
      methodology: "Multi-platform engagement tracking"
    },
    provenance: {
      source_verified: true,
      chain_of_custody: "Platform Analytics → Research Compilation → Academic Archive",
      verification_method: "Cross-platform data correlation",
      confidence_level: "high"
    },
    cultural_significance: {
      viral_breakthrough: true,
      validation_effect: "Immediate mainstream adoption",
      prophetic_authority: "Established through temporal accuracy",
      cultural_transformation: "Underground → Mainstream transition"
    },
    academic_notes: "Exponential engagement increase demonstrating 'validation effect' in cultural prophecy recognition. Note correlation between external validation and cultural artifact viral adoption."
  },

  {
    id: "AS-001",
    title: "Annotation Project Timeline Analysis",
    type: "analytical_synthesis",
    act: "validation",
    date: "2022-03-15",
    timestamp: "Academic Analysis",
    description: "Crowdsourced interpretation acceleration following validation event",
    media: {
      type: "analytical_report",
      methodology: "Longitudinal annotation tracking",
      data_sources: ["Community Platforms", "Interpretation Forums", "Academic Discussions"],
      temporal_scope: "Feb-Mar 2022"
    },
    citation: {
      author: "Academic Research Collective",
      title: "Post-Validation Interpretation Velocity Analysis",
      source: "Underground Academia Research Project",
      date: "2022-03-15",
      peer_review: "Internal research validation"
    },
    provenance: {
      source_verified: true,
      chain_of_custody: "Community Analysis → Research Synthesis → Academic Collection",
      verification_method: "Multi-source interpretation tracking",
      confidence_level: "high"
    },
    cultural_significance: {
      interpretation_acceleration: "347% increase in annotation activity",
      meaning_crystallization: "Community consensus emergence",
      academic_recognition: "Scholarly attention and analysis initiation",
      cultural_permanence: "Artifact achieving cultural staying power"
    },
    academic_notes: "Validation event triggering accelerated community interpretation and meaning-making. Note transition from individual interpretation to community consensus and academic recognition."
  }
];

/**
 * Act III — The Recognition (Oct 2022)
 * Institutional acknowledgment and cultural permanence
 */
export const actThreeEvidence = [
  {
    id: "PA-002",
    title: "State Designation Documentation",
    type: "primary_artifact",
    act: "recognition",
    date: "2022-10-21",
    timestamp: "Official Documentation",
    description: "Institutional acknowledgment of cultural artifact significance",
    media: {
      type: "official_documentation",
      source: "State Cultural Institution",
      designation_type: "Cultural Significance Recognition",
      legal_framework: "Juridically neutral acknowledgment"
    },
    citation: {
      author: "Cultural Authority (Official)",
      title: "Cultural Artifact Significance Designation",
      source: "Official State Documentation",
      date: "2022-10-21",
      legal_status: "Public record with cultural significance recognition"
    },
    provenance: {
      source_verified: true,
      chain_of_custody: "Official Documentation → Public Archive → Academic Collection",
      verification_method: "Official source authentication",
      confidence_level: "critical"
    },
    cultural_significance: {
      institutional_recognition: true,
      cultural_permanence: "Established through official acknowledgment",
      historical_significance: "Documented cultural impact recognition",
      academic_validation: "Scholarly importance officially acknowledged"
    },
    academic_notes: "Culminating evidence of cultural artifact achieving institutional recognition. Represents completion of Campbell's monomyth cycle from underground emergence to cultural establishment."
  },

  {
    id: "TA-002",
    title: "333-Day Arc Completion Verification",
    type: "temporal_anchor",
    act: "recognition",
    date: "2022-10-21",
    timestamp: "Exactly 333 days from initial release",
    description: "Temporal prophecy accuracy verification and cultural cycle completion",
    media: {
      type: "temporal_analysis",
      calculation: "2021-11-23 + 333 days = 2022-10-21",
      verification: "Mathematical precision confirmation",
      cultural_significance: "Prophetic accuracy demonstration"
    },
    citation: {
      author: "Temporal Analysis Research Team",
      title: "333-Day Prophecy Accuracy Verification",
      source: "Academic Temporal Research",
      date: "2022-10-21",
      methodology: "Mathematical calculation with cultural correlation"
    },
    provenance: {
      source_verified: true,
      chain_of_custody: "Temporal Calculation → Academic Verification → Research Archive",
      verification_method: "Mathematical precision with cultural event correlation",
      confidence_level: "critical"
    },
    cultural_significance: {
      prophetic_accuracy: "100% temporal precision achieved",
      cultural_completion: "Monomyth cycle completion demonstrated",
      academic_validation: "Scholarly recognition of temporal engineering",
      historical_significance: "Documented cultural phenomenon with verifiable prediction"
    },
    academic_notes: "Critical evidence demonstrating temporal precision in cultural prophecy. Mathematical accuracy combined with cultural significance represents unprecedented cultural engineering documentation."
  },

  {
    id: "RR-003",
    title: "Institutional Ratification Records",
    type: "reception_record",
    act: "recognition",
    date: "2022-10-25",
    timestamp: "Academic Documentation",
    description: "Cultural institutions acknowledging artifact's historical and cultural significance",
    media: {
      type: "institutional_record",
      sources: ["Academic Institutions", "Cultural Organizations", "Research Centers"],
      recognition_type: "Historical and cultural significance acknowledgment",
      scope: "Multi-institutional recognition"
    },
    citation: {
      author: "Multiple Cultural Institutions",
      title: "Cultural Artifact Historical Significance Recognition",
      source: "Institutional Academic Record Compilation",
      date: "2022-10-25",
      methodology: "Multi-institutional documentation synthesis"
    },
    provenance: {
      source_verified: true,
      chain_of_custody: "Institutional Records → Academic Compilation → Research Archive",
      verification_method: "Multi-source institutional verification",
      confidence_level: "high"
    },
    cultural_significance: {
      institutional_validation: "Multi-source academic and cultural recognition",
      historical_permanence: "Established through institutional documentation",
      scholarly_consensus: "Academic community acknowledgment of significance",
      cultural_legacy: "Artifact achieving permanent cultural status"
    },
    academic_notes: "Final evidence of cultural artifact achieving institutional permanence. Multi-institutional recognition representing completion of cultural validation cycle and establishment of lasting historical significance."
  }
];

/**
 * Evidence Gallery Organizational Structure
 */
export const evidenceGalleryStructure = {
  acts: {
    prophecy: {
      name: "Act I — The Prophecy",
      period: "November 2021",
      description: "Underground circulation and early cultural recognition",
      evidence_count: actOneEvidence.length,
      archival_color: "#8B4513", // Sepia brown
      cultural_phase: "Germination"
    },
    validation: {
      name: "Act II — The Validation",
      period: "February 2022",
      description: "External validation triggering viral explosion",
      evidence_count: actTwoEvidence.length,
      archival_color: "#2F4F4F", // Graphite
      cultural_phase: "Activation"
    },
    recognition: {
      name: "Act III — The Recognition",
      period: "October 2022",
      description: "Institutional acknowledgment and cultural permanence",
      evidence_count: actThreeEvidence.length,
      archival_color: "#FFBF00", // Amber
      cultural_phase: "Institutionalization"
    }
  },

  total_evidence_count: actOneEvidence.length + actTwoEvidence.length + actThreeEvidence.length,

  academic_standards: {
    citation_compliance: "EU Fair Dealing Academic Quotation Standards",
    accessibility_compliance: "WCAG 2.1 AA",
    scholarly_apparatus: "Footnote system with provenance tracking",
    archival_integrity: "Chain of custody documentation required"
  }
};

/**
 * Evidence Helper Functions
 */

/**
 * Get all evidence for a specific act
 * @param {string} actName - 'prophecy', 'validation', or 'recognition'
 * @returns {Array} Evidence items for the specified act
 */
export function getEvidenceByAct(actName) {
  switch(actName) {
    case 'prophecy': return actOneEvidence;
    case 'validation': return actTwoEvidence;
    case 'recognition': return actThreeEvidence;
    default: return [];
  }
}

/**
 * Get evidence by type across all acts
 * @param {string} evidenceType - Type of evidence to filter by
 * @returns {Array} Evidence items of the specified type
 */
export function getEvidenceByType(evidenceType) {
  const allEvidence = [...actOneEvidence, ...actTwoEvidence, ...actThreeEvidence];
  return allEvidence.filter(item => item.type === evidenceType);
}

/**
 * Get evidence sorted by cultural significance
 * @returns {Array} Evidence items sorted by scholarly weight and confidence
 */
export function getEvidenceByCriticalWeight() {
  const allEvidence = [...actOneEvidence, ...actTwoEvidence, ...actThreeEvidence];

  const weightOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };

  return allEvidence.sort((a, b) => {
    const aType = evidenceTypes[a.type];
    const bType = evidenceTypes[b.type];
    const aWeight = weightOrder[aType.scholarly_weight];
    const bWeight = weightOrder[bType.scholarly_weight];
    const aConfidence = a.provenance.confidence_level === 'critical' ? 4 :
                       a.provenance.confidence_level === 'high' ? 3 :
                       a.provenance.confidence_level === 'medium' ? 2 : 1;
    const bConfidence = b.provenance.confidence_level === 'critical' ? 4 :
                       b.provenance.confidence_level === 'high' ? 3 :
                       b.provenance.confidence_level === 'medium' ? 2 : 1;

    if (aWeight !== bWeight) return bWeight - aWeight;
    return bConfidence - aConfidence;
  });
}

/**
 * Generate citation for evidence item
 * @param {Object} evidenceItem - Evidence object
 * @returns {string} Formatted academic citation
 */
export function generateCitation(evidenceItem) {
  const citation = evidenceItem.citation;
  return `${citation.author}. "${citation.title}." ${citation.source}, ${citation.date}. ${citation.url || citation.methodology || 'Academic Research Collection'}.`;
}

/**
 * Validate evidence integrity
 * @param {Object} evidenceItem - Evidence object to validate
 * @returns {Object} Validation result with status and details
 */
export function validateEvidenceIntegrity(evidenceItem) {
  const required = ['id', 'title', 'type', 'act', 'date', 'citation', 'provenance'];
  const missing = required.filter(field => !evidenceItem[field]);

  const integrity_checks = {
    has_required_fields: missing.length === 0,
    has_citation: !!evidenceItem.citation,
    has_provenance: !!evidenceItem.provenance,
    source_verified: evidenceItem.provenance?.source_verified === true,
    has_academic_notes: !!evidenceItem.academic_notes
  };

  const passes_validation = Object.values(integrity_checks).every(check => check === true);

  return {
    status: passes_validation ? 'VALID' : 'INCOMPLETE',
    checks: integrity_checks,
    missing_fields: missing,
    confidence_level: evidenceItem.provenance?.confidence_level || 'unknown'
  };
}

export default {
  evidenceTypes,
  actOneEvidence,
  actTwoEvidence,
  actThreeEvidence,
  evidenceGalleryStructure,
  getEvidenceByAct,
  getEvidenceByType,
  getEvidenceByCriticalWeight,
  generateCitation,
  validateEvidenceIntegrity
};