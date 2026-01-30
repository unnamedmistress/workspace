/**
 * Permit Fee Information for Pinellas County Jurisdictions
 * Based on published fee schedules (as of January 2026)
 * 
 * Note: These are estimates. Always verify with the jurisdiction.
 */

import { JobType } from "@/types";

export interface PermitFee {
  jurisdictionId: string;
  jurisdictionName: string;
  jobType: JobType;
  feeStructure: "flat" | "percentage" | "tiered";
  baselineRange: {
    min: number;
    max: number;
    notes: string;
  };
  calculator?: {
    formula: string; // e.g., "project_value * 0.015"
    description: string;
  };
  officialScheduleUrl: string;
  lastUpdated: string;
}

export const PERMIT_FEES: PermitFee[] = [
  // St. Petersburg
  {
    jurisdictionId: "st-petersburg",
    jurisdictionName: "St. Petersburg",
    jobType: "AC_HVAC_CHANGEOUT",
    feeStructure: "flat",
    baselineRange: {
      min: 150,
      max: 250,
      notes: "Typical for residential HVAC changeout"
    },
    officialScheduleUrl: "https://www.stpete.org/government/development_services/building_construction_services/building_permits.php",
    lastUpdated: "2026-01-30"
  },
  {
    jurisdictionId: "st-petersburg",
    jurisdictionName: "St. Petersburg",
    jobType: "RE_ROOFING",
    feeStructure: "tiered",
    baselineRange: {
      min: 200,
      max: 500,
      notes: "Based on square footage and project value"
    },
    calculator: {
      formula: "Math.max(200, project_value * 0.012)",
      description: "Greater of $200 or 1.2% of project value"
    },
    officialScheduleUrl: "https://www.stpete.org/government/development_services/building_construction_services/building_permits.php",
    lastUpdated: "2026-01-30"
  },
  {
    jurisdictionId: "st-petersburg",
    jurisdictionName: "St. Petersburg",
    jobType: "ELECTRICAL_PANEL",
    feeStructure: "flat",
    baselineRange: {
      min: 100,
      max: 200,
      notes: "Residential panel upgrade"
    },
    officialScheduleUrl: "https://www.stpete.org/government/development_services/building_construction_services/building_permits.php",
    lastUpdated: "2026-01-30"
  },
  {
    jurisdictionId: "st-petersburg",
    jurisdictionName: "St. Petersburg",
    jobType: "WATER_HEATER",
    feeStructure: "flat",
    baselineRange: {
      min: 75,
      max: 150,
      notes: "Standard residential water heater replacement"
    },
    officialScheduleUrl: "https://www.stpete.org/government/development_services/building_construction_services/building_permits.php",
    lastUpdated: "2026-01-30"
  },
  {
    jurisdictionId: "st-petersburg",
    jurisdictionName: "St. Petersburg",
    jobType: "SMALL_BATH_REMODEL",
    feeStructure: "percentage",
    baselineRange: {
      min: 150,
      max: 800,
      notes: "Depends on scope - plumbing, electrical, structural permits"
    },
    calculator: {
      formula: "project_value * 0.015",
      description: "Approximately 1.5% of project value"
    },
    officialScheduleUrl: "https://www.stpete.org/government/development_services/building_construction_services/building_permits.php",
    lastUpdated: "2026-01-30"
  },
  
  // Clearwater (also serves Largo, Safety Harbor, Belleair)
  {
    jurisdictionId: "clearwater",
    jurisdictionName: "Clearwater",
    jobType: "AC_HVAC_CHANGEOUT",
    feeStructure: "flat",
    baselineRange: {
      min: 125,
      max: 225,
      notes: "Residential HVAC permit"
    },
    officialScheduleUrl: "https://www.myclearwater.com/government/departments/planning-development/building-permits-fees",
    lastUpdated: "2026-01-30"
  },
  {
    jurisdictionId: "clearwater",
    jurisdictionName: "Clearwater",
    jobType: "RE_ROOFING",
    feeStructure: "tiered",
    baselineRange: {
      min: 175,
      max: 450,
      notes: "Based on square footage"
    },
    calculator: {
      formula: "150 + (sq_ft / 100) * 10",
      description: "$150 base + $10 per 100 sq ft"
    },
    officialScheduleUrl: "https://www.myclearwater.com/government/departments/planning-development/building-permits-fees",
    lastUpdated: "2026-01-30"
  },
  {
    jurisdictionId: "clearwater",
    jurisdictionName: "Clearwater",
    jobType: "DECK_INSTALLATION",
    feeStructure: "tiered",
    baselineRange: {
      min: 200,
      max: 400,
      notes: "Includes plan review and inspections"
    },
    officialScheduleUrl: "https://www.myclearwater.com/government/departments/planning-development/building-permits-fees",
    lastUpdated: "2026-01-30"
  },
  
  // Pinellas County (unincorporated)
  {
    jurisdictionId: "pinellas-county",
    jurisdictionName: "Pinellas County",
    jobType: "AC_HVAC_CHANGEOUT",
    feeStructure: "flat",
    baselineRange: {
      min: 140,
      max: 240,
      notes: "Residential mechanical permit"
    },
    officialScheduleUrl: "https://pinellas.gov/permits-and-inspections/building-permits/",
    lastUpdated: "2026-01-30"
  },
  {
    jurisdictionId: "pinellas-county",
    jurisdictionName: "Pinellas County",
    jobType: "RE_ROOFING",
    feeStructure: "tiered",
    baselineRange: {
      min: 190,
      max: 475,
      notes: "Varies by square footage and type"
    },
    calculator: {
      formula: "project_value * 0.013",
      description: "Approximately 1.3% of project value"
    },
    officialScheduleUrl: "https://pinellas.gov/permits-and-inspections/building-permits/",
    lastUpdated: "2026-01-30"
  },
  {
    jurisdictionId: "pinellas-county",
    jurisdictionName: "Pinellas County",
    jobType: "POOL_BARRIER",
    feeStructure: "flat",
    baselineRange: {
      min: 150,
      max: 300,
      notes: "Pool safety barrier permit"
    },
    officialScheduleUrl: "https://pinellas.gov/permits-and-inspections/building-permits/",
    lastUpdated: "2026-01-30"
  },
];

/**
 * Get fee estimate for a specific job type and jurisdiction
 */
export function getPermitFeeEstimate(
  jobType: JobType,
  jurisdictionId: string,
  projectValue?: number,
  squareFeet?: number
): { min: number; max: number; calculated?: number; formula?: string } | null {
  const feeInfo = PERMIT_FEES.find(
    f => f.jobType === jobType && f.jurisdictionId === jurisdictionId
  );
  
  if (!feeInfo) {
    // Return generic estimate if no specific data
    return {
      min: 100,
      max: 500,
    };
  }
  
  let calculated: number | undefined;
  
  if (feeInfo.calculator && projectValue) {
    // Simple eval for basic formulas (in production, use a proper expression evaluator)
    try {
      const formula = feeInfo.calculator.formula
        .replace("project_value", projectValue.toString())
        .replace("sq_ft", (squareFeet || 0).toString());
      calculated = eval(formula);
    } catch (e) {
      console.error("Fee calculation error:", e);
    }
  }
  
  return {
    min: feeInfo.baselineRange.min,
    max: feeInfo.baselineRange.max,
    calculated,
    formula: feeInfo.calculator?.description
  };
}

/**
 * Get all fee schedules for a jurisdiction
 */
export function getJurisdictionFees(jurisdictionId: string): PermitFee[] {
  return PERMIT_FEES.filter(f => f.jurisdictionId === jurisdictionId);
}
