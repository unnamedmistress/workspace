import { ClipboardCheck, CheckCircle, AlertTriangle } from "lucide-react";
import { JobType } from "@/types";

interface InspectionCheckpointsProps {
  jobType: JobType;
}

interface InspectionPhase {
  name: string;
  timing: string;
  checkpoints: string[];
  commonIssues?: string[];
  proTips?: string[];
}

const INSPECTION_CHECKPOINTS: Record<JobType, InspectionPhase[]> = {
  RE_ROOFING: [
    {
      name: "Dry-In Inspection",
      timing: "Before covering deck with final roofing",
      checkpoints: [
        "Deck fastening pattern meets wind load requirements",
        "All deck boards properly secured (no loose or damaged sheathing)",
        "Proper underlayment/water barrier installation",
        "Flashing properly installed at all penetrations",
        "Drip edge installed at eaves and rakes",
        "Valley installation correct (if applicable)",
        "Hip and ridge backing solid"
      ],
      commonIssues: [
        "Insufficient deck fastening (must meet current wind code)",
        "Water barrier not properly lapped or sealed",
        "Flashing gaps around chimneys or vents"
      ],
      proTips: [
        "Take photos at each stage to document compliance",
        "Have manufacturer's installation instructions on-site",
        "Mark inspection-ready areas clearly"
      ]
    },
    {
      name: "Final Inspection",
      timing: "After roof completion",
      checkpoints: [
        "Roofing material installed per manufacturer specs",
        "No exposed fasteners or unsealed penetrations",
        "Proper starter course and cap installation",
        "Adequate ventilation maintained",
        "All debris removed from roof and property",
        "Gutters and downspouts properly reattached",
        "No visible defects or installation errors"
      ],
      commonIssues: [
        "Improper nail placement (over-driven or exposed)",
        "Missing or damaged shingles",
        "Poor cleanup (nails in yard/driveway)"
      ]
    }
  ],
  ROOF_REPAIR: [
    {
      name: "Final Inspection",
      timing: "After repair completion",
      checkpoints: [
        "Damaged area properly repaired",
        "New materials match existing (or better)",
        "Proper fastening and sealing",
        "Water-tight installation",
        "Flashing intact if near penetrations"
      ]
    }
  ],
  AC_HVAC_CHANGEOUT: [
    {
      name: "Final Inspection",
      timing: "After installation and startup",
      checkpoints: [
        "Equipment properly mounted and secured",
        "Proper refrigerant line installation and insulation",
        "Condensate drain properly trapped and routed",
        "Electrical disconnect within sight and labeled",
        "Proper equipment clearances maintained",
        "Thermostat properly installed and functional",
        "System operational and cycling properly",
        "Data plates visible and equipment labeled"
      ],
      commonIssues: [
        "Incorrect thermostat wiring",
        "Condensate drain not properly trapped",
        "Insufficient clearances around equipment"
      ],
      proTips: [
        "Run system before inspector arrives to verify operation",
        "Have all equipment documentation available"
      ]
    }
  ],
  WATER_HEATER: [
    {
      name: "Final Inspection",
      timing: "After installation",
      checkpoints: [
        "Water heater properly secured (earthquake straps)",
        "TPR valve properly installed with drain tube to 6\" from floor",
        "Drain pan installed with drain to exterior (if required)",
        "Proper venting (gas units - no gaps or damage)",
        "Gas line properly sized and supported",
        "Electrical connections proper (electric units)",
        "Water connections leak-free and properly supported",
        "Expansion tank installed (closed systems)",
        "Proper clearances from combustibles"
      ],
      commonIssues: [
        "Missing or improper earthquake straps",
        "TPR drain tube too short or improper material",
        "Venting gaps or improper slope"
      ]
    }
  ],
  ELECTRICAL_PANEL: [
    {
      name: "Rough Inspection",
      timing: "If walls are open",
      checkpoints: [
        "Service entrance cable properly sized",
        "Grounding electrode conductor properly installed",
        "Ground rod(s) properly driven and connected",
        "Panel location meets clearance requirements",
        "Proper conduit installation"
      ]
    },
    {
      name: "Final Inspection",
      timing: "Panel energized and complete",
      checkpoints: [
        "Panel properly secured and grounded",
        "All breakers properly labeled and rated",
        "No double-tapped breakers (unless listed for it)",
        "Proper wire sizing for all circuits",
        "AFCI/GFCI protection where required",
        "Dead front cover secure with no openings",
        "Working clearances maintained (30\" min)",
        "Load calculation on file",
        "Main disconnect clearly marked",
        "Panel directory complete and accurate"
      ],
      commonIssues: [
        "Missing or incorrect breaker labels",
        "Improper wire stripping or terminations",
        "Double-tapped neutrals",
        "Missing AFCI/GFCI protection"
      ],
      proTips: [
        "Have load calculation available for inspector",
        "Label everything clearly before inspection",
        "Test all circuits before calling for inspection"
      ]
    }
  ],
  ELECTRICAL_REWIRING: [
    {
      name: "Rough Inspection",
      timing: "Before covering walls/ceilings",
      checkpoints: [
        "All boxes properly secured and supported",
        "Cables properly secured within 12\" of boxes",
        "Proper wire gauge for circuit amperage",
        "AFCI/GFCI protection where required",
        "Proper stapling and protection of cables",
        "Correct height for receptacles and switches",
        "Kitchen counter outlets spaced correctly",
        "Bathroom GFCI outlets present"
      ],
      commonIssues: [
        "Cables not properly secured",
        "Wrong wire gauge for circuit",
        "Missing AFCI/GFCI protection"
      ]
    },
    {
      name: "Final Inspection",
      timing: "All devices installed",
      checkpoints: [
        "All outlets and switches functional",
        "Proper grounding on all circuits",
        "Cover plates installed",
        "GFCI outlets test properly",
        "Lighting fixtures secure and operational"
      ]
    }
  ],
  EV_CHARGER: [
    {
      name: "Final Inspection",
      timing: "After installation",
      checkpoints: [
        "Charger properly mounted and secured",
        "Proper circuit breaker size and type",
        "Correct wire gauge for circuit length",
        "GFCI protection if required by code",
        "Grounding verified",
        "Charger operational and charging properly",
        "Circuit labeled at panel"
      ]
    }
  ],
  GENERATOR_INSTALL: [
    {
      name: "Electrical Rough",
      timing: "Before backfill",
      checkpoints: [
        "Conduit properly installed and supported",
        "Transfer switch location approved",
        "Proper wire sizing",
        "Grounding system complete"
      ]
    },
    {
      name: "Gas Rough",
      timing: "Before backfill",
      checkpoints: [
        "Gas line properly sized",
        "Proper pipe support and protection",
        "Shutoff valve accessible"
      ]
    },
    {
      name: "Final Inspection",
      timing: "Generator set and operational",
      checkpoints: [
        "Generator properly set on pad",
        "Proper setbacks from openings maintained",
        "Transfer switch properly installed",
        "Generator operational and load tested",
        "Gas connections leak-free",
        "Electrical connections secure",
        "Proper labeling of disconnect"
      ]
    }
  ],
  PLUMBING_MAIN_LINE: [
    {
      name: "Underground/Rough Inspection",
      timing: "Before backfill",
      checkpoints: [
        "Proper pipe size and material",
        "Correct slope for drainage (1/4\" per foot min)",
        "Cleanout accessible at required locations",
        "No damage to pipe",
        "Proper bedding and backfill material",
        "Connection to existing system proper"
      ],
      commonIssues: [
        "Improper slope (too flat or reversed)",
        "Damaged pipe from excavation",
        "Missing or inaccessible cleanouts"
      ]
    },
    {
      name: "Final Inspection",
      timing: "After backfill and restoration",
      checkpoints: [
        "System tested and flowing properly",
        "No leaks at connections",
        "Grade restored properly",
        "Cleanout access maintained"
      ]
    }
  ],
  SMALL_BATH_REMODEL: [
    {
      name: "Plumbing Rough",
      timing: "Before covering walls",
      checkpoints: [
        "All supply lines properly sized and secured",
        "Drain lines have proper slope",
        "Shower pan properly installed and tested",
        "Tub/shower valve at correct height",
        "Pressure test passed (if required)"
      ]
    },
    {
      name: "Electrical Rough",
      timing: "Before covering walls",
      checkpoints: [
        "GFCI protection on all bathroom outlets",
        "Exhaust fan wired and vented to exterior",
        "Light fixtures over tub/shower properly rated",
        "Proper clearances from water sources"
      ]
    },
    {
      name: "Final Inspections",
      timing: "After completion",
      checkpoints: [
        "All fixtures installed and functional",
        "No leaks at any connection",
        "GFCI outlets test properly",
        "Exhaust fan operational",
        "Proper ventilation confirmed"
      ]
    }
  ],
  KITCHEN_REMODEL: [
    {
      name: "Plumbing Rough",
      timing: "Before walls closed",
      checkpoints: [
        "Supply lines properly sized",
        "Drain lines proper size and slope",
        "Dishwasher air gap or high loop",
        "Gas line for range (if applicable)"
      ]
    },
    {
      name: "Electrical Rough",
      timing: "Before walls closed",
      checkpoints: [
        "Counter outlets every 4 feet",
        "GFCI protection where required",
        "Dedicated circuits for appliances",
        "Range/oven circuit proper size",
        "Dishwasher dedicated circuit"
      ]
    },
    {
      name: "Final Inspections",
      timing: "All trades complete",
      checkpoints: [
        "All appliances functional",
        "No plumbing leaks",
        "All outlets and lights work",
        "Exhaust fan vented properly",
        "Gas connections leak-free"
      ]
    }
  ],
  WINDOW_DOOR_REPLACEMENT: [
    {
      name: "Final Inspection",
      timing: "After installation",
      checkpoints: [
        "Product approval sticker visible",
        "Proper installation per manufacturer",
        "Flashing properly installed",
        "No gaps or air leaks",
        "Operates smoothly",
        "Proper weatherstripping",
        "Impact rating matches approval"
      ],
      commonIssues: [
        "Missing product approval sticker",
        "Improper flashing",
        "Gaps not properly sealed"
      ]
    }
  ],
  SIDING_EXTERIOR: [
    {
      name: "Rough Inspection",
      timing: "After weather barrier, before siding",
      checkpoints: [
        "Weather-resistant barrier properly installed",
        "Proper lapping of WRB material",
        "Flashing at all penetrations",
        "Window/door flashing proper"
      ]
    },
    {
      name: "Final Inspection",
      timing: "Siding complete",
      checkpoints: [
        "Siding properly fastened",
        "Proper lap and spacing",
        "All trim installed",
        "No damage to siding",
        "Proper clearance from grade"
      ]
    }
  ],
  DECK_INSTALLATION: [
    {
      name: "Footing Inspection",
      timing: "Before pouring concrete",
      checkpoints: [
        "Footing holes proper depth",
        "Proper diameter",
        "Undisturbed soil at bottom",
        "Rebar properly placed",
        "Post bases set correctly"
      ]
    },
    {
      name: "Framing Inspection",
      timing: "Before decking",
      checkpoints: [
        "Ledger properly attached to house",
        "Proper flashing at ledger",
        "Joist sizing and spacing correct",
        "Beam and post connections solid",
        "Proper joist hangers used",
        "Adequate bracing"
      ]
    },
    {
      name: "Final Inspection",
      timing: "Deck complete",
      checkpoints: [
        "Decking properly fastened",
        "Railing height 36\" minimum",
        "Balusters spaced 4\" max",
        "Stairs meet code (rise/run)",
        "Handrail on stairs if required",
        "Sturdy and safe"
      ]
    }
  ],
  FENCE_INSTALLATION: [
    {
      name: "Final Inspection",
      timing: "Fence complete",
      checkpoints: [
        "Fence height meets code",
        "Posts set properly",
        "On property lines (not encroaching)",
        "Gates functional",
        "Sturdy construction"
      ]
    }
  ],
  POOL_BARRIER: [
    {
      name: "Final Inspection",
      timing: "Barrier complete - CRITICAL SAFETY",
      checkpoints: [
        "Barrier height 4 feet minimum",
        "Picket spacing 4 inches maximum",
        "Gate self-closing and self-latching",
        "Latch at least 54\" from ground",
        "No climbable elements within 3 feet",
        "Barrier completely surrounds pool",
        "No gaps under barrier over 4 inches"
      ],
      commonIssues: [
        "Gate not self-closing properly",
        "Latch too low or doesn't catch",
        "Gaps under fence too large",
        "Climbable objects near fence"
      ],
      proTips: [
        "This is a LIFE SAFETY inspection - inspector will be thorough",
        "Test gate closure multiple times before inspection",
        "Cannot get certificate of occupancy without passing"
      ]
    }
  ],
  ROOM_ADDITION: [
    {
      name: "Foundation Inspection",
      timing: "Before pouring concrete",
      checkpoints: [
        "Footings proper depth and width",
        "Rebar properly placed and tied",
        "Forms square and level",
        "Proper embedment depths"
      ]
    },
    {
      name: "Framing Inspection",
      timing: "Before insulation",
      checkpoints: [
        "All framing members proper size",
        "Proper nailing patterns",
        "Headers properly sized",
        "Shear walls properly nailed",
        "Structural connections solid",
        "Hurricane straps where required"
      ]
    },
    {
      name: "Rough Inspections",
      timing: "Each trade before drywall",
      checkpoints: [
        "Plumbing: all pipes, drains, vents",
        "Electrical: all boxes, cables, circuits",
        "Mechanical: ductwork, equipment",
        "Insulation: proper R-value and installation"
      ]
    },
    {
      name: "Final Inspections",
      timing: "Each trade completion",
      checkpoints: [
        "All systems functional",
        "Energy compliance verified",
        "Life safety systems operational",
        "Smoke detectors installed"
      ]
    }
  ],
  FOUNDATION_REPAIR: [
    {
      name: "Pre-Repair Inspection",
      timing: "After excavation",
      checkpoints: [
        "Problem area fully exposed",
        "Engineer on-site (may be required)",
        "Repair method approved by inspector",
        "Materials match engineer's specs"
      ]
    },
    {
      name: "Progress Inspections",
      timing: "During critical phases",
      checkpoints: [
        "Pier installation per engineer plans",
        "Proper depths achieved",
        "Brackets and connections proper",
        "Load transfer verified"
      ]
    },
    {
      name: "Final Inspection",
      timing: "Repair complete",
      checkpoints: [
        "All work per engineer plans",
        "Proper backfill and compaction",
        "Grade restored properly",
        "Engineer sign-off (if required)"
      ]
    }
  ],
};

export default function InspectionCheckpoints({ jobType }: InspectionCheckpointsProps) {
  const inspections = INSPECTION_CHECKPOINTS[jobType];
  
  if (!inspections || inspections.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
          <ClipboardCheck size={20} className="text-purple-600 dark:text-purple-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Inspection Checkpoints
          </h3>
          <p className="text-xs text-muted-foreground">
            What inspectors look for at each phase - prepare ahead to pass quickly
          </p>
        </div>
      </div>

      {/* Inspections */}
      <div className="space-y-4">
        {inspections.map((inspection, idx) => (
          <div key={idx} className="border border-border rounded-lg p-3 space-y-3">
            {/* Inspection Header */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center text-xs font-bold text-purple-600">
                    {idx + 1}
                  </span>
                  {inspection.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {inspection.timing}
                </p>
              </div>
            </div>

            {/* Checkpoints */}
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">✓ Inspector Will Check:</p>
              <div className="space-y-1.5">
                {inspection.checkpoints.map((checkpoint, cidx) => (
                  <div key={cidx} className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-success mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-foreground">{checkpoint}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Issues */}
            {inspection.commonIssues && inspection.commonIssues.length > 0 && (
              <div className="bg-warning/10 border border-warning/30 rounded-lg p-2.5">
                <p className="text-xs font-semibold text-warning-foreground mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle size={14} />
                  Common Issues That Fail:
                </p>
                <div className="space-y-1">
                  {inspection.commonIssues.map((issue, iidx) => (
                    <div key={iidx} className="flex items-start gap-1.5">
                      <span className="text-warning-foreground mt-0.5">•</span>
                      <span className="text-xs text-warning-foreground">{issue}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pro Tips */}
            {inspection.proTips && inspection.proTips.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2.5">
                <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1.5">
                  💡 Pro Tips:
                </p>
                <div className="space-y-1">
                  {inspection.proTips.map((tip, tidx) => (
                    <div key={tidx} className="flex items-start gap-1.5">
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                      <span className="text-xs text-blue-800 dark:text-blue-200">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* General Advice */}
      <div className="bg-muted rounded-lg p-3 space-y-2">
        <p className="text-xs font-semibold text-foreground">📋 General Inspection Tips:</p>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <span>•</span>
            <span>Call for inspection 24-48 hours in advance</span>
          </div>
          <div className="flex items-start gap-2">
            <span>•</span>
            <span>Have permit card visible at job site</span>
          </div>
          <div className="flex items-start gap-2">
            <span>•</span>
            <span>Be present or have contractor available during inspection</span>
          </div>
          <div className="flex items-start gap-2">
            <span>•</span>
            <span>If failed, correct issues immediately and reschedule</span>
          </div>
          <div className="flex items-start gap-2">
            <span>•</span>
            <span>Take photos of completed work for your records</span>
          </div>
        </div>
      </div>
    </div>
  );
}
