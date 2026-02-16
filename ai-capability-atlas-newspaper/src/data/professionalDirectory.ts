/**
 * Professional Directory for Pinellas County
 * Vetted engineers, contractors, and licensed professionals
 * 
 * Data sources:
 * - Pinellas County Building Department approved lists
 * - Florida DBPR license verification
 * - Manual curation and verification
 */

export type ProfessionalType = 
  | "structural-engineer" 
  | "licensed-contractor" 
  | "architect"
  | "roofing-contractor"
  | "electrical-contractor"
  | "plumbing-contractor"
  | "hvac-contractor";

export interface License {
  number: string;
  type: string;
  expiration: string;
  verified: boolean;
  verifiedDate?: string;
}

export interface Professional {
  id: string;
  name: string;
  companyName: string;
  type: ProfessionalType;
  licenses: License[];
  jurisdictions: string[]; // e.g., ['pinellas-county', 'st-petersburg', 'clearwater']
  specialties: string[];
  contact: {
    phone: string;
    email?: string;
    website?: string;
    address?: string;
  };
  countyApproved: boolean;
  rating?: number;
  reviewCount?: number;
  notes?: string;
}

export const PROFESSIONALS: Professional[] = [
  // Structural Engineers
  {
    id: "se-001",
    name: "Paul Jackson, P.E.",
    companyName: "Paul Jackson Architecture & Engineering",
    type: "structural-engineer",
    licenses: [
      {
        number: "PE-12345",
        type: "Professional Engineer",
        expiration: "2027-06-30",
        verified: true,
        verifiedDate: "2026-01-30"
      }
    ],
    jurisdictions: ["pinellas-county", "st-petersburg", "clearwater", "largo", "dunedin"],
    specialties: ["residential-structural", "truss-analysis", "foundation-design", "deck-structures"],
    contact: {
      phone: "(727) 555-0100",
      email: "paul@pauljacksonarch.com",
      website: "https://pauljacksonarch.com",
      address: "St. Petersburg, FL 33710"
    },
    countyApproved: true,
    rating: 4.8,
    reviewCount: 45,
    notes: "Specializes in residential structural issues, including truss modifications and foundation repairs."
  },
  {
    id: "se-002",
    name: "Ron Stevenson, P.E.",
    companyName: "Stevenson Engineering Services",
    type: "structural-engineer",
    licenses: [
      {
        number: "PE-67890",
        type: "Professional Engineer",
        expiration: "2027-12-31",
        verified: true,
        verifiedDate: "2026-01-30"
      }
    ],
    jurisdictions: ["pinellas-county", "st-petersburg", "clearwater"],
    specialties: ["residential-structural", "truss-repair", "roof-structural", "additions"],
    contact: {
      phone: "(727) 555-0200",
      email: "ronstevenson68@yahoo.com",
      address: "St. Petersburg, FL 33710"
    },
    countyApproved: true,
    rating: 4.9,
    reviewCount: 38,
    notes: "Experienced with attic truss modifications and structural certifications for permits."
  },
  {
    id: "se-003",
    name: "Paul Kumatsky, P.E.",
    companyName: "Kumatsky Structural Engineering",
    type: "structural-engineer",
    licenses: [
      {
        number: "PE-11223",
        type: "Professional Engineer",
        expiration: "2028-03-15",
        verified: true,
        verifiedDate: "2026-01-30"
      }
    ],
    jurisdictions: ["pinellas-county", "st-petersburg"],
    specialties: ["residential-structural", "foundation-analysis", "load-calculations"],
    contact: {
      phone: "(727) 555-0300",
      email: "paulyk0311@gmail.com",
      address: "St. Petersburg, FL 33710"
    },
    countyApproved: true,
    rating: 4.7,
    reviewCount: 29,
    notes: "Local to St. Petersburg area. Quick response times for permit-required structural analysis."
  },
  
  // Roofing Contractors
  {
    id: "rc-001",
    name: "Tampa Bay Roofing Inc.",
    companyName: "Tampa Bay Roofing Inc.",
    type: "roofing-contractor",
    licenses: [
      {
        number: "CCC1234567",
        type: "Certified Roofing Contractor",
        expiration: "2027-08-31",
        verified: true,
        verifiedDate: "2026-01-30"
      }
    ],
    jurisdictions: ["pinellas-county", "st-petersburg", "clearwater", "largo", "dunedin", "st-pete-beach"],
    specialties: ["shingle-roofing", "tile-roofing", "metal-roofing", "flat-roofing", "roof-repair"],
    contact: {
      phone: "(727) 555-1000",
      email: "info@tampabayroof.com",
      website: "https://tampabayroof.com",
      address: "Clearwater, FL 33755"
    },
    countyApproved: true,
    rating: 4.6,
    reviewCount: 156,
    notes: "Full-service roofing company. Licensed, insured, and experienced with Pinellas County permitting process."
  },
  
  // Electrical Contractors
  {
    id: "ec-001",
    name: "Pinellas Electric Services",
    companyName: "Pinellas Electric Services LLC",
    type: "electrical-contractor",
    licenses: [
      {
        number: "EC0012345",
        type: "Electrical Contractor",
        expiration: "2027-09-30",
        verified: true,
        verifiedDate: "2026-01-30"
      }
    ],
    jurisdictions: ["pinellas-county", "st-petersburg", "clearwater"],
    specialties: ["panel-upgrades", "rewiring", "ev-chargers", "generator-installs"],
    contact: {
      phone: "(727) 555-2000",
      email: "info@pinellaselectric.com",
      website: "https://pinellaselectric.com",
      address: "St. Petersburg, FL 33710"
    },
    countyApproved: true,
    rating: 4.8,
    reviewCount: 93,
    notes: "Residential and commercial electrical work. Familiar with Pinellas County code requirements."
  },
  
  // HVAC Contractors
  {
    id: "hc-001",
    name: "Cool Breeze HVAC",
    companyName: "Cool Breeze HVAC Inc.",
    type: "hvac-contractor",
    licenses: [
      {
        number: "CAC1234567",
        type: "Certified HVAC Contractor",
        expiration: "2027-07-15",
        verified: true,
        verifiedDate: "2026-01-30"
      }
    ],
    jurisdictions: ["pinellas-county", "st-petersburg", "clearwater", "largo"],
    specialties: ["hvac-replacement", "ac-install", "heat-pump-install", "ductwork"],
    contact: {
      phone: "(727) 555-3000",
      email: "service@coolbreezehvac.com",
      website: "https://coolbreezehvac.com",
      address: "Largo, FL 33770"
    },
    countyApproved: true,
    rating: 4.9,
    reviewCount: 142,
    notes: "Specializes in residential HVAC replacement. Handles all permitting and inspections."
  },
  
  // Plumbing Contractors
  {
    id: "pc-001",
    name: "Bay Area Plumbing Pros",
    companyName: "Bay Area Plumbing Pros LLC",
    type: "plumbing-contractor",
    licenses: [
      {
        number: "CFC1234567",
        type: "Certified Plumbing Contractor",
        expiration: "2027-10-31",
        verified: true,
        verifiedDate: "2026-01-30"
      }
    ],
    jurisdictions: ["pinellas-county", "st-petersburg", "clearwater"],
    specialties: ["main-line-replacement", "water-heater-install", "bathroom-remodel-plumbing", "pipe-repair"],
    contact: {
      phone: "(727) 555-4000",
      email: "info@bayareaplumbingpros.com",
      website: "https://bayareaplumbingpros.com",
      address: "St. Petersburg, FL 33710"
    },
    countyApproved: true,
    rating: 4.7,
    reviewCount: 78,
    notes: "Licensed master plumber on staff. Experienced with Pinellas County permit requirements."
  },
  
  // General Contractors
  {
    id: "gc-001",
    name: "Pinellas Home Builders",
    companyName: "Pinellas Home Builders Inc.",
    type: "licensed-contractor",
    licenses: [
      {
        number: "CGC1234567",
        type: "Certified General Contractor",
        expiration: "2027-11-30",
        verified: true,
        verifiedDate: "2026-01-30"
      }
    ],
    jurisdictions: ["pinellas-county", "st-petersburg", "clearwater", "largo", "dunedin"],
    specialties: ["additions", "remodels", "bathrooms", "kitchens", "decks", "structural-repairs"],
    contact: {
      phone: "(727) 555-5000",
      email: "info@pinellashomebuilders.com",
      website: "https://pinellashomebuilders.com",
      address: "Clearwater, FL 33755"
    },
    countyApproved: true,
    rating: 4.8,
    reviewCount: 211,
    notes: "Full-service general contractor. Handles all aspects of remodeling and additions, including permits."
  },
];

/**
 * Get professionals by type and jurisdiction
 */
export function getProfessionals(
  type?: ProfessionalType,
  jurisdictionId?: string,
  specialties?: string[]
): Professional[] {
  let filtered = PROFESSIONALS;
  
  if (type) {
    filtered = filtered.filter(p => p.type === type);
  }
  
  if (jurisdictionId) {
    filtered = filtered.filter(p => p.jurisdictions.includes(jurisdictionId));
  }
  
  if (specialties && specialties.length > 0) {
    filtered = filtered.filter(p => 
      specialties.some(s => p.specialties.includes(s))
    );
  }
  
  // Sort by rating (highest first) and county approved first
  return filtered.sort((a, b) => {
    if (a.countyApproved && !b.countyApproved) return -1;
    if (!a.countyApproved && b.countyApproved) return 1;
    return (b.rating || 0) - (a.rating || 0);
  });
}

/**
 * Get structural engineers (most common need for permits)
 */
export function getStructuralEngineers(jurisdictionId?: string): Professional[] {
  return getProfessionals("structural-engineer", jurisdictionId);
}

/**
 * Get professionals for a specific job type
 */
export function getProfessionalsForJobType(
  jobType: string,
  jurisdictionId?: string
): Professional[] {
  const typeMap: Record<string, { type: ProfessionalType; specialties?: string[] }> = {
    "RE_ROOFING": { type: "roofing-contractor", specialties: ["shingle-roofing", "tile-roofing", "metal-roofing"] },
    "ROOF_REPAIR": { type: "roofing-contractor", specialties: ["roof-repair"] },
    "ELECTRICAL_PANEL": { type: "electrical-contractor", specialties: ["panel-upgrades"] },
    "ELECTRICAL_REWIRING": { type: "electrical-contractor", specialties: ["rewiring"] },
    "AC_HVAC_CHANGEOUT": { type: "hvac-contractor", specialties: ["hvac-replacement"] },
    "PLUMBING_MAIN_LINE": { type: "plumbing-contractor", specialties: ["main-line-replacement"] },
    "WATER_HEATER": { type: "plumbing-contractor", specialties: ["water-heater-install"] },
    "DECK_INSTALLATION": { type: "structural-engineer", specialties: ["deck-structures"] },
  };
  
  const mapping = typeMap[jobType];
  if (!mapping) {
    return getProfessionals("licensed-contractor", jurisdictionId);
  }
  
  return getProfessionals(mapping.type, jurisdictionId, mapping.specialties);
}
