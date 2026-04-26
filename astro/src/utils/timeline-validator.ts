// Timeline Validation and Performance Testing Utility
// ORGA-072.3: Schema Design - Validation & Performance Verification
// Johnny requirement: ≤25KB timeline data, comprehensive validation

import {
  validateTimelineData,
  estimateTimelineSize,
  optimizeTimelineForTransport,
  TIMELINE_CONFIG,
  type Timeline
} from '../schemas/timeline-schema.js';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  performance: {
    sizeBytes: number;
    compressedEstimate: number;
    withinBudget: boolean;
    budgetUtilization: number;
  };
  quality: {
    eventCount: number;
    evidenceCount: number;
    averageEventSize: number;
    verifiedPercentage: number;
  };
}

export interface PerformanceReport {
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  budgetCompliance: boolean;
  recommendations: string[];
}

/**
 * Comprehensive timeline validation with performance analysis
 */
export async function validateTimelinePerformance(
  timelineData: unknown
): Promise<ValidationResult> {
  const result: ValidationResult = {
    isValid: false,
    errors: [],
    warnings: [],
    performance: {
      sizeBytes: 0,
      compressedEstimate: 0,
      withinBudget: false,
      budgetUtilization: 0
    },
    quality: {
      eventCount: 0,
      evidenceCount: 0,
      averageEventSize: 0,
      verifiedPercentage: 0
    }
  };

  try {
    // Schema validation
    const timeline = validateTimelineData(timelineData);
    result.isValid = true;

    // Performance analysis
    const sizeAnalysis = estimateTimelineSize(timeline);
    result.performance = {
      sizeBytes: sizeAnalysis.estimatedBytes,
      compressedEstimate: sizeAnalysis.compressionEstimate,
      withinBudget: sizeAnalysis.withinBudget,
      budgetUtilization: (sizeAnalysis.estimatedBytes / TIMELINE_CONFIG.SIZE_BUDGET_BYTES) * 100
    };

    // Quality analysis
    const totalEvidence = timeline.events.reduce((sum, event) => sum + event.evidence.length, 0);
    const verifiedEvents = timeline.events.filter(event => event.verificationStatus === 'verified').length;

    result.quality = {
      eventCount: timeline.events.length,
      evidenceCount: totalEvidence,
      averageEventSize: timeline.events.length > 0 ? sizeAnalysis.estimatedBytes / timeline.events.length : 0,
      verifiedPercentage: timeline.events.length > 0 ? (verifiedEvents / timeline.events.length) * 100 : 0
    };

    // Performance warnings
    if (result.performance.budgetUtilization > 80) {
      result.warnings.push(`High budget utilization: ${result.performance.budgetUtilization.toFixed(1)}%`);
    }

    if (result.quality.verifiedPercentage < 70) {
      result.warnings.push(`Low verification rate: ${result.quality.verifiedPercentage.toFixed(1)}% verified`);
    }

    if (timeline.events.length > 250) {
      result.warnings.push(`High event count may impact performance: ${timeline.events.length} events`);
    }

    // Validate event density for performance
    const eventDensity = timeline.events.length / timeline.dateRange.totalDays;
    if (eventDensity > 0.8) {
      result.warnings.push(`High event density: ${eventDensity.toFixed(2)} events/day average`);
    }

  } catch (error) {
    result.isValid = false;
    if (error instanceof Error) {
      result.errors.push(`Schema validation failed: ${error.message}`);
    } else {
      result.errors.push('Unknown validation error');
    }
  }

  return result;
}

/**
 * Performance optimization with detailed reporting
 */
export function optimizeTimelinePerformance(timeline: Timeline): PerformanceReport {
  const originalSize = estimateTimelineSize(timeline);
  const optimized = optimizeTimelineForTransport(timeline);
  const optimizedSize = estimateTimelineSize(optimized);

  const compressionRatio = originalSize.estimatedBytes > 0
    ? (originalSize.estimatedBytes - optimizedSize.estimatedBytes) / originalSize.estimatedBytes
    : 0;

  const recommendations: string[] = [];

  // Size optimization recommendations
  if (optimizedSize.estimatedBytes > TIMELINE_CONFIG.SIZE_BUDGET_BYTES) {
    recommendations.push('Timeline exceeds 25KB budget - consider reducing event count or evidence per event');
  }

  if (timeline.events.some(event => event.evidence.length > 10)) {
    recommendations.push('Some events have >10 evidence items - consider consolidation');
  }

  if (timeline.events.some(event => event.description.length > 500)) {
    recommendations.push('Some event descriptions >500 chars - consider shortening for performance');
  }

  // Performance recommendations
  if (timeline.events.length > 200) {
    recommendations.push('Consider implementing event pagination or lazy loading for >200 events');
  }

  const largeEvidenceCount = timeline.events.filter(event => event.evidence.length > 15).length;
  if (largeEvidenceCount > 10) {
    recommendations.push('Multiple events with >15 evidence items - implement evidence lazy loading');
  }

  return {
    originalSize: originalSize.estimatedBytes,
    optimizedSize: optimizedSize.estimatedBytes,
    compressionRatio,
    budgetCompliance: optimizedSize.withinBudget,
    recommendations
  };
}

/**
 * Validate sample timeline data file
 */
export async function validateSampleTimeline(): Promise<ValidationResult> {
  try {
    // In a real implementation, we would read from the file
    // For now, we'll simulate the validation
    const sampleTimelineResponse = await fetch('/src/data/sample-timeline.json');
    const sampleTimeline = await sampleTimelineResponse.json();

    return await validateTimelinePerformance(sampleTimeline);
  } catch (error) {
    return {
      isValid: false,
      errors: [`Failed to load sample timeline: ${error}`],
      warnings: [],
      performance: {
        sizeBytes: 0,
        compressedEstimate: 0,
        withinBudget: false,
        budgetUtilization: 0
      },
      quality: {
        eventCount: 0,
        evidenceCount: 0,
        averageEventSize: 0,
        verifiedPercentage: 0
      }
    };
  }
}

/**
 * Generate performance report for debugging
 */
export function generatePerformanceReport(timeline: Timeline): string {
  const validation = estimateTimelineSize(timeline);
  const optimization = optimizeTimelinePerformance(timeline);

  return `
# Timeline Performance Report

## Size Analysis
- Original Size: ${validation.estimatedBytes.toLocaleString()} bytes
- Compressed Estimate: ${validation.compressionEstimate.toLocaleString()} bytes
- Budget Utilization: ${((validation.estimatedBytes / TIMELINE_CONFIG.SIZE_BUDGET_BYTES) * 100).toFixed(1)}%
- Within Budget: ${validation.withinBudget ? '✅ YES' : '❌ NO'}

## Content Analysis
- Total Events: ${timeline.events.length}
- Total Evidence Items: ${timeline.events.reduce((sum, e) => sum + e.evidence.length, 0)}
- Verified Events: ${timeline.events.filter(e => e.verificationStatus === 'verified').length}
- Date Range: ${timeline.dateRange.start} to ${timeline.dateRange.end} (${timeline.dateRange.totalDays} days)

## Optimization Potential
- Size Reduction: ${(optimization.compressionRatio * 100).toFixed(1)}%
- Optimized Size: ${optimization.optimizedSize.toLocaleString()} bytes

## Recommendations
${optimization.recommendations.map(r => `- ${r}`).join('\n')}

Generated: ${new Date().toISOString()}
Schema Version: ${timeline.schemaVersion}
`;
}

/**
 * Timeline data loader with validation
 */
export class TimelineDataLoader {
  private cache: Map<string, Timeline> = new Map();

  async loadTimeline(source: string | object): Promise<Timeline> {
    let data: unknown;

    if (typeof source === 'string') {
      // Load from URL or file path
      if (this.cache.has(source)) {
        return this.cache.get(source)!;
      }

      const response = await fetch(source);
      data = await response.json();
    } else {
      data = source;
    }

    const timeline = validateTimelineData(data);

    if (typeof source === 'string') {
      this.cache.set(source, timeline);
    }

    return timeline;
  }

  async validateAndLoad(source: string | object): Promise<{
    timeline: Timeline;
    validation: ValidationResult;
    performance: PerformanceReport;
  }> {
    const timeline = await this.loadTimeline(source);
    const validation = await validateTimelinePerformance(timeline);
    const performance = optimizeTimelinePerformance(timeline);

    return { timeline, validation, performance };
  }

  clearCache(): void {
    this.cache.clear();
  }
}

// Export configured loader instance
export const timelineLoader = new TimelineDataLoader();