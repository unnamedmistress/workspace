import { Phone, Mail, ExternalLink, CheckCircle, Star, Award } from "lucide-react";
import { Professional, getProfessionalsForJobType } from "@/data/professionalDirectory";
import { JobType } from "@/types";

interface ProfessionalDirectoryProps {
  jobType: JobType;
  jurisdictionId?: string;
  title?: string;
  subtitle?: string;
}

function ProfessionalCard({ professional }: { professional: Professional }) {
  const { name, companyName, contact, licenses, countyApproved, rating, reviewCount, notes, specialties } = professional;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-foreground">{name}</h4>
          <p className="text-xs text-muted-foreground">{companyName}</p>
        </div>
        {countyApproved && (
          <div className="flex-shrink-0">
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
              <CheckCircle size={12} className="text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-700 dark:text-green-300">County Approved</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Rating */}
      {rating && (
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
          </div>
          {reviewCount && (
            <span className="text-xs text-muted-foreground">({reviewCount} reviews)</span>
          )}
        </div>
      )}
      
      {/* Licenses */}
      {licenses.length > 0 && (
        <div className="mb-2">
          {licenses.map((license, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-1">
              <Award size={12} className="text-blue-600 dark:text-blue-400" />
              <span className="text-xs text-muted-foreground">
                {license.type}: <span className="font-mono">{license.number}</span>
                {license.verified && <span className="text-green-600 dark:text-green-400"> ✓</span>}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {/* Specialties */}
      {specialties.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {specialties.slice(0, 3).map((specialty, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-xs text-blue-700 dark:text-blue-300 rounded-full"
            >
              {specialty.replace(/-/g, " ")}
            </span>
          ))}
          {specialties.length > 3 && (
            <span className="px-2 py-0.5 text-xs text-muted-foreground">
              +{specialties.length - 3} more
            </span>
          )}
        </div>
      )}
      
      {/* Notes */}
      {notes && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {notes}
        </p>
      )}
      
      {/* Contact */}
      <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
        <a
          href={`tel:${contact.phone}`}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
        >
          <Phone size={12} />
          {contact.phone}
        </a>
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-foreground rounded-lg text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Mail size={12} />
            Email
          </a>
        )}
        {contact.website && (
          <a
            href={contact.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-foreground rounded-lg text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ExternalLink size={12} />
            Website
          </a>
        )}
      </div>
    </div>
  );
}

export default function ProfessionalDirectory({
  jobType,
  jurisdictionId = "st-petersburg",
  title = "Recommended Professionals",
  subtitle
}: ProfessionalDirectoryProps) {
  const professionals = getProfessionalsForJobType(jobType, jurisdictionId);
  
  if (professionals.length === 0) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
        <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-xs text-muted-foreground mb-3">
          We're building our directory of licensed professionals for this project type.
        </p>
        <p className="text-xs text-muted-foreground">
          Contact Pinellas County Building at <a href="tel:+17274643199" className="text-blue-600 dark:text-blue-400 hover:underline">(727) 464-3199</a> for referrals.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      
      <div className="space-y-3">
        {professionals.map(professional => (
          <ProfessionalCard key={professional.id} professional={professional} />
        ))}
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-muted-foreground">
          <strong>Note:</strong> All professionals listed are licensed and have been verified. 
          Ratings are based on public reviews. Always verify licensing status before hiring.
        </p>
        <a
          href="https://www.myfloridalicense.com/CheckLicense"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ExternalLink size={12} />
          Verify Florida Licenses
        </a>
      </div>
    </div>
  );
}
