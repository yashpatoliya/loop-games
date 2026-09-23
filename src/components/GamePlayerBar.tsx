"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Game } from "@/lib/games";
import { BackIcon, ExpandIcon, ShareIcon, ThumbDownIcon, ThumbUpIcon, UserIcon } from "@/components/icons";
import { useAuth } from "@/components/AuthProvider";
import { useGameLikes } from "@/lib/useGameLikes";
import { formatLikeCount } from "@/lib/likes";
import { CATEGORY_ICON } from "@/lib/categoryIcons";

export default function GamePlayerBar({
  game,
  onFullscreen,
}: {
  game: Game;
  onFullscreen: () => void;
}) {
  const [disliked, setDisliked] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user, openSignIn, signOut } = useAuth();
  const { total, liked, toggle: toggleLike, busy: likeBusy } = useGameLikes(
    game.slug,
  );

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: game.title, url });
        return;
      } catch {
        // user cancelled or share failed — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — no-op
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-black/5 bg-white px-4 py-3 dark:border-white/5 dark:bg-neutral-950 sm:px-6">
      <Link
        href="/"
        className="flex shrink-0 items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-sm font-medium text-neutral-900 transition hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
      >
        <BackIcon />
        All Games
      </Link>

      <div className="flex min-w-0 flex-1 items-center gap-2 px-2">
        <span className="text-xl">{CATEGORY_ICON[game.category] ?? "🎮"}</span>
        <p className="truncate text-base font-bold text-neutral-900 dark:text-white">
          {game.title}
        </p>
        <span className="hidden shrink-0 text-sm text-neutral-500 dark:text-neutral-500 sm:inline">
          {game.category}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-4 text-neutral-600 dark:text-neutral-300">
        <button
          type="button"
          aria-label="Like"
          onClick={toggleLike}
          disabled={likeBusy}
          className={`flex items-center gap-1.5 transition hover:text-neutral-900 dark:hover:text-white active:scale-90 disabled:opacity-60 ${liked ? "text-teal-600 dark:text-teal-400" : ""}`}
        >
          <ThumbUpIcon filled={liked} />
          <span className="text-sm font-medium">{formatLikeCount(total)}</span>
        </button>
        <button
          type="button"
          aria-label="Dislike"
          onClick={() => setDisliked((v) => !v)}
          className={`transition hover:text-neutral-900 dark:hover:text-white active:scale-90 ${disliked ? "text-red-500 dark:text-red-400" : ""}`}
        >
          <ThumbDownIcon filled={disliked} />
        </button>
        <button
          type="button"
          aria-label="Share"
          onClick={share}
          className="relative transition hover:text-neutral-900 dark:hover:text-white active:scale-90"
        >
          <ShareIcon />
          {copied && (
            <span className="absolute -bottom-7 right-0 whitespace-nowrap rounded bg-neutral-900 px-2 py-1 text-xs text-white shadow dark:bg-neutral-800">
              Link copied
            </span>
          )}
        </button>
        <button
          type="button"
          aria-label="Fullscreen"
          onClick={onFullscreen}
          className="transition hover:text-neutral-900 dark:hover:text-white active:scale-90"
        >
          <ExpandIcon />
        </button>
      </div>

      {user ? (
        <button
          type="button"
          onClick={() => signOut()}
          title={`Signed in as ${user.displayName ?? user.email} — click to sign out`}
          className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-teal-500 text-xs font-bold text-white ring-2 ring-black/5 transition hover:ring-black/10 dark:text-neutral-950 dark:ring-white/10 dark:hover:ring-white/20"
        >
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName ?? "Account"}
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          ) : (
            (user.displayName ?? user.email ?? "?")[0].toUpperCase()
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={openSignIn}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-black/15 px-3 py-1.5 text-sm font-medium text-neutral-900 transition hover:bg-black/5 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
        >
          <UserIcon />
          Sign in
        </button>
      )}
    </div>
  );
}
