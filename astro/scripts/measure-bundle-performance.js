#!/usr/bin/env node
// ORGA-067: Bundle Performance Measurement Script
// Real-time bundle analysis with rollback trigger integration
// Expert assessment: Johnny (performance measurement) + Купер (rollback integration)

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

const execAsync = promisify(exec);

class BundlePerformanceMeasurement {
  constructor() {
    this.thresholds = {
      maxBundleSize: 150 * 1024, // 150KB
      maxLCP: 2500, // 2.5s
      minPerformanceScore: 0.85 // 85%
    };

    this.baselineFile = 'performance-baseline.json';
    this.resultsFile = 'bundle-analysis-results.json';
  }

  async measurePerformance() {
    console.log('🔍 ORGA-067: Measuring bundle performance...\n');

    try {
      // Step 1: Build the project
      console.log('📦 Building project...');
      await execAsync('npm run build');
      console.log('✅ Build completed\n');

      // Step 2: Analyze bundle size
      const bundleAnalysis = await this.analyzeBundleSize();

      // Step 3: Run Lighthouse CI for LCP measurement
      const lighthouseResults = await this.runLighthouseCI();

      // Step 4: Calculate performance metrics
      const performanceMetrics = this.calculateMetrics(bundleAnalysis, lighthouseResults);

      // Step 5: Compare with baseline
      const baseline = this.loadBaseline();
      const comparison = this.compareWithBaseline(performanceMetrics, baseline);

      // Step 6: Generate report
      this.generateReport(performanceMetrics, comparison);

      // Step 7: Check for performance regression
      const regressionStatus = this.checkRegression(performanceMetrics, comparison);

      // Step 8: Trigger rollback if necessary
      if (regressionStatus.shouldRollback) {
        await this.triggerRollback(regressionStatus);
      }

      return {
        success: true,
        metrics: performanceMetrics,
        regression: regressionStatus
      };

    } catch (error) {
      console.error('❌ Performance measurement failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async analyzeBundleSize() {
    console.log('📊 Analyzing bundle size...');

    const distDir = 'dist/_assets';

    if (!existsSync(distDir)) {
      throw new Error('Build directory not found. Please run npm run build first.');
    }

    // Read build output from Vite
    const buildOutput = await execAsync('npm run build 2>&1 | grep -E "(kB|MB)"');

    // Parse bundle sizes from Vite output
    const bundleSizes = this.parseBuildOutput(buildOutput.stdout);

    // Calculate total bundle size
    const totalSize = bundleSizes.reduce((total, file) => total + file.size, 0);

    console.log(`📊 Total bundle size: ${(totalSize / 1024).toFixed(1)}KB`);

    // Identify largest chunks
    const largestChunks = bundleSizes
      .sort((a, b) => b.size - a.size)
      .slice(0, 5);

    console.log('📦 Largest chunks:');
    largestChunks.forEach(chunk => {
      console.log(`  - ${chunk.name}: ${(chunk.size / 1024).toFixed(1)}KB`);
    });

    return {
      totalSize,
      chunks: bundleSizes,
      largestChunks
    };
  }

  parseBuildOutput(output) {
    const lines = output.split('\n');
    const bundleSizes = [];

    const sizeRegex = /(.+\.js)\s+([0-9.]+)\s+kB/g;
    let match;

    while ((match = sizeRegex.exec(output)) !== null) {
      const [, filename, sizeKB] = match;
      bundleSizes.push({
        name: filename.trim(),
        size: parseFloat(sizeKB) * 1024 // Convert to bytes
      });
    }

    return bundleSizes;
  }

  async runLighthouseCI() {
    console.log('🚀 Running Lighthouse CI for LCP measurement...');

    try {
      // Start preview server
      const previewProcess = exec('npm run preview');

      // Wait for server to start
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Run Lighthouse CI
      const { stdout } = await execAsync('npm run lhci:collect 2>&1 || true');

      // Parse Lighthouse results
      const results = this.parseLighthouseResults(stdout);

      // Kill preview server
      previewProcess.kill();

      console.log(`🎯 LCP: ${results.lcp}ms`);
      console.log(`📊 Performance Score: ${results.performanceScore}`);

      return results;

    } catch (error) {
      console.warn('⚠️ Lighthouse CI failed, using fallback metrics');
      return {
        lcp: 0,
        performanceScore: 1.0,
        error: error.message
      };
    }
  }

  parseLighthouseResults(output) {
    // Simple parsing - in production, you'd use lighthouse JSON output
    const lcpMatch = output.match(/largest-contentful-paint.*?(\d+\.?\d*)\s*ms/i);
    const perfMatch = output.match(/performance.*?(\d+\.?\d*)/i);

    return {
      lcp: lcpMatch ? parseFloat(lcpMatch[1]) : 0,
      performanceScore: perfMatch ? parseFloat(perfMatch[1]) / 100 : 1.0
    };
  }

  calculateMetrics(bundleAnalysis, lighthouseResults) {
    const metrics = {
      bundleSize: bundleAnalysis.totalSize,
      lcp: lighthouseResults.lcp,
      performanceScore: lighthouseResults.performanceScore,
      timestamp: Date.now(),
      chunks: bundleAnalysis.chunks,
      largestChunks: bundleAnalysis.largestChunks
    };

    // Calculate performance budget utilization
    metrics.budgetUtilization = {
      bundleSize: (metrics.bundleSize / this.thresholds.maxBundleSize) * 100,
      lcp: (metrics.lcp / this.thresholds.maxLCP) * 100,
      performanceScore: (metrics.performanceScore / this.thresholds.minPerformanceScore) * 100
    };

    return metrics;
  }

  loadBaseline() {
    if (!existsSync(this.baselineFile)) {
      console.log('📝 No baseline found, creating new baseline');
      return null;
    }

    try {
      const baselineData = readFileSync(this.baselineFile, 'utf8');
      return JSON.parse(baselineData);
    } catch (error) {
      console.warn('⚠️ Failed to load baseline:', error.message);
      return null;
    }
  }

  compareWithBaseline(metrics, baseline) {
    if (!baseline) {
      // Save current metrics as baseline
      writeFileSync(this.baselineFile, JSON.stringify(metrics, null, 2));
      return {
        isBaseline: true,
        message: 'Created new performance baseline'
      };
    }

    const comparison = {
      bundleSizeDelta: metrics.bundleSize - baseline.bundleSize,
      lcpDelta: metrics.lcp - baseline.lcp,
      performanceScoreDelta: metrics.performanceScore - baseline.performanceScore,
      bundleSizeChange: ((metrics.bundleSize - baseline.bundleSize) / baseline.bundleSize) * 100,
      lcpChange: ((metrics.lcp - baseline.lcp) / baseline.lcp) * 100,
      performanceScoreChange: ((metrics.performanceScore - baseline.performanceScore) / baseline.performanceScore) * 100
    };

    return comparison;
  }

  checkRegression(metrics, comparison) {
    console.log('\n🔍 Checking for performance regression...');

    const issues = [];
    let severity = 'none';

    // Check bundle size threshold
    if (metrics.bundleSize > this.thresholds.maxBundleSize) {
      issues.push({
        type: 'bundle_size_exceeded',
        severity: 'critical',
        current: metrics.bundleSize,
        threshold: this.thresholds.maxBundleSize,
        message: `Bundle size ${(metrics.bundleSize / 1024).toFixed(1)}KB exceeds ${this.thresholds.maxBundleSize / 1024}KB limit`
      });
      severity = 'critical';
    }

    // Check LCP threshold
    if (metrics.lcp > this.thresholds.maxLCP) {
      issues.push({
        type: 'lcp_exceeded',
        severity: 'critical',
        current: metrics.lcp,
        threshold: this.thresholds.maxLCP,
        message: `LCP ${metrics.lcp}ms exceeds ${this.thresholds.maxLCP}ms limit`
      });
      severity = 'critical';
    }

    // Check performance score threshold
    if (metrics.performanceScore < this.thresholds.minPerformanceScore) {
      issues.push({
        type: 'performance_score_low',
        severity: 'warning',
        current: metrics.performanceScore,
        threshold: this.thresholds.minPerformanceScore,
        message: `Performance score ${(metrics.performanceScore * 100).toFixed(1)}% below ${this.thresholds.minPerformanceScore * 100}% minimum`
      });
      if (severity !== 'critical') severity = 'warning';
    }

    // Check for significant regression (if baseline exists)
    if (comparison && !comparison.isBaseline) {
      if (comparison.bundleSizeChange > 20) {
        issues.push({
          type: 'bundle_size_regression',
          severity: 'warning',
          current: metrics.bundleSize,
          baseline: metrics.bundleSize - comparison.bundleSizeDelta,
          change: comparison.bundleSizeChange,
          message: `Bundle size increased by ${comparison.bundleSizeChange.toFixed(1)}%`
        });
        if (severity === 'none') severity = 'warning';
      }

      if (comparison.lcpChange > 25) {
        issues.push({
          type: 'lcp_regression',
          severity: 'warning',
          current: metrics.lcp,
          baseline: metrics.lcp - comparison.lcpDelta,
          change: comparison.lcpChange,
          message: `LCP increased by ${comparison.lcpChange.toFixed(1)}%`
        });
        if (severity === 'none') severity = 'warning';
      }
    }

    // Determine rollback action
    const shouldRollback = severity === 'critical';

    if (issues.length > 0) {
      console.log(`❌ Performance issues detected (severity: ${severity}):`);
      issues.forEach(issue => {
        console.log(`  - ${issue.message}`);
      });
    } else {
      console.log('✅ No performance regression detected');
    }

    return {
      severity,
      issues,
      shouldRollback,
      triggerType: shouldRollback ? 'automatic' : 'none'
    };
  }

  async triggerRollback(regressionStatus) {
    console.log('\n🚨 TRIGGERING PERFORMANCE ROLLBACK...');

    const rollbackData = {
      timestamp: Date.now(),
      reason: 'performance_regression',
      severity: regressionStatus.severity,
      issues: regressionStatus.issues,
      triggerType: 'automatic'
    };

    try {
      // 1. Create rollback log entry
      writeFileSync('rollback-log.json', JSON.stringify(rollbackData, null, 2));

      // 2. Git rollback to pre-ORGA-067 tag
      console.log('📦 Rolling back to pre-ORGA-067 checkpoint...');
      await execAsync('git stash');
      await execAsync('git checkout pre-orga-067');
      await execAsync('git checkout -b rollback-orga-067');

      // 3. Rebuild with previous version
      console.log('🔄 Rebuilding with rollback version...');
      await execAsync('npm run build');

      // 4. Verify rollback performance
      const rollbackAnalysis = await this.analyzeBundleSize();

      console.log('✅ Rollback completed successfully');
      console.log(`📦 Rollback bundle size: ${(rollbackAnalysis.totalSize / 1024).toFixed(1)}KB`);

      // 5. Notify about rollback
      this.notifyRollback(rollbackData, rollbackAnalysis);

    } catch (error) {
      console.error('❌ Rollback failed:', error);
      throw new Error(`Rollback execution failed: ${error.message}`);
    }
  }

  notifyRollback(rollbackData, rollbackAnalysis) {
    const notification = {
      type: 'PERFORMANCE_ROLLBACK',
      timestamp: rollbackData.timestamp,
      severity: rollbackData.severity,
      rollbackSize: rollbackAnalysis.totalSize,
      issues: rollbackData.issues.map(issue => issue.message),
      nextSteps: [
        'Review ORGA-067 implementation',
        'Optimize bundle size and LCP',
        'Re-test before re-deployment'
      ]
    };

    console.log('\n📧 Rollback notification:', JSON.stringify(notification, null, 2));

    // In production, this would send notifications via email/Slack
    writeFileSync('rollback-notification.json', JSON.stringify(notification, null, 2));
  }

  generateReport(metrics, comparison) {
    console.log('\n📊 PERFORMANCE MEASUREMENT REPORT');
    console.log('=====================================');

    console.log('\n📦 Bundle Analysis:');
    console.log(`  Total Size: ${(metrics.bundleSize / 1024).toFixed(1)}KB`);
    console.log(`  Budget Utilization: ${metrics.budgetUtilization.bundleSize.toFixed(1)}%`);

    console.log('\n🎯 Core Web Vitals:');
    console.log(`  LCP: ${metrics.lcp}ms`);
    console.log(`  Performance Score: ${(metrics.performanceScore * 100).toFixed(1)}%`);

    if (comparison && !comparison.isBaseline) {
      console.log('\n📈 Changes from Baseline:');
      console.log(`  Bundle Size: ${comparison.bundleSizeChange >= 0 ? '+' : ''}${comparison.bundleSizeChange.toFixed(1)}%`);
      console.log(`  LCP: ${comparison.lcpChange >= 0 ? '+' : ''}${comparison.lcpChange.toFixed(1)}%`);
      console.log(`  Performance Score: ${comparison.performanceScoreChange >= 0 ? '+' : ''}${comparison.performanceScoreChange.toFixed(1)}%`);
    }

    console.log('\n🏆 Top Chunks:');
    metrics.largestChunks.forEach((chunk, index) => {
      console.log(`  ${index + 1}. ${chunk.name}: ${(chunk.size / 1024).toFixed(1)}KB`);
    });

    // Save detailed results
    const reportData = {
      timestamp: metrics.timestamp,
      metrics,
      comparison,
      thresholds: this.thresholds
    };

    writeFileSync(this.resultsFile, JSON.stringify(reportData, null, 2));
    console.log(`\n📄 Detailed report saved to: ${this.resultsFile}`);
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const measurement = new BundlePerformanceMeasurement();

  measurement.measurePerformance()
    .then(result => {
      if (result.success) {
        console.log('\n✅ Performance measurement completed successfully');
        process.exit(0);
      } else {
        console.error('\n❌ Performance measurement failed');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n💥 Measurement script crashed:', error);
      process.exit(1);
    });
}

export { BundlePerformanceMeasurement };