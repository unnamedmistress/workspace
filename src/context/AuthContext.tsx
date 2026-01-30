import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, isFirebaseReady } from "@/config/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  ready: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const ready = isFirebaseReady() && !!auth;

  useEffect(() => {
    if (!ready || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [ready]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      ready,
      signIn: async (email, password) => {
        if (!auth) throw new Error("Firebase auth not configured");
        await signInWithEmailAndPassword(auth, email, password);
      },
      signUp: async (email, password) => {
        if (!auth) throw new Error("Firebase auth not configured");
        await createUserWithEmailAndPassword(auth, email, password);
      },
      signOut: async () => {
        if (!auth) return;
        await firebaseSignOut(auth);
      },
    }),
    [user, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
