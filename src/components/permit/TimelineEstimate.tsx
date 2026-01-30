import { Calendar, Clock, CheckCircle } from "lucide-react";
import { JobType } from "@/types";

interface TimelineEstimateProps {
  jobType: JobType;
  jurisdiction?: string;
}

interface TimelinePhase {
  phase: string;
  duration: string;
  description: string;
}

const PERMIT_TIMELINES: Record<JobType, {
  reviewTime: string;
  firstInspection: string;
  totalProcess: string;
  phases: TimelinePhase[];
  notes?: string;
}> = {
  AC_HVAC_CHANGEOUT: {
    reviewTime: "1-2 business days",
    firstInspection: "Schedule when ready",
    totalProcess: "3-5 days typical",
    phases: [
      { phase: "Submit Application", duration: "Day 1", description: "Online or in-person submission" },
      { phase: "Plan Review", duration: "1-2 days", description: "Express permit review" },
      { phase: "Approval & Fee Payment", duration: "Same day", description: "Pay fees when approved" },
      { phase: "Installation", duration: "1 day", description: "Licensed contractor installs" },
      { phase: "Final Inspection", duration: "Call when ready", description: "Typically same or next day" },
    ],
    notes: "Express permit - one of the fastest processes"
  },
  WATER_HEATER: {
    reviewTime: "1-2 business days",
    firstInspection: "Schedule when ready",
    totalProcess: "3-5 days typical",
    phases: [
      { phase: "Submit Application", duration: "Day 1", description: "Express permit application" },
      { phase: "Approval", duration: "1-2 days", description: "Quick review process" },
      { phase: "Installation", duration: "Few hours", description: "Licensed plumber installs" },
      { phase: "Final Inspection", duration: "Call when ready", description: "Quick inspection" },
    ]
  },
  RE_ROOFING: {
    reviewTime: "3-5 business days",
    firstInspection: "1-2 days after approval",
    totalProcess: "1-2 weeks typical",
    phases: [
      { phase: "Submit Application", duration: "Day 1", description: "Full plans and mitigation affidavit" },
      { phase: "Plan Review", duration: "3-5 days", description: "Structural and code review" },
      { phase: "Approval & Permit Issuance", duration: "1 day", description: "Pick up permit" },
      { phase: "Work Begins", duration: "Schedule", description: "Tear-off and deck inspection" },
      { phase: "Dry-In Inspection", duration: "Before covering", description: "Critical checkpoint" },
      { phase: "Roof Completion", duration: "1-3 days", description: "Finish installation" },
      { phase: "Final Inspection", duration: "Call when ready", description: "Final sign-off" },
    ],
    notes: "Timeline depends on weather and crew availability"
  },
  ROOF_REPAIR: {
    reviewTime: "1-3 business days",
    firstInspection: "After repair",
    totalProcess: "3-7 days typical",
    phases: [
      { phase: "Submit Application", duration: "Day 1", description: "For repairs over 100 sq ft" },
      { phase: "Approval", duration: "1-3 days", description: "Minor review" },
      { phase: "Repair Work", duration: "1 day", description: "Complete repair" },
      { phase: "Final Inspection", duration: "Call when ready", description: "Verify work complete" },
    ]
  },
  ELECTRICAL_PANEL: {
    reviewTime: "2-4 business days",
    firstInspection: "After rough-in",
    totalProcess: "5-10 days typical",
    phases: [
      { phase: "Submit Application", duration: "Day 1", description: "With load calculation" },
      { phase: "Plan Review", duration: "2-4 days", description: "Electrical review" },
      { phase: "Approval", duration: "1 day", description: "Permit issued" },
      { phase: "Installation", duration: "4-6 hours", description: "Licensed electrician only" },
      { phase: "Rough Inspection", duration: "If drywall open", description: "Before covering walls" },
      { phase: "Final Inspection", duration: "Call when ready", description: "Panel energized and labeled" },
    ],
    notes: "Power company coordination may add 1-2 days"
  },
  ELECTRICAL_REWIRING: {
    reviewTime: "2-4 business days",
    firstInspection: "Before covering walls",
    totalProcess: "1-2 weeks typical",
    phases: [
      { phase: "Submit Application", duration: "Day 1", description: "Wiring plan and load calc" },
      { phase: "Plan Review", duration: "2-4 days", description: "Review routing and capacity" },
      { phase: "Rough-In Work", duration: "1-3 days", description: "Run wiring, set boxes" },
      { phase: "Rough Inspection", duration: "Before drywall", description: "Inspector verifies work" },
      { phase: "Finish Work", duration: "1 day", description: "Devices, covers, testing" },
      { phase: "Final Inspection", duration: "Call when ready", description: "Everything functional" },
    ]
  },
  EV_CHARGER: {
    reviewTime: "1-2 business days",
    firstInspection: "Final only (typically)",
    totalProcess: "3-5 days typical",
    phases: [
      { phase: "Submit Application", duration: "Day 1", description: "Simple express permit" },
      { phase: "Approval", duration: "1-2 days", description: "Quick review" },
      { phase: "Installation", duration: "2-4 hours", description: "Mount and wire charger" },
      { phase: "Final Inspection", duration: "Call when ready", description: "Test charging function" },
    ],
    notes: "One of the simplest electrical permits"
  },
  GENERATOR_INSTALL: {
    reviewTime: "3-5 business days",
    firstInspection: "After rough-in",
    totalProcess: "1-2 weeks typical",
    phases: [
      { phase: "Submit Application", duration: "Day 1", description: "Electrical + gas/fuel permits" },
      { phase: "Plan Review", duration: "3-5 days", description: "Multiple trades review" },
      { phase: "Concrete Pad", duration: "1 day", description: "If needed" },
      { phase: "Rough Inspections", duration: "As work progresses", description: "Gas line, electrical" },
      { phase: "Generator Set", duration: "1 day", description: "Position and connect" },
      { phase: "Final Inspections", duration: "Multiple", description: "Electrical, gas, operational test" },
    ],
    notes: "Requires coordination with utility company"
  },
  PLUMBING_MAIN_LINE: {
    reviewTime: "2-3 business days",
    firstInspection: "Before backfill",
    totalProcess: "5-10 days typical",
    phases: [
      { phase: "Submit Application", duration: "Day 1", description: "Line repair/replacement plans" },
      { phase: "Approval", duration: "2-3 days", description: "Review routing and materials" },
      { phase: "Excavation", duration: "1-2 days", description: "Dig trench, expose line" },
      { phase: "Rough Inspection", duration: "Before backfill", description: "Inspector views installation" },
      { phase: "Backfill & Restore", duration: "1 day", description: "Fill trench, restore grade" },
      { phase: "Final Inspection", duration: "After settling", description: "Verify no issues" },
    ],
    notes: "Weather and ground conditions affect timeline"
  },
  SMALL_BATH_REMODEL: {
    reviewTime: "3-7 business days",
    firstInspection: "After rough work",
    totalProcess: "2-4 weeks typical",
    phases: [
      { phase: "Submit Application", duration: "Day 1", description: "May need multiple trade permits" },
      { phase: "Plan Review", duration: "3-7 days", description: "Depends on scope" },
      { phase: "Demo", duration: "1-2 days", description: "Remove old fixtures/finishes" },
      { phase: "Rough Work", duration: "2-3 days", description: "Plumbing, electrical, framing" },
      { phase: "Rough Inspections", duration: "Schedule each", description: "Before covering walls" },
      { phase: "Finish Work", duration: "1 week", description: "Drywall, tile, fixtures" },
      { phase: "Final Inspections", duration: "Multiple", description: "Each trade signs off" },
    ],
    notes: "Timeline varies greatly based on scope"
  },
  KITCHEN_REMODEL: {
    reviewTime: "5-10 business days",
    firstInspection: "After demolition",
    totalProcess: "3-6 weeks typical",
    phases: [
      { phase: "Submit Application", duration: "Day 1", description: "Comprehensive plans required" },
      { phase: "Plan Review", duration: "5-10 days", description: "Multiple trades review" },
      { phase: "Demolition", duration: "2-3 days", description: "Remove cabinets, fixtures" },
      { phase: "Rough Work", duration: "1 week", description: "Plumbing, electrical, HVAC" },
      { phase: "Rough Inspections", duration: "Coordinate", description: "Each trade inspected" },
      { phase: "Finish Work", duration: "2-3 weeks", description: "Drywall, cabinets, counters" },
      { phase: "Final Inspections", duration: "Multiple", description: "All trades finalized" },
    ],
    notes: "Large project - plan for material lead times"
  },
  WINDOW_DOOR_REPLACEMENT: {
    reviewTime: "2-4 business days",
    firstInspection: "Final only (usually)",
    totalProcess: "5-10 days typical",
    phases: [
      { phase: "Submit Application", duration: "Day 1", description: "Product approval numbers required" },
      { phase: "Plan Review", duration: "2-4 days", description: "Verify approved products" },
      { phase: "Installation", duration: "1-2 days", description: "Remove old, install new" },
      { phase: "Final Inspection", duration: "Call when ready", description: "Check installation quality" },
    ],
    notes: "Product availability affects timeline"
  },
  SIDING_EXTERIOR: {
    reviewTime: "3-5 business days",
    firstInspection: "Before siding over",
    totalProcess: "1-3 weeks typical",
    phases: [
      { phase: "Submit Application", duration: "Day 1", description: "With material specifications" },
      { phase: "Plan Review", duration: "3-5 days", description: "Review materials and methods" },
      { phase: "Remove Old Siding", duration: "1-2 days", description: "Demo existing" },
      { phase: "Rough Inspection", duration: "If WRB visible", description: "Check water barrier" },
      { phase: "Install New Siding", duration: "3-7 days", description: "Depends on building size" },
      { phase: "Final Inspection", duration: "Call when ready", description: "Verify completion" },
    ]
  },
  DECK_INSTALLATION: {
    reviewTime: "5-7 business days",
    firstInspection: "After footings",
    totalProcess: "2-3 weeks typical",
    phases: [
      { phase: "Submit Application", duration: "Day 1", description: "Structural plans required" },
      { phase: "Plan Review", duration: "5-7 days", description: "Structural engineer review" },
      { phase: "Dig Footings", duration: "1 day", description: "Excavate and form" },
      { phase: "Footing Inspection", duration: "Before concrete", description: "Inspector verifies depth/size" },
      { phase: "Pour Concrete", duration: "1 day", description: "Cure time required" },
      { phase: "Frame Deck", duration: "2-3 days", description: "Joists, beams, ledger" },
      { phase: "Framing Inspection", duration: "Before decking", description: "Verify structure" },
      { phase: "Decking & Railing", duration: "2-3 days", description: "Finish surfaces" },
      { phase: "Final Inspection", duration: "Call when ready", description: "Safety and code check" },
    ],
    notes: "Concrete curing adds ~3 days minimum"
  },
  FENCE_INSTALLATION: {
    reviewTime: "1-3 business days",
    firstInspection: "Usually final only",
    totalProcess: "3-7 days typical",
    phases: [
      { phase: "Submit Application", duration: "Day 1", description: "If permit required (>6ft)" },
      { phase: "Approval", duration: "1-3 days", description: "Quick review" },
      { phase: "Installation", duration: "1-3 days", description: "Set posts, install panels" },
      { phase: "Final Inspection", duration: "Call when ready", description: "Height and safety check" },
    ],
    notes: "Many residential fences don't require permits"
  },
  POOL_BARRIER: {
    reviewTime: "3-5 business days",
    firstInspection: "After installation",
    totalProcess: "1-2 weeks typical",
    phases: [
      { phase: "Submit Application", duration: "Day 1", description: "Safety barrier plan" },
      { phase: "Plan Review", duration: "3-5 days", description: "Code compliance review" },
      { phase: "Installation", duration: "1-3 days", description: "Fence, screen, or barrier" },
      { phase: "Final Inspection", duration: "Critical", description: "Must meet pool safety code" },
    ],
    notes: "Safety requirements are strictly enforced"
  },
  ROOM_ADDITION: {
    reviewTime: "2-4 weeks",
    firstInspection: "After site work",
    totalProcess: "2-4 months typical",
    phases: [
      { phase: "Submit Application", duration: "Day 1", description: "Complete architectural plans" },
      { phase: "Plan Review", duration: "2-4 weeks", description: "Comprehensive review - all trades" },
      { phase: "Site Work", duration: "Few days", description: "Survey, stake, clear" },
      { phase: "Foundation", duration: "1 week", description: "Footings, slab/crawl" },
      { phase: "Foundation Inspection", duration: "Critical", description: "Before backfill" },
      { phase: "Framing", duration: "1-2 weeks", description: "Walls, roof structure" },
      { phase: "Framing Inspection", duration: "Before insulation", description: "Structural sign-off" },
      { phase: "Mechanicals", duration: "1 week", description: "Plumbing, electrical, HVAC" },
      { phase: "Rough Inspections", duration: "Each trade", description: "Before drywall" },
      { phase: "Insulation & Drywall", duration: "1-2 weeks", description: "Close up walls" },
      { phase: "Finish Work", duration: "2-4 weeks", description: "Flooring, paint, trim" },
      { phase: "Final Inspections", duration: "Multiple", description: "All trades finalized" },
      { phase: "Certificate of Occupancy", duration: "After finals", description: "Legal to use" },
    ],
    notes: "Major project - weather and material delays common"
  },
  FOUNDATION_REPAIR: {
    reviewTime: "5-10 business days",
    firstInspection: "After excavation",
    totalProcess: "2-4 weeks typical",
    phases: [
      { phase: "Engineer Assessment", duration: "1 week", description: "Before permit - required" },
      { phase: "Submit Application", duration: "Day 1", description: "With sealed engineer plans" },
      { phase: "Plan Review", duration: "5-10 days", description: "Structural review required" },
      { phase: "Excavation", duration: "1-3 days", description: "Expose foundation" },
      { phase: "Rough Inspection", duration: "Before repair", description: "Inspector sees problem" },
      { phase: "Repair Work", duration: "3-7 days", description: "Piers, underpinning, etc." },
      { phase: "Engineer Observation", duration: "May be required", description: "PE oversees critical steps" },
      { phase: "Final Inspection", duration: "After backfill", description: "Verify repair" },
    ],
    notes: "Requires licensed structural engineer involvement"
  },
  DECK_INSTALLATION: {
    reviewTime: "5-7 business days",
    firstInspection: "After footings",
    totalProcess: "2-3 weeks typical",
    phases: [
      { phase: "Submit Application", duration: "Day 1", description: "Structural plans required" },
      { phase: "Plan Review", duration: "5-7 days", description: "Structural review" },
      { phase: "Footings", duration: "1 day", description: "Dig and inspect before concrete" },
      { phase: "Framing", duration: "2-3 days", description: "Build structure" },
      { phase: "Framing Inspection", duration: "Before decking", description: "Verify structure" },
      { phase: "Finish", duration: "2-3 days", description: "Decking and railing" },
      { phase: "Final Inspection", duration: "Call when ready", description: "Safety verification" },
    ]
  },
};

export default function TimelineEstimate({ jobType, jurisdiction = "Pinellas County" }: TimelineEstimateProps) {
  const timeline = PERMIT_TIMELINES[jobType];
  
  if (!timeline) {
    return (
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <Calendar size={20} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Timeline Information
            </h3>
            <p className="text-xs text-muted-foreground">
              Contact your local building department for timeline estimates.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
          <Calendar size={20} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Expected Timeline
          </h3>
          <p className="text-xs text-muted-foreground">
            Typical permit and construction timeline for {jurisdiction}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-muted rounded-lg p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock size={12} className="text-blue-600" />
            <p className="text-xs font-semibold text-muted-foreground">Review</p>
          </div>
          <p className="text-sm font-bold text-foreground">{timeline.reviewTime}</p>
        </div>
        <div className="bg-muted rounded-lg p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CheckCircle size={12} className="text-green-600" />
            <p className="text-xs font-semibold text-muted-foreground">1st Inspect</p>
          </div>
          <p className="text-sm font-bold text-foreground">{timeline.firstInspection}</p>
        </div>
        <div className="bg-muted rounded-lg p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Calendar size={12} className="text-purple-600" />
            <p className="text-xs font-semibold text-muted-foreground">Total</p>
          </div>
          <p className="text-sm font-bold text-foreground">{timeline.totalProcess}</p>
        </div>
      </div>

      {/* Timeline Phases */}
      <div>
        <h4 className="text-xs font-semibold text-foreground mb-3">Process Timeline</h4>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border" />
          
          <div className="space-y-3">
            {timeline.phases.map((phase, idx) => (
              <div key={idx} className="relative flex items-start gap-3 pl-8">
                {/* Timeline dot */}
                <div className="absolute left-0 top-0.5 w-6 h-6 rounded-full bg-blue-500/10 border-2 border-blue-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">{idx + 1}</span>
                </div>
                
                <div className="flex-1 pb-2">
                  <div className="flex items-baseline justify-between gap-2 mb-0.5">
                    <h5 className="text-sm font-medium text-foreground">{phase.phase}</h5>
                    <span className="text-xs font-semibold text-blue-600 shrink-0">{phase.duration}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notes */}
      {timeline.notes && (
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-3">
          <p className="text-xs text-warning-foreground">
            <strong>Note:</strong> {timeline.notes}
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-muted rounded-lg p-3">
        <p className="text-xs text-muted-foreground">
          ⏱️ <strong>Timelines are estimates.</strong> Actual duration depends on workload, weather, inspections, and project complexity. Plan for potential delays.
        </p>
      </div>
    </div>
  );
}
