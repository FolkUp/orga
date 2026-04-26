// Performance Monitor - Real-time monitoring with rollback triggers
// ORGA-072.1: Foundation Infrastructure - Automated circuit breakers
// Expert assessment: Купер (emergency procedures) + Johnny (baseline measurement)

import { checkPerformanceThresholds, enablePerformanceRollback, enableEmergencyRollback } from './feature-flags.js';

export interface PerformanceMetrics {
  bundleSize: number;
  lcp: number; // Largest Contentful Paint
  performanceScore: number;
  timestamp: number;
  route: string;
}

export interface PerformanceConfig {
  // Купер emergency rollback triggers
  maxBundleSize: number; // 150KB limit
  maxLCP: number; // 2.5s limit
  minPerformanceScore: number; // 0.85 limit

  // Monitoring intervals
  checkInterval: number; // ms
  alertCooldown: number; // ms to prevent alert spam
}

const DEFAULT_CONFIG: PerformanceConfig = {
  maxBundleSize: 150000, // 150KB (Купер threshold)
  maxLCP: 2500, // 2.5s (Johnny target)
  minPerformanceScore: 0.85, // 85% (Lighthouse threshold)
  checkInterval: 30000, // Check every 30s
  alertCooldown: 300000 // 5min cooldown between alerts
};

class PerformanceMonitor {
  private config: PerformanceConfig;
  private metrics: PerformanceMetrics[] = [];
  private lastAlert = 0;
  private monitoringActive = false;

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // Start real-time monitoring (Купер requirement)
  startMonitoring(): void {
    if (this.monitoringActive) return;

    this.monitoringActive = true;

    // Monitor Web Vitals if available
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.observeWebVitals();
    }

    // Regular health checks
    setInterval(() => {
      this.performHealthCheck();
    }, this.config.checkInterval);
  }

  stopMonitoring(): void {
    this.monitoringActive = false;
  }

  // Web Vitals observation for LCP
  private observeWebVitals(): void {
    try {
      // LCP Observer
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;

        if (lastEntry) {
          this.recordMetric({
            bundleSize: this.estimateBundleSize(),
            lcp: lastEntry.renderTime || lastEntry.loadTime,
            performanceScore: 1.0, // Default, overridden by real measurements
            timestamp: Date.now(),
            route: window.location.pathname
          });
        }
      });

      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // Navigation timing for bundle size estimation
      if (performance.getEntriesByType) {
        const navigationEntry = performance.getEntriesByType('navigation')[0] as any;
        if (navigationEntry && navigationEntry.transferSize) {
          this.recordMetric({
            bundleSize: navigationEntry.transferSize,
            lcp: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
            performanceScore: 1.0,
            timestamp: Date.now(),
            route: window.location.pathname
          });
        }
      }
    } catch (error) {
      console.warn('Performance monitoring initialization failed:', error);
    }
  }

  // Estimate bundle size from resource timing
  private estimateBundleSize(): number {
    if (typeof window === 'undefined') return 0;

    try {
      const resources = performance.getEntriesByType('resource')
        .filter(entry => entry.name.includes('.js'))
        .reduce((total, entry: any) => total + (entry.transferSize || 0), 0);

      return resources;
    } catch {
      return 0;
    }
  }

  // Record performance metric and check thresholds
  recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);

    // Keep only last 100 measurements
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Check for performance degradation
    const status = checkPerformanceThresholds(metric);
    this.handlePerformanceStatus(status, metric);
  }

  // Handle performance status changes (Купер circuit breakers)
  private handlePerformanceStatus(status: 'healthy' | 'degraded' | 'critical', metric: PerformanceMetrics): void {
    const now = Date.now();

    // Alert cooldown to prevent spam
    if (now - this.lastAlert < this.config.alertCooldown) return;

    if (status === 'critical') {
      this.triggerEmergencyRollback(metric);
      this.lastAlert = now;
    } else if (status === 'degraded') {
      this.triggerPerformanceRollback('mild', metric);
      this.lastAlert = now;
    }
  }

  // Emergency rollback trigger (Купер HIGH COMPLEXITY procedure)
  private triggerEmergencyRollback(metric: PerformanceMetrics): void {
    console.warn('🚨 EMERGENCY ROLLBACK TRIGGERED', {
      bundleSize: `${(metric.bundleSize / 1024).toFixed(1)}KB`,
      lcp: `${metric.lcp}ms`,
      score: metric.performanceScore,
      route: metric.route,
      timestamp: new Date(metric.timestamp).toISOString()
    });

    // Enable emergency rollback features
    const rollbackFlags = enableEmergencyRollback();

    // Store rollback state in localStorage for persistence
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('orga-emergency-rollback', JSON.stringify({
        active: true,
        trigger: metric,
        timestamp: metric.timestamp
      }));
    }

    // Trigger page reload with emergency flags
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  // Performance degradation rollback (graduated response)
  private triggerPerformanceRollback(severity: 'mild' | 'severe', metric: PerformanceMetrics): void {
    console.warn(`⚠️ PERFORMANCE DEGRADATION ROLLBACK (${severity.toUpperCase()})`, {
      bundleSize: `${(metric.bundleSize / 1024).toFixed(1)}KB`,
      lcp: `${metric.lcp}ms`,
      route: metric.route
    });

    const rollbackFlags = enablePerformanceRollback(severity);

    // Store graduated rollback state
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('orga-performance-rollback', JSON.stringify({
        active: true,
        severity,
        trigger: metric,
        timestamp: metric.timestamp
      }));
    }
  }

  // Health check for regular monitoring
  performHealthCheck(): void {
    if (!this.monitoringActive) return;

    const latestMetrics = this.getLatestMetrics();
    if (latestMetrics.length === 0) return;

    const avgBundleSize = latestMetrics.reduce((sum, m) => sum + m.bundleSize, 0) / latestMetrics.length;
    const avgLCP = latestMetrics.reduce((sum, m) => sum + m.lcp, 0) / latestMetrics.length;

    console.debug('📊 Performance Health Check', {
      avgBundleSize: `${(avgBundleSize / 1024).toFixed(1)}KB`,
      avgLCP: `${avgLCP.toFixed(1)}ms`,
      sampleSize: latestMetrics.length
    });
  }

  // Get recent metrics (last 10 minutes)
  getLatestMetrics(): PerformanceMetrics[] {
    const tenMinutesAgo = Date.now() - 600000;
    return this.metrics.filter(m => m.timestamp > tenMinutesAgo);
  }

  // Get performance summary for reporting
  getPerformanceSummary(): {
    avgBundleSize: number;
    avgLCP: number;
    healthStatus: 'healthy' | 'degraded' | 'critical';
    measurementCount: number;
  } {
    const recent = this.getLatestMetrics();

    if (recent.length === 0) {
      return {
        avgBundleSize: 0,
        avgLCP: 0,
        healthStatus: 'healthy',
        measurementCount: 0
      };
    }

    const avgBundleSize = recent.reduce((sum, m) => sum + m.bundleSize, 0) / recent.length;
    const avgLCP = recent.reduce((sum, m) => sum + m.lcp, 0) / recent.length;
    const avgScore = recent.reduce((sum, m) => sum + m.performanceScore, 0) / recent.length;

    const healthStatus = checkPerformanceThresholds({
      bundleSize: avgBundleSize,
      lcp: avgLCP,
      performanceScore: avgScore
    });

    return {
      avgBundleSize,
      avgLCP,
      healthStatus,
      measurementCount: recent.length
    };
  }
}

// Singleton instance for application-wide monitoring
export const performanceMonitor = new PerformanceMonitor();

// Auto-start monitoring if in browser environment
if (typeof window !== 'undefined') {
  performanceMonitor.startMonitoring();
}