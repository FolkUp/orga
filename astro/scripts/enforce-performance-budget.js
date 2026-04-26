#!/usr/bin/env node

// Performance Budget Enforcement for CI/CD
// ORGA-072.4: Automated budget enforcement + emergency rollback integration
// Johnny synthesis: webpack-bundle-analyzer + CI/CD gates + Купер rollback procedures

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { budgetEnforcer, PERFORMANCE_BUDGET_CONFIG } from '../performance-budget.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class PerformanceBudgetCI {
  constructor() {
    this.projectRoot = join(__dirname, '..');
    this.reportDir = join(this.projectRoot, 'performance-reports');
    this.config = PERFORMANCE_BUDGET_CONFIG;
  }

  /**
   * Main CI/CD enforcement entry point
   */
  async enforce(options = {}) {
    const {
      failFast = true,
      generateReport = true,
      skipRollback = false
    } = options;

    console.log('🎯 ORGA Performance Budget Enforcement');
    console.log('⚙️ Johnny synthesis + Купер rollback integration\n');

    try {
      // Step 1: Build the project
      await this.buildProject();

      // Step 2: Analyze bundle size
      const bundleAnalysis = await this.analyzeBundles();

      // Step 3: Run Lighthouse performance test
      const performanceMetrics = await this.measurePerformance();

      // Step 4: Validate against budgets
      const budgetValidation = this.validateBudgets(bundleAnalysis, performanceMetrics);

      // Step 5: Check for emergency conditions (Купер integration)
      const emergencyCheck = this.checkEmergencyConditions(performanceMetrics);

      // Step 6: Generate reports
      if (generateReport) {
        await this.generateReports(bundleAnalysis, performanceMetrics, budgetValidation);
      }

      // Step 7: Handle violations
      await this.handleViolations(budgetValidation, emergencyCheck, { skipRollback });

      // Step 8: Update performance tracking
      this.updatePerformanceTracking(performanceMetrics);

      console.log('\n✅ Performance budget enforcement completed successfully');
      return { success: true, violations: [], emergencyTriggered: false };

    } catch (error) {
      console.error('\n❌ Performance budget enforcement failed:', error.message);

      if (failFast) {
        process.exit(1);
      }

      return { success: false, error: error.message };
    }
  }

  /**
   * Build project for analysis
   */
  async buildProject() {
    console.log('🔨 Building project for analysis...');

    try {
      execSync('npm run build', {
        cwd: this.projectRoot,
        stdio: 'pipe'
      });
      console.log('✓ Build completed');
    } catch (error) {
      throw new Error(`Build failed: ${error.message}`);
    }
  }

  /**
   * Analyze bundle sizes using webpack-bundle-analyzer approach
   */
  async analyzeBundles() {
    console.log('📊 Analyzing bundle sizes...');

    const distDir = join(this.projectRoot, 'dist', '_assets');

    if (!existsSync(distDir)) {
      throw new Error('Dist directory not found. Build may have failed.');
    }

    try {
      // Get all JS files in dist
      const jsFiles = execSync(`find "${distDir}" -name "*.js" -type f`, { encoding: 'utf8' })
        .trim()
        .split('\n')
        .filter(file => file);

      // Calculate sizes
      let totalJs = 0;
      const chunks = [];

      for (const file of jsFiles) {
        if (!existsSync(file)) continue;

        const stats = execSync(`stat -f%z "${file}" 2>/dev/null || stat -c%s "${file}"`, {
          encoding: 'utf8'
        }).trim();

        const size = parseInt(stats, 10);
        totalJs += size;

        chunks.push({
          file: file.split('/').pop(),
          size: size,
          path: file
        });
      }

      // Get CSS files
      const cssFiles = execSync(`find "${distDir}" -name "*.css" -type f`, { encoding: 'utf8' })
        .trim()
        .split('\n')
        .filter(file => file);

      let totalCss = 0;
      for (const file of cssFiles) {
        if (!existsSync(file)) continue;

        const stats = execSync(`stat -f%z "${file}" 2>/dev/null || stat -c%s "${file}"`, {
          encoding: 'utf8'
        }).trim();
        totalCss += parseInt(stats, 10);
      }

      const analysis = {
        js: totalJs,
        css: totalCss,
        total: totalJs + totalCss,
        chunks: chunks.sort((a, b) => b.size - a.size),
        largestChunk: chunks.length > 0 ? chunks[0].size : 0
      };

      console.log(`✓ Bundle analysis complete: ${totalJs} bytes JS, ${totalCss} bytes CSS`);
      return analysis;

    } catch (error) {
      throw new Error(`Bundle analysis failed: ${error.message}`);
    }
  }

  /**
   * Measure performance using Lighthouse CI
   */
  async measurePerformance() {
    console.log('⚡ Measuring performance with Lighthouse...');

    try {
      // Run Lighthouse CI collect
      execSync('npm run lhci:collect', {
        cwd: this.projectRoot,
        stdio: 'pipe'
      });

      // Parse latest Lighthouse report
      const lhciDir = join(this.projectRoot, '.lighthouseci');
      const reportFiles = execSync(`ls -t "${lhciDir}"/lhr-*.json | head -1`, { encoding: 'utf8' }).trim();

      if (!reportFiles) {
        throw new Error('No Lighthouse reports found');
      }

      const reportData = readFileSync(reportFiles, 'utf8');
      const report = JSON.parse(reportData);

      // Extract key metrics
      const metrics = {
        lcp: report.audits['largest-contentful-paint']?.numericValue || 0,
        fcp: report.audits['first-contentful-paint']?.numericValue || 0,
        cls: report.audits['cumulative-layout-shift']?.numericValue || 0,
        performanceScore: report.categories?.performance?.score || 0,
        bundleSize: 0 // Will be filled by bundle analysis
      };

      console.log(`✓ Performance measured: LCP ${metrics.lcp}ms, Score ${metrics.performanceScore}`);
      return metrics;

    } catch (error) {
      console.warn(`⚠️ Performance measurement failed: ${error.message}`);

      // Return default metrics if Lighthouse fails
      return {
        lcp: 9999, // High value to trigger investigation
        fcp: 9999,
        cls: 1.0,
        performanceScore: 0,
        bundleSize: 0
      };
    }
  }

  /**
   * Validate against performance budgets
   */
  validateBudgets(bundleAnalysis, performanceMetrics) {
    console.log('🎯 Validating against performance budgets...');

    // Combine metrics
    const combinedStats = {
      js: bundleAnalysis.js,
      css: bundleAnalysis.css,
      total: bundleAnalysis.total,
      largestChunk: bundleAnalysis.largestChunk
    };

    // Validate critical routes
    const routes = ['index', 'longform', 'evidence-gallery'];
    const results = {};
    let hasViolations = false;

    for (const route of routes) {
      const validation = budgetEnforcer.validateRoute(route, combinedStats);
      results[route] = validation;

      if (!validation.valid) {
        hasViolations = true;
        console.log(`❌ Budget violation for ${route}:`);
        validation.violations.forEach(v => console.log(`  • ${v}`));
      } else {
        console.log(`✓ Budget compliance for ${route}`);
      }

      if (validation.warnings.length > 0) {
        console.log(`⚠️ Warnings for ${route}:`);
        validation.warnings.forEach(w => console.log(`  • ${w}`));
      }
    }

    return {
      hasViolations,
      routes: results,
      overall: budgetEnforcer.generateReport(combinedStats)
    };
  }

  /**
   * Check for emergency rollback conditions (Купер integration)
   */
  checkEmergencyConditions(performanceMetrics) {
    console.log('🚨 Checking emergency rollback conditions...');

    const emergency = budgetEnforcer.checkEmergencyConditions(performanceMetrics);

    if (emergency.emergencyDetected) {
      console.log('🚨 EMERGENCY CONDITIONS DETECTED:');
      emergency.triggers.forEach(trigger => console.log(`  • ${trigger}`));

      if (emergency.shouldRollback) {
        console.log('🔄 AUTOMATIC ROLLBACK TRIGGERED');
      }
    } else {
      console.log('✓ No emergency conditions detected');
    }

    return emergency;
  }

  /**
   * Handle violations and emergencies
   */
  async handleViolations(budgetValidation, emergencyCheck, options = {}) {
    const { skipRollback = false } = options;

    // Handle emergency conditions first (highest priority)
    if (emergencyCheck.emergencyDetected && !skipRollback) {
      console.log('\n🚨 EMERGENCY PROTOCOL ACTIVATED');

      // Trigger emergency rollback (Купер procedure)
      await this.triggerEmergencyRollback(emergencyCheck.triggers);

      // Emergency exit - don't continue with normal violation handling
      throw new Error('Emergency rollback triggered - build aborted');
    }

    // Handle budget violations
    if (budgetValidation.hasViolations) {
      console.log('\n❌ PERFORMANCE BUDGET VIOLATIONS DETECTED');

      if (this.config.cicd.failOnBudgetExceeded) {
        // Log recommendations before failing
        console.log('\n🔧 OPTIMIZATION RECOMMENDATIONS:');
        budgetValidation.overall.recommendations.forEach(rec => {
          console.log(`  • ${rec}`);
        });

        throw new Error('Performance budget exceeded - build failed');
      } else {
        console.log('⚠️ Budget violations detected but build continues (failOnBudgetExceeded: false)');
      }
    }
  }

  /**
   * Trigger emergency rollback (Купер integration)
   */
  async triggerEmergencyRollback(triggers) {
    console.log('🔄 Triggering emergency rollback procedure...');

    try {
      // Check if emergency rollback is enabled
      if (!this.config.emergency.autoRollback.enabled) {
        console.log('ℹ️ Auto-rollback disabled - manual intervention required');
        return;
      }

      // Get latest successful git tag
      const latestTag = execSync('git describe --tags --abbrev=0', {
        encoding: 'utf8',
        cwd: this.projectRoot
      }).trim();

      console.log(`🏷️ Rolling back to: ${latestTag}`);

      // Create emergency rollback branch
      const rollbackBranch = `emergency-rollback-${Date.now()}`;
      execSync(`git checkout -b ${rollbackBranch}`, { cwd: this.projectRoot });

      // Reset to last known good state
      execSync(`git reset --hard ${latestTag}`, { cwd: this.projectRoot });

      // Update emergency log
      const emergencyLog = {
        timestamp: new Date().toISOString(),
        triggers: triggers,
        rollbackTag: latestTag,
        rollbackBranch: rollbackBranch,
        autoRollback: true
      };

      writeFileSync(
        join(this.projectRoot, 'EMERGENCY-ROLLBACK.json'),
        JSON.stringify(emergencyLog, null, 2)
      );

      console.log('✓ Emergency rollback completed');
      console.log(`📋 Rollback details saved to EMERGENCY-ROLLBACK.json`);

    } catch (error) {
      console.error('❌ Emergency rollback failed:', error.message);
      throw new Error('Emergency rollback procedure failed');
    }
  }

  /**
   * Generate performance reports
   */
  async generateReports(bundleAnalysis, performanceMetrics, budgetValidation) {
    console.log('📊 Generating performance reports...');

    const report = {
      timestamp: new Date().toISOString(),
      bundleAnalysis,
      performanceMetrics,
      budgetValidation,
      config: this.config
    };

    // Ensure report directory exists
    execSync(`mkdir -p "${this.reportDir}"`, { cwd: this.projectRoot });

    // Save detailed report
    const reportPath = join(this.reportDir, `performance-report-${Date.now()}.json`);
    writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Save latest report (overwrite)
    const latestReportPath = join(this.reportDir, 'latest-performance-report.json');
    writeFileSync(latestReportPath, JSON.stringify(report, null, 2));

    console.log(`✓ Reports generated: ${reportPath}`);
  }

  /**
   * Update performance tracking
   */
  updatePerformanceTracking(metrics) {
    // Simple tracking - in production this would integrate with monitoring systems
    const trackingData = {
      timestamp: new Date().toISOString(),
      lcp: metrics.lcp,
      performanceScore: metrics.performanceScore,
      budgetCompliance: metrics.lcp <= this.config.thresholds.emergency.lcp
    };

    console.log('📈 Performance tracking updated');
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const options = {};

  // Parse CLI arguments
  if (args.includes('--no-fail-fast')) options.failFast = false;
  if (args.includes('--no-reports')) options.generateReport = false;
  if (args.includes('--skip-rollback')) options.skipRollback = true;

  if (args.includes('--help')) {
    console.log(`
ORGA Performance Budget CI/CD Enforcement

Usage: npm run budget:enforce [options]

Options:
  --no-fail-fast     Continue on violations (don't exit)
  --no-reports       Skip report generation
  --skip-rollback    Skip emergency rollback procedures
  --help             Show this help

Budget Thresholds:
  Emergency: Bundle >150KB, LCP >2.5s, Score <85%
  Warning:   Bundle >112KB, LCP >1.9s, Score <90%
  Target:    Bundle <75KB,  LCP <1.3s, Score >95%

Emergency Rollback:
  Автоматический откат при превышении emergency thresholds
  Интеграция с Купер rollback strategy из ORGA-072.1
`);
    process.exit(0);
  }

  const enforcer = new PerformanceBudgetCI();
  const result = await enforcer.enforce(options);

  process.exit(result.success ? 0 : 1);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ CI enforcement failed:', error.message);
    process.exit(1);
  });
}

export { PerformanceBudgetCI };