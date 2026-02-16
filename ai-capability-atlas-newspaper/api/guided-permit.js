const GuidedQuestionEngine = require('../lib/GuidedQuestionEngine');
const PermitDatabase = require('../lib/PermitDatabase');
const EngineeringDetector = require('../lib/EngineeringDetector');
const CostEstimator = require('../lib/CostEstimator');
const AnswerGenerator = require('../lib/AnswerGenerator');
const PermitService = require('../permitService');

// Load data files
const questionTrees = require('../data/question-trees.json');
const permitPortals = require('../data/permit-portals.json');
const engineeringRules = require('../data/engineering-rules.json');

// Initialize services
const permitDB = new PermitDatabase(permitPortals);
const engineeringDetector = new EngineeringDetector(engineeringRules);
const costEstimator = new CostEstimator();

// In-memory session storage (for serverless, use Redis in production)
const sessions = new Map();

// Clean up old sessions periodically
setInterval(() => {
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  for (const [id, session] of sessions.entries()) {
    if (session.startedAt < oneHourAgo) {
      sessions.delete(id);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action, sessionId, projectType, answer, questionId, location } = req.body || {};

  try {
    // START: Initialize new session
    if (action === 'start' && req.method === 'POST') {
      return await handleStart(req, res, projectType, location);
    }

    // ANSWER: Submit answer and get next question
    if (action === 'answer' && req.method === 'POST') {
      return await handleAnswer(req, res, sessionId, questionId, answer);
    }

    // BACK: Go back to previous question
    if (action === 'back' && req.method === 'POST') {
      return await handleBack(req, res, sessionId, questionId);
    }

    // REVIEW: Get summary of all answers
    if (action === 'review' && req.method === 'GET') {
      return await handleReview(req, res);
    }

    // Invalid action
    return res.status(400).json({ error: 'Invalid action' });

  } catch (error) {
    console.error('[Guided Permit] Error:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Failed to process guided permit request'
    });
  }
};

/**
 * Handle START action - initialize new session
 */
async function handleStart(req, res, projectType, location) {
  if (!projectType || !location) {
    return res.status(400).json({ 
      error: 'Missing required fields: projectType, location' 
    });
  }

  if (!questionTrees[projectType]) {
    return res.status(400).json({ 
      error: `Invalid project type: ${projectType}` 
    });
  }

  const newSessionId = generateSessionId();
  const engine = new GuidedQuestionEngine(projectType, questionTrees);
  
  sessions.set(newSessionId, {
    engine,
    projectType,
    location,
    startedAt: Date.now()
  });

  const firstQuestion = engine.getNextQuestion();
  
  return res.status(200).json({
    sessionId: newSessionId,
    projectType,
    projectName: questionTrees[projectType].name,
    projectIcon: questionTrees[projectType].icon,
    ...firstQuestion
  });
}

/**
 * Handle ANSWER action - submit answer and get next question
 */
async function handleAnswer(req, res, sessionId, questionId, answer) {
  if (!sessionId || !questionId || answer === undefined) {
    return res.status(400).json({ 
      error: 'Missing required fields: sessionId, questionId, answer' 
    });
  }

  const session = sessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found or expired' });
  }

  const { engine } = session;

  // Validate answer
  const validation = engine.validateAnswer(questionId, answer);
  if (!validation.valid) {
    return res.status(400).json({ 
      error: validation.error,
      questionId
    });
  }

  // Record answer
  const nextQuestion = engine.answerQuestion(questionId, answer);
  
  if (nextQuestion) {
    // More questions remain
    return res.status(200).json({
      hasMore: true,
      ...nextQuestion
    });
  } else {
    // All questions answered - generate result
    const result = await generatePermitResult(
      engine,
      session.location,
      permitDB,
      engineeringDetector,
      costEstimator
    );
    
    // Clean up session
    sessions.delete(sessionId);
    
    return res.status(200).json({
      hasMore: false,
      complete: true,
      result
    });
  }
}

/**
 * Handle BACK action - go back to previous question
 */
async function handleBack(req, res, sessionId, questionId) {
  if (!sessionId || !questionId) {
    return res.status(400).json({ 
      error: 'Missing required fields: sessionId, questionId' 
    });
  }

  const session = sessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const result = session.engine.goBackToQuestion(questionId);
  
  return res.status(200).json(result);
}

/**
 * Handle REVIEW action - get summary of answers
 */
async function handleReview(req, res) {
  const urlSessionId = new URL(req.url, `http://${req.headers.host}`).searchParams.get('sessionId');
  
  if (!urlSessionId) {
    return res.status(400).json({ error: 'Missing sessionId parameter' });
  }

  const session = sessions.get(urlSessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const summary = session.engine.getReviewSummary();
  
  return res.status(200).json({
    projectType: session.projectType,
    location: session.location,
    answers: summary
  });
}

/**
 * Generate final permit result from answers
 */
async function generatePermitResult(engine, location, permitDB, engineeringDetector, costEstimator) {
  const summary = engine.getSummary();
  const projectType = summary.projectType;
  const answers = summary.answers;

  // Determine permit level (0-3)
  const permitLevel = determinePermitLevel(projectType, answers);

  // Get portal information
  const portalData = permitDB.getPortal(location);

  // Check engineering requirements
  const engineeringResult = engineeringDetector.isRequired(projectType, answers, location);
  const engineeringExplanation = engineeringDetector.explainRequirement(engineeringResult, location);

  // Get cost estimates
  const permitFee = permitDB.getFeeEstimate(location, projectType, permitLevel);
  const engineeringCost = engineeringDetector.getCostEstimate(engineeringResult);
  const totalCost = costEstimator.calculateTotal(permitFee, engineeringCost);

  // Get timeline estimates
  const reviewTimeline = permitDB.getReviewTimeline(location, permitLevel);
  const engineeringTimeline = engineeringDetector.getEngineeringTimeline(engineeringResult);
  const totalTimeline = costEstimator.calculateTimeline(reviewTimeline, engineeringTimeline);

  // Get contact info
  const contact = permitDB.getContactInfo(location);

  // Generate AI-enhanced answer
  let aiAnswer = null;
  if (process.env.OPENAI_API_KEY) {
    try {
      const permitService = new PermitService(process.env.OPENAI_API_KEY);
      const answerGenerator = new AnswerGenerator(permitService.openai);
      
      aiAnswer = await answerGenerator.generateAnswer({
        summary,
        location,
        permitLevel,
        portalData,
        engineeringExplanation,
        permitFee,
        reviewTimeline,
        engineeringCost
      });
    } catch (error) {
      console.error('[AI Answer] Error:', error);
    }
  }

  return {
    permitNeeded: permitLevel > 0,
    permitLevel,
    permitLevelName: getPermitLevelName(permitLevel),
    projectType,
    projectName: summary.projectName,
    answers: engine.getReviewSummary(),
    
    jurisdiction: {
      type: portalData.type,
      name: portalData.jurisdiction || location.county,
      state: location.state,
      fullAddress: location.fullAddress
    },
    
    portal: portalData.found ? {
      mainUrl: portalData.portal.portal.main,
      applyUrl: portalData.portal.portal.main,
      formsUrl: portalData.portal.portal.forms,
      searchUrl: portalData.portal.portal.permitSearch,
      name: portalData.portal.name
    } : {
      searchUrl: portalData.searchUrl,
      note: 'Direct portal link not available. Click to search for your jurisdiction.'
    },
    
    engineering: {
      required: engineeringResult.required,
      ...engineeringExplanation
    },
    
    cost: {
      permit: permitFee,
      engineering: engineeringCost,
      total: totalCost
    },
    
    timeline: {
      review: reviewTimeline,
      engineering: engineeringTimeline,
      total: totalTimeline
    },
    
    contact: contact,
    
    aiAnswer: aiAnswer ? aiAnswer.answer : generateBasicAnswer(summary, permitLevel, portalData, engineeringExplanation),
    
    nextSteps: generateNextSteps(
      permitLevel,
      portalData,
      engineeringResult,
      engineeringExplanation,
      location
    ),
    
    timestamp: new Date().toISOString()
  };
}

/**
 * Determine permit level from answers
 */
function determinePermitLevel(projectType, answers) {
  // Hot water heater logic
  if (projectType === 'hot-water-heater') {
    if (answers.replacement === 'yes' && 
        answers['same-location'] === 'yes' &&
        (answers['fuel-type'] === 'same-gas' || answers['fuel-type'] === 'same-electric') &&
        answers.capacity === 'same-smaller') {
      return 1; // Express
    }
    return 2; // Standard if any changes
  }

  // Bathroom remodel logic
  if (projectType === 'bathroom-remodel') {
    if (answers.scope && answers.scope.length === 1 && answers.scope[0] === 'cosmetic') {
      return 0; // No permit
    }
    if (answers.scope && answers.scope.includes('expanding')) {
      return 3; // Complex (addition)
    }
    if (answers['wall-type'] === 'yes' || answers['wall-type'] === 'unknown') {
      return 3; // Complex (engineering required)
    }
    return 2; // Standard
  }

  // Deck logic
  if (projectType === 'deck') {
    if (answers['second-floor'] === 'yes' || answers.height === 'over-72') {
      return 3; // Complex
    }
    if (answers.size >= 200 || answers.height === '30-72') {
      return 2; // Standard
    }
    return 1; // Simple
  }

  // Fence logic
  if (projectType === 'fence') {
    if (answers.retaining === 'yes') {
      return 3; // Complex (retaining wall)
    }
    if (answers.height > 6) {
      return 1; // Simple permit
    }
    return 0; // Usually no permit
  }

  // HVAC logic
  if (projectType === 'hvac-replacement') {
    if (answers['same-capacity'] === 'yes' && 
        answers['same-location'] === 'yes' && 
        answers.ductwork === 'no') {
      return 1; // Express
    }
    return 2; // Standard
  }

  // Default
  return 2;
}

/**
 * Get permit level name
 */
function getPermitLevelName(level) {
  const names = {
    0: 'No Permit Required',
    1: 'Express Permit',
    2: 'Standard Permit',
    3: 'Complex Permit'
  };
  return names[level] || 'Unknown';
}

/**
 * Generate basic answer without AI
 */
function generateBasicAnswer(summary, permitLevel, portalData, engineeringExplanation) {
  if (permitLevel === 0) {
    return `✅ **Good news! No permit required** for your ${summary.projectName} project.\n\nYou can proceed without a building permit. However, make sure to follow any zoning regulations that may apply.`;
  }

  const permitName = getPermitLevelName(permitLevel);
  const engineeringText = engineeringExplanation.title.includes('Required')
    ? `\n\n🔧 **${engineeringExplanation.title}**\n${engineeringExplanation.message}` 
    : '';

  return `📋 **${permitName} Required**\n\nFor your ${summary.projectName} project, you need a ${permitName}.${engineeringText}\n\n${portalData.found ? `**Apply:** ${portalData.portal.portal.main}\n**Contact:** ${portalData.portal.contact.phone || 'See portal'}` : '**Contact your local building department.**'}`;
}

/**
 * Generate next steps
 */
function generateNextSteps(permitLevel, portalData, engineeringResult, engineeringExplanation, location) {
  const steps = [];

  if (permitLevel === 0) {
    return [{
      step: 1,
      action: 'No permit needed!',
      detail: 'You can start your project',
      icon: '✅'
    }];
  }

  if (engineeringResult.required && engineeringExplanation.nextSteps) {
    return engineeringExplanation.nextSteps;
  }

  if (portalData.found) {
    steps.push({
      step: 1,
      action: 'Create account on permit portal',
      detail: portalData.portal.name,
      link: portalData.portal.portal.main,
      icon: '👤'
    });

    steps.push({
      step: 2,
      action: 'Gather required documents',
      detail: 'Plans, surveys, forms',
      icon: '📄'
    });

    steps.push({
      step: 3,
      action: 'Submit application online',
      detail: 'Upload documents and pay fee',
      link: portalData.portal.portal.main,
      icon: '📤'
    });

    steps.push({
      step: 4,
      action: 'Wait for review',
      detail: 'Check portal for updates',
      icon: '⏰'
    });

    steps.push({
      step: 5,
      action: 'Schedule inspections',
      detail: portalData.portal.contact.inspections || 'Call building department',
      icon: '🔍'
    });
  } else {
    steps.push({
      step: 1,
      action: 'Contact local building department',
      detail: `${location.city || location.county} Building Services`,
      link: portalData.searchUrl,
      icon: '📞'
    });
  }

  return steps;
}

/**
 * Generate unique session ID
 */
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
