// Performance Budget Framework Configuration
// ORGA-072.4: Bundle analysis + enforcement (Johnny synthesis priority)
// Integration: Купер rollback + Johnny performance + bundle optimization

export const PERFORMANCE_BUDGET_CONFIG = {
  // Bundle size budgets per route (Johnny: ≤150KB JS/route)
  budgets: {
    // Main routes
    'index': {
      js: 150 * 1024, // 150KB maximum
      css: 50 * 1024,  // 50KB CSS budget
      total: 512 * 1024, // 512KB total budget
      critical: true // Critical route for performance
    },
    'longform': {
      js: 150 * 1024, // Same JS budget for longform content
      css: 60 * 1024,  // Slightly higher for rich content
      total: 640 * 1024, // Higher total for multimedia
      critical: true
    },
    'evidence-gallery': {
      js: 180 * 1024, // Higher budget for complex interactions
      css: 80 * 1024,  // Higher for gallery layouts
      total: 1024 * 1024, // 1MB for multimedia gallery
      critical: false // Non-critical route
    },
    'investigations': {
      js: 120 * 1024, // Lower budget for listing pages
      css: 40 * 1024,
      total: 384 * 1024,
      critical: false
    },
    'legal': {
      js: 80 * 1024,  // Minimal JS for legal pages
      css: 30 * 1024,
      total: 256 * 1024,
      critical: false
    }
  },

  // Performance thresholds (from Купер emergency rollback triggers)
  thresholds: {
    // Emergency rollback triggers
    emergency: {
      bundleSize: 150 * 1024, // 150KB = immediate rollback
      lcp: 2500, // 2.5s LCP = emergency
      performanceScore: 0.85 // <85% = emergency
    },

    // Warning thresholds (75% of emergency limits)
    warning: {
      bundleSize: 112.5 * 1024, // 112.5KB = warning
      lcp: 1875, // 1.875s LCP = warning
      performanceScore: 0.90 // <90% = warning
    },

    // Optimization targets (50% of emergency limits)
    target: {
      bundleSize: 75 * 1024, // 75KB = optimal
      lcp: 1250, // 1.25s LCP = optimal
      performanceScore: 0.95 // 95%+ = optimal
    }
  },

  // Bundle analysis configuration
  analysis: {
    // webpack-bundle-analyzer settings
    analyzer: {
      mode: 'static',
      reportFilename: 'bundle-analysis-report.html',
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: 'bundle-stats.json'
    },

    // Analysis thresholds
    alerts: {
      largeChunk: 100 * 1024, // Alert if any chunk >100KB
      duplicatePackages: true, // Alert on duplicate dependencies
      unusedCode: 10 * 1024,  // Alert if unused code >10KB
      compressionRatio: 0.7   // Alert if compression ratio <70%
    }
  },

  // CI/CD enforcement configuration
  cicd: {
    // Fail build if budget exceeded
    failOnBudgetExceeded: true,

    // Fail build on performance regression
    failOnPerformanceRegression: true,

    // Performance regression tolerance (%)
    regressionTolerance: 5,

    // Lighthouse CI integration
    lighthouse: {
      budgetPath: './budget.json',
      uploadTarget: 'filesystem',
      outputDir: './lighthouse-ci-results'
    }
  },

  // Bundle splitting strategy (Johnny optimization)
  splitting: {
    // Vendor chunk strategy
    vendor: {
      minSize: 20 * 1024, // Minimum 20KB for vendor chunk
      maxSize: 100 * 1024, // Maximum 100KB per vendor chunk
      chunks: 'all',
      enforce: true
    },

    // Component chunk strategy
    components: {
      minSize: 10 * 1024, // Minimum 10KB for component chunk
      maxSize: 50 * 1024,  // Maximum 50KB per component chunk
      chunks: 'async',
      enforce: false
    },

    // Critical path optimization
    critical: [
      'src/components/ReadingModeToggle.astro',
      'src/components/CookieConsent.astro',
      'src/utils/performance-monitor.ts'
    ]
  },

  // Emergency procedures (Купер rollback integration)
  emergency: {
    // Automatic rollback triggers
    autoRollback: {
      enabled: true,
      cooldownMinutes: 30, // Prevent rollback loops
      maxAttemptsPerHour: 3
    },

    // Feature flag emergency overrides
    featureFlags: {
      disableMultimedia: true, // Disable heavy components first
      disableInteractivity: false, // Keep basic interactions
      enableTextOnlyMode: true // Final fallback option
    },

    // Emergency contact procedures
    notifications: {
      webhookUrl: null, // To be configured
      emailRecipients: ['performance-alerts@folkup.app'],
      includeMetrics: true
    }
  },

  // Monitoring and reporting
  monitoring: {
    // Real-time monitoring intervals
    intervals: {
      healthCheck: 30000, // 30s health checks
      metricCollection: 60000, // 1min metric collection
      budgetValidation: 300000 // 5min budget validation
    },

    // Metric collection settings
    metrics: {
      retention: 7, // Days to retain detailed metrics
      aggregation: 'hourly', // Metric aggregation level
      exportFormat: 'json'
    }
  }
};

// Budget enforcement utilities
export class PerformanceBudgetEnforcer {
  constructor(config = PERFORMANCE_BUDGET_CONFIG) {
    this.config = config;
  }

  /**
   * Validate route against performance budget
   */
  validateRoute(routeName, stats) {
    const budget = this.config.budgets[routeName];
    if (!budget) {
      return { valid: true, warnings: [`No budget defined for route: ${routeName}`] };
    }

    const violations = [];
    const warnings = [];

    // Check JS budget
    if (stats.js > budget.js) {
      violations.push(`JS bundle ${stats.js} bytes exceeds budget ${budget.js} bytes`);
    } else if (stats.js > budget.js * 0.8) {
      warnings.push(`JS bundle approaching budget limit: ${((stats.js / budget.js) * 100).toFixed(1)}%`);
    }

    // Check CSS budget
    if (stats.css > budget.css) {
      violations.push(`CSS bundle ${stats.css} bytes exceeds budget ${budget.css} bytes`);
    }

    // Check total budget
    if (stats.total > budget.total) {
      violations.push(`Total bundle ${stats.total} bytes exceeds budget ${budget.total} bytes`);
    }

    return {
      valid: violations.length === 0,
      violations,
      warnings,
      critical: budget.critical
    };
  }

  /**
   * Check for emergency rollback conditions (Купер integration)
   */
  checkEmergencyConditions(metrics) {
    const { emergency } = this.config.thresholds;
    const triggers = [];

    if (metrics.bundleSize > emergency.bundleSize) {
      triggers.push('Bundle size exceeds emergency threshold');
    }

    if (metrics.lcp > emergency.lcp) {
      triggers.push('LCP exceeds emergency threshold');
    }

    if (metrics.performanceScore < emergency.performanceScore) {
      triggers.push('Performance score below emergency threshold');
    }

    return {
      emergencyDetected: triggers.length > 0,
      triggers,
      shouldRollback: triggers.length > 0 && this.config.emergency.autoRollback.enabled
    };
  }

  /**
   * Generate bundle analysis report
   */
  generateReport(stats) {
    return {
      timestamp: new Date().toISOString(),
      overall: {
        totalSize: stats.total,
        budgetUtilization: (stats.total / this.config.budgets.index.total) * 100,
        performanceGrade: this.calculatePerformanceGrade(stats)
      },
      budgets: Object.keys(this.config.budgets).map(route => ({
        route,
        validation: this.validateRoute(route, stats)
      })),
      recommendations: this.generateRecommendations(stats)
    };
  }

  /**
   * Calculate performance grade based on budget utilization
   */
  calculatePerformanceGrade(stats) {
    const utilization = (stats.js / this.config.budgets.index.js) * 100;

    if (utilization <= 50) return 'A+';
    if (utilization <= 70) return 'A';
    if (utilization <= 85) return 'B';
    if (utilization <= 95) return 'C';
    return 'F';
  }

  /**
   * Generate optimization recommendations
   */
  generateRecommendations(stats) {
    const recommendations = [];

    // Bundle size recommendations
    if (stats.js > this.config.thresholds.warning.bundleSize) {
      recommendations.push('Consider code splitting for large components');
      recommendations.push('Review and remove unused dependencies');
    }

    // Chunk size recommendations
    if (stats.largestChunk > this.config.analysis.alerts.largeChunk) {
      recommendations.push('Large chunk detected - implement dynamic imports');
    }

    return recommendations;
  }
}

export const budgetEnforcer = new PerformanceBudgetEnforcer();