"use client";

import { useRef } from "react";
import type { Game } from "@/lib/games";
import GameRowCard from "@/components/GameRowCard";

export default function GameRow({
  heading,
  games,
  featured = false,
}: {
  heading: string;
  games: Game[];
  featured?: boolean;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollNext() {
    scrollerRef.current?.scrollBy({ left: 400, behavior: "smooth" });
  }

  if (games.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-bold text-white">{heading}</h2>
      <div className="group/row relative">
        <div
          ref={scrollerRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {games.map((game, i) => (
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
          className="absolute right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-lg text-white shadow-lg backdrop-blur transition hover:bg-black/80 sm:flex"
        >
          ›
        </button>
      </div>
    </section>
  );
}
