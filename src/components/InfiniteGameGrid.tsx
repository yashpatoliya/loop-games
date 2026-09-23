"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Game } from "@/lib/games";
import GameRowCard from "@/components/GameRowCard";

export default function InfiniteGameGrid({
  heading = "All games",
  initialGames,
  initialPage,
  initialTotalPages,
  category,
}: {
  heading?: string;
  initialGames: Game[];
  initialPage: number;
  initialTotalPages: number;
  category?: string;
}) {
  const [games, setGames] = useState(initialGames);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current) return;
    if (page >= totalPages) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const params = new URLSearchParams({ page: String(nextPage) });
      if (category) params.set("category", category);
      const res = await fetch(`/api/games?${params.toString()}`);
      const data = await res.json();
      setGames((prev) => [...prev, ...data.games]);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch {
      // network hiccup — the observer will just retry on next intersection
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [page, totalPages, category]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "800px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <section>
      <h2 className="mb-3 text-lg font-bold text-neutral-900 dark:text-white">
        {heading}
      </h2>
      <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
        {games.map((game) => (
          <GameRowCard key={game.slug} game={game} fluid />
        ))}
      </div>

      {page < totalPages && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          {loading && (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/10 border-t-neutral-900 dark:border-white/20 dark:border-t-white" />
          )}
        </div>
      )}
    </section>
  );
}
