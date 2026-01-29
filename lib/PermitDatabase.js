/**
 * PermitDatabase
 * Access permit portal data and jurisdiction information
 */
class PermitDatabase {
  constructor(permitPortals) {
    this.portals = permitPortals;
  }

  /**
   * Get permit portal for a location
   */
  getPortal(location) {
    const state = location.stateShort;
    const jurisdiction = location.likelyCityLimits ? location.city : location.county;
    
    // Check state exists
    if (!this.portals[state]) {
      return {
        found: false,
        reason: 'state-not-found',
        searchUrl: this.generateSearchUrl(location)
      };
    }

    // Check if city has its own portal (priority)
    if (location.likelyCityLimits && this.portals[state][location.city]) {
      return {
        found: true,
        type: 'city',
        jurisdiction: location.city,
        portal: this.portals[state][location.city],
        source: 'database'
      };
    }

    // Check county portal
    if (this.portals[state][location.county]) {
      const countyPortal = this.portals[state][location.county];
      
      // Check if city is served by county
      if (location.likelyCityLimits && countyPortal.serviceAreas) {
        if (countyPortal.serviceAreas.includes(location.city)) {
          return {
            found: true,
            type: 'county-services-city',
            jurisdiction: location.county,
            city: location.city,
            portal: countyPortal,
            note: `${location.city} building permits are handled by ${location.county}`,
            source: 'database'
          };
        } else {
          return {
            found: false,
            reason: 'city-not-in-county-service-area',
            possiblePortal: countyPortal,
            note: `${location.city} may have its own permit portal. Please verify.`,
            searchUrl: this.generateSearchUrl(location)
          };
        }
      }

      // Unincorporated area
      return {
        found: true,
        type: 'county',
        jurisdiction: location.county,
        portal: countyPortal,
        source: 'database'
      };
    }

    // No portal found
    return {
      found: false,
      reason: 'jurisdiction-not-found',
      searchUrl: this.generateSearchUrl(location)
    };
  }

  /**
   * Generate search URL for unknown jurisdictions
   */
  generateSearchUrl(location) {
    const jurisdiction = location.likelyCityLimits ? location.city : location.county;
    const query = `${jurisdiction} ${location.stateShort} building permit application`;
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  }

  /**
   * Get permit type info for a jurisdiction
   */
  getPermitTypeInfo(location, permitLevel) {
    const portalData = this.getPortal(location);
    if (!portalData.found || !portalData.portal.permitTypes) {
      return null;
    }

    const permitTypes = portalData.portal.permitTypes;
    
    switch (permitLevel) {
      case 0:
        return null; // No permit needed
      case 1:
        return permitTypes.express || null;
      case 2:
      case 3:
        return permitTypes.residential || permitTypes.commercial || null;
      default:
        return null;
    }
  }

  /**
   * Get fee estimate for a project
   */
  getFeeEstimate(location, projectType, permitLevel) {
    const portalData = this.getPortal(location);
    if (!portalData.found || !portalData.portal.fees) {
      return null;
    }

    const fees = portalData.portal.fees;
    
    // Try to get specific project fee
    if (fees.express && fees.express[projectType]) {
      return {
        amount: fees.express[projectType],
        type: 'fixed',
        category: 'express'
      };
    }

    if (fees.residential && fees.residential[projectType]) {
      return {
        min: fees.residential[projectType].min,
        max: fees.residential[projectType].max,
        type: 'range',
        category: 'residential'
      };
    }

    // Fallback to general ranges
    if (permitLevel === 1 && fees.express) {
      return {
        min: 75,
        max: 200,
        type: 'range',
        category: 'express',
        note: 'Typical express permit range'
      };
    }

    if ((permitLevel === 2 || permitLevel === 3) && fees.residential) {
      return {
        min: 300,
        max: 3000,
        type: 'range',
        category: 'residential',
        note: 'Varies by project scope'
      };
    }

    return null;
  }

  /**
   * Get review timeline estimate
   */
  getReviewTimeline(location, permitLevel) {
    const portalData = this.getPortal(location);
    if (!portalData.found || !portalData.portal.reviewTimes) {
      return null;
    }

    const times = portalData.portal.reviewTimes;
    
    switch (permitLevel) {
      case 1:
        return times.express || { target: 'same-day', days: 0 };
      case 2:
        return times.residentialSimple || times.commercial || { target: '2-3 weeks', days: 14 };
      case 3:
        return times.residentialComplex || times.commercial || { target: '3-4 weeks', days: 21 };
      default:
        return null;
    }
  }

  /**
   * Get contact information
   */
  getContactInfo(location) {
    const portalData = this.getPortal(location);
    if (!portalData.found || !portalData.portal.contact) {
      return null;
    }

    return portalData.portal.contact;
  }

  /**
   * Get special requirements for a jurisdiction
   */
  getSpecialRequirements(location) {
    const portalData = this.getPortal(location);
    if (!portalData.found || !portalData.portal.specialRequirements) {
      return {};
    }

    return portalData.portal.specialRequirements;
  }
}

module.exports = PermitDatabase;
