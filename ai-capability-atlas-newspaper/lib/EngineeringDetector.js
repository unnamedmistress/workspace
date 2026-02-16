/**
 * EngineeringDetector
 * Determines if engineering is required based on project details
 */
class EngineeringDetector {
  constructor(engineeringRules) {
    this.rules = engineeringRules;
  }

  /**
   * Main method to determine if engineering is required
   */
  isRequired(projectType, answers, location) {
    const state = location.stateShort;
    const county = location.county;

    // Check global always-required triggers
    const globalCheck = this.checkGlobalRules(answers);
    if (globalCheck.required) {
      return globalCheck;
    }

    // Check state-specific rules
    const stateRules = this.rules.byState[state];
    if (!stateRules) {
      return {
        required: false,
        confidence: 'low',
        note: 'No specific rules for this state. Contact local building department.'
      };
    }

    // Check project-specific rules
    const projectRules = stateRules.byProject[projectType];
    if (projectRules && projectRules.engineeringRequired === true) {
      return {
        required: true,
        reason: projectRules.reason,
        requirements: projectRules.requirements || [],
        cost: projectRules.engineeringCost,
        confidence: 'high'
      };
    }

    // Check detailed rules based on answers
    if (projectRules && projectRules.rules) {
      const rulesCheck = this.evaluateProjectRules(projectRules.rules, answers);
      if (rulesCheck) {
        return {
          ...rulesCheck,
          cost: projectRules.engineeringCost
        };
      }
    }

    // Check triggers (for remodels, etc.)
    if (projectRules && projectRules.triggers) {
      const triggerCheck = this.checkTriggers(projectRules.triggers, answers);
      if (triggerCheck.required) {
        return {
          ...triggerCheck,
          cost: projectRules.engineeringCost[triggerCheck.costKey] || projectRules.engineeringCost
        };
      }
    }

    // Check county-specific rules
    if (stateRules.byCounty && stateRules.byCounty[county]) {
      const countyCheck = this.checkCountyRules(stateRules.byCounty[county], answers);
      if (countyCheck.required) {
        return countyCheck;
      }
    }

    // Default: not required
    return {
      required: false,
      confidence: 'high',
      note: 'Based on the information provided, engineering is not required.'
    };
  }

  /**
   * Check global always-required rules
   */
  checkGlobalRules(answers) {
    const alwaysRequired = this.rules.global.alwaysRequired || [];
    
    // Check for keywords in answers
    const answerString = JSON.stringify(answers).toLowerCase();
    for (const keyword of alwaysRequired) {
      if (answerString.includes(keyword.toLowerCase())) {
        return {
          required: true,
          reason: `${keyword} always requires engineering`,
          confidence: 'high'
        };
      }
    }

    return { required: false };
  }

  /**
   * Evaluate project-specific rules
   */
  evaluateProjectRules(rules, answers) {
    // Deck example
    if (answers.height === 'over-72' && rules.over30OrOver200Attached) {
      return {
        required: true,
        reason: rules.over30OrOver200Attached.reason,
        confidence: 'high'
      };
    }

    if (answers['second-floor'] === 'yes' && rules.secondFloor) {
      return {
        required: true,
        reason: rules.secondFloor.reason,
        confidence: 'high'
      };
    }

    if (answers.size >= 200 && answers.attached === 'yes' && rules.over30OrOver200Attached) {
      return {
        required: true,
        reason: rules.over30OrOver200Attached.reason,
        confidence: 'medium'
      };
    }

    // Fence retaining wall check
    if (answers.retaining === 'yes' && rules.retaining) {
      return {
        required: true,
        reason: rules.retaining.reason,
        confidence: 'high'
      };
    }

    return null;
  }

  /**
   * Check engineering triggers (for remodels)
   */
  checkTriggers(triggers, answers) {
    // Check load-bearing wall removal
    if (answers['wall-type'] === 'yes' && triggers.loadBearingWallRemoval) {
      return {
        required: true,
        reason: triggers.loadBearingWallRemoval.reason,
        confidence: 'high',
        costKey: 'beamCalculations'
      };
    }

    if (answers['wall-type'] === 'unknown' && triggers.unknownWallType) {
      return {
        required: true,
        engineeringType: 'assessment',
        reason: triggers.unknownWallType.reason,
        confidence: 'medium',
        costKey: 'assessment'
      };
    }

    // Check footprint expansion
    if (answers.scope && answers.scope.includes('expanding') && triggers.expandingFootprint) {
      return {
        required: true,
        reason: triggers.expandingFootprint.reason,
        confidence: 'high',
        costKey: 'fullAddition'
      };
    }

    return { required: false };
  }

  /**
   * Check county-specific rules
   */
  checkCountyRules(countyRules, answers) {
    if (countyRules.specificRules) {
      // Example: Pinellas County opening rule
      if (countyRules.specificRules.openings) {
        const openingRule = countyRules.specificRules.openings;
        // This would need specific logic based on plans
        // For now, just note it as a requirement
        return {
          required: false,
          note: `Note: ${openingRule.reason}`
        };
      }
    }

    return { required: false };
  }

  /**
   * Get engineering cost estimate
   */
  getCostEstimate(engineeringResult) {
    if (!engineeringResult.required || !engineeringResult.cost) {
      return null;
    }

    const cost = engineeringResult.cost;
    
    if (typeof cost === 'number') {
      return {
        amount: cost,
        type: 'fixed',
        formatted: `$${cost.toLocaleString()}`
      };
    }

    if (cost.min && cost.max) {
      return {
        min: cost.min,
        max: cost.max,
        typical: cost.typical || Math.round((cost.min + cost.max) / 2),
        type: 'range',
        formatted: `$${cost.min.toLocaleString()} - $${cost.max.toLocaleString()}`,
        typicalFormatted: cost.typical ? `$${cost.typical.toLocaleString()}` : null
      };
    }

    return null;
  }

  /**
   * Get timeline estimate for engineering
   */
  getEngineeringTimeline(engineeringResult) {
    if (!engineeringResult.required) {
      return null;
    }

    const type = engineeringResult.engineeringType || 'full';
    
    const timelines = {
      assessment: {
        weeks: 1,
        description: '1 week for engineer site visit and assessment'
      },
      beamCalculations: {
        weeks: 2,
        description: '1-2 weeks for beam calculations and sealed plans'
      },
      full: {
        weeks: 3,
        description: '2-3 weeks for complete structural engineering'
      }
    };

    return timelines[type] || timelines.full;
  }

  /**
   * Generate explanation for user
   */
  explainRequirement(engineeringResult, location) {
    if (!engineeringResult.required) {
      return {
        title: '✅ Engineering Not Required',
        message: 'Based on your project details, a licensed engineer is not needed.',
        explanation: 'You can proceed with standard permit application.',
        nextSteps: []
      };
    }

    const costEstimate = this.getCostEstimate(engineeringResult);
    const timeline = this.getEngineeringTimeline(engineeringResult);

    return {
      title: '🔧 Licensed Engineer Required',
      message: engineeringResult.reason,
      explanation: `A licensed structural engineer must review your project, perform calculations, and create stamped/sealed drawings. This is required by ${location.city || location.county} building code.`,
      requirements: engineeringResult.requirements || [
        'Site visit and assessment',
        'Structural calculations',
        'Sealed engineering drawings',
        'Submission with permit application'
      ],
      cost: costEstimate,
      timeline: timeline,
      nextSteps: [
        {
          step: 1,
          action: `Hire licensed structural engineer`,
          detail: costEstimate ? costEstimate.formatted : '$500-3,000',
          tip: 'Look for engineers with residential experience in your area'
        },
        {
          step: 2,
          action: 'Engineer site visit and plans review',
          detail: timeline ? `${timeline.weeks} week(s)` : '1-3 weeks'
        },
        {
          step: 3,
          action: 'Receive sealed engineering drawings',
          detail: 'Engineer stamps and signs plans'
        },
        {
          step: 4,
          action: 'Submit engineered plans with permit',
          detail: 'Include engineering with permit application'
        }
      ],
      findEngineer: {
        searchQuery: `structural engineer ${location.city || location.county} ${location.stateShort}`,
        searchUrl: `https://www.google.com/search?q=${encodeURIComponent(`structural engineer ${location.city || location.county} ${location.stateShort}`)}`
      }
    };
  }
}

module.exports = EngineeringDetector;
