"use client";

import { useCallback, useEffect, useState } from "react";
import { doc, onSnapshot, runTransaction } from "firebase/firestore";
import { db, firebaseEnabled } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { baselineLikes } from "@/lib/likes";

export function useGameLikes(slug: string) {
  const { user, openSignIn } = useAuth();
  const [realCount, setRealCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!db) return;
    const ref = doc(db, "likes", slug);
    return onSnapshot(ref, (snap) => {
      setRealCount(snap.exists() ? ((snap.data().count as number) ?? 0) : 0);
    });
  }, [slug]);

  useEffect(() => {
    if (!db || !user) {
      const t = setTimeout(() => setLiked(false), 0);
      return () => clearTimeout(t);
    }
    const ref = doc(db, "likes", slug, "likedBy", user.uid);
    return onSnapshot(ref, (snap) => setLiked(snap.exists()));
  }, [slug, user]);

  const toggle = useCallback(async () => {
    if (!db) return;
    if (!user) {
      openSignIn();
      return;
    }
    setBusy(true);
    try {
      const countRef = doc(db, "likes", slug);
      const likedRef = doc(db, "likes", slug, "likedBy", user.uid);
      await runTransaction(db, async (tx) => {
        const likedSnap = await tx.get(likedRef);
        const countSnap = await tx.get(countRef);
        const current = countSnap.exists()
          ? ((countSnap.data().count as number) ?? 0)
          : 0;
        if (likedSnap.exists()) {
          tx.delete(likedRef);
          tx.set(countRef, { count: Math.max(0, current - 1) }, { merge: true });
        } else {
          tx.set(likedRef, { likedAt: Date.now() });
          tx.set(countRef, { count: current + 1 }, { merge: true });
        }
      });
    } finally {
      setBusy(false);
    }
  }, [user, slug, openSignIn]);

  return {
    total: baselineLikes(slug) + realCount,
    liked,
    toggle,
    enabled: firebaseEnabled,
    busy,
  };
}
