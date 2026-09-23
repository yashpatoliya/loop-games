"use client";

import { useRef } from "react";
import type { Game } from "@/lib/games";
import GameRowCard from "@/components/GameRowCard";

export default function GameRow({
  heading,
  games,
  featured = false,
  limit = 20,
}: {
  heading: string;
  games: Game[];
  featured?: boolean;
  limit?: number;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const visible = games.slice(0, limit);

  function scrollNext() {
    scrollerRef.current?.scrollBy({ left: 400, behavior: "smooth" });
  }

  if (visible.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-bold text-neutral-900 dark:text-white">
        {heading}
      </h2>
      <div className="group/row relative">
        <div
          ref={scrollerRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {visible.map((game, i) => (
            <GameRowCard
              key={game.slug}
              game={game}
              wide={featured && i === 0}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Scroll right"
          className="absolute right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-lg text-neutral-900 shadow-lg ring-1 ring-black/5 backdrop-blur transition hover:bg-white dark:bg-black/60 dark:text-white dark:ring-0 dark:hover:bg-black/80 sm:flex"
        >
          ›
        </button>
      </div>
    </section>
  );
}
