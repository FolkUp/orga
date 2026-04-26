// Feature Flag System for Component-Level Rollback
// ORGA-072.1: Foundation Infrastructure - Emergency Rollback Capability
// Expert assessment: Купер (HIGH COMPLEXITY) - Component-level feature flags required

export interface FeatureFlags {
  // Timeline Components (ORGA-065 rollback capability)
  TIMELINE_INTERACTIVE: boolean;
  TIMELINE_VIRTUALIZATION: boolean;
  TIMELINE_TOUCH_CONTROLS: boolean;

  // Evidence Gallery Components (ORGA-066 rollback capability)
  EVIDENCE_GALLERY_MODAL: boolean;
  EVIDENCE_GALLERY_LAZY_LOADING: boolean;
  EVIDENCE_GALLERY_MULTIMEDIA: boolean;

  // Performance Monitoring
  PERFORMANCE_MONITORING: boolean;
  BUNDLE_SIZE_ALERTS: boolean;

  // Emergency Rollback States
  EMERGENCY_FALLBACK_MODE: boolean;
  TEXT_ONLY_MODE: boolean;
}

// Default feature flag configuration
const DEFAULT_FLAGS: FeatureFlags = {
  // Timeline features - enabled by default
  TIMELINE_INTERACTIVE: true,
  TIMELINE_VIRTUALIZATION: true,
  TIMELINE_TOUCH_CONTROLS: true,

  // Evidence gallery features - enabled by default
  EVIDENCE_GALLERY_MODAL: true,
  EVIDENCE_GALLERY_LAZY_LOADING: true,
  EVIDENCE_GALLERY_MULTIMEDIA: true,

  // Monitoring - enabled by default
  PERFORMANCE_MONITORING: true,
  BUNDLE_SIZE_ALERTS: true,

  // Emergency modes - disabled by default
  EMERGENCY_FALLBACK_MODE: false,
  TEXT_ONLY_MODE: false
};

// Environment variable overrides
function parseEnvironmentFlags(): Partial<FeatureFlags> {
  const envFlags: Partial<FeatureFlags> = {};

  // Parse boolean environment variables
  Object.keys(DEFAULT_FLAGS).forEach(flag => {
    const envKey = `ORGA_FEATURE_${flag}`;
    const envValue = import.meta.env[envKey];

    if (envValue !== undefined) {
      envFlags[flag as keyof FeatureFlags] = envValue === 'true';
    }
  });

  return envFlags;
}

// Emergency rollback function (Купер requirement)
export function enableEmergencyRollback(): FeatureFlags {
  return {
    ...DEFAULT_FLAGS,
    // Disable all multimedia features
    TIMELINE_INTERACTIVE: false,
    TIMELINE_VIRTUALIZATION: false,
    EVIDENCE_GALLERY_MODAL: false,
    EVIDENCE_GALLERY_MULTIMEDIA: false,
    // Enable fallback modes
    EMERGENCY_FALLBACK_MODE: true,
    TEXT_ONLY_MODE: true
  };
}

// Performance degradation rollback (graduated approach)
export function enablePerformanceRollback(severity: 'mild' | 'severe'): FeatureFlags {
  const baseFlags = { ...DEFAULT_FLAGS };

  if (severity === 'mild') {
    // Disable heavy features only
    baseFlags.EVIDENCE_GALLERY_MULTIMEDIA = false;
    baseFlags.TIMELINE_VIRTUALIZATION = false;
  } else if (severity === 'severe') {
    // Full rollback to basic functionality
    return enableEmergencyRollback();
  }

  return baseFlags;
}

// Main feature flag resolution
export function getFeatureFlags(): FeatureFlags {
  const envFlags = parseEnvironmentFlags();
  return { ...DEFAULT_FLAGS, ...envFlags };
}

// Runtime feature flag checking utilities
export function isEnabled(flag: keyof FeatureFlags): boolean {
  const flags = getFeatureFlags();
  return flags[flag];
}

// Performance monitoring trigger detection
export function checkPerformanceThresholds(metrics: {
  bundleSize: number;
  lcp: number;
  performanceScore: number;
}): 'healthy' | 'degraded' | 'critical' {
  const { bundleSize, lcp, performanceScore } = metrics;

  // Emergency rollback triggers (from Купер assessment)
  if (bundleSize > 150000 || lcp > 2500 || performanceScore < 0.85) {
    return 'critical';
  }

  // Warning thresholds (75% of limits)
  if (bundleSize > 112500 || lcp > 1875 || performanceScore < 0.90) {
    return 'degraded';
  }

  return 'healthy';
}