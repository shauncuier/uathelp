// src/context/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { AppUser } from "@/types";

interface AuthContextValue {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  appUser: null,
  loading: true,
  isAdmin: false,
  isEditor: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const ref = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(ref);

          if (snap.exists()) {
            setAppUser({ id: snap.id, ...snap.data() } as AppUser);
          } else {
            // Create default student profile
            const newUser: Omit<AppUser, "id"> = {
              name: firebaseUser.displayName || firebaseUser.email || "User",
              email: firebaseUser.email || "",
              photoURL: firebaseUser.photoURL || undefined,
              role: "student",
              status: "active",
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            await setDoc(ref, {
              ...newUser,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
            setAppUser({ id: firebaseUser.uid, ...newUser });
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      } else {
        setAppUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = appUser?.role === "admin";
  const isEditor = appUser?.role === "editor" || appUser?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, appUser, loading, isAdmin, isEditor }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
