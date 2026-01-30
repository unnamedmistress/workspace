import { ClipboardCheck, Phone, ExternalLink, AlertCircle } from "lucide-react";
import { getRequiredInspections } from "@/data/permitLogic";

interface InspectionGuideProps {
  permitTypes: string[];
  jurisdictionId?: string;
}

const JURISDICTION_INSPECTION_INFO: Record<string, {
  schedulingPortal?: string;
  phone: string;
  advanceNotice: string;
  hours: string;
  tips: string[];
}> = {
  "st-petersburg": {
    schedulingPortal: "https://www.stpete.org/government/development_services/building_construction_services/building_permits.php",
    phone: "(727) 893-7388",
    advanceNotice: "24 hours",
    hours: "Mon-Fri, 8:00 AM - 4:30 PM",
    tips: [
      "Call or schedule online at least 24 hours before inspection needed",
      "Have permit number ready when scheduling",
      "Inspector will verify work complies with approved plans",
      "Keep permit posted at job site during inspections"
    ]
  },
  "clearwater": {
    schedulingPortal: "https://www.myclearwater.com/government/departments/planning-development/building-permits",
    phone: "(727) 562-4567",
    advanceNotice: "24 hours",
    hours: "Mon-Fri, 8:00 AM - 4:00 PM",
    tips: [
      "Schedule 24 hours in advance via phone or online portal",
      "Morning inspections typically scheduled for 8 AM - 12 PM",
      "Afternoon inspections typically 1 PM - 4 PM",
      "Have all required documentation on site"
    ]
  },
  "pinellas-county": {
    schedulingPortal: "https://pinellas.gov/permits-and-inspections/building-permits/",
    phone: "(727) 464-3199",
    advanceNotice: "24-48 hours",
    hours: "Mon-Fri, 8:00 AM - 4:00 PM",
    tips: [
      "Schedule at least 24-48 hours in advance",
      "Have permit number and job address ready",
      "Inspection windows are typically 2-4 hours",
      "Contractor or property owner must be present"
    ]
  },
  "dunedin": {
    phone: "(727) 298-3230",
    advanceNotice: "24 hours",
    hours: "Mon-Fri, 8:00 AM - 3:30 PM",
    tips: [
      "Call 24 hours ahead to schedule",
      "Inspections conducted Mon-Fri only",
      "Have permit card posted and visible",
      "Work area must be accessible and safe"
    ]
  },
};

function InspectionStep({ 
  number, 
  title, 
  timing, 
  description 
}: { 
  number: number; 
  title: string; 
  timing: string; 
  description?: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{number}</span>
        </div>
      </div>
      <div className="flex-1 pb-4">
        <h4 className="text-sm font-semibold text-foreground mb-1">{title}</h4>
        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">{timing}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

export default function InspectionGuide({ 
  permitTypes, 
  jurisdictionId = "st-petersburg" 
}: InspectionGuideProps) {
  const inspections = getRequiredInspections(permitTypes);
  const jurisdictionInfo = JURISDICTION_INSPECTION_INFO[jurisdictionId] || JURISDICTION_INSPECTION_INFO["st-petersburg"];
  
  if (inspections.length === 0) {
    return null;
  }
  
  // Map generic inspections to step-by-step guide
  const inspectionSteps = inspections.map((inspection, idx) => {
    const timingMap: Record<string, string> = {
      "Rough Plumbing (before covering walls)": "Schedule before drywall installation",
      "Rough Electrical (before covering walls)": "Schedule before drywall installation",
      "Framing/Structural (if walls altered)": "Schedule after framing complete",
      "Dry-In Inspection": "Schedule after roof deck and underlayment complete",
      "Mechanical Final": "Schedule after AC/HVAC installation complete",
      "Final Plumbing": "Schedule after all plumbing fixtures installed",
      "Final Electrical": "Schedule after all electrical work complete",
      "Final Building": "Schedule when all work is complete",
      "Final Roofing": "Schedule when roofing is fully complete"
    };
    
    return {
      number: idx + 1,
      title: inspection,
      timing: timingMap[inspection] || "Schedule when work reaches this stage",
      description: undefined
    };
  });
  
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <ClipboardCheck size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Required Inspections
            </h3>
            <p className="text-xs text-muted-foreground">
              You'll need {inspections.length} inspection{inspections.length > 1 ? "s" : ""} for this project
            </p>
          </div>
        </div>
        
        {/* Inspection Timeline */}
        <div className="space-y-0 border-l-2 border-blue-200 dark:border-blue-800 ml-4 pl-4">
          {inspectionSteps.map(step => (
            <InspectionStep key={step.number} {...step} />
          ))}
        </div>
      </div>
      
      {/* Scheduling Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-foreground mb-3">How to Schedule</h4>
        
        <div className="space-y-3 mb-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Advance Notice Required</p>
            <p className="text-sm text-foreground">{jurisdictionInfo.advanceNotice}</p>
          </div>
          
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Inspection Hours</p>
            <p className="text-sm text-foreground">{jurisdictionInfo.hours}</p>
          </div>
        </div>
        
        {/* Contact Methods */}
        <div className="flex flex-wrap gap-2 mb-4">
          <a
            href={`tel:${jurisdictionInfo.phone}`}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            <Phone size={14} />
            {jurisdictionInfo.phone}
          </a>
          {jurisdictionInfo.schedulingPortal && (
            <a
              href={jurisdictionInfo.schedulingPortal}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-foreground rounded-lg text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ExternalLink size={14} />
              Schedule Online
            </a>
          )}
        </div>
        
        {/* Tips */}
        <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <h5 className="text-xs font-semibold text-amber-900 dark:text-amber-100">Inspection Tips</h5>
          </div>
          <ul className="space-y-1.5 ml-6">
            {jurisdictionInfo.tips.map((tip, idx) => (
              <li key={idx} className="text-xs text-amber-800 dark:text-amber-200">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
