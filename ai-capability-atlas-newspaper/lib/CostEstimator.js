/**
 * CostEstimator
 * Calculate total project costs including permits and engineering
 */
class CostEstimator {
  /**
   * Calculate total cost estimate
   */
  calculateTotal(permitFee, engineeringCost) {
    if (!permitFee && !engineeringCost) return null;

    const permitMin = permitFee?.min || permitFee?.amount || 0;
    const permitMax = permitFee?.max || permitFee?.amount || 0;
    const engMin = engineeringCost?.min || engineeringCost?.amount || 0;
    const engMax = engineeringCost?.max || engineeringCost?.amount || 0;

    return {
      min: permitMin + engMin,
      max: permitMax + engMax,
      formatted: `$${(permitMin + engMin).toLocaleString()} - $${(permitMax + engMax).toLocaleString()}`,
      breakdown: {
        permit: {
          min: permitMin,
          max: permitMax,
          formatted: permitMin === permitMax 
            ? `$${permitMin.toLocaleString()}` 
            : `$${permitMin.toLocaleString()} - $${permitMax.toLocaleString()}`
        },
        engineering: engineeringCost ? {
          min: engMin,
          max: engMax,
          formatted: engMin === engMax 
            ? `$${engMin.toLocaleString()}` 
            : `$${engMin.toLocaleString()} - $${engMax.toLocaleString()}`
        } : null
      }
    };
  }

  /**
   * Calculate total timeline
   */
  calculateTimeline(reviewTimeline, engineeringTimeline) {
    const reviewDays = reviewTimeline?.days || 0;
    const engWeeks = engineeringTimeline?.weeks || 0;
    const engDays = engWeeks * 7;

    const totalDays = reviewDays + engDays;
    const totalWeeks = Math.ceil(totalDays / 7);

    return {
      days: totalDays,
      weeks: totalWeeks,
      formatted: totalWeeks === 0 ? 'Same day' : `${totalWeeks} week${totalWeeks > 1 ? 's' : ''}`,
      breakdown: {
        engineering: engineeringTimeline ? `${engWeeks} week${engWeeks > 1 ? 's' : ''}` : null,
        review: reviewTimeline ? reviewTimeline.target : null
      }
    };
  }

  /**
   * Format currency
   */
  formatCurrency(amount) {
    return `$${amount.toLocaleString()}`;
  }
}

module.exports = CostEstimator;
