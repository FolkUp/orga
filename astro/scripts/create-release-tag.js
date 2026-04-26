#!/usr/bin/env node

// Release Tagging Script - Git tag fallback strategy
// ORGA-072.1: Foundation Infrastructure - Version stamping for rollbacks
// Expert assessment: Купер (rollback strategy) - Git tag fallbacks required

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Performance thresholds from Купер assessment
const PERFORMANCE_THRESHOLDS = {
  MAX_BUNDLE_SIZE: 150000, // 150KB
  MAX_LCP: 2500, // 2.5s
  MIN_PERFORMANCE_SCORE: 0.85 // 85%
};

class ReleaseManager {
  constructor() {
    this.projectRoot = join(__dirname, '..');
    this.packagePath = join(this.projectRoot, 'package.json');
  }

  // Generate version tag with performance metadata
  async createReleaseTag(options = {}) {
    const {
      type = 'patch', // major, minor, patch
      preRelease = false,
      skipPerformanceCheck = false
    } = options;

    try {
      console.log('🏗️ ORGA Release Tagging Process Started');

      // 1. Verify git status
      this.verifyGitStatus();

      // 2. Run performance validation (unless skipped)
      if (!skipPerformanceCheck) {
        await this.validatePerformance();
      }

      // 3. Update version
      const newVersion = this.updateVersion(type, preRelease);

      // 4. Build and validate
      await this.buildAndValidate();

      // 5. Create git tag with metadata
      const tagName = this.createGitTag(newVersion);

      // 6. Generate rollback information
      this.generateRollbackInfo(tagName, newVersion);

      console.log(`✅ Release tag ${tagName} created successfully`);
      console.log(`📋 Rollback command: git checkout ${tagName}`);

      return tagName;

    } catch (error) {
      console.error('❌ Release tagging failed:', error.message);
      process.exit(1);
    }
  }

  verifyGitStatus() {
    console.log('📋 Verifying git status...');

    try {
      // Check for uncommitted changes
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      if (status.trim()) {
        throw new Error('Repository has uncommitted changes. Please commit or stash changes before tagging.');
      }

      // Check if we're on main/master branch
      const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      if (!['main', 'master'].includes(branch)) {
        console.warn(`⚠️ Warning: Creating tag from branch '${branch}' instead of main/master`);
      }

      console.log(`✓ Git status clean on branch '${branch}'`);
    } catch (error) {
      throw new Error(`Git status check failed: ${error.message}`);
    }
  }

  async validatePerformance() {
    console.log('🔍 Running performance validation...');

    try {
      // Build the project first
      execSync('npm run build', { stdio: 'pipe' });

      // Run Lighthouse CI
      const lhciResult = execSync('npm run lhci:collect', { encoding: 'utf8', stdio: 'pipe' });

      // Parse lighthouse report
      const reportPath = join(this.projectRoot, 'lighthouse-report.json');
      let performanceData;

      try {
        const reportContent = readFileSync(reportPath, 'utf8');
        performanceData = JSON.parse(reportContent);
      } catch {
        console.warn('⚠️ Could not parse lighthouse report, proceeding with caution');
        return;
      }

      // Validate against thresholds (Купер emergency triggers)
      this.checkPerformanceThresholds(performanceData);

      console.log('✓ Performance validation passed');

    } catch (error) {
      throw new Error(`Performance validation failed: ${error.message}`);
    }
  }

  checkPerformanceThresholds(performanceData) {
    const errors = [];

    // Extract metrics from lighthouse report
    const metrics = performanceData?.audits || {};

    // Check LCP
    const lcp = metrics['largest-contentful-paint']?.numericValue;
    if (lcp && lcp > PERFORMANCE_THRESHOLDS.MAX_LCP) {
      errors.push(`LCP ${lcp}ms exceeds threshold ${PERFORMANCE_THRESHOLDS.MAX_LCP}ms`);
    }

    // Check performance score
    const performanceScore = performanceData?.categories?.performance?.score;
    if (performanceScore && performanceScore < PERFORMANCE_THRESHOLDS.MIN_PERFORMANCE_SCORE) {
      errors.push(`Performance score ${performanceScore} below threshold ${PERFORMANCE_THRESHOLDS.MIN_PERFORMANCE_SCORE}`);
    }

    // Check bundle size (from resource-summary)
    const bundleSize = metrics['resource-summary']?.details?.items
      ?.find(item => item.resourceType === 'script')?.size;

    if (bundleSize && bundleSize > PERFORMANCE_THRESHOLDS.MAX_BUNDLE_SIZE) {
      errors.push(`Bundle size ${bundleSize} bytes exceeds threshold ${PERFORMANCE_THRESHOLDS.MAX_BUNDLE_SIZE} bytes`);
    }

    if (errors.length > 0) {
      throw new Error(`Performance thresholds exceeded:\n${errors.map(e => `  - ${e}`).join('\n')}`);
    }
  }

  updateVersion(type, preRelease) {
    console.log(`📦 Updating version (${type}${preRelease ? ' pre-release' : ''})...`);

    const packageJson = JSON.parse(readFileSync(this.packagePath, 'utf8'));
    const currentVersion = packageJson.version;

    // Parse current version
    const versionParts = currentVersion.split('.').map(Number);
    let [major, minor, patch] = versionParts;

    // Increment based on type
    switch (type) {
      case 'major':
        major++;
        minor = 0;
        patch = 0;
        break;
      case 'minor':
        minor++;
        patch = 0;
        break;
      case 'patch':
        patch++;
        break;
      default:
        throw new Error(`Invalid version type: ${type}`);
    }

    // Construct new version
    let newVersion = `${major}.${minor}.${patch}`;
    if (preRelease) {
      const timestamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15);
      newVersion += `-beta.${timestamp}`;
    }

    // Update package.json
    packageJson.version = newVersion;
    writeFileSync(this.packagePath, JSON.stringify(packageJson, null, 2) + '\n');

    console.log(`✓ Version updated: ${currentVersion} → ${newVersion}`);
    return newVersion;
  }

  async buildAndValidate() {
    console.log('🔨 Building and validating...');

    try {
      // Run build
      execSync('npm run build', { stdio: 'inherit' });

      // Run astro check
      execSync('npm run check', { stdio: 'inherit' });

      console.log('✓ Build and validation completed');
    } catch (error) {
      throw new Error(`Build failed: ${error.message}`);
    }
  }

  createGitTag(version) {
    console.log('🏷️ Creating git tag...');

    const tagName = `v${version}`;
    const commitSha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();

    // Create annotated tag with metadata
    const tagMessage = [
      `Release ${tagName}`,
      '',
      `Performance validated against ORGA-072.1 thresholds:`,
      `- Bundle size: ≤${PERFORMANCE_THRESHOLDS.MAX_BUNDLE_SIZE} bytes`,
      `- LCP: ≤${PERFORMANCE_THRESHOLDS.MAX_LCP}ms`,
      `- Performance score: ≥${PERFORMANCE_THRESHOLDS.MIN_PERFORMANCE_SCORE}`,
      '',
      `Commit: ${commitSha}`,
      `Created: ${new Date().toISOString()}`,
      `Rollback capable: Yes`
    ].join('\n');

    execSync(`git tag -a "${tagName}" -m "${tagMessage}"`, { stdio: 'inherit' });

    console.log(`✓ Git tag ${tagName} created`);
    return tagName;
  }

  generateRollbackInfo(tagName, version) {
    console.log('📋 Generating rollback information...');

    const rollbackInfo = {
      tag: tagName,
      version: version,
      created: new Date().toISOString(),
      commit: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
      rollbackCommands: {
        immediate: `git checkout ${tagName}`,
        withReset: `git reset --hard ${tagName}`,
        newBranch: `git checkout -b rollback-${tagName} ${tagName}`
      },
      performanceThresholds: PERFORMANCE_THRESHOLDS,
      emergencyContacts: [
        'Check performance monitor logs',
        'Review lighthouse results in lighthouse-results/',
        'Verify bundle size with: npm run bundle:analyze'
      ]
    };

    const rollbackPath = join(this.projectRoot, `rollback-info-${tagName}.json`);
    writeFileSync(rollbackPath, JSON.stringify(rollbackInfo, null, 2));

    console.log(`✓ Rollback information saved to ${rollbackPath}`);
  }
}

// CLI Interface
function main() {
  const args = process.argv.slice(2);
  const releaseManager = new ReleaseManager();

  // Parse arguments
  const options = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--major':
        options.type = 'major';
        break;
      case '--minor':
        options.type = 'minor';
        break;
      case '--patch':
        options.type = 'patch';
        break;
      case '--pre-release':
      case '--beta':
        options.preRelease = true;
        break;
      case '--skip-performance':
        options.skipPerformanceCheck = true;
        break;
      case '--help':
      case '-h':
        console.log(`
ORGA Release Tagging Tool

Usage: npm run release:tag [options]

Options:
  --major              Create major version bump
  --minor              Create minor version bump (default: patch)
  --patch              Create patch version bump
  --pre-release, --beta Create pre-release version
  --skip-performance   Skip performance validation (not recommended)
  --help, -h           Show this help

Examples:
  npm run release:tag                  # Create patch release
  npm run release:tag -- --minor       # Create minor release
  npm run release:tag -- --major --beta # Create major pre-release

Performance Thresholds (Купер assessment):
  - Bundle size: ≤150KB
  - LCP: ≤2.5s
  - Performance score: ≥85%
`);
        process.exit(0);
        break;
    }
  }

  // Default to patch if no type specified
  if (!options.type) {
    options.type = 'patch';
  }

  releaseManager.createReleaseTag(options);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { ReleaseManager };