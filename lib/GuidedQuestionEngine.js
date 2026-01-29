/**
 * GuidedQuestionEngine
 * Manages question flow with conditional logic
 */
class GuidedQuestionEngine {
  constructor(projectType, questionTrees) {
    this.projectType = projectType;
    this.config = questionTrees[projectType];
    if (!this.config) {
      throw new Error(`Project type "${projectType}" not found in question trees`);
    }
    this.answers = {};
    this.questionHistory = [];
    this.currentQuestionIndex = 0;
  }

  /**
   * Get the next question based on current answers
   */
  getNextQuestion() {
    const questions = this.config.questions;
    
    for (let i = this.currentQuestionIndex; i < questions.length; i++) {
      const question = questions[i];
      
      // Check if this question should be shown based on conditions
      if (question.condition && !this.evaluateCondition(question.condition)) {
        continue; // Skip this question
      }
      
      this.currentQuestionIndex = i;
      return {
        question,
        questionNumber: this.questionHistory.length + 1,
        totalQuestions: this.estimateTotalQuestions(),
        progress: this.calculateProgress()
      };
    }
    
    return null; // All questions answered
  }

  /**
   * Evaluate if a condition is met
   */
  evaluateCondition(condition) {
    const { field, equals, contains, notEquals } = condition;
    const answerValue = this.answers[field];
    
    if (equals !== undefined) {
      return answerValue === equals;
    }
    
    if (contains !== undefined) {
      return Array.isArray(answerValue) && answerValue.includes(contains);
    }
    
    if (notEquals !== undefined) {
      return answerValue !== notEquals;
    }
    
    return true;
  }

  /**
   * Record an answer and move to next question
   */
  answerQuestion(questionId, answer) {
    this.answers[questionId] = answer;
    this.questionHistory.push({
      questionId,
      answer,
      timestamp: new Date()
    });
    
    this.currentQuestionIndex++;
    return this.getNextQuestion();
  }

  /**
   * Validate an answer against question requirements
   */
  validateAnswer(questionId, answer) {
    const question = this.config.questions.find(q => q.id === questionId);
    if (!question) {
      return { valid: false, error: 'Question not found' };
    }

    // Check required
    if (question.required && (answer === null || answer === undefined || answer === '')) {
      return { valid: false, error: 'This question is required' };
    }

    // Check validation rules
    if (question.validation) {
      const { min, max, pattern, errorMessage } = question.validation;
      
      if (question.type === 'number') {
        const num = parseFloat(answer);
        if (isNaN(num)) {
          return { valid: false, error: 'Please enter a valid number' };
        }
        if (min !== undefined && num < min) {
          return { valid: false, error: errorMessage || `Minimum value is ${min}` };
        }
        if (max !== undefined && num > max) {
          return { valid: false, error: errorMessage || `Maximum value is ${max}` };
        }
      }
      
      if (pattern && !new RegExp(pattern).test(answer)) {
        return { valid: false, error: errorMessage || 'Invalid format' };
      }
    }

    // Check multi-select min selections
    if (question.type === 'multi-select' && question.minSelections) {
      if (!Array.isArray(answer) || answer.length < question.minSelections) {
        return { 
          valid: false, 
          error: `Please select at least ${question.minSelections} option(s)` 
        };
      }
    }

    return { valid: true };
  }

  /**
   * Calculate current progress percentage
   */
  calculateProgress() {
    const totalEstimated = this.estimateTotalQuestions();
    const current = this.questionHistory.length;
    return Math.round((current / totalEstimated) * 100);
  }

  /**
   * Estimate total questions based on current answers
   */
  estimateTotalQuestions() {
    let total = 0;
    for (const question of this.config.questions) {
      if (!question.condition || this.evaluateCondition(question.condition)) {
        total++;
      }
    }
    return Math.max(total, this.config.questions.length * 0.6); // Estimate at least 60%
  }

  /**
   * Get summary of all answers
   */
  getSummary() {
    return {
      projectType: this.projectType,
      projectName: this.config.name,
      answers: this.answers,
      questionHistory: this.questionHistory,
      timestamp: new Date()
    };
  }

  /**
   * Allow editing previous answer
   */
  goBackToQuestion(questionId) {
    const index = this.questionHistory.findIndex(h => h.questionId === questionId);
    if (index === -1) {
      return { success: false, error: 'Question not found in history' };
    }

    // Remove this and all subsequent answers
    this.questionHistory = this.questionHistory.slice(0, index);
    
    // Rebuild answers object
    this.answers = {};
    for (const entry of this.questionHistory) {
      this.answers[entry.questionId] = entry.answer;
    }

    // Set current index to this question
    this.currentQuestionIndex = this.config.questions.findIndex(q => q.id === questionId);
    
    return { success: true, question: this.getNextQuestion() };
  }

  /**
   * Get all questions and answers for review
   */
  getReviewSummary() {
    return this.questionHistory.map(entry => {
      const question = this.config.questions.find(q => q.id === entry.questionId);
      return {
        question: question.text,
        answer: this.formatAnswer(entry.answer, question),
        questionId: entry.questionId
      };
    });
  }

  /**
   * Format answer for display
   */
  formatAnswer(answer, question) {
    if (question.type === 'yes-no') {
      return answer === 'yes' ? 'Yes' : 'No';
    }
    
    if (question.type === 'select') {
      const option = question.options.find(opt => opt.value === answer);
      return option ? option.label : answer;
    }
    
    if (question.type === 'multi-select') {
      return answer.map(val => {
        const option = question.options.find(opt => opt.value === val);
        return option ? option.label : val;
      }).join(', ');
    }
    
    if (question.type === 'number' && question.unit) {
      return `${answer} ${question.unit}`;
    }
    
    return answer;
  }
}

module.exports = GuidedQuestionEngine;
