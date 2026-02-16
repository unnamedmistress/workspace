import { MapPin, Info, ExternalLink } from "lucide-react";

interface JurisdictionInfoProps {
  city: string;
  servingOffice?: string;
  explanation?: string;
  officialUrl?: string;
}

const JURISDICTION_DATA: Record<string, {
  servingOffice: string;
  explanation: string;
  officialUrl: string;
  phone: string;
}> = {
  "largo": {
    servingOffice: "Clearwater Central Permitting",
    explanation: "Largo building permits are processed through Clearwater Central Permitting, which serves multiple Pinellas County cities including Largo, Safety Harbor, and Belleair.",
    officialUrl: "https://www.myclearwater.com/government/departments/planning-development/building-permits",
    phone: "(727) 562-4567"
  },
  "safety-harbor": {
    servingOffice: "Clearwater Central Permitting",
    explanation: "Safety Harbor uses Clearwater Central Permitting for all building permits and inspections.",
    officialUrl: "https://www.myclearwater.com/government/departments/planning-development/building-permits",
    phone: "(727) 562-4567"
  },
  "belleair": {
    servingOffice: "Clearwater Central Permitting",
    explanation: "Belleair building services are provided by Clearwater Central Permitting.",
    officialUrl: "https://www.myclearwater.com/government/departments/planning-development/building-permits",
    phone: "(727) 562-4567"
  },
  "st-petersburg": {
    servingOffice: "St. Petersburg Building Department",
    explanation: "St. Petersburg has its own building department located in City Hall.",
    officialUrl: "https://www.stpete.org/government/development_services/building_construction_services",
    phone: "(727) 893-7388"
  },
  "clearwater": {
    servingOffice: "Clearwater Building Department",
    explanation: "Clearwater manages its own permits at the Central Permitting office.",
    officialUrl: "https://www.myclearwater.com/government/departments/planning-development/building-permits",
    phone: "(727) 562-4567"
  },
  "dunedin": {
    servingOffice: "City of Dunedin Building Division",
    explanation: "Dunedin has its own building department at City Hall.",
    officialUrl: "https://www.dunedinfl.gov/building",
    phone: "(727) 298-3230"
  },
  "st-pete-beach": {
    servingOffice: "Pinellas County Building Department",
    explanation: "St. Pete Beach is served by the Pinellas County Building Department, not the city.",
    officialUrl: "https://pinellas.gov/permits-and-inspections/building-permits/",
    phone: "(727) 464-3199"
  },
};

export default function JurisdictionInfo({ 
  city, 
  servingOffice, 
  explanation, 
  officialUrl 
}: JurisdictionInfoProps) {
  const cityKey = city.toLowerCase().replace(/\s+/g, "-");
  const data = JURISDICTION_DATA[cityKey];
  
  const office = servingOffice || data?.servingOffice;
  const explainText = explanation || data?.explanation;
  const url = officialUrl || data?.officialUrl;
  const phone = data?.phone;
  
  if (!office && !explainText) {
    return null;
  }
  
  // Show alert if the serving office is different from the city
  const isDifferentOffice = office && !office.toLowerCase().includes(city.toLowerCase());
  
  return (
    <div className={`rounded-lg p-4 border ${
      isDifferentOffice 
        ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
        : "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800"
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isDifferentOffice
            ? "bg-blue-500/10"
            : "bg-gray-500/10"
        }`}>
          {isDifferentOffice ? (
            <Info size={20} className="text-blue-600 dark:text-blue-400" />
          ) : (
            <MapPin size={20} className="text-gray-600 dark:text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            {city} Permitting Office
          </h3>
          {office && (
            <p className="text-sm font-medium text-foreground mb-1">
              {office}
            </p>
          )}
          {explainText && (
            <p className="text-xs text-muted-foreground mb-2">
              {explainText}
            </p>
          )}
          {isDifferentOffice && (
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-md px-2 py-1.5 mb-2">
              <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                📍 This is correct - {city} residents do go to {office} for permits.
              </p>
            </div>
          )}
          {phone && (
            <p className="text-xs text-muted-foreground mb-2">
              <strong>Phone:</strong> <a href={`tel:${phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">{phone}</a>
            </p>
          )}
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ExternalLink size={12} />
              Visit Official Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
