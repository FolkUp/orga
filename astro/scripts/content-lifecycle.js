#!/usr/bin/env node
/**
 * Content Lifecycle Management - ORGA Editorial Workflow
 *
 * Automates content transitions through editorial workflow stages:
 * draft → development → review → verified → published
 *
 * Enhanced Alice v2.0 Level 3 automation with banking-level standards
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '..', 'src', 'content');

// Workflow stages configuration
const WORKFLOW_STAGES = {
  draft: {
    next: 'development',
    requirements: ['title', 'date', 'investigation_type'],
    validations: ['basic_metadata']
  },
  development: {
    next: 'review',
    requirements: ['title', 'date', 'investigation_type', 'status', 'confidence', 'sources'],
    validations: ['content_quality', 'source_validation', 'placeholder_check']
  },
  review: {
    next: 'verified',
    requirements: ['reviewed_by', 'review_date', 'fact_verified', 'legal_reviewed', 'editorial_reviewed'],
    validations: ['editorial_workflow', 'legal_compliance', 'quality_standards']
  },
  verified: {
    next: 'published',
    requirements: ['all_reviews_complete'],
    validations: ['publication_readiness', 'banking_level_standards']
  },
  published: {
    next: null,
    requirements: ['publication_metadata'],
    validations: ['post_publication_monitoring']
  }
};

// Stage transition validations
class ContentValidator {
  constructor(content, metadata) {
    this.content = content;
    this.metadata = metadata;
  }

  // Basic metadata validation
  validateBasicMetadata() {
    const required = ['title', 'date', 'investigation_type'];
    const missing = required.filter(field => !this.metadata[field]);

    return {
      valid: missing.length === 0,
      issues: missing.map(field => `Missing required field: ${field}`),
      warnings: []
    };
  }

  // Content quality validation
  validateContentQuality() {
    const issues = [];
    const warnings = [];

    // Word count check
    const wordCount = this.content ? this.content.trim().split(/\s+/).length : 0;
    if (wordCount < 150) {
      issues.push(`Insufficient word count: ${wordCount} (minimum: 150)`);
    }

    // Placeholder detection
    const placeholderPatterns = [
      /\[.*\]/g, /\{.*\}/g, /TODO|FIXME|XXX/gi,
      /\[Имя \d+\]|\[Медиа\]|\[Анализ\]/g
    ];

    let placeholderCount = 0;
    for (const pattern of placeholderPatterns) {
      const matches = this.content ? this.content.match(pattern) : [];
      if (matches) placeholderCount += matches.length;
    }

    if (placeholderCount > 0) {
      issues.push(`Placeholder content detected: ${placeholderCount} instances`);
    }

    return { valid: issues.length === 0, issues, warnings };
  }

  // Source validation
  validateSourceValidation() {
    const issues = [];
    const warnings = [];
    const sources = this.metadata?.sources || [];

    // Minimum source count
    if (sources.length < 2) {
      issues.push(`Insufficient sources: ${sources.length} (minimum: 2)`);
    }

    // Source URL validation
    const invalidUrls = sources.filter(source =>
      source.url && (
        source.url.includes('example.com') ||
        source.url.includes('placeholder.url') ||
        source.url.includes('tbd.source')
      )
    );

    if (invalidUrls.length > 0) {
      issues.push(`Invalid placeholder URLs found: ${invalidUrls.length}`);
    }

    // High confidence content requires more sources
    if (this.metadata?.confidence === 'high' && sources.length < 3) {
      warnings.push('High confidence content should have 3+ sources');
    }

    return { valid: issues.length === 0, issues, warnings };
  }

  // Editorial workflow validation
  validateEditorialWorkflow() {
    const issues = [];
    const warnings = [];

    // Required review fields
    const requiredReviews = ['fact_verified', 'legal_reviewed', 'editorial_reviewed'];
    const missingReviews = requiredReviews.filter(field => !this.metadata[field]);

    if (missingReviews.length > 0) {
      issues.push(`Missing required reviews: ${missingReviews.join(', ')}`);
    }

    // Reviewer information
    if (this.metadata?.fact_verified && !this.metadata?.fact_verified_by) {
      warnings.push('Fact verification lacks reviewer identification');
    }

    if (this.metadata?.legal_reviewed && !this.metadata?.legal_reviewed_by) {
      warnings.push('Legal review lacks reviewer identification');
    }

    return { valid: issues.length === 0, issues, warnings };
  }

  // Legal compliance validation
  validateLegalCompliance() {
    const issues = [];
    const warnings = [];

    // PII review requirements
    const piiPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/,           // SSN
      /\b[\w\.-]+@[\w\.-]+\.\w+\b/,     // Email
      /\b\d{10,15}\b/,                  // Phone numbers
    ];

    let piiCount = 0;
    for (const pattern of piiPatterns) {
      const matches = this.content ? this.content.match(pattern) : [];
      if (matches) piiCount += matches.length;
    }

    if (piiCount > 0 && !this.metadata?.pii_reviewed) {
      issues.push(`Potential PII detected (${piiCount} instances) - requires PII review`);
    }

    // High legal risk requirements
    if (this.metadata?.legal_risk === 'high') {
      if (!this.metadata?.legal_reviewed) {
        issues.push('High legal risk content requires legal review');
      }
      if (!this.metadata?.hostile_verified) {
        warnings.push('High legal risk content should have hostile verification');
      }
    }

    // Naming justification for biographical content
    if (this.metadata?.investigation_type === 'biographical' && !this.metadata?.naming_justified) {
      warnings.push('Biographical content should have naming justification');
    }

    return { valid: issues.length === 0, issues, warnings };
  }

  // Publication readiness validation
  validatePublicationReadiness() {
    const issues = [];
    const warnings = [];

    // All workflow stages must be complete
    const workflowFields = [
      'fact_verified', 'legal_reviewed', 'editorial_reviewed',
      'reviewed_by', 'review_date'
    ];

    const incompleteFields = workflowFields.filter(field => !this.metadata[field]);
    if (incompleteFields.length > 0) {
      issues.push(`Incomplete workflow fields: ${incompleteFields.join(', ')}`);
    }

    // Status must be appropriate for publication
    if (this.metadata?.draft === true) {
      issues.push('Content still marked as draft');
    }

    if (this.metadata?.status !== 'verified') {
      issues.push(`Invalid status for publication: ${this.metadata?.status} (expected: verified)`);
    }

    // SEO readiness
    if (!this.metadata?.description) {
      warnings.push('Missing SEO description');
    }

    return { valid: issues.length === 0, issues, warnings };
  }

  // Banking-level standards validation
  validateBankingLevelStandards() {
    const issues = [];
    const warnings = [];

    // High-stakes content requirements
    const highStakesTypes = ['institutional', 'biographical'];
    if (highStakesTypes.includes(this.metadata?.investigation_type)) {

      // Hostile verification required
      if (!this.metadata?.hostile_verified) {
        issues.push('High-stakes content requires hostile verification');
      }

      // Multiple editorial reviewers
      const editorialReviewers = this.metadata?.editorial_reviewed_by || [];
      if (editorialReviewers.length < 2) {
        warnings.push('High-stakes content should have multiple editorial reviewers');
      }

      // Enhanced source requirements
      const sources = this.metadata?.sources || [];
      if (sources.length < 3) {
        warnings.push('High-stakes content should have 3+ sources');
      }
    }

    // Evidence count validation
    if (this.metadata?.evidence_count && this.metadata.evidence_count < 2) {
      warnings.push('Low evidence count may impact credibility');
    }

    return { valid: issues.length === 0, issues, warnings };
  }

  // Run all validations for a stage
  validateStage(stageName) {
    const stage = WORKFLOW_STAGES[stageName];
    if (!stage) {
      return { valid: false, issues: [`Unknown workflow stage: ${stageName}`], warnings: [] };
    }

    const results = {
      stage: stageName,
      valid: true,
      issues: [],
      warnings: [],
      validations: {}
    };

    // Run each validation for the stage
    for (const validation of stage.validations) {
      let validationResult = { valid: true, issues: [], warnings: [] };

      switch (validation) {
        case 'basic_metadata':
          validationResult = this.validateBasicMetadata();
          break;
        case 'content_quality':
          validationResult = this.validateContentQuality();
          break;
        case 'source_validation':
          validationResult = this.validateSourceValidation();
          break;
        case 'placeholder_check':
          // Already covered in content_quality
          break;
        case 'editorial_workflow':
          validationResult = this.validateEditorialWorkflow();
          break;
        case 'legal_compliance':
          validationResult = this.validateLegalCompliance();
          break;
        case 'quality_standards':
          // Combination of previous validations
          break;
        case 'publication_readiness':
          validationResult = this.validatePublicationReadiness();
          break;
        case 'banking_level_standards':
          validationResult = this.validateBankingLevelStandards();
          break;
      }

      results.validations[validation] = validationResult;
      results.issues.push(...validationResult.issues);
      results.warnings.push(...validationResult.warnings);

      if (!validationResult.valid) {
        results.valid = false;
      }
    }

    return results;
  }
}

// Content file operations
async function parseContentFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

    if (!frontmatterMatch) {
      return { metadata: {}, content, frontmatter: '', error: 'No frontmatter found' };
    }

    // Simple YAML parsing
    const frontmatterText = frontmatterMatch[1];
    const metadata = {};

    for (const line of frontmatterText.split('\n')) {
      const match = line.match(/^([^:]+):\s*(.*)$/);
      if (match) {
        const [, key, value] = match;
        const cleanKey = key.trim();
        const cleanValue = value.trim().replace(/^["'](.*)["']$/, '$1');

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
    return { metadata: {}, content: '', frontmatter: '', error: error.message };
  }
}

// Update content file with new metadata
async function updateContentFile(filePath, metadata, content) {
  // Reconstruct frontmatter
  const frontmatterLines = ['---'];

  for (const [key, value] of Object.entries(metadata)) {
    if (Array.isArray(value)) {
      const arrayValue = value.map(v => typeof v === 'string' ? `"${v}"` : v).join(', ');
      frontmatterLines.push(`${key}: [${arrayValue}]`);
    } else if (typeof value === 'string') {
      frontmatterLines.push(`${key}: "${value}"`);
    } else {
      frontmatterLines.push(`${key}: ${value}`);
    }
  }

  frontmatterLines.push('---', '');

  const newContent = frontmatterLines.join('\n') + content;
  await fs.writeFile(filePath, newContent, 'utf-8');
}

// Stage transition operations
async function transitionContentStage(filePath, targetStage) {
  console.log(`\n=== Transitioning ${path.basename(filePath)} to ${targetStage} ===`);

  const { metadata, content, error } = await parseContentFile(filePath);
  if (error) {
    console.error(`Error reading file: ${error}`);
    return { success: false, error };
  }

  // Determine current stage
  const currentStage = metadata.workflow_stage || 'draft';
  console.log(`Current stage: ${currentStage}`);

  // Validate current stage for transition
  const validator = new ContentValidator(content, metadata);
  const stageValidation = validator.validateStage(currentStage);

  console.log(`\nValidation for ${currentStage} stage:`);
  console.log(`Valid: ${stageValidation.valid}`);

  if (stageValidation.issues.length > 0) {
    console.log('Issues:');
    stageValidation.issues.forEach(issue => console.log(`  - ${issue}`));
  }

  if (stageValidation.warnings.length > 0) {
    console.log('Warnings:');
    stageValidation.warnings.forEach(warning => console.log(`  - ${warning}`));
  }

  // Check if transition is allowed
  const expectedNext = WORKFLOW_STAGES[currentStage]?.next;
  if (targetStage !== expectedNext && targetStage !== currentStage) {
    console.log(`\nInvalid transition: ${currentStage} → ${targetStage}`);
    console.log(`Expected next stage: ${expectedNext}`);
    return { success: false, error: 'Invalid stage transition' };
  }

  // If validation passes or force flag is used, update stage
  if (stageValidation.valid || process.argv.includes('--force')) {
    const updatedMetadata = {
      ...metadata,
      workflow_stage: targetStage,
      workflow_updated: new Date().toISOString().split('T')[0],
      workflow_progress: getStageProgress(targetStage)
    };

    await updateContentFile(filePath, updatedMetadata, content);
    console.log(`\n✅ Successfully transitioned to ${targetStage}`);
    console.log(`Progress: ${updatedMetadata.workflow_progress}%`);

    return { success: true, stage: targetStage, progress: updatedMetadata.workflow_progress };
  } else {
    console.log(`\n❌ Cannot transition to ${targetStage} - validation failed`);
    console.log('Use --force to override validation');
    return { success: false, error: 'Validation failed', issues: stageValidation.issues };
  }
}

// Calculate workflow progress percentage
function getStageProgress(stage) {
  const stages = Object.keys(WORKFLOW_STAGES);
  const stageIndex = stages.indexOf(stage);
  return Math.round((stageIndex / (stages.length - 1)) * 100);
}

// Generate lifecycle report
async function generateLifecycleReport() {
  console.log('\n=== ORGA Content Lifecycle Report ===');

  const contentFiles = await glob(path.join(CONTENT_DIR, '**', '*.md').replace(/\\/g, '/'));
  const stageDistribution = {};
  const issues = [];

  for (const filePath of contentFiles) {
    const { metadata, content } = await parseContentFile(filePath);
    const stage = metadata.workflow_stage || 'draft';

    stageDistribution[stage] = (stageDistribution[stage] || 0) + 1;

    // Check for stuck content
    const validator = new ContentValidator(content, metadata);
    const validation = validator.validateStage(stage);

    if (!validation.valid) {
      issues.push({
        file: path.basename(filePath),
        stage,
        issues: validation.issues
      });
    }
  }

  console.log('\nStage Distribution:');
  for (const [stage, count] of Object.entries(stageDistribution)) {
    console.log(`  ${stage}: ${count} files`);
  }

  console.log(`\nTotal files: ${contentFiles.length}`);
  console.log(`Files with issues: ${issues.length}`);

  if (issues.length > 0) {
    console.log('\nFiles requiring attention:');
    issues.forEach(issue => {
      console.log(`\n  ${issue.file} (${issue.stage}):`);
      issue.issues.forEach(i => console.log(`    - ${i}`));
    });
  }

  return { stageDistribution, totalFiles: contentFiles.length, issues };
}

// Main CLI interface
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.length === 0) {
    console.log(`
ORGA Content Lifecycle Management

Usage:
  node content-lifecycle.js --report                    Generate lifecycle report
  node content-lifecycle.js --file <path> --stage <stage>  Transition file to stage
  node content-lifecycle.js --validate <path>          Validate file's current stage
  node content-lifecycle.js --help                     Show this help

Workflow stages:
  draft → development → review → verified → published

Flags:
  --force     Force stage transition despite validation failures
`);
    return;
  }

  if (args.includes('--report')) {
    await generateLifecycleReport();
    return;
  }

  if (args.includes('--validate') && args.length >= 2) {
    const fileIndex = args.indexOf('--validate') + 1;
    const filePath = args[fileIndex];

    const { metadata, content } = await parseContentFile(filePath);
    const stage = metadata.workflow_stage || 'draft';
    const validator = new ContentValidator(content, metadata);
    const validation = validator.validateStage(stage);

    console.log(`\nValidation for ${path.basename(filePath)} (${stage}):`);
    console.log(`Valid: ${validation.valid}`);

    if (validation.issues.length > 0) {
      console.log('Issues:', validation.issues);
    }

    if (validation.warnings.length > 0) {
      console.log('Warnings:', validation.warnings);
    }

    return;
  }

  if (args.includes('--file') && args.includes('--stage')) {
    const fileIndex = args.indexOf('--file') + 1;
    const stageIndex = args.indexOf('--stage') + 1;

    if (fileIndex < args.length && stageIndex < args.length) {
      const filePath = args[fileIndex];
      const targetStage = args[stageIndex];

      await transitionContentStage(filePath, targetStage);
    } else {
      console.error('Missing file path or stage argument');
    }
    return;
  }

  console.error('Invalid arguments. Use --help for usage information.');
}

// Export for module use
export { ContentValidator, transitionContentStage, generateLifecycleReport, WORKFLOW_STAGES };

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}