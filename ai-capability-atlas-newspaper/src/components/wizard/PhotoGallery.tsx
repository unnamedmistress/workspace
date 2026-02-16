import { X, Loader2, AlertCircle, RotateCcw } from "lucide-react";
import { Photo } from "@/types";

interface PhotoGalleryProps {
  photos: Photo[];
  onPhotoClick?: (photo: Photo) => void;
  onDeletePhoto?: (photoId: string) => void;
  onRetryUpload?: (photoId: string) => void;
  uploadProgress?: Record<string, number>;
}

export default function PhotoGallery({ 
  photos, 
  onPhotoClick, 
  onDeletePhoto,
  onRetryUpload,
  uploadProgress = {}
}: PhotoGalleryProps) {
  if (photos.length === 0) {
    return null;
  }

  return (
    <div 
      className="flex gap-2 px-3 py-2 overflow-x-auto scrollbar-hide"
      role="list"
      aria-label={`${photos.length} photo${photos.length !== 1 ? 's' : ''}`}
    >
      {photos.map((photo, index) => {
        const progress = uploadProgress[photo.id];
        const isUploading = photo.status === "UPLOADING" || (progress !== undefined && progress < 100);
        
        return (
          <div 
            key={photo.id} 
            className="relative flex-shrink-0"
            role="listitem"
          >
            <button
              onClick={() => onPhotoClick?.(photo)}
              className="block focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
              disabled={photo.status !== "COMPLETE"}
              aria-label={`Photo ${index + 1}${photo.status !== "COMPLETE" ? ` (${photo.status.toLowerCase()})` : ''}`}
            >
              <img
                src={photo.thumbnailUrl || photo.url}
                alt={`Job photo ${index + 1}`}
                className="photo-thumb"
              />
            </button>
            
            {/* Upload progress overlay */}
            {isUploading && progress !== undefined && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex flex-col items-center justify-center">
                <Loader2 size={14} className="animate-spin text-white mb-1" aria-hidden="true" />
                <span className="text-white text-xs font-medium">{Math.round(progress)}%</span>
              </div>
            )}
            
            {/* Processing overlay */}
            {photo.status === "PROCESSING" && !isUploading && (
              <div className="absolute inset-0 bg-primary/30 rounded-lg flex items-center justify-center">
                <div 
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" 
                  role="status"
                  aria-label="Processing photo"
                />
              </div>
            )}
            
            {/* Error overlay with retry */}
            {photo.status === "ERROR" && (
              <div className="absolute inset-0 bg-destructive/50 rounded-lg flex flex-col items-center justify-center gap-1">
                <AlertCircle size={14} className="text-white" aria-hidden="true" />
                {onRetryUpload && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRetryUpload(photo.id);
                    }}
                    className="p-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    aria-label="Retry upload"
                  >
                    <RotateCcw size={10} className="text-white" />
                  </button>
                )}
              </div>
            )}
            
            {/* Delete button */}
            {onDeletePhoto && photo.status === "COMPLETE" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePhoto(photo.id);
                }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-md hover:bg-destructive/90 transition-colors focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-1"
                aria-label={`Delete photo ${index + 1}`}
              >
                <X size={10} aria-hidden="true" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}