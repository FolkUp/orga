#!/usr/bin/env node
/**
 * ORGA Editorial Workflow Automation - Enhanced Alice v2.0
 *
 * Implements automated content quality checks, editorial workflow validation,
 * and content lifecycle management for Phase 3B readiness.
 *
 * Banking-level quality standards with constitutional compliance.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '..', 'src', 'content');
const LOG_FILE = path.join(__dirname, '..', 'editorial-automation.log');

// Editorial quality standards
const QUALITY_STANDARDS = {
  MIN_WORD_COUNT: 150,
  MIN_SOURCES: 2,
  REQUIRED_METADATA: ['title', 'date', 'investigation_type', 'status', 'confidence'],
  REQUIRED_REVIEW_FIELDS: ['reviewed_by', 'review_date'],
  HIGH_CONFIDENCE_MIN_SOURCES: 3,
  CRITICAL_LEGAL_RISK_REVIEWERS: ['Legal Team', 'Cooper Security']
};

// Content validation rules
const VALIDATION_RULES = {
  // PII Detection patterns
  PII_PATTERNS: [
    /\b\d{3}-\d{2}-\d{4}\b/,           // SSN pattern
    /\b[\w\.-]+@[\w\.-]+\.\w+\b/,     // Email pattern
    /\b\d{10,15}\b/,                  // Phone number pattern
    /\b(?:CREDIT|CARD|CC).*\d{4,}\b/i // Credit card references
  ],

  // Content quality patterns
  PLACEHOLDER_PATTERNS: [
    /\[.*\]/g,                        // Placeholder brackets
    /\{.*\}/g,                        // Template variables
    /TODO|FIXME|XXX/gi,              // Development markers
    /lorem ipsum/gi,                  // Lorem ipsum text
    /\[Имя \d+\]|\[Медиа\]|\[Анализ\]/g // Russian placeholders from session
  ],

  // Source validation
  INVALID_SOURCES: [
    'example.com',
    'placeholder.url',
    'tbd.source'
  ]
};

// Logging utility
async function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level}] ${message}\n`;

  try {
    await fs.appendFile(LOG_FILE, logEntry);
  } catch (error) {
    console.error('Failed to write log:', error.message);
  }

  console.log(logEntry.trim());
}

// Content file discovery
async function discoverContentFiles() {
  const patterns = [
    path.join(CONTENT_DIR, 'investigations', '**', '*.md'),
    path.join(CONTENT_DIR, 'longform', '**', '*.md')
  ];

  const files = [];
  for (const pattern of patterns) {
    const matches = await glob(pattern.replace(/\\/g, '/'));
    files.push(...matches);
  }

  await log(`Discovered ${files.length} content files for analysis`);
  return files;
}

// Parse frontmatter from markdown file
async function parseFrontmatter(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

    if (!frontmatterMatch) {
      return { metadata: null, content: content, error: 'No frontmatter found' };
    }

    // Basic YAML parsing (simplified for key-value pairs)
    const frontmatterText = frontmatterMatch[1];
    const metadata = {};

    for (const line of frontmatterText.split('\n')) {
      const match = line.match(/^([^:]+):\s*(.*)$/);
      if (match) {
        const [, key, value] = match;
        const cleanKey = key.trim();
        const cleanValue = value.trim().replace(/^["'](.*)["']$/, '$1');

        // Handle arrays (basic support)
        if (cleanValue.startsWith('[') && cleanValue.endsWith(']')) {
          metadata[cleanKey] = cleanValue.slice(1, -1).split(',').map(v => v.trim().replace(/^["'](.*)["']$/, '$1'));
        } else if (cleanValue === 'true') {
          metadata[cleanKey] = true;
        } else if (cleanValue === 'false') {
          metadata[cleanKey] = false;
        } else if (!isNaN(cleanValue) && cleanValue !== '') {
          metadata[cleanKey] = Number(cleanValue);
        } else {
          metadata[cleanKey] = cleanValue;
        }
      }
    }

    const bodyContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');

    return { metadata, content: bodyContent, frontmatter: frontmatterText };
  } catch (error) {
    return { metadata: null, content: null, error: error.message };
  }
}

// Content quality analysis
function analyzeContentQuality(content, metadata) {
  const issues = [];
  const warnings = [];
  const recommendations = [];

  // Word count analysis
  const wordCount = content ? content.trim().split(/\s+/).length : 0;
  if (wordCount < QUALITY_STANDARDS.MIN_WORD_COUNT) {
    issues.push(`Word count too low: ${wordCount} (minimum: ${QUALITY_STANDARDS.MIN_WORD_COUNT})`);
  }

  // Placeholder content detection
  let placeholderCount = 0;
  for (const pattern of VALIDATION_RULES.PLACEHOLDER_PATTERNS) {
    const matches = content ? content.match(pattern) : [];
    if (matches) {
      placeholderCount += matches.length;
    }
  }

  if (placeholderCount > 0) {
    issues.push(`Placeholder content detected: ${placeholderCount} instances`);
  }

  // Source validation
  const sources = metadata?.sources || [];
  if (sources.length < QUALITY_STANDARDS.MIN_SOURCES) {
    issues.push(`Insufficient sources: ${sources.length} (minimum: ${QUALITY_STANDARDS.MIN_SOURCES})`);
  }

  // High confidence content requires more sources
  if (metadata?.confidence === 'high' && sources.length < QUALITY_STANDARDS.HIGH_CONFIDENCE_MIN_SOURCES) {
    warnings.push(`High confidence content should have ${QUALITY_STANDARDS.HIGH_CONFIDENCE_MIN_SOURCES}+ sources`);
  }

  // Invalid source detection
  for (const source of sources) {
    if (source.url && VALIDATION_RULES.INVALID_SOURCES.some(invalid => source.url.includes(invalid))) {
      issues.push(`Invalid source URL detected: ${source.url}`);
    }
  }

  // PII detection
  let piiCount = 0;
  for (const pattern of VALIDATION_RULES.PII_PATTERNS) {
    const matches = content ? content.match(pattern) : [];
    if (matches) {
      piiCount += matches.length;
    }
  }

  if (piiCount > 0 && !metadata?.pii_reviewed) {
    issues.push(`Potential PII detected (${piiCount} instances) - requires PII review`);
  }

  // Editorial workflow validation
  const requiredFields = metadata?.status === 'verified' ? QUALITY_STANDARDS.REQUIRED_REVIEW_FIELDS : [];
  for (const field of requiredFields) {
    if (!metadata?.[field]) {
      issues.push(`Missing required field for verified content: ${field}`);
    }
  }

  // Legal risk assessment
  if (metadata?.legal_risk === 'high' && !metadata?.legal_reviewed) {
    issues.push('High legal risk content requires legal review');
  }

  // Quality scoring
  const totalIssues = issues.length;
  let qualityScore = 'excellent';

  if (totalIssues === 0 && warnings.length === 0) {
    qualityScore = 'excellent';
    recommendations.push('Content meets all quality standards');
  } else if (totalIssues === 0 && warnings.length <= 2) {
    qualityScore = 'good';
    recommendations.push('Minor improvements available');
  } else if (totalIssues <= 2) {
    qualityScore = 'fair';
    recommendations.push('Address critical issues before publication');
  } else {
    qualityScore = 'poor';
    recommendations.push('Significant revision required');
  }

  return {
    qualityScore,
    wordCount,
    placeholderCount,
    piiCount,
    sourceCount: sources.length,
    issues,
    warnings,
    recommendations
  };
}

// Editorial workflow status check
function checkEditorialWorkflow(metadata) {
  const workflow = {
    factVerification: {
      status: metadata?.fact_verified ? 'complete' : 'pending',
      reviewer: metadata?.fact_verified_by || null,
      date: metadata?.fact_verified_date || null
    },
    legalReview: {
      status: metadata?.legal_reviewed ? 'complete' : 'pending',
      reviewer: metadata?.legal_reviewed_by || null,
      risk: metadata?.legal_risk || 'unknown'
    },
    editorialReview: {
      status: metadata?.editorial_reviewed ? 'complete' : 'pending',
      reviewers: metadata?.editorial_reviewed_by || []
    },
    hostileVerification: {
      status: metadata?.hostile_verified ? 'complete' : 'pending',
      reviewers: metadata?.hostile_verified_by || []
    },
    piiReview: {
      status: metadata?.pii_reviewed ? 'complete' : 'pending',
      reviewer: metadata?.pii_reviewed_by || null,
      date: metadata?.pii_review_date || null
    }
  };

  // Calculate completion percentage
  const totalSteps = Object.keys(workflow).length;
  const completedSteps = Object.values(workflow).filter(step => step.status === 'complete').length;
  const completionPercentage = Math.round((completedSteps / totalSteps) * 100);

  return { workflow, completionPercentage };
}

// Generate editorial recommendations
function generateEditorialRecommendations(analysis, workflow, metadata) {
  const recommendations = [];

  // Content quality recommendations
  if (analysis.qualityScore === 'poor') {
    recommendations.push({
      priority: 'HIGH',
      category: 'content_quality',
      action: 'Address critical content issues before proceeding with editorial workflow',
      details: analysis.issues
    });
  }

  // Workflow recommendations
  if (workflow.completionPercentage < 50) {
    recommendations.push({
      priority: 'MEDIUM',
      category: 'editorial_workflow',
      action: 'Complete editorial workflow steps',
      details: `${workflow.completionPercentage}% complete - prioritize pending reviews`
    });
  }

  // PII recommendations
  if (analysis.piiCount > 0 && workflow.piiReview.status === 'pending') {
    recommendations.push({
      priority: 'HIGH',
      category: 'privacy_compliance',
      action: 'Complete PII review before publication',
      details: `${analysis.piiCount} potential PII instances detected`
    });
  }

  // Source recommendations
  if (analysis.sourceCount < QUALITY_STANDARDS.MIN_SOURCES) {
    recommendations.push({
      priority: 'MEDIUM',
      category: 'source_validation',
      action: 'Add additional sources to meet quality standards',
      details: `Current: ${analysis.sourceCount}, Required: ${QUALITY_STANDARDS.MIN_SOURCES}`
    });
  }

  return recommendations;
}

// Main content analysis function
async function analyzeContent(filePath) {
  await log(`Analyzing: ${path.basename(filePath)}`);

  const { metadata, content, error } = await parseFrontmatter(filePath);

  if (error) {
    await log(`Error parsing ${filePath}: ${error}`, 'ERROR');
    return {
      file: filePath,
      status: 'error',
      error,
      analysis: null,
      workflow: null,
      recommendations: []
    };
  }

  // Perform analysis
  const analysis = analyzeContentQuality(content, metadata);
  const workflowStatus = checkEditorialWorkflow(metadata);
  const recommendations = generateEditorialRecommendations(analysis, workflowStatus, metadata);

  return {
    file: filePath,
    status: 'analyzed',
    metadata,
    analysis,
    workflow: workflowStatus,
    recommendations
  };
}

// Generate detailed report
async function generateEditorialReport(results) {
  const timestamp = new Date().toISOString();
  const totalFiles = results.length;
  const validFiles = results.filter(r => r.status === 'analyzed').length;
  const errorFiles = results.filter(r => r.status === 'error').length;

  // Quality distribution
  const qualityDistribution = results.reduce((acc, result) => {
    if (result.analysis) {
      acc[result.analysis.qualityScore] = (acc[result.analysis.qualityScore] || 0) + 1;
    }
    return acc;
  }, {});

  // Workflow completion analysis
  const workflowCompletions = results
    .filter(r => r.workflow)
    .map(r => r.workflow.completionPercentage);

  const avgWorkflowCompletion = workflowCompletions.length > 0
    ? Math.round(workflowCompletions.reduce((a, b) => a + b, 0) / workflowCompletions.length)
    : 0;

  // High priority recommendations
  const highPriorityRecs = results.reduce((acc, result) => {
    const highPriority = result.recommendations.filter(rec => rec.priority === 'HIGH');
    return acc + highPriority.length;
  }, 0);

  const report = {
    timestamp,
    summary: {
      totalFiles,
      validFiles,
      errorFiles,
      qualityDistribution,
      avgWorkflowCompletion,
      highPriorityRecommendations: highPriorityRecs
    },
    results: results.map(result => ({
      file: path.basename(result.file),
      status: result.status,
      qualityScore: result.analysis?.qualityScore || 'unknown',
      workflowCompletion: result.workflow?.completionPercentage || 0,
      criticalIssues: result.analysis?.issues?.length || 0,
      recommendations: result.recommendations?.length || 0
    })),
    detailedResults: results
  };

  return report;
}

// Main execution function
async function runEditorialAutomation() {
  try {
    await log('Starting ORGA Editorial Workflow Automation - Enhanced Alice v2.0');
    await log('Banking-level quality standards enforcement active');

    // Discover content files
    const contentFiles = await discoverContentFiles();

    if (contentFiles.length === 0) {
      await log('No content files found for analysis', 'WARNING');
      return;
    }

    // Analyze each file
    const results = [];
    for (const filePath of contentFiles) {
      const result = await analyzeContent(filePath);
      results.push(result);
    }

    // Generate comprehensive report
    const report = await generateEditorialReport(results);

    // Save report
    const reportPath = path.join(__dirname, '..', `editorial-report-${new Date().toISOString().slice(0, 10)}.json`);
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    await log(`Editorial automation complete. Report saved: ${reportPath}`);

    // Summary output
    console.log('\n=== ORGA EDITORIAL AUTOMATION SUMMARY ===');
    console.log(`Files analyzed: ${report.summary.totalFiles}`);
    console.log(`Valid files: ${report.summary.validFiles}`);
    console.log(`Error files: ${report.summary.errorFiles}`);
    console.log(`Average workflow completion: ${report.summary.avgWorkflowCompletion}%`);
    console.log(`High priority recommendations: ${report.summary.highPriorityRecommendations}`);
    console.log('\nQuality Distribution:');
    for (const [quality, count] of Object.entries(report.summary.qualityDistribution)) {
      console.log(`  ${quality}: ${count} files`);
    }

    return report;

  } catch (error) {
    await log(`Editorial automation failed: ${error.message}`, 'ERROR');
    console.error('Editorial automation failed:', error);
    process.exit(1);
  }
}

// Export for module use
export { runEditorialAutomation, analyzeContent, QUALITY_STANDARDS, VALIDATION_RULES };

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runEditorialAutomation();
}