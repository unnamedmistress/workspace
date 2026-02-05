import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Photo } from "@/types";

interface PhotoContextValue {
  photos: Record<string, Photo[]>;
  getPhotos: (jobId: string) => Photo[];
  loadPhotos: (jobId: string) => Promise<void>;
  addPhoto: (jobId: string, photo: Photo) => void;
  updatePhoto: (jobId: string, photoId: string, updates: Partial<Photo>) => void;
  deletePhoto: (jobId: string, photoId: string) => void;
  clearPhotos: (jobId: string) => void;
}

const PhotoContext = createContext<PhotoContextValue | null>(null);

// In-memory storage for photos
const memoryPhotos: Record<string, Photo[]> = {};

export function PhotoProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = useState<Record<string, Photo[]>>({});

  const getPhotos = useCallback((jobId: string): Photo[] => {
    return photos[jobId] || memoryPhotos[jobId] || [];
  }, [photos]);

  const loadPhotos = useCallback(async (jobId: string) => {
    // Load from memory only (no Firestore)
    setPhotos((prev) => ({ ...prev, [jobId]: memoryPhotos[jobId] || [] }));
  }, []);

  const addPhoto = useCallback((jobId: string, photo: Photo) => {
    memoryPhotos[jobId] = [...(memoryPhotos[jobId] || []), photo];
    setPhotos(prev => ({
      ...prev,
      [jobId]: [...(prev[jobId] || []), photo],
    }));
  }, []);

  const updatePhoto = useCallback((jobId: string, photoId: string, updates: Partial<Photo>) => {
    memoryPhotos[jobId] = (memoryPhotos[jobId] || []).map(p => 
      p.id === photoId ? { ...p, ...updates } : p
    );
    setPhotos(prev => ({
      ...prev,
      [jobId]: (prev[jobId] || []).map(p => 
        p.id === photoId ? { ...p, ...updates } : p
      ),
    }));
  }, []);

  const deletePhoto = useCallback((jobId: string, photoId: string) => {
    memoryPhotos[jobId] = (memoryPhotos[jobId] || []).filter(p => p.id !== photoId);
    setPhotos(prev => ({
      ...prev,
      [jobId]: (prev[jobId] || []).filter(p => p.id !== photoId),
    }));
  }, []);

  const clearPhotos = useCallback((jobId: string) => {
    delete memoryPhotos[jobId];
    setPhotos(prev => {
      const next = { ...prev };
      delete next[jobId];
      return next;
    });
  }, []);

  return (
    <PhotoContext.Provider value={{ photos, getPhotos, loadPhotos, addPhoto, updatePhoto, deletePhoto, clearPhotos }}>
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
  const { getPhotos, loadPhotos, addPhoto, updatePhoto, deletePhoto } = usePhotoContext();
  
  return {
    photos: getPhotos(jobId),
    loadPhotos: () => loadPhotos(jobId),
    addPhoto: (photo: Photo) => addPhoto(jobId, photo),
    updatePhoto: (photoId: string, updates: Partial<Photo>) => updatePhoto(jobId, photoId, updates),
    deletePhoto: (photoId: string) => deletePhoto(jobId, photoId),
  };
}