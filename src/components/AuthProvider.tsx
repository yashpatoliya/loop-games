"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, signOut as firebaseSignOut, type User } from "firebase/auth";
import { auth, firebaseEnabled } from "@/lib/firebase";
import SignInModal from "@/components/SignInModal";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  firebaseEnabled: boolean;
  openSignIn: () => void;
  closeSignIn: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => Boolean(auth));
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  async function signOut() {
    if (!auth) return;
    await firebaseSignOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        firebaseEnabled,
        openSignIn: () => setModalOpen(true),
        closeSignIn: () => setModalOpen(false),
        signOut,
      }}
    >
      {children}
      {modalOpen && <SignInModal onClose={() => setModalOpen(false)} />}
    </AuthContext.Provider>
  );
}
