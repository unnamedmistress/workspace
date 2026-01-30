import { useState, useCallback } from "react";
import { Job, JobType, Jurisdiction } from "@/types";
import { getSessionId } from "@/utils/sessionId";
import { db, isFirebaseReady } from "@/config/firebase";
import { useAuth } from "@/context/AuthContext";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// In-memory storage for jobs (demo mode)
let memoryJobs: Job[] = [];

export function useJob() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>(memoryJobs);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const useFirestore = isFirebaseReady() && !!db && !!user;

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (useFirestore && db && user) {
        const jobsQuery = query(
          collection(db, "jobs"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(jobsQuery);
        const fetched = snapshot.docs.map((docSnap) => firestoreToJob(docSnap.id, docSnap.data()));
        setJobs(fetched);
        return;
      }

      // Fallback demo storage
      const sessionId = getSessionId();
      const userJobs = memoryJobs.filter((j) => j.sessionId === sessionId);
      setJobs(userJobs);
    } catch (err) {
      setError("Failed to fetch jobs");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [useFirestore, user]);

  const createJob = useCallback(
    async (jobType: JobType, jurisdiction: Jurisdiction, address?: string): Promise<Job> => {
      setIsLoading(true);
      setError(null);
      try {
        const sessionId = getSessionId();
        const newJob: Job = {
          id: `job-${Date.now()}`,
          sessionId,
          jobType,
          jurisdiction,
          status: "IN_PROGRESS",
          createdAt: new Date(),
          updatedAt: new Date(),
          extractedData: {},
          answers: {},
          address,
          title: getJobTitle(jobType, address),
        };

        if (useFirestore && db && user) {
          const docRef = await addDoc(collection(db, "jobs"), {
            userId: user.uid,
            sessionId,
            jobType,
            jurisdiction,
            status: "IN_PROGRESS",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            extractedData: {},
            answers: {},
            address: address ?? "",
            title: getJobTitle(jobType, address),
          });
          const created: Job = { ...newJob, id: docRef.id };
          setJobs((prev) => [created, ...prev]);
          setCurrentJob(created);
          return created;
        }

        memoryJobs = [...memoryJobs, newJob];
        setJobs((prev) => [...prev, newJob]);
        setCurrentJob(newJob);
        return newJob;
      } catch (err) {
        setError("Failed to create job");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [useFirestore, user]
  );

  const getJob = useCallback(
    async (jobId: string): Promise<Job | null> => {
      setIsLoading(true);
      try {
        if (useFirestore && db && user) {
          const docRef = doc(db, "jobs", jobId);
          const snapshot = await getDoc(docRef);
          if (!snapshot.exists()) {
            setCurrentJob(null);
            return null;
          }
          const job = firestoreToJob(snapshot.id, snapshot.data());
          if (job.userId !== user.uid) {
            setCurrentJob(null);
            return null;
          }
          setCurrentJob(job);
          return job;
        }

        const job = memoryJobs.find((j) => j.id === jobId) || null;
        setCurrentJob(job);
        return job;
      } finally {
        setIsLoading(false);
      }
    },
    [useFirestore, user]
  );

  const updateJob = useCallback(
    async (jobId: string, updates: Partial<Job>): Promise<void> => {
      setIsLoading(true);
      try {
        if (useFirestore && db && user) {
          const docRef = doc(db, "jobs", jobId);
          await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp(),
          });
          setJobs((prev) =>
            prev.map((job) => (job.id === jobId ? { ...job, ...updates, updatedAt: new Date() } : job))
          );
          if (currentJob?.id === jobId) {
            setCurrentJob({ ...currentJob, ...updates, updatedAt: new Date() });
          }
          return;
        }

        memoryJobs = memoryJobs.map((j) =>
          j.id === jobId ? { ...j, ...updates, updatedAt: new Date() } : j
        );
        setJobs([...memoryJobs]);
        if (currentJob?.id === jobId) {
          setCurrentJob({ ...currentJob, ...updates, updatedAt: new Date() });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [currentJob, useFirestore, user]
  );

  const deleteJob = useCallback(
    async (jobId: string): Promise<void> => {
      if (useFirestore && db) {
        await deleteDoc(doc(db, "jobs", jobId));
      }
      memoryJobs = memoryJobs.filter((j) => j.id !== jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      if (currentJob?.id === jobId) {
        setCurrentJob(null);
      }
    },
    [currentJob, useFirestore]
  );

  return {
    jobs,
    currentJob,
    isLoading,
    error,
    fetchJobs,
    createJob,
    getJob,
    updateJob,
    deleteJob,
    setCurrentJob,
  };
}

function firestoreToJob(id: string, data: any): Job {
  const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
  const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date();
  return {
    id,
    sessionId: data.sessionId ?? "",
    userId: data.userId,
    jobType: data.jobType,
    jurisdiction: data.jurisdiction,
    status: data.status,
    createdAt,
    updatedAt,
    extractedData: data.extractedData ?? {},
    answers: data.answers ?? {},
    address: data.address ?? undefined,
    title: data.title ?? getJobTitle(data.jobType, data.address),
  };
}

function getJobTitle(jobType: JobType, address?: string): string {
  const typeLabels: Record<JobType, string> = {
    // HVAC & Mechanical
    AC_HVAC_CHANGEOUT: "AC/HVAC Changeout",
    WATER_HEATER: "Water Heater",
    
    // Roofing
    RE_ROOFING: "Roof Replacement",
    ROOF_REPAIR: "Roof Repair",
    
    // Electrical
    ELECTRICAL_PANEL: "Panel Upgrade",
    ELECTRICAL_REWIRING: "Electrical Rewiring",
    EV_CHARGER: "EV Charger",
    GENERATOR_INSTALL: "Generator Install",
    
    // Plumbing
    PLUMBING_MAIN_LINE: "Plumbing Main Line",
    
    // Interior
    SMALL_BATH_REMODEL: "Bathroom Remodel",
    KITCHEN_REMODEL: "Kitchen Remodel",
    
    // Exterior
    WINDOW_DOOR_REPLACEMENT: "Window/Door Replacement",
    SIDING_EXTERIOR: "Siding/Exterior",
    DECK_INSTALLATION: "Deck Installation",
    FENCE_INSTALLATION: "Fence Installation",
    POOL_BARRIER: "Pool Barrier",
    
    // Structural
    ROOM_ADDITION: "Room Addition",
    FOUNDATION_REPAIR: "Foundation Repair",
  };
  const label = typeLabels[jobType] || jobType.replace(/_/g, " ");
  return address ? `${label} - ${address.split(",")[0]}` : label;
}
