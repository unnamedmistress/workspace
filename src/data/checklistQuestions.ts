import { ChecklistQuestions, QuestionStep } from "@/types";

// Questions for Electrical Panel permits
const ELECTRICAL_PANEL_QUESTIONS: { [jurisdiction: string]: ChecklistQuestions } = {
  PINELLAS: {
    "Panel Specifications": [
      {
        id: "panel-amperage",
        intro: "Let's start with the basics about your electrical panel. This info goes straight to your permit application! 📋",
        question: "What's the main breaker size? Look at the big switch at the top of your panel — it should have a number on it.",
        options: [
          { label: "100 Amps", value: "100A" },
          { label: "150 Amps", value: "150A" },
          { label: "200 Amps", value: "200A" },
          { label: "I'm not sure", value: "unknown" }
        ],
        field: "amperage",
        followUp: {
          unknown: "No worries! Take a photo of your panel and I'll find it for you. 📷"
        }
      },
      {
        id: "panel-brand",
        question: "What brand is the panel? There's usually a logo or name on the inside of the door.",
        options: [
          { label: "Square D", value: "Square D" },
          { label: "Siemens", value: "Siemens" },
          { label: "Eaton/Cutler-Hammer", value: "Eaton" },
          { label: "GE", value: "GE" },
          { label: "Other brand", value: "other" }
        ],
        field: "manufacturer"
      },
      {
        id: "panel-spaces",
        question: "How many circuit breaker spaces does the panel have? Count all the slots (even empty ones).",
        options: [
          { label: "20 spaces", value: "20" },
          { label: "30 spaces", value: "30" },
          { label: "40 spaces", value: "40" },
          { label: "I'll take a photo", value: "photo" }
        ],
        field: "spaces"
      }
    ],
    "Service Entrance": [
      {
        id: "service-type",
        intro: "Now let's document how power comes into your home. This is called the 'service entrance'. 🏠",
        question: "How does the power line connect to your house?",
        options: [
          { label: "Overhead (wires from pole)", value: "overhead" },
          { label: "Underground (buried cable)", value: "underground" },
          { label: "Not sure", value: "unknown" }
        ],
        field: "serviceType"
      },
      {
        id: "meter-location",
        question: "Where is your electric meter located?",
        options: [
          { label: "Outside on wall", value: "exterior_wall" },
          { label: "In garage", value: "garage" },
          { label: "On power pole", value: "pole" },
          { label: "I'll show you (photo)", value: "photo" }
        ],
        field: "meterLocation"
      }
    ],
    "Grounding System": [
      {
        id: "ground-rod",
        intro: "Grounding keeps you safe from electrical surges. Let's document your grounding system. ⚡",
        question: "Can you see a copper rod driven into the ground near your panel or meter?",
        options: [
          { label: "Yes, I see it", value: "visible" },
          { label: "No, can't find it", value: "not_visible" },
          { label: "I'll take a photo", value: "photo" }
        ],
        field: "groundRodVisible"
      },
      {
        id: "water-bond",
        question: "Is there a green or bare copper wire clamped to your main water pipe?",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
          { label: "Not sure / can't see", value: "unknown" }
        ],
        field: "waterBond"
      }
    ],
    "Load Calculation": [
      {
        id: "home-sqft",
        intro: "The inspector needs to know your home can handle all its electrical needs. Let's figure that out! 🔌",
        question: "Roughly how big is your home?",
        options: [
          { label: "Under 1,500 sq ft", value: "small" },
          { label: "1,500 - 2,500 sq ft", value: "medium" },
          { label: "2,500 - 4,000 sq ft", value: "large" },
          { label: "Over 4,000 sq ft", value: "xlarge" }
        ],
        field: "homeSqft"
      },
      {
        id: "ac-type",
        question: "What kind of air conditioning do you have?",
        options: [
          { label: "Central AC", value: "central" },
          { label: "Window units", value: "window" },
          { label: "Heat pump", value: "heat_pump" },
          { label: "No AC", value: "none" }
        ],
        field: "acType"
      },
      {
        id: "electric-appliances",
        question: "Do you have any of these? (Pick all that apply, or 'None')",
        options: [
          { label: "Electric stove/range", value: "electric_range" },
          { label: "Electric water heater", value: "electric_wh" },
          { label: "Electric dryer", value: "electric_dryer" },
          { label: "None of these", value: "none" }
        ],
        field: "electricAppliances"
      }
    ],
    "Permit Documents": [
      {
        id: "docs-ready",
        intro: "Almost done! Let's make sure you have everything for the permit office. 📄",
        question: "Do you have a diagram or photo showing your panel layout?",
        options: [
          { label: "Yes, I'll upload it", value: "has_diagram" },
          { label: "No, can you help?", value: "need_help" },
          { label: "What's a panel layout?", value: "explain" }
        ],
        field: "hasDiagram",
        followUp: {
          explain: "A panel layout shows which breaker controls what. Take a photo of your panel with the door open — I'll help you create one!"
        }
      }
    ]
  },
  TAMPA: {
    // Tampa has similar questions but can be customized
    "Panel Specifications": [
      {
        id: "panel-amperage",
        intro: "Let's document your electrical panel for the City of Tampa permit. 📋",
        question: "What's the main breaker size? Check the big switch at the top.",
        options: [
          { label: "100 Amps", value: "100A" },
          { label: "150 Amps", value: "150A" },
          { label: "200 Amps", value: "200A" },
          { label: "I'm not sure", value: "unknown" }
        ],
        field: "amperage"
      },
      {
        id: "panel-brand",
        question: "What brand is the panel?",
        options: [
          { label: "Square D", value: "Square D" },
          { label: "Siemens", value: "Siemens" },
          { label: "Eaton", value: "Eaton" },
          { label: "GE", value: "GE" },
          { label: "Other", value: "other" }
        ],
        field: "manufacturer"
      }
    ],
    "Service Details": [
      {
        id: "service-type",
        intro: "Now let's look at how power gets to your home. 🏠",
        question: "Is your electric service overhead or underground?",
        options: [
          { label: "Overhead (wires from pole)", value: "overhead" },
          { label: "Underground", value: "underground" },
          { label: "Not sure", value: "unknown" }
        ],
        field: "serviceType"
      }
    ],
    "Safety Requirements": [
      {
        id: "ground-visible",
        intro: "Tampa requires specific safety features. Let's check those. ⚡",
        question: "Can you see a grounding rod near your panel?",
        options: [
          { label: "Yes", value: "visible" },
          { label: "No", value: "not_visible" },
          { label: "I'll take a photo", value: "photo" }
        ],
        field: "groundRodVisible"
      }
    ],
    "Final Review": [
      {
        id: "review-ready",
        intro: "Great job! Let's wrap up your permit package. 📄",
        question: "Ready to preview your permit documents?",
        options: [
          { label: "Yes, show me!", value: "ready" },
          { label: "I need to add more photos", value: "more_photos" },
          { label: "Go back and review", value: "review" }
        ],
        field: "reviewStatus"
      }
    ]
  }
};

// Questions for Water Heater permits
const WATER_HEATER_QUESTIONS: { [jurisdiction: string]: ChecklistQuestions } = {
  PINELLAS: {
    "Unit Specifications": [
      {
        id: "wh-type",
        intro: "Let's document your new water heater! This will help speed up your permit. 🚿",
        question: "What type of water heater are you installing?",
        options: [
          { label: "Tank (traditional)", value: "tank" },
          { label: "Tankless", value: "tankless" },
          { label: "Heat pump", value: "heat_pump" },
          { label: "Not sure", value: "unknown" }
        ],
        field: "type"
      },
      {
        id: "wh-fuel",
        question: "What powers the water heater?",
        options: [
          { label: "Electric", value: "electric" },
          { label: "Natural gas", value: "gas" },
          { label: "Propane", value: "propane" },
          { label: "Not sure", value: "unknown" }
        ],
        field: "fuel"
      },
      {
        id: "wh-capacity",
        question: "What's the tank size (or BTU for tankless)?",
        options: [
          { label: "40 gallons", value: "40gal" },
          { label: "50 gallons", value: "50gal" },
          { label: "75 gallons", value: "75gal" },
          { label: "Tankless", value: "tankless" },
          { label: "I'll check the label", value: "photo" }
        ],
        field: "capacity"
      }
    ],
    "Installation Location": [
      {
        id: "wh-location",
        intro: "Where you put the water heater matters for safety codes. 📍",
        question: "Where will the water heater be installed?",
        options: [
          { label: "Garage", value: "garage" },
          { label: "Utility closet", value: "closet" },
          { label: "Outside", value: "exterior" },
          { label: "Attic", value: "attic" },
          { label: "Other location", value: "other" }
        ],
        field: "location"
      },
      {
        id: "wh-pan",
        question: "Will there be a drain pan under the water heater?",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
          { label: "What's a drain pan?", value: "explain" }
        ],
        field: "hasPan",
        followUp: {
          explain: "A drain pan catches water if the tank leaks. It's required in most indoor locations to protect your home from water damage."
        }
      }
    ],
    "Venting (Gas Units)": [
      {
        id: "wh-venting",
        intro: "If you have a gas water heater, we need to document the venting. 💨",
        question: "How is/will the water heater be vented?",
        options: [
          { label: "Through the roof", value: "roof" },
          { label: "Through the wall (power vent)", value: "wall" },
          { label: "It's electric (no vent)", value: "electric" },
          { label: "Not sure", value: "unknown" }
        ],
        field: "ventType"
      }
    ]
  },
  TAMPA: {
    "Unit Specifications": [
      {
        id: "wh-type",
        intro: "Let's document your water heater for the Tampa permit! 🚿",
        question: "What type of water heater?",
        options: [
          { label: "Tank (traditional)", value: "tank" },
          { label: "Tankless", value: "tankless" },
          { label: "Heat pump", value: "heat_pump" }
        ],
        field: "type"
      },
      {
        id: "wh-fuel",
        question: "Electric or gas?",
        options: [
          { label: "Electric", value: "electric" },
          { label: "Gas", value: "gas" }
        ],
        field: "fuel"
      }
    ],
    "Location & Safety": [
      {
        id: "wh-location",
        intro: "Tampa has specific location requirements. 📍",
        question: "Where is it being installed?",
        options: [
          { label: "Garage", value: "garage" },
          { label: "Inside home", value: "interior" },
          { label: "Outside", value: "exterior" }
        ],
        field: "location"
      }
    ]
  }
};

// Questions for Bathroom Remodel permits
const BATH_REMODEL_QUESTIONS: { [jurisdiction: string]: ChecklistQuestions } = {
  PINELLAS: {
    "Scope of Work": [
      {
        id: "scope-type",
        intro: "Let's figure out what work you're doing. This determines which inspections you'll need! 🛁",
        question: "What are you changing in the bathroom?",
        options: [
          { label: "Fixtures only (sink, toilet, tub)", value: "fixtures" },
          { label: "Moving plumbing", value: "plumbing" },
          { label: "Adding/moving electrical", value: "electrical" },
          { label: "Full gut remodel", value: "full" }
        ],
        field: "scopeType"
      },
      {
        id: "scope-fixtures",
        question: "Which fixtures are you replacing or adding?",
        options: [
          { label: "Toilet", value: "toilet" },
          { label: "Sink/vanity", value: "sink" },
          { label: "Tub or shower", value: "tub_shower" },
          { label: "All of the above", value: "all" }
        ],
        field: "fixtures"
      }
    ],
    "Electrical Work": [
      {
        id: "elec-work",
        intro: "Let's check on the electrical side of things. ⚡",
        question: "Are you doing any electrical work?",
        options: [
          { label: "Adding outlets", value: "outlets" },
          { label: "New lighting", value: "lighting" },
          { label: "Exhaust fan", value: "fan" },
          { label: "No electrical work", value: "none" }
        ],
        field: "electricalWork"
      },
      {
        id: "gfci",
        question: "Will outlets near water have GFCI protection?",
        options: [
          { label: "Yes", value: "yes" },
          { label: "Not sure what that is", value: "explain" },
          { label: "No electrical near water", value: "na" }
        ],
        field: "hasGfci",
        followUp: {
          explain: "GFCI outlets have 'Test' and 'Reset' buttons — they protect you from shocks near water. They're required in bathrooms!"
        }
      }
    ],
    "Ventilation": [
      {
        id: "vent-fan",
        intro: "Bathrooms need proper ventilation to prevent mold. 💨",
        question: "Does the bathroom have an exhaust fan?",
        options: [
          { label: "Yes, keeping existing", value: "existing" },
          { label: "Yes, installing new", value: "new" },
          { label: "No fan (has window)", value: "window" },
          { label: "No fan, no window", value: "none" }
        ],
        field: "ventilation"
      }
    ]
  },
  TAMPA: {
    "Scope of Work": [
      {
        id: "scope-type",
        intro: "What's the plan for your bathroom? 🛁",
        question: "What kind of work are you doing?",
        options: [
          { label: "Just replacing fixtures", value: "fixtures" },
          { label: "Moving plumbing around", value: "plumbing" },
          { label: "Full remodel", value: "full" }
        ],
        field: "scopeType"
      }
    ],
    "Plumbing": [
      {
        id: "plumb-changes",
        intro: "Let's document the plumbing changes. 🔧",
        question: "Are you moving any drains or water lines?",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No, same locations", value: "no" },
          { label: "Not sure", value: "unknown" }
        ],
        field: "plumbingChanges"
      }
    ]
  }
};

// Main export function to get questions for a specific job
export function getChecklistQuestions(
  jobType: string,
  jurisdiction: string
): ChecklistQuestions {
  const jobTypeKey = jobType as keyof typeof questionsByJobType;
  const questionsByJobType = {
    ELECTRICAL_PANEL: ELECTRICAL_PANEL_QUESTIONS,
    WATER_HEATER: WATER_HEATER_QUESTIONS,
    BATH_REMODEL: BATH_REMODEL_QUESTIONS
  };

  const questionsForType = questionsByJobType[jobTypeKey];
  if (!questionsForType) {
    console.warn(`No questions found for job type: ${jobType}`);
    return {};
  }

  const questionsForJurisdiction = questionsForType[jurisdiction];
  if (!questionsForJurisdiction) {
    console.warn(`No questions found for jurisdiction: ${jurisdiction}`);
    return {};
  }

  return questionsForJurisdiction;
}

// Get questions for a specific checklist item
export function getQuestionsForItem(
  jobType: string,
  jurisdiction: string,
  itemTitle: string
): QuestionStep[] {
  const allQuestions = getChecklistQuestions(jobType, jurisdiction);
  return allQuestions[itemTitle] || [];
}

// Get the first incomplete checklist item's questions
export function getFirstIncompleteQuestions(
  jobType: string,
  jurisdiction: string,
  checklistItems: { title: string; status: string }[]
): { itemTitle: string; questions: QuestionStep[] } | null {
  const allQuestions = getChecklistQuestions(jobType, jurisdiction);
  
  for (const item of checklistItems) {
    if (item.status !== "COMPLETE" && allQuestions[item.title]) {
      return {
        itemTitle: item.title,
        questions: allQuestions[item.title]
      };
    }
  }
  
  return null;
}
