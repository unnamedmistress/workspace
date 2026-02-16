import { Camera, Eye, Image, ChevronUp, ChevronDown } from "lucide-react";

interface ActionBarProps {
  onAddPhoto: () => void;
  onPreview: () => void;
  canPreview: boolean;
  photoCount?: number;
  photosExpanded?: boolean;
  onTogglePhotos?: () => void;
}

export default function ActionBar({ 
  onAddPhoto, 
  onPreview, 
  canPreview,
  photoCount = 0,
  photosExpanded = false,
  onTogglePhotos
}: ActionBarProps) {
  const handleAddPhoto = () => {
    navigator.vibrate?.(10);
    onAddPhoto();
  };

  const handlePreview = () => {
    navigator.vibrate?.(10);
    onPreview();
  };

  const handleTogglePhotos = () => {
    navigator.vibrate?.(10);
    onTogglePhotos?.();
  };

  return (
    <div className="flex gap-2 px-3 py-2 safe-area-inset-bottom" role="toolbar" aria-label="Job actions">
      <button
        onClick={handleAddPhoto}
        className="btn-photo tap-target focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
        aria-label="Add photo"
      >
        <Camera size={16} aria-hidden="true" />
        <span>Add Photo</span>
      </button>
      
      {photoCount > 0 && onTogglePhotos && (
        <button
          onClick={handleTogglePhotos}
          className="flex items-center gap-1 px-2 py-1.5 bg-muted rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label={`${photoCount} photo${photoCount !== 1 ? 's' : ''}, ${photosExpanded ? 'collapse' : 'expand'}`}
          aria-expanded={photosExpanded}
        >
          <Image size={14} aria-hidden="true" />
          <span>{photoCount}</span>
          {photosExpanded ? <ChevronDown size={12} aria-hidden="true" /> : <ChevronUp size={12} aria-hidden="true" />}
        </button>
      )}
      
      <button
        onClick={handlePreview}
        disabled={!canPreview}
        className={`btn-preview tap-target focus-visible:ring-2 focus-visible:ring-accent-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-accent ${!canPreview ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label="Preview permit summary"
        aria-disabled={!canPreview}
      >
        <Eye size={16} aria-hidden="true" />
        <span>Preview</span>
      </button>
    </div>
  );
}