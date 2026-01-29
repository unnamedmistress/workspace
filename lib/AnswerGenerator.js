/**
 * AnswerGenerator
 * Generate enhanced AI answers with guided context
 */
class AnswerGenerator {
  constructor(openaiClient) {
    this.openai = openaiClient;
  }

  /**
   * Generate comprehensive permit answer
   */
  async generateAnswer(context) {
    const {
      summary,
      location,
      permitLevel,
      portalData,
      engineeringExplanation,
      permitFee,
      reviewTimeline,
      engineeringCost
    } = context;

    const systemPrompt = this.buildSystemPrompt(context);
    const userPrompt = 'Based on my answers, what do I need to do to get my permit?';

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 1500
      });

      return {
        answer: response.choices[0].message.content,
        model: 'gpt-4o-mini',
        tokens: response.usage.total_tokens
      };
    } catch (error) {
      console.error('[AI Answer] Error:', error);
      return {
        answer: this.generateFallbackAnswer(context),
        model: 'fallback',
        error: error.message
      };
    }
  }

  /**
   * Build enhanced system prompt with all context
   */
  buildSystemPrompt(context) {
    const {
      summary,
      location,
      permitLevel,
      portalData,
      engineeringExplanation,
      permitFee,
      reviewTimeline
    } = context;

    const permitLevelNames = {
      0: 'No Permit Required',
      1: 'Express Permit',
      2: 'Standard Permit',
      3: 'Complex Permit with Engineering'
    };

    return `You are a building permit expert. Provide clear, actionable guidance.

PROJECT: ${summary.projectName}
ANSWERS: ${JSON.stringify(summary.answers, null, 2)}

LOCATION: ${location.fullAddress}
JURISDICTION: ${portalData.jurisdiction || location.county}
STATE: ${location.state}

PERMIT LEVEL: ${permitLevelNames[permitLevel]}
${permitLevel === 0 ? 'NO PERMIT REQUIRED' : ''}

${portalData.found ? `
APPLY HERE: ${portalData.portal.portal.main}
CONTACT: ${portalData.portal.contact.phone || 'See portal for contact info'}
` : ''}

ENGINEERING: ${engineeringExplanation.title}
${engineeringExplanation.message}

${permitFee ? `COST: $${permitFee.min}-$${permitFee.max}` : 'COST: Contact jurisdiction for fee info'}
${reviewTimeline ? `TIMELINE: ${reviewTimeline.target}` : 'TIMELINE: Contact jurisdiction'}

Provide a clear, friendly answer with:
1. ✅ YES/NO - Do they need a permit?
2. 📋 WHY - Brief explanation
3. 💰 COST - Fee estimate
4. ⏰ TIMELINE - How long it takes
5. 🔧 ENGINEERING - Required? Why? Cost?
6. 📝 NEXT STEPS - Exact actions with links
7. 🔗 WHERE TO APPLY - Direct portal link

Use simple language (4th grade reading level) and emoji. Be specific to ${location.city || location.county}, ${location.stateShort}.`;
  }

  /**
   * Generate fallback answer without AI
   */
  generateFallbackAnswer(context) {
    const { summary, permitLevel, portalData, engineeringExplanation } = context;
    const permitLevelNames = {
      0: 'No Permit Required',
      1: 'Express Permit',
      2: 'Standard Permit',
      3: 'Complex Permit'
    };

    if (permitLevel === 0) {
      return `✅ **Good news! No permit required** for ${summary.projectName}.\n\nYou can proceed with your project without a building permit. However, make sure to follow any zoning regulations that may apply.`;
    }

    const permitName = permitLevelNames[permitLevel];
    const engineeringText = engineeringExplanation.title.includes('Required')
      ? `\n\n🔧 **Engineering Required:** ${engineeringExplanation.message}` 
      : '';

    return `📋 **${permitName} Required**\n\nFor your ${summary.projectName} project, you need to apply for a ${permitName}.${engineeringText}\n\n${portalData.found ? `**Apply here:** ${portalData.portal.portal.main}\n**Contact:** ${portalData.portal.contact.phone || 'See portal'}` : '**Contact your local building department for application details.**'}`;
  }
}

module.exports = AnswerGenerator;
