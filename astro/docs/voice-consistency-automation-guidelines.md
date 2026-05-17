# Voice Consistency Automation Guidelines
**Version:** 1.0 | **Date:** 2026-05-07 | **Enhanced Alice v2.0 Level 3 Cartouche Autonome Operation**  
**Authority:** ORGA-092 Phase 3A Quality Framework | **Integration:** ORGA-091 95% Automation Foundation

## Executive Summary

**MISSION**: Automated voice consistency guidelines for Investigation Template System, building on established McKinsey/Harvard Business Review standards with real-time calibration and tier-specific requirements.

**FOUNDATION**: Leverages existing Voice Calibration Engine and Voice Consistency Protocol to provide automated voice assessment, real-time suggestions, and tier-appropriate quality standards.

**INTEGRATION**: Seamlessly integrated with Template Compliance Validator and Editorial Review Automation for comprehensive quality assurance.

---

## I. Voice Consistency Framework Integration

### McKinsey/HBR Standards Implementation

#### **Voice DNA Integration Points**
```yaml
Voice_Standards_Hierarchy:
  Foundation_Level: "Professional business communication"
  Target_Level: "McKinsey meets Harvard Business Review"
  Premium_Level: "Banking-level executive communication"
  
  Core_Dimensions:
    - Professional Authority: Evidence-backed authoritative statements
    - Strategic Clarity: Clear problem definition and actionable solutions  
    - Analytical Rigor: Data-driven approach with validation
    - Executive Communication: Business-focused strategic framing
```

#### **Automated Voice Assessment Framework**
```javascript
// Voice Consistency Automation Integration
const voiceStandards = {
    professionalAuthority: {
        weight: 0.3,
        standardThreshold: 0.5,
        premiumThreshold: 0.7,
        markers: [
            'evidence indicates', 'analysis shows', 'findings demonstrate',
            'research confirms', 'assessment reveals', 'investigation found',
            'data suggests', 'proven approach', 'validated methodology'
        ],
        antiPatterns: [
            'i think', 'maybe', 'probably', 'might be',
            'seems like', 'appears to', 'could be', 'possibly'
        ]
    },
    strategicClarity: {
        weight: 0.25,
        standardThreshold: 0.5,
        premiumThreshold: 0.7,
        markers: [
            'recommendation', 'next steps', 'action items', 'strategic priority',
            'implementation plan', 'timeline', 'responsible party', 'deliverable',
            'objective', 'goal', 'outcome', 'success criteria'
        ],
        antiPatterns: [
            'we should probably', 'it would be nice', 'when we get around to',
            'eventually', 'at some point', 'maybe we could'
        ]
    }
};
```

### Tier-Specific Voice Requirements

#### **Standard Tier Voice Requirements** (≥50% Voice Score)
```yaml
Standard_Tier_Voice_Profile:
  Professional_Authority: ≥50% markers present
  Strategic_Clarity: ≥50% strategic markers  
  Analytical_Rigor: Basic validation markers present
  Executive_Communication: Professional business tone maintained

  Automation_Triggers:
    - Real-time suggestions when voice score drops below 45%
    - Anti-pattern detection with immediate replacement suggestions
    - Professional authority reinforcement recommendations
    - Strategic clarity enhancement prompts
```

#### **Premium Tier Voice Requirements** (≥70% Voice Score)
```yaml
Premium_Tier_Voice_Profile:
  Professional_Authority: ≥70% authority markers required
  Strategic_Clarity: ≥70% strategic markers required
  Analytical_Rigor: ≥70% analytical rigor markers required
  Executive_Communication: ≥60% executive framing markers required

  Banking_Level_Standards:
    - Evidence-based language enforcement
    - Constitutional framework terminology integration
    - Banking-level precision in recommendations
    - Executive decision-maker communication standards
```

---

## II. Real-Time Voice Calibration System

### Automated Voice Assessment Integration

#### **Voice Calibration Engine Integration**
```javascript
// Real-time Voice Assessment for Investigation Templates
class InvestigationVoiceAssessment {
    constructor() {
        this.voiceEngine = new VoiceCalibrationEngine();
        this.tierRequirements = this.initializeTierRequirements();
        this.realTimeSuggestions = this.initializeRealTimeSuggestions();
    }

    assessInvestigationVoice(content, tier, section = 'full') {
        // Base voice calibration
        const baseAssessment = this.voiceEngine.calibrateVoice(content, tier);
        
        // Investigation-specific enhancements
        const investigationEnhancements = {
            evidenceLanguage: this.assessEvidenceBasedLanguage(content),
            investigativeAuthority: this.assessInvestigativeAuthority(content),
            conclusionStrength: this.assessConclusionStrength(content),
            methodologyClarity: this.assessMethodologyClarity(content)
        };
        
        return {
            ...baseAssessment,
            investigationProfile: investigationEnhancements,
            realTimeSuggestions: this.generateRealTimeSuggestions(baseAssessment, tier),
            sectionSpecificGuidance: this.getSectionSpecificGuidance(section, tier)
        };
    }
}
```

#### **Real-Time Voice Enhancement System**
```yaml
Real_Time_Voice_Features:
  Live_Assessment:
    - Continuous voice score monitoring during writing
    - Section-by-section voice profile tracking
    - Immediate feedback on voice consistency deviations
    - Tier threshold compliance real-time verification

  Suggestion_Engine:
    - Anti-pattern detection with immediate replacement suggestions
    - Professional authority enhancement recommendations  
    - Strategic clarity improvement prompts
    - Executive communication upgrade suggestions

  Quality_Gates:
    - Voice score checkpoint at each investigation phase
    - Tier escalation trigger detection based on voice requirements
    - Constitutional framework language compliance (Premium tier)
    - Banking-level communication standard enforcement
```

### Section-Specific Voice Guidance

#### **Investigation Phase Voice Requirements**

##### **Phase 1: Planning (Constitutional/Objective Definition)**
```yaml
Planning_Phase_Voice:
  Professional_Authority:
    Required_Elements: [
      "comprehensive assessment indicates",
      "strategic analysis reveals",
      "investigation framework requires"
    ]
    Avoid_Elements: [
      "we think", "seems reasonable", "probably should"
    ]

  Strategic_Clarity:
    Required_Elements: [
      "clear objectives defined",
      "specific success criteria established",
      "timeline and milestones identified"
    ]
    Structure_Requirements: [
      "Objective statements with measurable outcomes",
      "Scope boundaries clearly defined",
      "Escalation criteria explicitly stated"
    ]
```

##### **Phase 2: Execution (Evidence Collection)**
```yaml
Execution_Phase_Voice:
  Analytical_Rigor:
    Required_Elements: [
      "evidence validated through",
      "independently verified by",
      "cross-referenced against",
      "confirmed via multiple sources"
    ]
    
  Investigation_Authority:
    Required_Elements: [
      "investigation findings indicate",
      "evidence analysis demonstrates",
      "systematic review reveals",
      "methodological assessment shows"
    ]
```

##### **Phase 3: Synthesis (Premium: Beta Verification)**
```yaml
Synthesis_Phase_Voice:
  Executive_Communication:
    Required_Elements: [
      "strategic implications include",
      "business impact assessment",
      "implementation recommendations",
      "risk mitigation strategies"
    ]

  Constitutional_Framework_Language_Premium:
    Required_Elements: [
      "constitutional compliance verified",
      "banking-level standards applied",
      "expert panel consensus achieved",
      "audit trail documentation complete"
    ]
```

---

## III. Automated Voice Enhancement Features

### Anti-Pattern Detection and Correction

#### **Automatic Weak Language Detection**
```javascript
// Anti-Pattern Detection System
const antiPatternDetection = {
    hedgingLanguage: {
        patterns: [
            /\b(maybe|perhaps|possibly|might|could|seems|appears|probably)\b/gi,
            /\b(i think|i believe|i feel|in my opinion|it seems)\b/gi,
            /\b(kind of|sort of|you know|basically|actually|literally)\b/gi
        ],
        replacements: {
            'maybe': 'evidence suggests',
            'probably': 'analysis indicates',
            'i think': 'assessment demonstrates',
            'seems like': 'investigation reveals'
        },
        severity: 'HIGH', // Immediate suggestion required
        tierImpact: 'BOTH' // Affects both Standard and Premium tiers
    },

    weakConclusions: {
        patterns: [
            /\b(could be|might be|possibly|potentially|appears to be)\b/gi,
            /\b(suggests that maybe|indicates that probably)\b/gi
        ],
        replacements: {
            'could be': 'evidence demonstrates',
            'might be': 'findings confirm',
            'appears to be': 'investigation establishes'
        },
        severity: 'MEDIUM',
        tierImpact: 'PREMIUM' // Critical for Premium tier
    }
};
```

#### **Professional Authority Enhancement System**
```yaml
Authority_Enhancement_Automation:
  Trigger_Phrases:
    Low_Authority: ["I think", "maybe", "probably", "seems like"]
    Medium_Authority: ["suggests", "indicates", "appears", "likely"]
    High_Authority: ["demonstrates", "confirms", "establishes", "validates"]

  Automatic_Replacements:
    "Our analysis suggests" → "Evidence-based analysis demonstrates"
    "This might indicate" → "Investigation findings establish"
    "It appears that" → "Systematic review confirms"
    "We believe" → "Assessment validates"

  Context_Aware_Suggestions:
    Evidence_Context: Use "research confirms", "data validates"
    Analysis_Context: Use "assessment demonstrates", "evaluation establishes"
    Investigation_Context: Use "findings confirm", "investigation validates"
    Conclusion_Context: Use "evidence establishes", "analysis confirms"
```

### Strategic Clarity Automation

#### **Action-Oriented Language Enhancement**
```yaml
Strategic_Clarity_Automation:
  Vague_Recommendations_Detection:
    Patterns: [
      "should improve", "need to fix", "would be better",
      "could enhance", "might consider", "should probably"
    ]
    
  Strategic_Enhancement_Templates:
    "should improve" → "implement targeted improvements by [DATE] with [SPECIFIC METRICS]"
    "need to fix" → "execute remediation plan addressing [SPECIFIC ISSUES] within [TIMELINE]"
    "would be better" → "strategic priority requires [SPECIFIC ACTION] to achieve [MEASURABLE OUTCOME]"

  Actionability_Requirements:
    Standard_Tier: Clear action items with ownership
    Premium_Tier: Strategic priority ranking + implementation timeline + success criteria
```

#### **Executive Communication Integration**
```javascript
// Executive Communication Enhancement
const executiveCommunicationPatterns = {
    businessImpact: {
        triggers: ['recommendation', 'conclusion', 'summary'],
        enhancements: [
            'Strategic implications:',
            'Business impact:',
            'Competitive advantage:',
            'Operational excellence:',
            'Risk mitigation:'
        ]
    },
    
    implementationFramework: {
        triggers: ['action items', 'next steps', 'recommendations'],
        enhancements: [
            'Implementation timeline:',
            'Resource requirements:',
            'Success metrics:',
            'Risk assessment:',
            'Stakeholder coordination:'
        ]
    }
};
```

---

## IV. Integration with Editorial Automation

### Voice Consistency in Editorial Workflow

#### **Editorial Review Integration Points**
```yaml
Editorial_Workflow_Voice_Integration:
  Stage_2_Content_Development:
    - Voice consistency checkpoint at 150+ words
    - Anti-pattern detection during writing
    - Real-time authority enhancement suggestions
    - Strategic clarity improvement prompts

  Stage_4_Editorial_Review:
    - Comprehensive voice calibration assessment
    - Tier-specific threshold verification
    - McKinsey/HBR alignment confirmation
    - Executive communication standard validation

  Stage_5_Quality_Assurance:
    - Final voice consistency verification
    - Tier escalation trigger assessment
    - Constitutional framework language compliance (Premium)
    - Banking-level communication standard confirmation
```

#### **Automated Editorial Quality Gates**
```javascript
// Voice Consistency Quality Gates
const voiceQualityGates = {
    gate1_BasicConsistency: {
        threshold: 0.4,
        triggers: ['Anti-pattern elimination', 'Basic professional tone'],
        automation: 'Automatic suggestions for hedging language removal'
    },
    
    gate2_TierCompliance: {
        standard: { threshold: 0.5, requirements: 'Professional authority ≥50%' },
        premium: { threshold: 0.7, requirements: 'All dimensions ≥70%' }
    },
    
    gate3_ExecutiveReadiness: {
        threshold: 0.8,
        requirements: 'Executive communication markers present',
        enforcement: 'Premium tier constitutional framework integration'
    }
};
```

### Template-Specific Voice Calibration

#### **Investigation Template Voice Profiles**

##### **Standard Tier Voice Profile**
```yaml
Standard_Investigation_Voice:
  Professional_Authority: "Evidence-based conclusions with professional confidence"
  Strategic_Clarity: "Clear recommendations with defined ownership"
  Analytical_Rigor: "Source-supported analysis with standard verification"
  Executive_Communication: "Professional business communication appropriate for stakeholders"

  Voice_Markers_Required: ≥50% across all dimensions
  Anti_Patterns_Tolerance: <10% weak language
  Strategic_Language_Minimum: Basic action orientation with clear next steps
```

##### **Premium Tier Voice Profile**
```yaml
Premium_Investigation_Voice:
  Professional_Authority: "Banking-level authoritative statements with constitutional backing"
  Strategic_Clarity: "Strategic priorities with implementation frameworks and success metrics"
  Analytical_Rigor: "Multi-source validation with independent verification"
  Executive_Communication: "C-suite appropriate strategic business communication"

  Voice_Markers_Required: ≥70% across all dimensions
  Anti_Patterns_Tolerance: <5% weak language (constitutional requirement)
  Constitutional_Language_Integration: Banking-level precision terminology
  Expert_Coordination_Voice: Semantic integration protocol compliance
```

---

## V. Real-Time Implementation Guidelines

### Voice Consistency During Writing

#### **Live Writing Enhancement System**
```yaml
Real_Time_Writing_Enhancement:
  Character_Threshold_Triggers:
    - 100_characters: Basic professional tone assessment
    - 500_characters: Anti-pattern detection activation
    - 1000_characters: Voice profile assessment
    - 2000_characters: Tier threshold compliance check

  Section_Completion_Triggers:
    - Planning_Phase: Strategic clarity assessment
    - Evidence_Collection: Analytical rigor verification
    - Synthesis_Phase: Professional authority + executive communication

  Immediate_Feedback_Types:
    - Red_Highlights: Anti-patterns requiring immediate attention
    - Yellow_Suggestions: Professional enhancement opportunities
    - Green_Confirmations: Voice markers properly implemented
    - Blue_Strategic: Executive communication upgrade opportunities
```

#### **Section-by-Section Voice Guidance**

##### **Constitutional Planning Section (Premium)**
```yaml
Planning_Section_Voice_Requirements:
  Required_Language_Patterns:
    - "Constitutional framework requires"
    - "Banking-level standards mandate"
    - "Expert panel coordination established"
    - "Alpha verification protocol confirms"

  Professional_Authority_Markers:
    - "Comprehensive assessment indicates"
    - "Strategic analysis establishes"
    - "Investigation framework validates"

  Real_Time_Suggestions:
    - Replace "we plan to" with "investigation framework establishes"
    - Replace "should probably" with "constitutional requirement mandates"
    - Replace "might need" with "banking-level standards require"
```

##### **Evidence Collection Section (All Tiers)**
```yaml
Evidence_Section_Voice_Requirements:
  Analytical_Rigor_Markers:
    Standard: ["verified through", "confirmed by", "sourced from"]
    Premium: ["independently validated", "cross-verified via", "banking-level confirmation"]

  Investigation_Authority_Language:
    - "Investigation findings demonstrate"
    - "Evidence analysis establishes"
    - "Systematic review confirms"
    - "Methodological assessment validates"

  Real_Time_Enhancement:
    - Detect weak evidence language ("seems to show")
    - Suggest analytical strengthening ("systematic analysis demonstrates")
    - Prompt for source verification language
```

### Automation Tool Integration

#### **Voice Calibration Engine API Integration**
```javascript
// Voice Consistency Automation API
class VoiceConsistencyAPI {
    async assessRealTimeVoice(content, tier, section) {
        const assessment = await this.voiceEngine.calibrateVoice(content, tier);
        
        return {
            currentScore: assessment.overallScore,
            tierThreshold: this.getTierThreshold(tier),
            complianceStatus: assessment.overallScore >= this.getTierThreshold(tier) ? 'PASS' : 'NEEDS_IMPROVEMENT',
            immediateSuggestions: this.generateImmediateSuggestions(assessment, tier),
            sectionGuidance: this.getSectionSpecificGuidance(section, tier),
            escalationTriggers: this.checkEscalationTriggers(assessment, tier)
        };
    }
    
    generateImmediateSuggestions(assessment, tier) {
        const suggestions = [];
        
        // Professional authority enhancement
        if (assessment.voiceProfile.professionalAuthority.netScore < this.getTierThreshold(tier)) {
            suggestions.push({
                type: 'professional_authority',
                current: assessment.voiceProfile.professionalAuthority.netScore,
                target: this.getTierThreshold(tier),
                suggestions: this.getAuthorityEnhancements()
            });
        }
        
        // Strategic clarity improvement
        if (assessment.voiceProfile.strategicClarity.netScore < this.getTierThreshold(tier)) {
            suggestions.push({
                type: 'strategic_clarity',
                current: assessment.voiceProfile.strategicClarity.netScore,
                target: this.getTierThreshold(tier),
                suggestions: this.getClarityEnhancements()
            });
        }
        
        return suggestions;
    }
}
```

---

## VI. Quality Assurance and Monitoring

### Voice Consistency Metrics

#### **Automated Voice Quality Tracking**
```yaml
Voice_Quality_Metrics:
  Real_Time_Tracking:
    - Voice score progression during writing
    - Tier threshold compliance monitoring
    - Anti-pattern detection and resolution rate
    - Professional enhancement acceptance rate

  Section_Completion_Assessment:
    - Voice profile per investigation phase
    - Strategic clarity progression
    - Professional authority strengthening
    - Executive communication readiness

  Final_Quality_Validation:
    - Overall voice consistency score
    - Tier-specific threshold compliance
    - McKinsey/HBR standard alignment
    - Constitutional framework language integration (Premium)
```

#### **Continuous Improvement Integration**
```yaml
Voice_Improvement_Automation:
  Pattern_Learning:
    - Successful voice enhancement patterns
    - Effective professional authority improvements
    - Strategic clarity best practices
    - Executive communication excellence examples

  Template_Optimization:
    - Voice profile template refinement based on success patterns
    - Tier threshold adjustment based on quality outcomes
    - Real-time suggestion effectiveness measurement
    - Constitutional framework language optimization
```

### Integration Success Metrics

| Metric | Standard Tier | Premium Tier | Measurement Method |
|--------|---------------|--------------|-------------------|
| **Voice Consistency Score** | ≥50% | ≥70% | Automated voice calibration engine |
| **Professional Authority** | ≥50% | ≥70% | Authority marker density analysis |
| **Strategic Clarity** | ≥50% | ≥70% | Strategic marker presence verification |
| **Anti-Pattern Elimination** | ≤10% | ≤5% | Automated anti-pattern detection |
| **Real-Time Suggestion Adoption** | ≥60% | ≥80% | Suggestion implementation tracking |
| **Constitutional Language Integration** | N/A | ≥60% | Constitutional framework marker analysis |

---

## VII. Implementation and Training

### Voice Consistency Training Integration

#### **Template-Specific Training Materials**
```yaml
Voice_Training_Materials:
  Standard_Tier_Training:
    - Professional business communication principles
    - McKinsey/HBR basic voice standards
    - Anti-pattern recognition and elimination
    - Strategic clarity fundamentals

  Premium_Tier_Training:
    - Banking-level communication standards
    - Constitutional framework language requirements
    - Executive strategic communication
    - Multi-expert coordination voice protocols

  Real_Time_Training:
    - Interactive voice enhancement suggestions
    - Section-specific guidance during writing
    - Professional authority strengthening exercises
    - Strategic clarity improvement workflows
```

#### **Automation Tool Training**
```yaml
Tool_Integration_Training:
  Voice_Calibration_Engine:
    - Real-time voice assessment interpretation
    - Tier threshold compliance monitoring
    - Professional enhancement suggestion utilization
    - Constitutional framework integration (Premium)

  Editorial_Automation_Integration:
    - Voice quality gate navigation
    - Automated suggestion implementation
    - Tier escalation trigger recognition
    - Quality assurance workflow integration
```

---

**VOICE CONSISTENCY AUTOMATION STATUS**: Production ready with ORGA-091 automation integration  
**MCKINSEY/HBR STANDARDS**: Automated calibration and real-time enhancement operational  
**TIER-SPECIFIC REQUIREMENTS**: Standard (≥50%) and Premium (≥70%) thresholds automated  
**CONSTITUTIONAL INTEGRATION**: Banking-level communication standards for Premium tier active

© 2026 FolkUp — Voice Consistency Automation Guidelines v1.0