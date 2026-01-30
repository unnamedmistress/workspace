import { JobType } from "@/types";

export interface PhotoRequirement {
  name: string;
  instructions: string;
  tips: string;
}

export interface PhotoRequirements {
  [requirementTitle: string]: PhotoRequirement[];
}

// Photo requirements organized by requirement title across job types
export const PHOTO_REQUIREMENTS_BY_TITLE: PhotoRequirements = {
  // Electrical
  "Panel Specifications": [
    {
      name: "Full Panel View",
      instructions: "Stand 3-4 feet back, open door, show all breakers clearly",
      tips: "Make sure breaker labels are readable. Good lighting is essential."
    },
    {
      name: "Main Breaker Close-up",
      instructions: "Focus on amp rating at top of panel",
      tips: "Should be able to read the number (100A, 150A, 200A, etc.)"
    }
  ],
  
  "Panel Photos": [
    {
      name: "Full Panel with Door Open",
      instructions: "Stand back 3-4 feet, show entire panel interior",
      tips: "All breakers should be visible and labels readable"
    },
    {
      name: "Main Breaker Close-up",
      instructions: "Close-up of main breaker showing amp rating",
      tips: "Usually at top of panel, should clearly show amperage"
    },
    {
      name: "Available Space",
      instructions: "Show any empty breaker slots",
      tips: "Helps inspector verify capacity for new circuits"
    }
  ],
  
  "Service Entrance": [
    {
      name: "Meter and Service Connection",
      instructions: "Photo showing where power enters your home",
      tips: "Include electric meter and connection point"
    },
    {
      name: "Service Cable",
      instructions: "Show main service cable from meter to panel",
      tips: "Overhead or underground - capture the connection"
    }
  ],
  
  "Grounding System": [
    {
      name: "Ground Rod",
      instructions: "Photo of copper ground rod near panel or meter",
      tips: "Usually driven into ground outside. May be near AC unit."
    },
    {
      name: "Water Pipe Ground",
      instructions: "Green/bare copper wire clamped to main water pipe",
      tips: "Usually within first 5 feet of where water enters home"
    }
  ],
  
  // Roofing
  "Roof Type & Material": [
    {
      name: "Wide Shot of Entire Roof",
      instructions: "Stand back to capture full roof area",
      tips: "Shows overall condition and roof type (shingle, tile, metal)"
    },
    {
      name: "Close-up of Existing Material",
      instructions: "Close shot showing current roofing material condition",
      tips: "Capture any damage, wear, or deterioration"
    },
    {
      name: "Problem Areas",
      instructions: "Photos of damaged, missing, or deteriorated sections",
      tips: "Document why roof needs replacement"
    }
  ],
  
  "Deck Fastening": [
    {
      name: "Attic/Deck View",
      instructions: "From inside attic, show roof deck condition",
      tips: "Look for water stains, damaged wood, or sagging"
    },
    {
      name: "Fastening Pattern",
      instructions: "Close-up of how deck is attached (nails/screws)",
      tips: "Needed for wind mitigation affidavit"
    }
  ],
  
  "Secondary Water Barrier": [
    {
      name: "Existing Underlayment",
      instructions: "If visible, photo of current underlayment",
      tips: "May be visible at edges or damaged areas"
    }
  ],
  
  "Roof Repair": [
    {
      name: "Damaged Area Overview",
      instructions: "Wide shot showing location and extent of damage",
      tips: "Include reference points (chimney, vents, edges)"
    },
    {
      name: "Close-up of Damage",
      instructions: "Detailed shot of damaged/missing material",
      tips: "Show severity - missing shingles, holes, cracks, etc."
    },
    {
      name: "Interior Damage",
      instructions: "Any water stains or damage inside home",
      tips: "Ceiling stains, attic moisture, etc."
    }
  ],
  
  // HVAC
  "Equipment Specifications": [
    {
      name: "Data Plate/Label",
      instructions: "Clear photo of manufacturer data plate on unit",
      tips: "Should show model number, tonnage, SEER rating, serial number"
    },
    {
      name: "Full Unit View",
      instructions: "Stand back to show entire AC/HVAC unit",
      tips: "Include surrounding area and installation location"
    }
  ],
  
  "Location & Ductwork": [
    {
      name: "Installation Location",
      instructions: "Where unit sits - pad, stand, rooftop, etc.",
      tips: "Show clearances from walls and property lines"
    },
    {
      name: "Ductwork Condition",
      instructions: "Visible ducts in attic or crawlspace",
      tips: "Show condition - old, damaged, properly sealed, etc."
    }
  ],
  
  // Water Heater
  "Unit Specifications": [
    {
      name: "Data Plate",
      instructions: "Manufacturer label showing capacity, BTU, model",
      tips: "Usually on side of tank or inside access panel"
    },
    {
      name: "Full Unit",
      instructions: "Overall view of water heater and installation area",
      tips: "Show surrounding space and connections"
    }
  ],
  
  "Installation Location": [
    {
      name: "Location Context",
      instructions: "Where water heater is installed (garage, closet, outside)",
      tips: "Show floor drain, pan, and clearances"
    },
    {
      name: "Drain Pan",
      instructions: "If present, photo of drain pan under unit",
      tips: "Required in most indoor locations"
    }
  ],
  
  // Kitchen/Bath
  "Plumbing Work": [
    {
      name: "Existing Fixtures",
      instructions: "Current sink, toilet, tub/shower locations",
      tips: "Shows baseline before work begins"
    },
    {
      name: "Under-sink Plumbing",
      instructions: "Open cabinet, show supply lines and drain",
      tips: "Captures existing plumbing configuration"
    }
  ],
  
  "Electrical Work": [
    {
      name: "Outlet Locations",
      instructions: "Photos showing current outlet and switch placement",
      tips: "Document what exists before changes"
    },
    {
      name: "GFCI Outlets",
      instructions: "Close-up of outlets near water (should have Test/Reset buttons)",
      tips: "Code requires GFCI in bathrooms and kitchens"
    }
  ],
  
  "Scope Assessment": [
    {
      name: "Overall Room View",
      instructions: "Wide shot of entire bathroom or kitchen",
      tips: "Shows current layout and condition"
    },
    {
      name: "Work Areas",
      instructions: "Specific areas being remodeled",
      tips: "Focus on walls, fixtures, or surfaces being changed"
    }
  ],
  
  // Exterior
  "Material Selection": [
    {
      name: "Existing Siding/Material",
      instructions: "Current exterior wall covering",
      tips: "Shows what's being replaced"
    },
    {
      name: "Problem Areas",
      instructions: "Damaged, rotted, or deteriorated sections",
      tips: "Documents reason for replacement"
    }
  ],
  
  "Product Selection": [
    {
      name: "Product Approval Label",
      instructions: "Florida Product Approval number on window/door",
      tips: "Required for impact-rated products. Usually on sticker or etched in glass."
    },
    {
      name: "Existing Openings",
      instructions: "Current windows or doors being replaced",
      tips: "Measure and document size"
    }
  ],
  
  // Deck/Fence
  "Deck Dimensions": [
    {
      name: "Proposed Deck Area",
      instructions: "Photo of area where deck will be built",
      tips: "Include house attachment point"
    },
    {
      name: "Existing Structure",
      instructions: "If replacing, show current deck condition",
      tips: "Document deterioration or damage"
    }
  ],
  
  "Property Line Survey": [
    {
      name: "Fence Location",
      instructions: "Area where fence will be installed",
      tips: "Show property boundaries if visible"
    },
    {
      name: "Existing Fence",
      instructions: "If replacing, current fence condition",
      tips: "Document damage or reason for replacement"
    }
  ],
  
  // Pool Barrier
  "Barrier Type": [
    {
      name: "Pool Area",
      instructions: "Overall view of pool and surrounding area",
      tips: "Shows where barrier will be installed"
    },
    {
      name: "Access Points",
      instructions: "All doors and gates that need child-safety features",
      tips: "Document current gate/latch setup"
    }
  ],
  
  // Structural
  "Site Plan": [
    {
      name: "Property Overview",
      instructions: "Wide shot showing property boundaries and existing structures",
      tips: "Include house, driveway, and proposed addition area"
    },
    {
      name: "Setbacks",
      instructions: "Distance from property lines to proposed work",
      tips: "Measure from fence/survey markers"
    }
  ],
  
  "Foundation Repair": [
    {
      name: "Visible Damage",
      instructions: "Cracks, settling, or structural issues",
      tips: "Use ruler or coin for scale reference"
    },
    {
      name: "Interior Signs",
      instructions: "Floor cracks, door/window gaps, wall cracks",
      tips: "Shows extent of foundation problems"
    }
  ]
};

// General photo guidelines
export const GENERAL_PHOTO_GUIDELINES = {
  formats: ["JPEG", "PNG", "HEIC", "WebP"],
  maxSizeMB: 10,
  maxCount: 10,
  tips: [
    "Use good lighting - natural daylight is best",
    "Hold phone steady or use a surface to avoid blur",
    "Include a reference object for scale when helpful",
    "Take multiple angles if needed",
    "Zoom with your feet, not the camera (get closer instead of digital zoom)",
    "Clean the lens first for clearer photos",
    "Make sure text/labels are readable in the photo"
  ]
};

// Get photo requirements for a specific requirement title
export function getPhotoRequirements(requirementTitle: string): PhotoRequirement[] {
  return PHOTO_REQUIREMENTS_BY_TITLE[requirementTitle] || [];
}

// Format photo requirements as AI message
export function formatPhotoRequirementsMessage(requirementTitle: string): string {
  const requirements = getPhotoRequirements(requirementTitle);
  
  if (requirements.length === 0) {
    return `For **${requirementTitle}**, take photos that clearly show the work area and any relevant details. Make sure photos are well-lit and in focus.`;
  }
  
  let message = `For **${requirementTitle}**, I need:\n\n`;
  
  requirements.forEach((req, index) => {
    message += `📸 **Photo ${index + 1}: ${req.name}**\n`;
    message += `   ${req.instructions}\n`;
    message += `   💡 Tip: ${req.tips}\n\n`;
  });
  
  message += `**General tips:**\n`;
  message += `• Good lighting is essential\n`;
  message += `• Hold phone steady\n`;
  message += `• Make sure text/labels are readable\n`;
  message += `• Max ${GENERAL_PHOTO_GUIDELINES.maxSizeMB}MB per photo\n`;
  
  return message;
}
