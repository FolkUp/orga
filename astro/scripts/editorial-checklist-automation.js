// Editorial Checklist Automation for Investigation Templates
// ORGA-092 Phase 3A Quality Framework Implementation
// Enhanced Alice v2.0 Level 3 Cartouche Autonome Operation

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import existing automation infrastructure
import TemplateComplianceValidator from '../../agile-sapiens/scripts/template-compliance-validator.js';
import VoiceCalibrationEngine from '../../agile-sapiens/archive/orga-093-full-implementation/voice-calibration-engine.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Editorial Checklist Automation for Investigation Templates
 * Integrates with ORGA-091's 95% automation infrastructure
 * Provides automated checklist compliance, tier management, and quality assurance
 */

class EditorialChecklistAutomation {
    constructor() {
        this.templateValidator = new TemplateComplianceValidator();
        this.voiceCalibrator = new VoiceCalibrationEngine();
        this.checklistTemplates = this.initializeChecklistTemplates();
        this.qualityStandards = this.initializeQualityStandards();
        this.automationRules = this.initializeAutomationRules();
    }

    /**
     * Initialize checklist templates for different tiers
     */
    initializeChecklistTemplates() {
        return {
            premium: {
                required_gates: 5,
                constitutional_framework: true,
                expert_panel_mandatory: true,
                banking_level_standards: true,
                alpha_beta_verification: true,
                voice_threshold: 0.7,
                template_compliance_threshold: 0.9,
                citation_compliance_threshold: 1.0,
                min_sources: 2,
                audit_trail_required: true
            },
            standard: {
                required_gates: 3,
                constitutional_framework: false,
                expert_panel_mandatory: false,
                banking_level_standards: false,
                alpha_beta_verification: false,
                voice_threshold: 0.5,
                template_compliance_threshold: 0.8,
                citation_compliance_threshold: 0.95,
                min_sources: 1,
                audit_trail_required: false
            }
        };
    }

    /**
     * Initialize quality standards for automation
     */
    initializeQualityStandards() {
        return {
            constitutional_triggers: [
                'security', 'vulnerability', 'threat', 'breach',
                'infrastructure', 'p0', 'critical', 'emergency',
                'constitutional', 'banking-level', 'multi-expert'
            ],
            escalation_indicators: [
                'expert conflict', 'disagreement', 'high stakes',
                'p1 priority', 'constitutional compliance',
                'banking level', 'multi-domain'
            ],
            voice_consistency_markers: {
                professional_authority: [
                    'evidence indicates', 'analysis shows', 'findings demonstrate',
                    'research confirms', 'assessment reveals', 'investigation found'
                ],
                strategic_clarity: [
                    'recommendation', 'next steps', 'action items',
                    'strategic priority', 'implementation plan', 'timeline'
                ],
                analytical_rigor: [
                    'validated by', 'confirmed through', 'independently verified',
                    'cross-referenced', 'supported by evidence'
                ]
            }
        };
    }

    /**
     * Initialize automation rules for checklist management
     */
    initializeAutomationRules() {
        return {
            automatic_escalation: {
                enabled: true,
                trigger_detection: 'real-time',
                constitutional_triggers_mandatory: true,
                priority_escalation: ['P0', 'P1'],
                multi_expert_threshold: 2
            },
            quality_gate_automation: {
                enabled: true,
                real_time_validation: true,
                checkpoint_frequency: 'per_section',
                failure_intervention: true
            },
            voice_consistency_automation: {
                enabled: true,
                real_time_suggestions: true,
                tier_specific_thresholds: true,
                mckinsey_hbr_alignment: true
            }
        };
    }

    /**
     * Main automated checklist validation method
     * @param {string} filePath - Path to investigation document
     * @param {string} expectedTier - Expected tier ('premium' or 'standard')
     * @param {Object} options - Automation options
     */
    async validateEditorialChecklist(filePath, expectedTier = null, options = {}) {
        try {
            console.log(`\n=== EDITORIAL CHECKLIST AUTOMATION ===`);
            console.log(`File: ${filePath}`);
            console.log(`Date: ${new Date().toISOString().split('T')[0]}`);

            const content = fs.readFileSync(filePath, 'utf-8');

            // Initialize validation session
            const validationSession = {
                filePath,
                expectedTier,
                content,
                startTime: Date.now(),
                checklist: {},
                qualityGates: {},
                automationResults: {},
                recommendations: {}
            };

            // Step 1: Tier Assessment and Validation
            await this.performTierAssessment(validationSession);

            // Step 2: Template Compliance Validation
            await this.performTemplateValidation(validationSession);

            // Step 3: Voice Consistency Assessment
            await this.performVoiceValidation(validationSession);

            // Step 4: Quality Gates Automation
            await this.performQualityGatesValidation(validationSession);

            // Step 5: Checklist Compliance Assessment
            await this.performChecklistValidation(validationSession);

            // Step 6: Generate Automated Recommendations
            this.generateAutomatedRecommendations(validationSession);

            // Step 7: Generate Final Report
            this.generateChecklistReport(validationSession);

            return validationSession;

        } catch (error) {
            console.error(`❌ Editorial checklist automation failed: ${error.message}`);
            return { error: true, message: error.message, filePath };
        }
    }

    /**
     * Step 1: Automated Tier Assessment
     */
    async performTierAssessment(session) {
        console.log('\n🔍 Step 1: Automated Tier Assessment');

        try {
            // Use existing template validator for tier assessment
            const tierAssessment = this.templateValidator.assessRequiredTier(
                session.content,
                { sourceCount: this.countSources(session.content) }
            );

            session.automationResults.tierAssessment = tierAssessment;

            console.log(`  Assessed Tier: ${tierAssessment.requiredTier.toUpperCase()}`);
            if (session.expectedTier && session.expectedTier !== tierAssessment.requiredTier) {
                console.log(`  ⚠️  Tier Mismatch: Expected ${session.expectedTier}, Assessed ${tierAssessment.requiredTier}`);
                session.automationResults.tierMismatch = true;
            }

            if (tierAssessment.escalationRequired) {
                console.log(`  🚨 Escalation Required: ${tierAssessment.escalationTriggers.join(', ')}`);
                session.automationResults.escalationRequired = true;
            }

            // Set active tier for validation
            session.activeTier = tierAssessment.requiredTier;

        } catch (error) {
            session.automationResults.tierAssessment = { error: error.message };
            console.log(`  ❌ Tier Assessment Error: ${error.message}`);
        }
    }

    /**
     * Step 2: Template Compliance Validation
     */
    async performTemplateValidation(session) {
        console.log('\n📋 Step 2: Template Compliance Validation');

        try {
            const templateValidation = await this.templateValidator.validateDocument(
                session.filePath,
                session.activeTier
            );

            session.automationResults.templateValidation = templateValidation;

            const complianceScore = templateValidation.compliance?.overallScore || 0;
            const threshold = this.checklistTemplates[session.activeTier].template_compliance_threshold;

            console.log(`  Template Compliance: ${(complianceScore * 100).toFixed(1)}% (Threshold: ${(threshold * 100)}%)`);
            console.log(`  Status: ${complianceScore >= threshold ? '✅ PASS' : '❌ FAIL'}`);

            if (templateValidation.escalationRequired) {
                console.log(`  ⚠️  Escalation Triggers: ${templateValidation.tierAssessment?.escalationTriggers?.join(', ')}`);
            }

        } catch (error) {
            session.automationResults.templateValidation = { error: error.message };
            console.log(`  ❌ Template Validation Error: ${error.message}`);
        }
    }

    /**
     * Step 3: Voice Consistency Assessment
     */
    async performVoiceValidation(session) {
        console.log('\n🎤 Step 3: Voice Consistency Assessment');

        try {
            const voiceCalibration = this.voiceCalibrator.calibrateVoice(
                session.content,
                session.activeTier
            );

            session.automationResults.voiceCalibration = voiceCalibration;

            const voiceScore = voiceCalibration.overallScore;
            const threshold = this.checklistTemplates[session.activeTier].voice_threshold;

            console.log(`  Voice Consistency: ${(voiceScore * 100).toFixed(1)}% (Threshold: ${(threshold * 100)}%)`);
            console.log(`  McKinsey/HBR Alignment: ${voiceCalibration.tierCompliance || 'ASSESSED'}`);
            console.log(`  Status: ${voiceScore >= threshold ? '✅ PASS' : '❌ FAIL'}`);

            // Analyze voice profile dimensions
            if (voiceCalibration.voiceProfile) {
                console.log('  Voice Dimensions:');
                Object.entries(voiceCalibration.voiceProfile).forEach(([dimension, data]) => {
                    console.log(`    ${dimension}: ${(data.netScore * 100).toFixed(1)}%`);
                });
            }

        } catch (error) {
            session.automationResults.voiceCalibration = { error: error.message };
            console.log(`  ❌ Voice Validation Error: ${error.message}`);
        }
    }

    /**
     * Step 4: Quality Gates Validation
     */
    async performQualityGatesValidation(session) {
        console.log('\n🚪 Step 4: Quality Gates Validation');

        try {
            const tierTemplate = this.checklistTemplates[session.activeTier];
            const qualityGates = {};

            // Gate 1: Structural Integrity
            qualityGates.gate1_structural = this.validateStructuralIntegrity(session);

            // Gate 2: Content Quality
            qualityGates.gate2_content = this.validateContentQuality(session);

            // Gate 3: Voice Standards
            qualityGates.gate3_voice = this.validateVoiceStandards(session);

            // Premium tier additional gates
            if (session.activeTier === 'premium') {
                // Gate 4: Expert Coordination
                qualityGates.gate4_expert = this.validateExpertCoordination(session);

                // Gate 5: Constitutional Framework
                qualityGates.gate5_constitutional = this.validateConstitutionalFramework(session);
            }

            session.qualityGates = qualityGates;

            // Report quality gates status
            console.log('  Quality Gates Summary:');
            Object.entries(qualityGates).forEach(([gateName, gateResult]) => {
                const gateNum = gateName.replace(/gate(\d+)_.*/, '$1');
                console.log(`    Gate ${gateNum}: ${gateResult.status} (${(gateResult.score * 100).toFixed(1)}%)`);
            });

            const passedGates = Object.values(qualityGates).filter(gate => gate.status === 'PASS').length;
            const totalGates = tierTemplate.required_gates;
            console.log(`  Overall: ${passedGates}/${totalGates} gates passed`);

        } catch (error) {
            session.qualityGates = { error: error.message };
            console.log(`  ❌ Quality Gates Error: ${error.message}`);
        }
    }

    /**
     * Step 5: Checklist Compliance Assessment
     */
    async performChecklistValidation(session) {
        console.log('\n✅ Step 5: Checklist Compliance Assessment');

        try {
            const tierTemplate = this.checklistTemplates[session.activeTier];
            const checklist = {};

            // Constitutional Framework Compliance (Premium only)
            if (session.activeTier === 'premium') {
                checklist.constitutional = this.validateConstitutionalChecklist(session);
            }

            // Quality Gates Compliance (All tiers)
            checklist.qualityGates = this.validateQualityGatesChecklist(session);

            // Editorial Quality Standards (All tiers)
            checklist.editorial = this.validateEditorialChecklist(session);

            // Technical Standards (All tiers)
            checklist.technical = this.validateTechnicalChecklist(session);

            session.checklist = checklist;

            // Report checklist compliance
            console.log('  Checklist Compliance:');
            Object.entries(checklist).forEach(([section, sectionResult]) => {
                const completionRate = sectionResult.completedItems / sectionResult.totalItems;
                console.log(`    ${section}: ${(completionRate * 100).toFixed(1)}% complete (${sectionResult.completedItems}/${sectionResult.totalItems})`);
            });

        } catch (error) {
            session.checklist = { error: error.message };
            console.log(`  ❌ Checklist Validation Error: ${error.message}`);
        }
    }

    /**
     * Validate Structural Integrity (Quality Gate 1)
     */
    validateStructuralIntegrity(session) {
        const templateValidation = session.automationResults.templateValidation;
        const structuralScore = templateValidation?.compliance?.structuralCompliance?.score || 0;
        const threshold = 0.8;

        return {
            status: structuralScore >= threshold ? 'PASS' : 'FAIL',
            score: structuralScore,
            threshold,
            details: {
                hasValidStructure: templateValidation?.analysis?.hasTitle && templateValidation?.analysis?.hasAuthority,
                hasTierDeclaration: templateValidation?.analysis?.hasTierDeclaration,
                hasRequiredSections: structuralScore > 0.6
            }
        };
    }

    /**
     * Validate Content Quality (Quality Gate 2)
     */
    validateContentQuality(session) {
        const templateValidation = session.automationResults.templateValidation;
        const tierTemplate = this.checklistTemplates[session.activeTier];

        const sourceCount = this.countSources(session.content);
        const sufficientSources = sourceCount >= tierTemplate.min_sources;

        const contentScore = templateValidation?.compliance?.contentCompliance?.score || 0;
        const threshold = 0.7;

        return {
            status: contentScore >= threshold && sufficientSources ? 'PASS' : 'FAIL',
            score: contentScore,
            threshold,
            details: {
                sourceCount,
                minSources: tierTemplate.min_sources,
                sufficientSources,
                evidenceDocumentation: contentScore > 0.5
            }
        };
    }

    /**
     * Validate Voice Standards (Quality Gate 3)
     */
    validateVoiceStandards(session) {
        const voiceCalibration = session.automationResults.voiceCalibration;
        const tierTemplate = this.checklistTemplates[session.activeTier];

        const voiceScore = voiceCalibration?.overallScore || 0;
        const threshold = tierTemplate.voice_threshold;

        return {
            status: voiceScore >= threshold ? 'PASS' : 'FAIL',
            score: voiceScore,
            threshold,
            details: {
                professionalAuthority: voiceCalibration?.voiceProfile?.professionalAuthority?.netScore || 0,
                strategicClarity: voiceCalibration?.voiceProfile?.strategicClarity?.netScore || 0,
                analyticalRigor: voiceCalibration?.voiceProfile?.analyticalRigor?.netScore || 0,
                tierCompliance: voiceCalibration?.tierCompliance || 'UNKNOWN'
            }
        };
    }

    /**
     * Validate Expert Coordination (Quality Gate 4 - Premium only)
     */
    validateExpertCoordination(session) {
        const content = session.content.toLowerCase();
        const hasExpertPanel = /expert.*panel|multi.*expert|expert.*coordination/i.test(content);
        const hasSemanticIntegration = /semantic.*integration|intent.*classification|blocking|advisory|generative/i.test(content);

        const score = (hasExpertPanel ? 0.5 : 0) + (hasSemanticIntegration ? 0.5 : 0);

        return {
            status: score >= 0.8 ? 'PASS' : 'FAIL',
            score,
            threshold: 0.8,
            details: {
                hasExpertPanel,
                hasSemanticIntegration,
                expertCoordinationDocumented: hasExpertPanel && hasSemanticIntegration
            }
        };
    }

    /**
     * Validate Constitutional Framework (Quality Gate 5 - Premium only)
     */
    validateConstitutionalFramework(session) {
        const content = session.content.toLowerCase();
        const constitutionalElements = [
            'constitutional',
            'banking-level',
            'evidence-first',
            'alpha.*verification',
            'beta.*verification',
            'audit.*trail'
        ];

        const foundElements = constitutionalElements.filter(element =>
            new RegExp(element).test(content)
        );

        const score = foundElements.length / constitutionalElements.length;

        return {
            status: score >= 0.8 ? 'PASS' : 'FAIL',
            score,
            threshold: 0.8,
            details: {
                requiredElements: constitutionalElements.length,
                foundElements: foundElements.length,
                missingElements: constitutionalElements.filter(el => !foundElements.includes(el)),
                constitutionalCompliance: score >= 0.8
            }
        };
    }

    /**
     * Validate Constitutional Checklist (Premium tier)
     */
    validateConstitutionalChecklist(session) {
        const content = session.content;

        const constitutionalItems = [
            { name: 'Constitutional triggers identified', pattern: /constitutional.*trigger|banking.*level.*trigger/i },
            { name: 'Expert panel coordination', pattern: /expert.*panel|multi.*expert.*coordination/i },
            { name: 'Alpha+Beta verification', pattern: /alpha.*verification.*beta|alpha.*beta.*verification/i },
            { name: 'Evidence-first methodology', pattern: /evidence.*first.*methodology|evidence.*based.*approach/i },
            { name: 'Banking-level standards applied', pattern: /banking.*level.*standard|constitutional.*framework/i }
        ];

        const completed = constitutionalItems.filter(item => item.pattern.test(content));

        return {
            totalItems: constitutionalItems.length,
            completedItems: completed.length,
            completionRate: completed.length / constitutionalItems.length,
            details: constitutionalItems.map(item => ({
                name: item.name,
                completed: item.pattern.test(content)
            }))
        };
    }

    /**
     * Validate Quality Gates Checklist (All tiers)
     */
    validateQualityGatesChecklist(session) {
        const qualityGates = session.qualityGates || {};
        const tierTemplate = this.checklistTemplates[session.activeTier];

        const gateItems = [];

        // Add gates based on tier
        gateItems.push(
            { name: 'Structural integrity gate', completed: qualityGates.gate1_structural?.status === 'PASS' },
            { name: 'Content quality gate', completed: qualityGates.gate2_content?.status === 'PASS' },
            { name: 'Voice standards gate', completed: qualityGates.gate3_voice?.status === 'PASS' }
        );

        if (session.activeTier === 'premium') {
            gateItems.push(
                { name: 'Expert coordination gate', completed: qualityGates.gate4_expert?.status === 'PASS' },
                { name: 'Constitutional framework gate', completed: qualityGates.gate5_constitutional?.status === 'PASS' }
            );
        }

        const completed = gateItems.filter(item => item.completed);

        return {
            totalItems: tierTemplate.required_gates,
            completedItems: completed.length,
            completionRate: completed.length / tierTemplate.required_gates,
            details: gateItems
        };
    }

    /**
     * Validate Editorial Checklist (All tiers)
     */
    validateEditorialChecklist(session) {
        const content = session.content;
        const voiceCalibration = session.automationResults.voiceCalibration;
        const tierTemplate = this.checklistTemplates[session.activeTier];

        const editorialItems = [
            { name: 'Voice consistency meets threshold', completed: voiceCalibration?.overallScore >= tierTemplate.voice_threshold },
            { name: 'Professional authority maintained', completed: voiceCalibration?.voiceProfile?.professionalAuthority?.netScore >= 0.5 },
            { name: 'Strategic clarity achieved', completed: voiceCalibration?.voiceProfile?.strategicClarity?.netScore >= 0.5 },
            { name: 'Content quality standards met', completed: this.countSources(content) >= tierTemplate.min_sources },
            { name: 'Template compliance achieved', completed: session.automationResults.templateValidation?.compliance?.overallScore >= tierTemplate.template_compliance_threshold }
        ];

        // Add tier-specific items
        if (session.activeTier === 'premium') {
            editorialItems.push(
                { name: 'Banking-level documentation', completed: /audit.*trail|documentation.*archive/i.test(content) },
                { name: 'Constitutional framework compliance', completed: /constitutional.*framework|banking.*level/i.test(content) }
            );
        }

        const completed = editorialItems.filter(item => item.completed);

        return {
            totalItems: editorialItems.length,
            completedItems: completed.length,
            completionRate: completed.length / editorialItems.length,
            details: editorialItems
        };
    }

    /**
     * Validate Technical Checklist (All tiers)
     */
    validateTechnicalChecklist(session) {
        const content = session.content;
        const wordCount = content.split(/\s+/).length;
        const tierTemplate = this.checklistTemplates[session.activeTier];

        const minWords = session.activeTier === 'premium' ? 1500 : 800;
        const maxWords = session.activeTier === 'premium' ? 5000 : 2500;

        const technicalItems = [
            { name: 'Appropriate word count', completed: wordCount >= minWords && wordCount <= maxWords },
            { name: 'Required sections present', completed: this.hasRequiredSections(content, session.activeTier) },
            { name: 'Professional formatting', completed: /#{1,6}\s+/.test(content) },
            { name: 'Source citations present', completed: this.countSources(content) > 0 },
            { name: 'Template structure followed', completed: session.automationResults.templateValidation?.analysis?.hasTitle && session.automationResults.templateValidation?.analysis?.hasAuthority }
        ];

        const completed = technicalItems.filter(item => item.completed);

        return {
            totalItems: technicalItems.length,
            completedItems: completed.length,
            completionRate: completed.length / technicalItems.length,
            details: technicalItems,
            wordCount,
            wordCountRange: `${minWords}-${maxWords}`,
            wordCountCompliant: wordCount >= minWords && wordCount <= maxWords
        };
    }

    /**
     * Generate Automated Recommendations
     */
    generateAutomatedRecommendations(session) {
        const recommendations = {
            immediate: [],
            recommended: [],
            strategic: []
        };

        // Tier escalation recommendations
        if (session.automationResults.escalationRequired) {
            recommendations.immediate.push({
                type: 'tier_escalation',
                action: 'Escalate to Premium tier',
                reason: session.automationResults.tierAssessment?.escalationTriggers?.join(', '),
                priority: 'P0',
                automation: 'Use investigation-template-premium-enhanced.md'
            });
        }

        // Voice consistency recommendations
        const voiceScore = session.automationResults.voiceCalibration?.overallScore || 0;
        const voiceThreshold = this.checklistTemplates[session.activeTier].voice_threshold;

        if (voiceScore < voiceThreshold) {
            recommendations.immediate.push({
                type: 'voice_improvement',
                action: 'Improve voice consistency',
                current: `${(voiceScore * 100).toFixed(1)}%`,
                target: `${(voiceThreshold * 100)}%`,
                suggestions: this.generateVoiceImprovementSuggestions(session)
            });
        }

        // Template compliance recommendations
        const templateScore = session.automationResults.templateValidation?.compliance?.overallScore || 0;
        const templateThreshold = this.checklistTemplates[session.activeTier].template_compliance_threshold;

        if (templateScore < templateThreshold) {
            recommendations.recommended.push({
                type: 'template_compliance',
                action: 'Improve template compliance',
                current: `${(templateScore * 100).toFixed(1)}%`,
                target: `${(templateThreshold * 100)}%`,
                automation: 'Run template-compliance-validator.js for specific issues'
            });
        }

        // Quality gates recommendations
        Object.entries(session.qualityGates || {}).forEach(([gateName, gateResult]) => {
            if (gateResult.status === 'FAIL') {
                recommendations.recommended.push({
                    type: 'quality_gate',
                    action: `Address ${gateName.replace('gate\\d+_', '')} quality gate failure`,
                    score: `${(gateResult.score * 100).toFixed(1)}%`,
                    threshold: `${(gateResult.threshold * 100).toFixed(1)}%`,
                    details: gateResult.details
                });
            }
        });

        // Checklist completion recommendations
        Object.entries(session.checklist || {}).forEach(([section, sectionResult]) => {
            if (sectionResult.completionRate < 0.9) {
                const incompleteItems = sectionResult.details?.filter(item => !item.completed) || [];
                recommendations.strategic.push({
                    type: 'checklist_completion',
                    action: `Complete ${section} checklist items`,
                    completion: `${(sectionResult.completionRate * 100).toFixed(1)}%`,
                    incomplete_items: incompleteItems.map(item => item.name)
                });
            }
        });

        session.recommendations = recommendations;
    }

    /**
     * Generate Voice Improvement Suggestions
     */
    generateVoiceImprovementSuggestions(session) {
        const voiceProfile = session.automationResults.voiceCalibration?.voiceProfile || {};
        const suggestions = [];

        Object.entries(voiceProfile).forEach(([dimension, data]) => {
            if (data.netScore < 0.5) {
                const markers = this.qualityStandards.voice_consistency_markers[dimension] || [];
                suggestions.push({
                    dimension,
                    current_score: `${(data.netScore * 100).toFixed(1)}%`,
                    suggested_markers: markers.slice(0, 3),
                    advice: `Add more ${dimension.replace(/([A-Z])/g, ' $1').toLowerCase()} markers`
                });
            }
        });

        return suggestions;
    }

    /**
     * Generate Final Checklist Report
     */
    generateChecklistReport(session) {
        const duration = (Date.now() - session.startTime) / 1000;

        console.log('\n' + '='.repeat(70));
        console.log('EDITORIAL CHECKLIST AUTOMATION - FINAL REPORT');
        console.log('='.repeat(70));
        console.log(`File: ${session.filePath}`);
        console.log(`Active Tier: ${session.activeTier?.toUpperCase() || 'UNKNOWN'}`);
        console.log(`Duration: ${duration.toFixed(1)}s`);

        // Tier assessment summary
        if (session.automationResults.tierAssessment) {
            console.log(`\nTier Assessment: ${session.automationResults.tierAssessment.requiredTier.toUpperCase()}`);
            if (session.automationResults.escalationRequired) {
                console.log(`⚠️  Escalation Required: ${session.automationResults.tierAssessment.escalationTriggers?.join(', ')}`);
            }
        }

        // Quality gates summary
        if (session.qualityGates && Object.keys(session.qualityGates).length > 0) {
            console.log('\nQuality Gates Summary:');
            Object.entries(session.qualityGates).forEach(([gateName, gateResult]) => {
                const gateNum = gateName.replace(/gate(\d+)_.*/, '$1');
                const status = gateResult.status === 'PASS' ? '✅' : '❌';
                console.log(`  Gate ${gateNum}: ${status} ${gateResult.status} (${(gateResult.score * 100).toFixed(1)}%)`);
            });
        }

        // Checklist compliance summary
        if (session.checklist && Object.keys(session.checklist).length > 0) {
            console.log('\nChecklist Compliance:');
            Object.entries(session.checklist).forEach(([section, sectionResult]) => {
                const completionRate = sectionResult.completionRate * 100;
                const status = completionRate >= 90 ? '✅' : completionRate >= 70 ? '⚠️' : '❌';
                console.log(`  ${section}: ${status} ${completionRate.toFixed(1)}% (${sectionResult.completedItems}/${sectionResult.totalItems})`);
            });
        }

        // Automation recommendations
        if (session.recommendations?.immediate?.length > 0) {
            console.log('\nImmediate Actions:');
            session.recommendations.immediate.slice(0, 5).forEach((rec, i) => {
                console.log(`  ${i + 1}. ${rec.action} (${rec.type})`);
            });
        }

        if (session.recommendations?.recommended?.length > 0) {
            console.log('\nRecommended Improvements:');
            session.recommendations.recommended.slice(0, 3).forEach((rec, i) => {
                console.log(`  ${i + 1}. ${rec.action} (${rec.type})`);
            });
        }

        // Final status
        const overallScore = this.calculateOverallScore(session);
        console.log(`\n✅ Editorial checklist automation complete - Score: ${(overallScore * 100).toFixed(1)}%`);
        console.log('='.repeat(70));
    }

    /**
     * Calculate overall score
     */
    calculateOverallScore(session) {
        const scores = [];

        // Template compliance score
        if (session.automationResults.templateValidation?.compliance?.overallScore) {
            scores.push(session.automationResults.templateValidation.compliance.overallScore);
        }

        // Voice consistency score
        if (session.automationResults.voiceCalibration?.overallScore) {
            scores.push(session.automationResults.voiceCalibration.overallScore);
        }

        // Quality gates score
        if (session.qualityGates && Object.keys(session.qualityGates).length > 0) {
            const gateScores = Object.values(session.qualityGates).map(gate => gate.score || 0);
            const avgGateScore = gateScores.reduce((sum, score) => sum + score, 0) / gateScores.length;
            scores.push(avgGateScore);
        }

        return scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
    }

    // Helper methods
    countSources(content) {
        const sourcePatterns = [
            /\*\*Source\*\*:/gi,
            /\[.*?\]\(.*?\)/g,  // Markdown links
            /https?:\/\/\S+/g,   // URLs
            /doi:\s*\S+/gi      // DOI references
        ];

        let sourceCount = 0;
        sourcePatterns.forEach(pattern => {
            const matches = content.match(pattern) || [];
            sourceCount += matches.length;
        });

        return sourceCount;
    }

    hasRequiredSections(content, tier) {
        const requiredSections = tier === 'premium'
            ? ['constitutional', 'planning', 'execution', 'verification', 'delivery']
            : ['setup', 'planning', 'execution', 'results'];

        const sections = content.match(/^#{1,6}\s+(.+)$/gm) || [];
        const sectionTitles = sections.map(s => s.replace(/^#+\s*/, '').toLowerCase());

        return requiredSections.every(req =>
            sectionTitles.some(title => title.includes(req))
        );
    }
}

// CLI Interface
if (process.argv.length > 2) {
    const automation = new EditorialChecklistAutomation();
    const filePath = process.argv[2];
    const expectedTier = process.argv[3] || null;

    automation.validateEditorialChecklist(filePath, expectedTier).then(result => {
        if (result.error) {
            console.error('❌ Editorial checklist automation failed:', result.message);
            process.exit(1);
        }

        const overallScore = automation.calculateOverallScore(result);
        process.exit(overallScore >= 0.8 ? 0 : 1);
    }).catch(error => {
        console.error('❌ Editorial checklist automation system error:', error.message);
        process.exit(1);
    });
}

export default EditorialChecklistAutomation;