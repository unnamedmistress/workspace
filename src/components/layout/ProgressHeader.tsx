import { ArrowLeft, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProgressHeaderProps {
  title: string;
  progress: number; // 0-100
  onBack?: () => void;
  showMenu?: boolean;
}

export default function ProgressHeader({
  title,
  progress,
  onBack,
  showMenu = false,
}: ProgressHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigator.vibrate?.(10);
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const normalizedProgress = Math.min(100, Math.max(0, progress));

  return (
    <header className="compact-header">
      <div className="flex items-center justify-between mb-1.5">
        <button
          onClick={handleBack}
          className="p-1.5 -ml-1.5 rounded-lg hover:bg-muted transition-colors tap-target flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="Go back"
        >
          <ArrowLeft size={20} className="text-foreground" aria-hidden="true" />
        </button>
        
        <h1 className="text-sm font-semibold text-foreground flex-1 text-center truncate px-2">
          {title}
        </h1>
        
        {showMenu ? (
          <button
            className="p-1.5 -mr-1.5 rounded-lg hover:bg-muted transition-colors tap-target flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="More options"
          >
            <MoreVertical size={20} className="text-foreground" aria-hidden="true" />
          </button>
        ) : (
          <div className="w-8" aria-hidden="true" /> // Spacer for alignment
        )}
      </div>
      
      <div 
        className="progress-track" 
        role="progressbar" 
        aria-valuenow={normalizedProgress} 
        aria-valuemin={0} 
        aria-valuemax={100}
        aria-label={`Progress: ${normalizedProgress}%`}
      >
        <div 
          className="progress-fill"
          style={{ width: `${normalizedProgress}%` }}
        />
      </div>
    </header>
  );
}