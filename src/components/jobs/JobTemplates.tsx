import { Sparkles, ChevronRight } from "lucide-react";
import { JobTemplate, JOB_TEMPLATES, getPopularTemplates } from "@/data/jobTemplates";

interface JobTemplatesProps {
  onSelectTemplate: (template: JobTemplate) => void;
  onDismiss: () => void;
}

export default function JobTemplates({ onSelectTemplate, onDismiss }: JobTemplatesProps) {
  const popularTemplates = getPopularTemplates();
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            Quick Start Templates
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Start with a pre-filled common scenario
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-xs font-medium text-primary hover:text-primary/80"
        >
          Start from scratch →
        </button>
      </div>

      {/* Popular Templates */}
      {popularTemplates.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            ⭐ Most Popular
          </h3>
          <div className="space-y-2">
            {popularTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="w-full p-3 rounded-xl border-2 border-border hover:border-primary/50 text-left flex items-center gap-3 transition-all bg-card"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{template.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground">{template.name}</h4>
                  <p className="text-xs text-muted-foreground truncate">{template.description}</p>
                </div>
                <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All Templates */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
          All Templates ({JOB_TEMPLATES.length})
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {JOB_TEMPLATES.filter(t => !t.popular).map((template) => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className="w-full p-3 rounded-xl border-2 border-border hover:border-primary/50 text-left flex items-center gap-3 transition-all bg-card"
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">{template.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground">{template.name}</h4>
                <p className="text-xs text-muted-foreground truncate">{template.description}</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <p className="text-xs text-blue-900 dark:text-blue-100">
          <strong>💡 Templates save time!</strong> Each template pre-fills common details for that scenario. You can still customize everything before submitting.
        </p>
      </div>
    </div>
  );
}
