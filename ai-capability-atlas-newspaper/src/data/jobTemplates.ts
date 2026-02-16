import { JobType, Jurisdiction } from "@/types";

export interface JobTemplate {
  id: string;
  name: string;
  jobType: JobType;
  jurisdiction: Jurisdiction;
  description: string;
  scenario: string;
  preFilledData: {
    scope?: string[];
    notes?: string;
    estimatedValue?: number;
    squareFeet?: number;
    [key: string]: any;
  };
  icon: string;
  popular?: boolean;
}

export const JOB_TEMPLATES: JobTemplate[] = [
  {
    id: "hurricane-roof-standard",
    name: "Hurricane Roof Damage - Standard",
    jobType: "RE_ROOFING",
    jurisdiction: "PINELLAS",
    description: "Full re-roof after hurricane/storm damage",
    scenario: "Shingle roof damaged by Hurricane, insurance claim approved, full replacement needed",
    preFilledData: {
      scope: [
        "Remove existing damaged shingles",
        "Inspect and repair deck as needed",
        "Install new architectural shingles",
        "Replace flashing",
        "Install ice & water barrier"
      ],
      notes: "Insurance claim #: [Your claim number]\nDamage from: [Storm name/date]\nAdjuster approved full replacement",
      estimatedValue: 12000,
      squareFeet: 2000
    },
    icon: "🌀",
    popular: true
  },
  {
    id: "panel-upgrade-200a",
    name: "Panel Upgrade to 200A",
    jobType: "ELECTRICAL_PANEL",
    jurisdiction: "PINELLAS",
    description: "Upgrade from 100A to 200A service",
    scenario: "Older home with 100A panel, upgrading to 200A for EV charger, pool equipment, and modern loads",
    preFilledData: {
      scope: [
        "Replace 100A panel with 200A",
        "Upgrade service entrance cable",
        "Install new main disconnect",
        "Update grounding system",
        "Relocate/consolidate circuits"
      ],
      notes: "Current panel: 100A, 20 circuit\nNew panel: 200A, 40 circuit\nReason: Adding EV charger + pool equipment",
      estimatedValue: 3500
    },
    icon: "⚡",
    popular: true
  },
  {
    id: "kitchen-basic-remodel",
    name: "Kitchen Remodel - Basic",
    jobType: "KITCHEN_REMODEL",
    jurisdiction: "PINELLAS",
    description: "Standard kitchen update without layout changes",
    scenario: "Replace cabinets, countertops, add outlets, update lighting - no wall removal",
    preFilledData: {
      scope: [
        "New cabinets (same layout)",
        "New countertops",
        "Add 4 new counter outlets",
        "Install under-cabinet lighting",
        "New sink and faucet (same location)",
        "New dishwasher",
        "Tile backsplash"
      ],
      notes: "No structural changes\nNo plumbing relocation\nNo gas line work",
      estimatedValue: 15000
    },
    icon: "🏠"
  },
  {
    id: "bathroom-quick-refresh",
    name: "Bathroom Quick Refresh",
    jobType: "SMALL_BATH_REMODEL",
    jurisdiction: "PINELLAS",
    description: "Cosmetic bathroom update, no permit needed",
    scenario: "Replace fixtures in same locations, new vanity, paint, tile - no plumbing/electrical changes",
    preFilledData: {
      scope: [
        "New vanity (same size/location)",
        "Replace toilet (same location)",
        "New tub surround (no plumbing change)",
        "Tile floor",
        "Paint walls",
        "New mirror and light fixture"
      ],
      notes: "All fixtures in SAME locations\nNo plumbing lines moved\nNo new electrical circuits\nCosmetic only - may not require permit",
      estimatedValue: 4500
    },
    icon: "🛁"
  },
  {
    id: "pool-safety-fence",
    name: "Pool Safety Fence - Standard",
    jobType: "POOL_BARRIER",
    jurisdiction: "PINELLAS",
    description: "4-foot safety fence around pool",
    scenario: "New pool or resale requirement - need code-compliant barrier",
    preFilledData: {
      scope: [
        "4-foot aluminum fence around pool",
        "Self-closing, self-latching gate",
        "Barrier completely surrounds pool",
        "Meets 4-inch spacing requirement"
      ],
      notes: "Critical for pool safety code\nRequired for certificate of occupancy\nGate must be self-closing and latch 54\" from ground",
      estimatedValue: 3000
    },
    icon: "🏊"
  },
  {
    id: "ev-charger-level-2",
    name: "Tesla/EV Charger - Level 2",
    jobType: "EV_CHARGER",
    jurisdiction: "PINELLAS",
    description: "Level 2 EV charger installation",
    scenario: "Install 240V Level 2 charger in garage for Tesla/EV",
    preFilledData: {
      scope: [
        "Install 50A dedicated circuit",
        "Mount charger in garage",
        "Run conduit from panel",
        "Install GFCI breaker",
        "Label circuit"
      ],
      notes: "Charger model: [Your charger model]\nPanel has available space: Yes\nDistance from panel: ~30 feet",
      estimatedValue: 1500
    },
    icon: "🚗",
    popular: true
  },
  {
    id: "generator-standby-22kw",
    name: "Whole House Generator - 22kW",
    jobType: "GENERATOR_INSTALL",
    jurisdiction: "PINELLAS",
    description: "Standby generator with automatic transfer switch",
    scenario: "22kW natural gas generator for hurricane preparedness",
    preFilledData: {
      scope: [
        "Install 22kW Generac/Kohler generator",
        "Automatic transfer switch",
        "Gas line extension",
        "Concrete pad",
        "Electrical connections"
      ],
      notes: "Generator size: 22kW\nFuel: Natural gas\nLocation: Side yard, 5ft from house\nPowers: Whole house except AC",
      estimatedValue: 8500
    },
    icon: "⚙️"
  },
  {
    id: "water-heater-tankless",
    name: "Tankless Water Heater Upgrade",
    jobType: "WATER_HEATER",
    jurisdiction: "PINELLAS",
    description: "Replace tank with tankless unit",
    scenario: "Upgrading from 40-gallon tank to tankless for energy efficiency",
    preFilledData: {
      scope: [
        "Remove existing 40-gal tank",
        "Install tankless unit",
        "Upgrade gas line (if needed)",
        "Install new venting",
        "Recirculation pump"
      ],
      notes: "Current: 40-gal gas tank\nNew: Rinnai/Navien tankless\nLocation: Same location in garage",
      estimatedValue: 3500
    },
    icon: "💧"
  },
  {
    id: "impact-windows-hurricane",
    name: "Impact Windows - Hurricane Protection",
    jobType: "WINDOW_DOOR_REPLACEMENT",
    jurisdiction: "PINELLAS",
    description: "Replace standard windows with impact-rated",
    scenario: "Hurricane protection upgrade - replace all windows with impact-rated",
    preFilledData: {
      scope: [
        "Remove existing single-pane windows",
        "Install impact-rated windows",
        "All windows Florida Product Approved",
        "Professional installation with warranty"
      ],
      notes: "Number of windows: 12\nStyle: Vinyl, impact-rated\nFlorida Product Approval: [Will be provided]\nInsurance discount expected",
      estimatedValue: 15000
    },
    icon: "🪟"
  },
  {
    id: "deck-basic-wood",
    name: "Basic Wood Deck - 12x16",
    jobType: "DECK_INSTALLATION",
    jurisdiction: "PINELLAS",
    description: "Standard wood deck off back of house",
    scenario: "12x16 pressure-treated wood deck, ground level",
    preFilledData: {
      scope: [
        "12' x 16' pressure-treated deck",
        "Concrete footings",
        "Ledger attached to house",
        "Railing all sides",
        "Stairs to ground"
      ],
      notes: "Size: 192 sq ft\nHeight: 24\" above grade\nMaterials: Pressure-treated pine\nRailing: Cable or traditional",
      estimatedValue: 6000,
      squareFeet: 192
    },
    icon: "🏗️"
  },
  {
    id: "ac-straight-swap",
    name: "AC Straight Swap - Like-for-Like",
    jobType: "AC_HVAC_CHANGEOUT",
    jurisdiction: "PINELLAS",
    description: "Direct replacement, same size unit",
    scenario: "Existing AC failed, replacing with same capacity unit, no ductwork changes",
    preFilledData: {
      scope: [
        "Remove failed AC unit",
        "Install new 3-ton AC",
        "Reuse existing ductwork",
        "New thermostat",
        "Test and commission"
      ],
      notes: "Current unit: 3-ton, 13 SEER (failed compressor)\nNew unit: 3-ton, 16 SEER\nDuctwork: Existing, good condition\nNo structural changes",
      estimatedValue: 5500
    },
    icon: "❄️"
  }
];

/**
 * Get templates by job type
 */
export function getTemplatesByJobType(jobType: JobType): JobTemplate[] {
  return JOB_TEMPLATES.filter(t => t.jobType === jobType);
}

/**
 * Get popular templates
 */
export function getPopularTemplates(): JobTemplate[] {
  return JOB_TEMPLATES.filter(t => t.popular);
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): JobTemplate | undefined {
  return JOB_TEMPLATES.find(t => t.id === id);
}
