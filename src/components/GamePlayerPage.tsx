"use client";

import { useRef } from "react";
import type { Game } from "@/lib/games";
import { getEmbedSrc } from "@/lib/gameHelpers";
import GameFrame from "@/components/GameFrame";
import GamePlayerBar from "@/components/GamePlayerBar";
import GameRowCard from "@/components/GameRowCard";
import { useAuth } from "@/components/AuthProvider";

const PLATFORM_ICON: Record<string, string> = {
  windows: "🪟",
  linux: "🐧",
  mac: "🍎",
  android: "🤖",
};

export default function GamePlayerPage({
  game,
  host,
  proto,
  more,
}: {
  game: Game;
  host: string;
  proto: string;
  more: Game[];
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const { user, openSignIn } = useAuth();

  function toggleFullscreen() {
    if (!stageRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      stageRef.current.requestFullscreen?.();
    }
  }

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-neutral-950">
      <GamePlayerBar game={game} onFullscreen={toggleFullscreen} />

      <div className="flex min-h-0 flex-1">
        <div ref={stageRef} className="relative min-h-0 flex-1 bg-neutral-100 dark:bg-neutral-900">
          {game.type === "play" && (
            <GameFrame
              src={game.playUrl}
              title={game.title}
              sandbox="allow-scripts allow-same-origin allow-pointer-lock"
            />
          )}
          {game.type === "embed" && (
            <GameFrame
              src={getEmbedSrc(game, host, proto)}
              title={game.title}
              allow="autoplay; fullscreen; gamepad; accelerometer; gyroscope"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-orientation-lock allow-pointer-lock"
            />
          )}
          {game.type === "download" && (
            <div className="flex h-full items-center justify-center p-4">
              <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl">
                <p className="mb-2 text-xs font-medium text-neutral-500">
                  Version {game.version}
                </p>
                <ul className="divide-y divide-black/5 rounded-lg border border-black/5">
                  {game.releases.map((release) => (
                    <li
                      key={release.filename}
                      className="flex items-center justify-between gap-3 p-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-neutral-900">
                          {release.filename}
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          {release.size} · {release.date}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-sm" title={release.label}>
                          {PLATFORM_ICON[release.platform] ?? "💾"}
                        </span>
                        <a
                          href={release.url}
                          download
                          className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-red-600 active:scale-95"
                        >
                          Get
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {more.length > 0 && (
          <aside className="hidden w-72 shrink-0 flex-col overflow-y-auto border-l border-black/5 p-4 dark:border-white/5 lg:flex">
            <div className="mb-6 rounded-lg bg-neutral-100 px-3 py-2.5 dark:bg-neutral-900">
              {user ? (
                <p className="truncate text-sm text-neutral-600 dark:text-neutral-300">
                  Welcome back, {user.displayName ?? user.email}
                </p>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600 dark:text-neutral-300">
                    Sign in for a better experience
                  </span>
                  <button
                    type="button"
                    onClick={openSignIn}
                    className="shrink-0 text-sm font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                  >
                    Sign in
                  </button>
                </div>
              )}
            </div>

            <h2 className="mb-3 text-sm font-bold text-neutral-900 dark:text-white">
              People Also Played
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {more.map((g) => (
                <GameRowCard key={g.slug} game={g} fluid />
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
