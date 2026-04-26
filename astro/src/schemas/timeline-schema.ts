// Timeline Schema Design - 333-day Cultural Investigation Framework
// ORGA-072.3: Schema Design - Johnny technical specification
// Target: ≤25KB timeline data, cultural event metadata with evidence links

import { z } from 'zod';

// Schema versioning for backward compatibility (Johnny requirement)
export const TIMELINE_SCHEMA_VERSION = '1.0.0';

// Impact significance levels for cultural events
export const ImpactLevelSchema = z.enum([
  'seismic',      // Major cultural shift (album release, major controversy)
  'significant',   // Notable cultural moment (interview, major performance)
  'moderate',     // Community/niche impact (social media event, smaller performance)
  'minor'         // Background cultural noise (mentions, minor interactions)
]);

// Evidence types for multimedia components
export const EvidenceTypeSchema = z.enum([
  'audio',        // Spotify embeds, audio clips
  'video',        // YouTube embeds, video content
  'image',        // Photos, screenshots, artwork
  'text',         // Articles, interviews, social media
  'document',     // Official documents, contracts, legal materials
  'social'        // Social media posts, comments, reactions
]);

// Geographic impact scope
export const GeographicScopeSchema = z.enum([
  'global',       // International impact
  'national',     // Russia-wide or multi-country
  'regional',     // City/region specific (Moscow, St. Petersburg)
  'subcultural'   // Specific community/fanbase
]);

// Cultural domain classification
export const CulturalDomainSchema = z.enum([
  'music',        // Musical releases, performances, collaborations
  'media',        // Interviews, articles, media coverage
  'social',       // Social media activity, fan interactions
  'legal',        // Legal proceedings, contracts, disputes
  'personal',     // Personal life events affecting public perception
  'political',    // Political statements, activism, government interaction
  'commercial'    // Business ventures, brand partnerships, monetization
]);

// Evidence link schema (for multimedia gallery integration)
export const EvidenceSchema = z.object({
  id: z.string().min(1).max(50), // Short identifier for performance
  type: EvidenceTypeSchema,
  title: z.string().min(1).max(150), // Brief title for UI display
  description: z.string().max(500).optional(), // Optional longer description
  url: z.string().url().optional(), // External URL (YouTube, Spotify, etc.)
  localPath: z.string().optional(), // Local asset path if hosted
  thumbnail: z.string().optional(), // Thumbnail image path/URL
  metadata: z.record(z.string(), z.any()).optional(), // Flexible metadata storage
  verified: z.boolean().default(false), // Evidence verification status
  dateAdded: z.string().datetime() // When evidence was catalogued
});

// Impact metrics for quantitative analysis
export const ImpactMetricsSchema = z.object({
  socialMediaMentions: z.number().min(0).optional(),
  streamingNumbers: z.number().min(0).optional(),
  mediaArticles: z.number().min(0).optional(),
  viewCount: z.number().min(0).optional(),
  shareCount: z.number().min(0).optional(),
  sentimentScore: z.number().min(-1).max(1).optional(), // -1 (negative) to 1 (positive)
  culturalReach: z.number().min(0).max(100).optional(), // 0-100 cultural penetration %
  durabilityScore: z.number().min(0).max(10).optional() // Long-term cultural impact prediction
});

// Core cultural event schema
export const CulturalEventSchema = z.object({
  // Basic identification
  id: z.string().min(1).max(100), // Unique event identifier
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // ISO date format (YYYY-MM-DD)
  dayOfInvestigation: z.number().min(1).max(333), // Day number in 333-day investigation

  // Event classification
  title: z.string().min(1).max(200), // Event title for timeline display
  description: z.string().max(1000), // Event description
  domain: CulturalDomainSchema,
  impact: ImpactLevelSchema,
  scope: GeographicScopeSchema,

  // Cultural analysis
  culturalContext: z.string().max(500).optional(), // Cultural significance explanation
  connections: z.array(z.string()).optional(), // IDs of related events
  tags: z.array(z.string().min(1).max(50)).max(10), // Searchable tags (max 10 for performance)

  // Evidence and verification
  evidence: z.array(EvidenceSchema).max(20), // Evidence items (max 20 for performance)
  primarySource: z.string().max(300).optional(), // Main source/citation
  verificationStatus: z.enum(['verified', 'disputed', 'unverified']).default('unverified'),

  // Impact quantification
  metrics: ImpactMetricsSchema.optional(),

  // Narrative integration
  narrativeArc: z.enum(['rising', 'peak', 'falling', 'resolution']).optional(),
  memeConcepts: z.array(z.string().min(1).max(100)).max(5).optional(), // Dawkins meme theory integration

  // Technical metadata
  weight: z.number().min(0).max(1).default(1), // Visual weight in timeline (0-1)
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(), // Hex color for timeline visualization
  position: z.object({ // Precise positioning for timeline rendering
    x: z.number(), // Timeline position (0-1)
    y: z.number().optional() // Vertical offset for overlapping events
  }).optional()
});

// Full timeline schema for 333-day investigation
export const TimelineSchema = z.object({
  // Schema metadata
  schemaVersion: z.string().default(TIMELINE_SCHEMA_VERSION),
  generatedAt: z.string().datetime(),

  // Investigation context
  investigationId: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  description: z.string().max(1000),

  // Date range (333-day investigation period)
  dateRange: z.object({
    start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    totalDays: z.number().min(1).max(333)
  }),

  // Cultural events array (optimized for ≤25KB target)
  events: z.array(CulturalEventSchema)
    .max(333) // Maximum one event per day (performance optimization)
    .refine(events => {
      // Ensure date uniqueness for performance
      const dates = events.map(e => e.date);
      return new Set(dates).size === dates.length;
    }, 'Event dates must be unique'),

  // Timeline visualization metadata
  visualization: z.object({
    totalDuration: z.number(), // Total timeline width in pixels
    scaleFactor: z.number(), // Pixels per day
    heightLevels: z.number().default(3), // Number of vertical levels for overlapping events
    colorPalette: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/)).optional() // Event color scheme
  }).optional(),

  // Investigation metadata
  methodology: z.object({
    sources: z.array(z.string().max(300)).max(50), // Primary investigation sources
    keyInformants: z.array(z.string().max(100)).max(20).optional(), // Key people/organizations
    limitations: z.string().max(500).optional(), // Investigation limitations
    biases: z.string().max(500).optional() // Acknowledged biases in data
  }).optional(),

  // Performance optimization metadata
  optimization: z.object({
    totalSize: z.number().optional(), // Estimated JSON size in bytes
    compressionRatio: z.number().optional(), // Gzip compression ratio
    indexingStrategy: z.enum(['date', 'impact', 'domain', 'hybrid']).default('hybrid'),
    cacheStrategy: z.enum(['full', 'partial', 'lazy']).default('partial')
  }).optional()
});

// Derived types for TypeScript usage
export type CulturalEvent = z.infer<typeof CulturalEventSchema>;
export type Timeline = z.infer<typeof TimelineSchema>;
export type Evidence = z.infer<typeof EvidenceSchema>;
export type ImpactMetrics = z.infer<typeof ImpactMetricsSchema>;
export type ImpactLevel = z.infer<typeof ImpactLevelSchema>;
export type EvidenceType = z.infer<typeof EvidenceTypeSchema>;
export type GeographicScope = z.infer<typeof GeographicScopeSchema>;
export type CulturalDomain = z.infer<typeof CulturalDomainSchema>;

// Validation utilities for performance
export function validateTimelineData(data: unknown): Timeline {
  return TimelineSchema.parse(data);
}

export function validateCulturalEvent(data: unknown): CulturalEvent {
  return CulturalEventSchema.parse(data);
}

// Size estimation utility (Johnny performance requirement: ≤25KB)
export function estimateTimelineSize(timeline: Timeline): {
  estimatedBytes: number;
  compressionEstimate: number;
  withinBudget: boolean;
} {
  const jsonString = JSON.stringify(timeline);
  const estimatedBytes = new TextEncoder().encode(jsonString).length;

  // Rough gzip compression estimate (typically 60-80% reduction for JSON)
  const compressionEstimate = Math.round(estimatedBytes * 0.3);

  return {
    estimatedBytes,
    compressionEstimate,
    withinBudget: estimatedBytes <= 25600 // 25KB budget
  };
}

// Schema migration utilities for backward compatibility
export function migrateTimelineSchema(data: any, fromVersion: string): Timeline {
  // Future schema migration logic
  if (fromVersion === '1.0.0') {
    return validateTimelineData(data);
  }

  throw new Error(`Unsupported schema version: ${fromVersion}`);
}

// Performance optimization utilities
export function optimizeTimelineForTransport(timeline: Timeline): Timeline {
  // Remove optional fields that are null/undefined to reduce size
  const optimized = JSON.parse(JSON.stringify(timeline));

  // Remove empty arrays and null values
  optimized.events = optimized.events.map((event: any) => {
    Object.keys(event).forEach(key => {
      if (event[key] === null || event[key] === undefined ||
          (Array.isArray(event[key]) && event[key].length === 0)) {
        delete event[key];
      }
    });
    return event;
  });

  return optimized;
}

// Export for configuration
export const TIMELINE_CONFIG = {
  MAX_EVENTS: 333,
  MAX_EVIDENCE_PER_EVENT: 20,
  MAX_TAGS_PER_EVENT: 10,
  SIZE_BUDGET_BYTES: 25600, // 25KB
  SCHEMA_VERSION: TIMELINE_SCHEMA_VERSION
} as const;