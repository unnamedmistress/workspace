import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Photo } from "@/types";

interface PhotoContextValue {
  photos: Record<string, Photo[]>;
  getPhotos: (jobId: string) => Photo[];
  addPhoto: (jobId: string, photo: Photo) => void;
  updatePhoto: (jobId: string, photoId: string, updates: Partial<Photo>) => void;
  deletePhoto: (jobId: string, photoId: string) => void;
  clearPhotos: (jobId: string) => void;
}

const PhotoContext = createContext<PhotoContextValue | null>(null);

export function PhotoProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = useState<Record<string, Photo[]>>({});

  const getPhotos = useCallback((jobId: string): Photo[] => {
    return photos[jobId] || [];
  }, [photos]);

  const addPhoto = useCallback((jobId: string, photo: Photo) => {
    setPhotos(prev => ({
      ...prev,
      [jobId]: [...(prev[jobId] || []), photo],
    }));
  }, []);

  const updatePhoto = useCallback((jobId: string, photoId: string, updates: Partial<Photo>) => {
    setPhotos(prev => ({
      ...prev,
      [jobId]: (prev[jobId] || []).map(p => 
        p.id === photoId ? { ...p, ...updates } : p
      ),
    }));
  }, []);

  const deletePhoto = useCallback((jobId: string, photoId: string) => {
    setPhotos(prev => ({
      ...prev,
      [jobId]: (prev[jobId] || []).filter(p => p.id !== photoId),
    }));
  }, []);

  const clearPhotos = useCallback((jobId: string) => {
    setPhotos(prev => {
      const next = { ...prev };
      delete next[jobId];
      return next;
    });
  }, []);

  return (
    <PhotoContext.Provider value={{ photos, getPhotos, addPhoto, updatePhoto, deletePhoto, clearPhotos }}>
      {children}
    </PhotoContext.Provider>
  );
}

export function usePhotoContext() {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error("usePhotoContext must be used within a PhotoProvider");
  }
  return context;
}

export function usePhotos(jobId: string) {
  const { getPhotos, addPhoto, updatePhoto, deletePhoto } = usePhotoContext();
  
  return {
    photos: getPhotos(jobId),
    addPhoto: (photo: Photo) => addPhoto(jobId, photo),
    updatePhoto: (photoId: string, updates: Partial<Photo>) => updatePhoto(jobId, photoId, updates),
    deletePhoto: (photoId: string) => deletePhoto(jobId, photoId),
  };
}
