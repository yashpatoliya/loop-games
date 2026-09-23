import type { Game } from "@/lib/games";
import GameRowCard from "@/components/GameRowCard";

export default function AllGamesGrid({ games }: { games: Game[] }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold text-white">All games</h2>
      <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
        {games.map((game) => (
          <GameRowCard key={game.slug} game={game} fluid />
        ))}
      </div>
    </section>
  );
}
