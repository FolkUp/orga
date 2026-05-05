/**
 * Investigation Template Validation System
 * Enhanced Alice v2.0 Level 3 - Quality Framework
 * Validates investigation compliance with Premium/Standard tier requirements
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export class TemplateValidator {
  constructor() {
    this.premiumRequirements = {
      frontmatter: [
        'title', 'date', 'investigation_type', 'status', 'confidence',
        'evidence_count', 'timeline_span', 'description', 'sources',
        'pii_reviewed', 'pii_reviewed_by', 'legal_risk', 'tier'
      ],
      sections: [
        'Abstract', 'Methodological Note', 'Preliminary Conclusions'
      ],
      qualityGates: 5,
      minWordCount: 2000,
      minSources: 3,
      requiredSourceTypes: ['primary', 'secondary']
    };

    this.standardRequirements = {
      frontmatter: [
        'title', 'date', 'investigation_type', 'status', 'confidence',
        'evidence_count', 'description', 'sources', 'pii_reviewed', 'legal_risk', 'tier'
      ],
      sections: [
        'Abstract', 'Conclusions'
      ],
      qualityGates: 3,
      minWordCount: 1000,
      minSources: 2,
      requiredSourceTypes: ['primary']
    };
  }

  async validateInvestigation(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const { frontmatter, body } = this.parseFrontmatter(content);

      const tier = frontmatter.tier || 'standard';
      const requirements = tier === 'premium' ? this.premiumRequirements : this.standardRequirements;

      const validation = {
        filePath,
        tier,
        passed: true,
        errors: [],
        warnings: [],
        qualityGates: {
          passed: 0,
          total: requirements.qualityGates
        }
      };

      // Validate frontmatter completeness
      const frontmatterValidation = this.validateFrontmatter(frontmatter, requirements);
      validation.errors.push(...frontmatterValidation.errors);
      validation.warnings.push(...frontmatterValidation.warnings);
      if (frontmatterValidation.passed) validation.qualityGates.passed++;

      // Validate content structure
      const structureValidation = this.validateStructure(body, requirements);
      validation.errors.push(...structureValidation.errors);
      validation.warnings.push(...structureValidation.warnings);
      if (structureValidation.passed) validation.qualityGates.passed++;

      // Validate sources
      const sourcesValidation = this.validateSources(frontmatter.sources || [], requirements);
      validation.errors.push(...sourcesValidation.errors);
      validation.warnings.push(...sourcesValidation.warnings);
      if (sourcesValidation.passed) validation.qualityGates.passed++;

      // Validate PII compliance (mandatory for all tiers)
      const piiValidation = this.validatePII(frontmatter);
      validation.errors.push(...piiValidation.errors);
      validation.warnings.push(...piiValidation.warnings);
      if (piiValidation.passed) validation.qualityGates.passed++;

      // Premium tier: Validate methodology section
      if (tier === 'premium') {
        const methodologyValidation = this.validateMethodology(body);
        validation.errors.push(...methodologyValidation.errors);
        validation.warnings.push(...methodologyValidation.warnings);
        if (methodologyValidation.passed) validation.qualityGates.passed++;
      }

      // Word count validation
      const wordCount = this.countWords(body);
      if (wordCount < requirements.minWordCount) {
        validation.warnings.push(`Word count ${wordCount} below recommended minimum ${requirements.minWordCount}`);
      }

      validation.passed = validation.errors.length === 0;
      validation.wordCount = wordCount;

      return validation;

    } catch (error) {
      return {
        filePath,
        passed: false,
        errors: [`File validation failed: ${error.message}`],
        warnings: [],
        qualityGates: { passed: 0, total: 0 }
      };
    }
  }

  validateFrontmatter(frontmatter, requirements) {
    const validation = { passed: true, errors: [], warnings: [] };

    // Check required fields
    for (const field of requirements.frontmatter) {
      if (!frontmatter[field]) {
        validation.errors.push(`Missing required frontmatter field: ${field}`);
        validation.passed = false;
      }
    }

    // Validate specific field formats
    if (frontmatter.confidence && !['low', 'medium', 'high'].includes(frontmatter.confidence)) {
      validation.errors.push('Confidence must be: low, medium, or high');
      validation.passed = false;
    }

    if (frontmatter.status && !['draft', 'in_progress', 'partially_verified', 'verified', 'needs_revision'].includes(frontmatter.status)) {
      validation.errors.push('Invalid status value');
      validation.passed = false;
    }

    if (frontmatter.legal_risk && !['low', 'medium', 'high'].includes(frontmatter.legal_risk)) {
      validation.errors.push('Legal risk must be: low, medium, or high');
      validation.passed = false;
    }

    return validation;
  }

  validateStructure(body, requirements) {
    const validation = { passed: true, errors: [], warnings: [] };

    for (const section of requirements.sections) {
      if (!body.includes(`## ${section}`)) {
        validation.errors.push(`Missing required section: ${section}`);
        validation.passed = false;
      }
    }

    return validation;
  }

  validateSources(sources, requirements) {
    const validation = { passed: true, errors: [], warnings: [] };

    if (sources.length < requirements.minSources) {
      validation.errors.push(`Minimum ${requirements.minSources} sources required, found ${sources.length}`);
      validation.passed = false;
    }

    const sourceTypes = sources.map(s => s.type);
    for (const requiredType of requirements.requiredSourceTypes) {
      if (!sourceTypes.includes(requiredType)) {
        validation.errors.push(`Missing required source type: ${requiredType}`);
        validation.passed = false;
      }
    }

    // Validate source completeness
    sources.forEach((source, index) => {
      if (!source.title) validation.errors.push(`Source ${index + 1}: Missing title`);
      if (!source.date) validation.errors.push(`Source ${index + 1}: Missing date`);
      if (!source.type) validation.errors.push(`Source ${index + 1}: Missing type`);
    });

    return validation;
  }

  validatePII(frontmatter) {
    const validation = { passed: true, errors: [], warnings: [] };

    if (frontmatter.pii_reviewed !== true) {
      validation.errors.push('PII review must be completed (pii_reviewed: true)');
      validation.passed = false;
    }

    if (frontmatter.tier === 'premium') {
      if (!frontmatter.pii_reviewed_by) {
        validation.errors.push('Premium tier requires pii_reviewed_by field');
        validation.passed = false;
      }
      if (!frontmatter.pii_review_date) {
        validation.errors.push('Premium tier requires pii_review_date field');
        validation.passed = false;
      }
    }

    return validation;
  }

  validateMethodology(body) {
    const validation = { passed: true, errors: [], warnings: [] };

    if (!body.includes('## Methodological Note')) {
      validation.errors.push('Premium tier requires Methodological Note section');
      validation.passed = false;
    }

    if (!body.includes('Underground Academia')) {
      validation.warnings.push('Consider referencing Underground Academia methodology');
    }

    return validation;
  }

  parseFrontmatter(content) {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontmatterMatch) {
      throw new Error('No valid frontmatter found');
    }

    const frontmatter = yaml.load(frontmatterMatch[1]);
    const body = frontmatterMatch[2];

    return { frontmatter, body };
  }

  countWords(text) {
    return text.trim().split(/\s+/).length;
  }

  async validateDirectory(directory) {
    const results = [];
    const files = fs.readdirSync(directory, { recursive: true });

    for (const file of files) {
      if (path.extname(file) === '.md') {
        const filePath = path.join(directory, file);
        const validation = await this.validateInvestigation(filePath);
        results.push(validation);
      }
    }

    return results;
  }

  generateReport(validations) {
    const report = {
      timestamp: new Date().toISOString(),
      total: validations.length,
      passed: validations.filter(v => v.passed).length,
      failed: validations.filter(v => !v.passed).length,
      byTier: {
        premium: validations.filter(v => v.tier === 'premium').length,
        standard: validations.filter(v => v.tier === 'standard').length
      },
      validations
    };

    return report;
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new TemplateValidator();
  const targetPath = process.argv[2] || './src/content/investigations';

  console.log('🔍 Investigation Template Validation - Enhanced Alice v2.0 L3');
  console.log(`Validating: ${targetPath}\n`);

  const validations = await validator.validateDirectory(targetPath);
  const report = validator.generateReport(validations);

  console.log(`📊 Validation Results:`);
  console.log(`Total investigations: ${report.total}`);
  console.log(`✅ Passed: ${report.passed}`);
  console.log(`❌ Failed: ${report.failed}`);
  console.log(`Premium tier: ${report.byTier.premium}`);
  console.log(`Standard tier: ${report.byTier.standard}\n`);

  validations.forEach(validation => {
    const status = validation.passed ? '✅' : '❌';
    const gates = `${validation.qualityGates.passed}/${validation.qualityGates.total}`;
    console.log(`${status} ${validation.tier.toUpperCase()} | ${gates} gates | ${path.basename(validation.filePath)}`);

    if (validation.errors.length > 0) {
      validation.errors.forEach(error => console.log(`  ❌ ${error}`));
    }
    if (validation.warnings.length > 0) {
      validation.warnings.forEach(warning => console.log(`  ⚠️  ${warning}`));
    }
  });
}

export default TemplateValidator;