#!/usr/bin/env node
/**
 * ORGA Editorial Build Integration - Enhanced Alice v2.0
 *
 * Integrates editorial workflow validation into Astro build process.
 * Ensures all content meets editorial standards before publication.
 *
 * Banking-level quality gates for Phase 3B readiness.
 */

import { runEditorialAutomation, QUALITY_STANDARDS } from './editorial-automation.js';
import { ContentLifecycle, WORKFLOW_STAGES } from './content-lifecycle.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUILD_LOG = path.join(__dirname, '..', 'editorial-build.log');

// Build quality gates configuration
const BUILD_GATES = {
  // Pre-build validation requirements
  PRE_BUILD: {
    MIN_WORKFLOW_COMPLETION: 80, // 80% editorial workflow completion required
    REQUIRED_STAGES: ['development'], // Minimum stage for build inclusion
    BLOCK_ON_PII: true, // Block build if unreviewed PII detected
    BLOCK_ON_PLACEHOLDERS: true, // Block build if placeholder content found
    QUALITY_THRESHOLD: 'fair' // Minimum quality score for inclusion
  },

  // Content filtering rules
  INCLUSION_RULES: {
    DRAFT_CONTENT: false, // Exclude draft content from build
    VERIFIED_CONTENT: true, // Always include verified content
    REVIEW_CONTENT: true, // Include content in review stage
    DEVELOPMENT_CONTENT: false // Exclude development content by default
  },

  // Quality enforcement levels
  ENFORCEMENT_LEVELS: {
    STRICT: 'block_build_on_violations',
    MODERATE: 'warn_on_violations',
    PERMISSIVE: 'log_violations_only'
  }
};

// Logging utility
async function buildLog(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [BUILD-${level}] ${message}\n`;

  try {
    await fs.appendFile(BUILD_LOG, logEntry);
  } catch (error) {
    console.error('Build log write failed:', error.message);
  }

  console.log(logEntry.trim());
}

// Pre-build editorial validation
async function validatePreBuild() {
  await buildLog('Starting pre-build editorial validation');

  try {
    // Run full editorial automation analysis
    const editorialReport = await runEditorialAutomation();

    if (!editorialReport) {
      throw new Error('Editorial automation failed to generate report');
    }

    // Analyze build readiness
    const buildReadiness = analyzeBuildReadiness(editorialReport);

    return buildReadiness;

  } catch (error) {
    await buildLog(`Pre-build validation failed: ${error.message}`, 'ERROR');
    throw error;
  }
}

// Analyze editorial report for build readiness
function analyzeBuildReadiness(report) {
  const readiness = {
    canProceed: true,
    blockers: [],
    warnings: [],
    contentFiltered: [],
    qualitySummary: {
      totalFiles: report.summary.totalFiles,
      readyForBuild: 0,
      needsWork: 0,
      excluded: 0
    }
  };

  // Analyze each content file
  report.results.forEach(result => {
    const analysis = analyzeFileReadiness(result, report.detailedResults);

    if (analysis.status === 'blocked') {
      readiness.blockers.push(analysis);
      readiness.qualitySummary.needsWork++;
    } else if (analysis.status === 'warning') {
      readiness.warnings.push(analysis);
      readiness.qualitySummary.readyForBuild++;
    } else if (analysis.status === 'excluded') {
      readiness.contentFiltered.push(analysis);
      readiness.qualitySummary.excluded++;
    } else {
      readiness.qualitySummary.readyForBuild++;
    }
  });

  // Determine if build can proceed
  if (readiness.blockers.length > 0) {
    readiness.canProceed = false;
  }

  return readiness;
}

// Analyze individual file readiness
function analyzeFileReadiness(result, detailedResults) {
  const detailed = detailedResults.find(d => d.file === result.file);

  if (!detailed) {
    return {
      file: result.file,
      status: 'blocked',
      reason: 'No detailed analysis available'
    };
  }

  const { metadata, analysis, workflow } = detailed;

  // Check for blocking issues
  if (analysis?.issues?.length > 0) {
    // Check for PII violations
    const hasPIIViolation = analysis.piiCount > 0 && !metadata?.pii_reviewed;
    if (BUILD_GATES.PRE_BUILD.BLOCK_ON_PII && hasPIIViolation) {
      return {
        file: result.file,
        status: 'blocked',
        reason: `Unreviewed PII detected (${analysis.piiCount} instances)`
      };
    }

    // Check for placeholder content
    if (BUILD_GATES.PRE_BUILD.BLOCK_ON_PLACEHOLDERS && analysis.placeholderCount > 0) {
      return {
        file: result.file,
        status: 'blocked',
        reason: `Placeholder content found (${analysis.placeholderCount} instances)`
      };
    }

    // Check quality threshold
    const qualityOrder = ['excellent', 'good', 'fair', 'poor'];
    const currentQuality = qualityOrder.indexOf(analysis.qualityScore);
    const thresholdQuality = qualityOrder.indexOf(BUILD_GATES.PRE_BUILD.QUALITY_THRESHOLD);

    if (currentQuality > thresholdQuality) {
      return {
        file: result.file,
        status: 'blocked',
        reason: `Quality below threshold: ${analysis.qualityScore} < ${BUILD_GATES.PRE_BUILD.QUALITY_THRESHOLD}`
      };
    }
  }

  // Check workflow completion
  const workflowCompletion = workflow?.completionPercentage || 0;
  if (workflowCompletion < BUILD_GATES.PRE_BUILD.MIN_WORKFLOW_COMPLETION) {
    return {
      file: result.file,
      status: 'blocked',
      reason: `Workflow incomplete: ${workflowCompletion}% < ${BUILD_GATES.PRE_BUILD.MIN_WORKFLOW_COMPLETION}%`
    };
  }

  // Check content stage inclusion rules
  const contentStatus = metadata?.status || 'unknown';

  if (contentStatus === 'draft' && !BUILD_GATES.INCLUSION_RULES.DRAFT_CONTENT) {
    return {
      file: result.file,
      status: 'excluded',
      reason: 'Draft content excluded from build'
    };
  }

  if (contentStatus === 'development' && !BUILD_GATES.INCLUSION_RULES.DEVELOPMENT_CONTENT) {
    return {
      file: result.file,
      status: 'excluded',
      reason: 'Development content excluded from build'
    };
  }

  // File passed all checks
  return {
    file: result.file,
    status: 'ready',
    reason: 'All quality gates passed'
  };
}

// Generate build exclusion list
async function generateBuildExclusions(readiness) {
  const exclusions = [
    ...readiness.blockers.map(b => b.file),
    ...readiness.contentFiltered.map(c => c.file)
  ];

  if (exclusions.length > 0) {
    const exclusionList = exclusions.map(file => path.relative(
      path.join(__dirname, '..', 'src'),
      file
    )).join('\n');

    const exclusionPath = path.join(__dirname, '..', '.editorial-exclusions');
    await fs.writeFile(exclusionPath, exclusionList);

    await buildLog(`Generated build exclusions: ${exclusions.length} files`);
  }

  return exclusions;
}

// Generate build quality report
async function generateBuildReport(readiness) {
  const reportPath = path.join(__dirname, '..', `build-editorial-report-${new Date().toISOString().slice(0, 10)}.md`);

  const report = `# Editorial Build Quality Report
**Date:** ${new Date().toISOString()}
**Build Status:** ${readiness.canProceed ? 'READY' : 'BLOCKED'}

## Summary
- **Total Files:** ${readiness.qualitySummary.totalFiles}
- **Ready for Build:** ${readiness.qualitySummary.readyForBuild}
- **Needs Work:** ${readiness.qualitySummary.needsWork}
- **Excluded:** ${readiness.qualitySummary.excluded}

## Blocking Issues (${readiness.blockers.length})
${readiness.blockers.map(b => `- **${path.basename(b.file)}**: ${b.reason}`).join('\n')}

## Warnings (${readiness.warnings.length})
${readiness.warnings.map(w => `- **${path.basename(w.file)}**: ${w.reason}`).join('\n')}

## Content Exclusions (${readiness.contentFiltered.length})
${readiness.contentFiltered.map(c => `- **${path.basename(c.file)}**: ${c.reason}`).join('\n')}

---
*Generated by ORGA Editorial Build Integration - Enhanced Alice v2.0*
`;

  await fs.writeFile(reportPath, report);
  await buildLog(`Build quality report generated: ${reportPath}`);

  return reportPath;
}

// Main build integration function
export async function validateBuild(options = {}) {
  const enforcement = options.enforcement || 'STRICT';

  try {
    await buildLog('=== ORGA Editorial Build Integration Started ===');
    await buildLog(`Enforcement Level: ${enforcement}`);

    // Run pre-build validation
    const readiness = await validatePreBuild();

    // Generate exclusions and reports
    await generateBuildExclusions(readiness);
    const reportPath = await generateBuildReport(readiness);

    // Apply enforcement policy
    if (enforcement === 'STRICT' && !readiness.canProceed) {
      await buildLog('BUILD BLOCKED: Editorial quality gates failed', 'ERROR');
      throw new Error(`Editorial validation failed. See report: ${reportPath}`);
    } else if (enforcement === 'MODERATE' && readiness.blockers.length > 0) {
      await buildLog(`BUILD WARNING: ${readiness.blockers.length} quality issues detected`, 'WARN');
      console.warn(`⚠️  Editorial issues detected. See report: ${reportPath}`);
    } else {
      await buildLog('BUILD READY: Editorial validation passed', 'SUCCESS');
    }

    await buildLog('=== ORGA Editorial Build Integration Completed ===');

    return {
      success: enforcement === 'STRICT' ? readiness.canProceed : true,
      readiness,
      reportPath,
      exclusions: readiness.blockers.length + readiness.contentFiltered.length
    };

  } catch (error) {
    await buildLog(`Build integration failed: ${error.message}`, 'ERROR');
    throw error;
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const enforcement = process.argv[2] || 'STRICT';

  validateBuild({ enforcement })
    .then(result => {
      console.log('\n=== EDITORIAL BUILD VALIDATION COMPLETE ===');
      console.log(`Status: ${result.success ? 'PASSED' : 'FAILED'}`);
      console.log(`Files excluded: ${result.exclusions}`);
      console.log(`Report: ${result.reportPath}`);
    })
    .catch(error => {
      console.error('\nEditorial build validation failed:', error.message);
      process.exit(1);
    });
}