// Lighthouse CI Configuration
// ORGA-072.1: Foundation Infrastructure - Performance Monitoring
// Expert assessment: Купер (HIGH COMPLEXITY rollback) + Johnny (baseline measurement)

module.exports = {
  ci: {
    collect: {
      // Test against built static files
      staticDistDir: './dist',
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --headless',
        // Performance budget enforcement
        budgets: [
          {
            path: '/*',
            resourceSizes: [
              {
                resourceType: 'script',
                budget: 150000 // 150KB JS budget per route (Купер threshold)
              },
              {
                resourceType: 'total',
                budget: 512000 // 512KB total budget
              }
            ],
            timings: [
              {
                metric: 'largest-contentful-paint',
                budget: 2500 // LCP <2.5s target (Johnny specification)
              },
              {
                metric: 'cumulative-layout-shift',
                budget: 0.1
              }
            ]
          }
        ]
      }
    },
    assert: {
      // Emergency rollback triggers (Купер assessment)
      assertions: {
        'categories:performance': ['error', { minScore: 0.85 }], // Score <85 = rollback trigger
        'categories:accessibility': ['error', { minScore: 0.95 }], // WCAG 2.1 AA compliance
        'resource-summary:script:size': ['error', { maxNumericValue: 150000 }], // Bundle >150KB = emergency rollback
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }], // LCP >2.5s = rollback trigger
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }]
      }
    },
    upload: {
      // Store results for baseline comparison
      target: 'filesystem',
      outputDir: './lighthouse-results'
    }
  }
};